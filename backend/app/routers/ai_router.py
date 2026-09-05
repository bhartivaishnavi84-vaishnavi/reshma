from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from backend.app import schemas, models
from backend.app.auth import get_current_user
from backend.app.services.ai_service import (
    generate_interview_questions_ai,
    evaluate_candidate_answer_ai,
    generate_personalized_plan_ai
)

router = APIRouter(prefix="/api/ai", tags=["AI Operations"])

@router.post("/generate-questions", response_model=List[schemas.AIGeneratedQuestion])
def generate_questions(
    req: schemas.AIGenerateQuestionsRequest,
    current_user: models.User = Depends(get_current_user)
):
    questions = generate_interview_questions_ai(
        role=req.role,
        interview_type=req.interview_type,
        difficulty=req.difficulty,
        count=req.question_count,
        weak_areas=req.weak_areas,
        resume_text=req.resume_text
    )
    return questions

@router.post("/evaluate-answer", response_model=schemas.AnswerEvaluationResponse)
def evaluate_answer(
    req: schemas.AIEvaluateAnswerRequest,
    current_user: models.User = Depends(get_current_user)
):
    evaluation = evaluate_candidate_answer_ai(
        question=req.question,
        candidate_answer=req.candidate_answer
    )
    return evaluation

@router.post("/generate-plan")
def generate_plan(
    req: schemas.AIGeneratePlanRequest,
    current_user: models.User = Depends(get_current_user)
):
    plan_days = generate_personalized_plan_ai(
        target_role=req.target_role,
        experience_level=req.experience_level,
        duration_days=req.duration_days,
        daily_time_minutes=req.daily_time_minutes,
        weak_areas=req.weak_areas
    )
    return {
        "target_role": req.target_role,
        "total_days": req.duration_days,
        "daily_time_minutes": req.daily_time_minutes,
        "days": plan_days
    }

@router.post("/recommendations")
def get_ai_recommendations(
    req: schemas.AIRecommendationsRequest,
    current_user: models.User = Depends(get_current_user)
):
    weak_areas = req.weak_areas or ["Databases & SQL", "Concurrency"]
    recommendations = [
        f"Prioritize 30 minutes of deep-dive drills in {area}."
        for area in weak_areas
    ]
    return {
        "user_id": current_user.id,
        "recommended_focus": weak_areas,
        "actionable_tips": recommendations
    }
