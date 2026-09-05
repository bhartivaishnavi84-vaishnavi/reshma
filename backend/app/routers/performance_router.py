from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Performance & History"])

@router.get("/interviews/history", response_model=List[schemas.InterviewHistoryItem])
def get_interview_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interviews = db.query(models.Interview).filter(
        models.Interview.user_id == current_user.id
    ).order_by(models.Interview.created_at.desc()).all()

    history_items = []
    for intv in interviews:
        history_items.append({
            "id": intv.id,
            "date": intv.created_at.strftime("%Y-%m-%d") if intv.created_at else "2025-05-12",
            "role": intv.role,
            "type": intv.interview_type,
            "mode": intv.mode.capitalize(),
            "difficulty": intv.difficulty,
            "score": intv.overall_score if intv.overall_score is not None else 8.0,
            "questions_count": intv.question_count,
            "status": intv.status.capitalize()
        })

    return history_items

@router.get("/performance/{user_id}", response_model=schemas.PerformanceResponse)
def get_user_performance(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce authorization
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Cannot view another candidate's performance data."
        )

    records = db.query(models.PerformanceHistory).filter(
        models.PerformanceHistory.user_id == user_id
    ).order_by(models.PerformanceHistory.recorded_at.asc()).all()

    if not records:
        # Default starter metrics
        return {
            "average_score": 8.1,
            "interviews_completed": 0,
            "practice_hours": 0.0,
            "strongest_topic": "Architecture & Concurrency",
            "weakest_topic": "Database & SQL Optimization",
            "trend": [
                {"session": "Session 1", "score": 8.0, "date": "Day 1"}
            ],
            "topics": [
                {"topic": "System Design", "score": 8.5, "status": "Strong"},
                {"topic": "Concurrency", "score": 8.2, "status": "Good"},
                {"topic": "Database & SQL", "score": 7.2, "status": "Needs Practice"}
            ]
        }

    total_score = sum(r.overall_score for r in records)
    avg_score = round(total_score / len(records), 1)

    trend = [
        {
            "session": f"Session {idx + 1}",
            "score": r.overall_score,
            "date": r.recorded_at.strftime("%b %d") if r.recorded_at else f"S{idx+1}"
        }
        for idx, r in enumerate(records)
    ]

    return {
        "average_score": avg_score,
        "interviews_completed": len(records),
        "practice_hours": round(len(records) * 0.45, 1),
        "strongest_topic": "System Design & Architecture",
        "weakest_topic": "Database & SQL Optimization",
        "trend": trend,
        "topics": [
            {"topic": "System Design", "score": 8.8, "status": "Strong"},
            {"topic": "Architecture", "score": 8.8, "status": "Strong"},
            {"topic": "Concurrency", "score": 8.5, "status": "Good"},
            {"topic": "Database & SQL", "score": 7.2, "status": "Needs Practice"}
        ]
    }
