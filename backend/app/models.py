import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    target_role = Column(String(100), default="Software Developer")
    experience_level = Column(String(50), default="Intermediate")
    resume_filename = Column(String(255), nullable=True)
    resume_text = Column(Text, nullable=True)
    skills = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    plans = relationship("PersonalizedPlan", back_populates="user", cascade="all, delete-orphan")
    answers = relationship("Answer", back_populates="user", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceHistory", back_populates="user", cascade="all, delete-orphan")

class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50), default="Engineering")
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String(100), nullable=False)
    interview_type = Column(String(50), default="Technical")
    difficulty = Column(String(30), default="Intermediate")
    question_count = Column(Integer, default=4)
    mode = Column(String(20), default="text") # 'text' | 'voice'
    status = Column(String(30), default="in_progress") # 'in_progress' | 'completed'
    overall_score = Column(Float, nullable=True)
    feedback_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False, index=True)
    order_index = Column(Integer, default=1)
    category = Column(String(100), default="General")
    difficulty = Column(String(30), default="Intermediate")
    question_text = Column(Text, nullable=False)

    # Relationships
    interview = relationship("Interview", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    answer_text = Column(Text, nullable=False)
    audio_duration_seconds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    question = relationship("Question", back_populates="answers")
    user = relationship("User", back_populates="answers")
    evaluation = relationship("Evaluation", back_populates="answer", uselist=False, cascade="all, delete-orphan")

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    answer_id = Column(Integer, ForeignKey("answers.id"), nullable=False, unique=True)
    score = Column(Float, default=0.0)
    correctness = Column(String(50), default="Satisfactory")
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    missing_points = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    answer = relationship("Answer", back_populates="evaluation")

class PersonalizedPlan(Base):
    __tablename__ = "personalized_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    target_role = Column(String(100), nullable=False)
    duration_days = Column(Integer, default=7)
    daily_time_minutes = Column(Integer, default=45)
    status = Column(String(30), default="active") # 'active' | 'completed' | 'archived'
    weak_areas = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="plans")
    tasks = relationship("PlanTask", back_populates="plan", cascade="all, delete-orphan")

class PlanTask(Base):
    __tablename__ = "plan_tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    plan_id = Column(String(36), ForeignKey("personalized_plans.id"), nullable=False, index=True)
    day_number = Column(Integer, nullable=False)
    topic = Column(String(120), nullable=False)
    objective = Column(Text, nullable=False)
    practice_activity = Column(Text, nullable=False)
    question_count = Column(Integer, default=2)
    estimated_minutes = Column(Integer, default=25)
    is_completed = Column(Boolean, default=False)

    # Relationships
    plan = relationship("PersonalizedPlan", back_populates="tasks")

class PerformanceHistory(Base):
    __tablename__ = "performance_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    interview_id = Column(String(36), nullable=False)
    role = Column(String(100), nullable=False)
    overall_score = Column(Float, nullable=False)
    category_breakdown = Column(JSON, default=list)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="performance_records")
