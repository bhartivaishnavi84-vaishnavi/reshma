from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# --- Standard Error Envelope ---
class ErrorDetail(BaseModel):
    code: int
    message: str
    details: Optional[Any] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    target_role: Optional[str] = "Software Developer"
    experience_level: Optional[str] = "Intermediate"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    target_role: Optional[str] = "Software Developer"
    experience_level: Optional[str] = "Intermediate"
    resume_uploaded: bool = False
    resume_filename: Optional[str] = None
    skills: List[str] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Interview Schemas ---
class InterviewStartRequest(BaseModel):
    role: str
    interview_type: str = "Technical"
    difficulty: str = "Intermediate"
    question_count: int = Field(default=4, ge=1, le=10)
    mode: str = "text"
    use_resume: bool = False

class QuestionResponse(BaseModel):
    id: int
    order_index: int
    category: str
    difficulty: str
    question_text: str

    class Config:
        from_attributes = True

class InterviewDetailResponse(BaseModel):
    id: str
    role: str
    interview_type: str
    difficulty: str
    question_count: int
    mode: str
    status: str
    created_at: Optional[datetime] = None
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True

class AnswerSubmitRequest(BaseModel):
    answer_text: str
    audio_duration_seconds: Optional[int] = 0

class AnswerEvaluationResponse(BaseModel):
    score: float
    correctness: str
    strengths: List[str]
    weaknesses: List[str]
    missing_points: List[str]
    suggestions: List[str]

class QuestionEvaluationItem(BaseModel):
    question_id: int
    question: str
    candidate_answer: str
    score: float
    correctness: str
    strengths: List[str]
    weaknesses: List[str]
    missing_points: List[str]
    suggestions: List[str]

class CategoryScoreBreakdown(BaseModel):
    category: str
    score: float

class InterviewCompleteResponse(BaseModel):
    interview_id: str
    overall_score: float
    general_feedback: str
    category_breakdown: List[CategoryScoreBreakdown]
    answers: List[QuestionEvaluationItem]
    completed_at: Optional[datetime] = None

# --- AI Integration Schemas ---
class AIGeneratedQuestion(BaseModel):
    question: str
    category: str
    difficulty: str

class AIEvaluateAnswerRequest(BaseModel):
    question: str
    candidate_answer: str

class AIGenerateQuestionsRequest(BaseModel):
    role: str
    interview_type: str = "Technical"
    difficulty: str = "Intermediate"
    question_count: int = 4
    weak_areas: List[str] = []
    resume_text: Optional[str] = None

class AIGeneratePlanRequest(BaseModel):
    target_role: str
    experience_level: str = "Intermediate"
    duration_days: int = 7
    daily_time_minutes: int = 45
    weak_areas: List[str] = []

class AIRecommendationsRequest(BaseModel):
    weak_areas: List[str] = []

# --- Plan & Task Schemas ---
class PlanCreateRequest(BaseModel):
    target_role: str
    duration_days: int = Field(default=7, ge=1, le=365)
    daily_time_minutes: int = Field(default=45, ge=15, le=480)
    
class TaskStatusUpdateRequest(BaseModel):
    is_completed: bool

class PlanTaskResponse(BaseModel):
    id: str
    day_number: int
    topic: str
    objective: str
    practice_activity: str
    question_count: int
    estimated_minutes: int
    is_completed: bool

    class Config:
        from_attributes = True

class PlanDayGroup(BaseModel):
    day: int
    title: str
    objective: str
    tasks: List[PlanTaskResponse]

class PersonalizedPlanResponse(BaseModel):
    id: str
    user_id: int
    target_role: str
    total_days: int
    daily_time_minutes: int
    status: str
    progress_percentage: int
    weak_areas: List[str] = []
    days: List[PlanDayGroup] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Performance & History Schemas ---
class InterviewHistoryItem(BaseModel):
    id: str
    date: str
    role: str
    type: str
    mode: str
    difficulty: str
    score: float
    questions_count: int
    status: str

class TrendPoint(BaseModel):
    session: str
    score: float
    date: str

class TopicMastery(BaseModel):
    topic: str
    score: float
    status: str

class PerformanceResponse(BaseModel):
    average_score: float
    interviews_completed: int
    practice_hours: float
    strongest_topic: str
    weakest_topic: str
    trend: List[TrendPoint]
    topics: List[TopicMastery]

# --- Resume Schemas ---
class ResumeUploadResponse(BaseModel):
    filename: str
    extracted_skills: List[str]
    summary: str
