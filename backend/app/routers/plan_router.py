from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user
from backend.app.services.ai_service import generate_personalized_plan_ai

router = APIRouter(prefix="/api/plans", tags=["Personalized Plans"])

@router.post("", response_model=schemas.PersonalizedPlanResponse)
def create_or_update_plan(
    req: schemas.PlanCreateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Archive any previous active plan for this user
    previous_plans = db.query(models.PersonalizedPlan).filter(
        models.PersonalizedPlan.user_id == current_user.id,
        models.PersonalizedPlan.status == "active"
    ).all()
    for p in previous_plans:
        p.status = "archived"

    # Generate new plan days
    plan_days = generate_personalized_plan_ai(
        target_role=req.target_role,
        experience_level=current_user.experience_level,
        duration_days=req.duration_days,
        daily_time_minutes=req.daily_time_minutes,
        weak_areas=current_user.skills
    )

    new_plan = models.PersonalizedPlan(
        user_id=current_user.id,
        target_role=req.target_role,
        duration_days=req.duration_days,
        daily_time_minutes=req.daily_time_minutes,
        status="active",
        weak_areas=current_user.skills
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)

    # Insert tasks
    for day_data in plan_days:
        day_num = day_data["day"]
        for t in day_data.get("tasks", []):
            task = models.PlanTask(
                plan_id=new_plan.id,
                day_number=day_num,
                topic=day_data["title"],
                objective=day_data["objective"],
                practice_activity=t["text"],
                estimated_minutes=t.get("estimatedMinutes", 20),
                is_completed=False
            )
            db.add(task)
    db.commit()

    # Re-fetch with structured response
    return format_plan_response(new_plan, db)

@router.get("/{user_id}", response_model=schemas.PersonalizedPlanResponse)
def get_user_plan(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce user authorization: token must match user_id
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Cannot view another candidate's study plan."
        )

    plan = db.query(models.PersonalizedPlan).filter(
        models.PersonalizedPlan.user_id == user_id,
        models.PersonalizedPlan.status == "active"
    ).first()

    if not plan:
        # Auto-create initial plan if none exists
        default_req = schemas.PlanCreateRequest(
            target_role=current_user.target_role or "Software Developer",
            duration_days=7,
            daily_time_minutes=45
        )
        return create_or_update_plan(default_req, current_user, db)

    return format_plan_response(plan, db)

@router.put("/tasks/{task_id}")
def update_task_status(
    task_id: str,
    req: schemas.TaskStatusUpdateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(models.PlanTask).filter(models.PlanTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan task not found.")

    # Validate that the task belongs to current user
    if task.plan.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden.")

    task.is_completed = req.is_completed
    db.commit()
    db.refresh(task)

    return {
        "id": task.id,
        "is_completed": task.is_completed,
        "message": "Task status updated successfully."
    }

def format_plan_response(plan: models.PersonalizedPlan, db: Session) -> dict:
    tasks = db.query(models.PlanTask).filter(models.PlanTask.plan_id == plan.id).order_by(models.PlanTask.day_number).all()

    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.is_completed)
    progress = int((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0

    # Group by day
    days_dict = {}
    for t in tasks:
        if t.day_number not in days_dict:
            days_dict[t.day_number] = {
                "day": t.day_number,
                "title": t.topic,
                "objective": t.objective,
                "tasks": []
            }
        days_dict[t.day_number]["tasks"].append(t)

    days_list = [days_dict[d] for d in sorted(days_dict.keys())]

    return {
        "id": plan.id,
        "user_id": plan.user_id,
        "target_role": plan.target_role,
        "total_days": plan.duration_days,
        "daily_time_minutes": plan.daily_time_minutes,
        "status": plan.status,
        "progress_percentage": progress,
        "weak_areas": plan.weak_areas or [],
        "days": days_list,
        "created_at": plan.created_at
    }
