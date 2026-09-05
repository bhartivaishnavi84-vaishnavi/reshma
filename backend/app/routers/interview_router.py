from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user
from backend.app.services.ai_service import generate_interview_questions_ai, evaluate_candidate_answer_ai

router = APIRouter(prefix="/api/interview", tags=["Interview"])

@router.post("/start", response_model=schemas.InterviewDetailResponse)
def start_interview(
    req: schemas.InterviewStartRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Retrieve user's resume text if requested
    resume_context = current_user.resume_text if (req.use_resume and current_user.resume_text) else None

    # Fetch questions via AI service
    ai_questions = generate_interview_questions_ai(
        role=req.role,
        interview_type=req.interview_type,
        difficulty=req.difficulty,
        count=req.question_count,
        weak_areas=current_user.skills,
        resume_text=resume_context
    )

    # Persist interview record
    interview = models.Interview(
        user_id=current_user.id,
        role=req.role,
        interview_type=req.interview_type,
        difficulty=req.difficulty,
        question_count=len(ai_questions),
        mode=req.mode,
        status="in_progress"
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    # Persist questions
    created_questions = []
    for idx, q_data in enumerate(ai_questions):
        question = models.Question(
            interview_id=interview.id,
            order_index=idx + 1,
            category=q_data.get("category", "General"),
            difficulty=q_data.get("difficulty", req.difficulty),
            question_text=q_data.get("question", "")
        )
        db.add(question)
        created_questions.append(question)

    db.commit()
    for q in created_questions:
        db.refresh(q)

    return {
        "id": interview.id,
        "role": interview.role,
        "interview_type": interview.interview_type,
        "difficulty": interview.difficulty,
        "question_count": interview.question_count,
        "mode": interview.mode,
        "status": interview.status,
        "created_at": interview.created_at,
        "questions": created_questions
    }

@router.get("/{id}", response_model=schemas.InterviewDetailResponse)
def get_interview(
    id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found.")
    
    # Enforce user authorization
    if interview.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access to another candidate's interview is forbidden.")

    return interview

@router.post("/{id}/answer", response_model=schemas.AnswerEvaluationResponse)
def submit_answer(
    id: str,
    question_id: int,
    req: schemas.AnswerSubmitRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found.")
    if interview.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden.")

    question = db.query(models.Question).filter(
        models.Question.id == question_id,
        models.Question.interview_id == id
    ).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found in this interview.")

    # Evaluate answer with AI service
    eval_res = evaluate_candidate_answer_ai(
        question=question.question_text,
        candidate_answer=req.answer_text
    )

    # Save answer
    answer = models.Answer(
        question_id=question.id,
        user_id=current_user.id,
        answer_text=req.answer_text,
        audio_duration_seconds=req.audio_duration_seconds or 0
    )
    db.add(answer)
    db.commit()
    db.refresh(answer)

    # Save evaluation
    evaluation = models.Evaluation(
        answer_id=answer.id,
        score=eval_res.get("score", 7.0),
        correctness=eval_res.get("correctness", "Good"),
        strengths=eval_res.get("strengths", []),
        weaknesses=eval_res.get("weaknesses", []),
        missing_points=eval_res.get("missing_points", []),
        suggestions=eval_res.get("suggestions", [])
    )
    db.add(evaluation)
    db.commit()

    return eval_res

@router.post("/{id}/complete", response_model=schemas.InterviewCompleteResponse)
def complete_interview(
    id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == id).first()
    if not interview:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found.")
    if interview.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden.")

    # Retrieve all answers & evaluations
    questions = db.query(models.Question).filter(models.Question.interview_id == id).all()
    evaluation_items = []
    total_score = 0.0
    category_scores = {}

    for q in questions:
        ans = db.query(models.Answer).filter(models.Answer.question_id == q.id).first()
        if ans and ans.evaluation:
            score = ans.evaluation.score
            total_score += score
            category_scores.setdefault(q.category, []).append(score)
            evaluation_items.append({
                "question_id": q.id,
                "question": q.question_text,
                "candidate_answer": ans.answer_text,
                "score": score,
                "correctness": ans.evaluation.correctness,
                "strengths": ans.evaluation.strengths,
                "weaknesses": ans.evaluation.weaknesses,
                "missing_points": ans.evaluation.missing_points,
                "suggestions": ans.evaluation.suggestions
            })

    num_evaluated = len(evaluation_items)
    avg_score = round(total_score / num_evaluated, 1) if num_evaluated > 0 else 7.5

    cat_breakdown = [
        {"category": cat, "score": round(sum(scores) / len(scores), 1)}
        for cat, scores in category_scores.items()
    ]
    if not cat_breakdown:
        cat_breakdown = [{"category": "Overall Performance", "score": avg_score}]

    interview.status = "completed"
    interview.overall_score = avg_score
    interview.feedback_summary = f"Interview successfully completed with an average score of {avg_score}/10."
    db.commit()

    # Record in performance_history table
    perf = models.PerformanceHistory(
        user_id=current_user.id,
        interview_id=interview.id,
        role=interview.role,
        overall_score=avg_score,
        category_breakdown=cat_breakdown
    )
    db.add(perf)
    db.commit()

    return {
        "interview_id": interview.id,
        "overall_score": avg_score,
        "general_feedback": interview.feedback_summary,
        "category_breakdown": cat_breakdown,
        "answers": evaluation_items,
        "completed_at": datetime.utcnow()
    }
