import logging
from backend.app.database import engine, Base, SessionLocal
from backend.app import models

logger = logging.getLogger("uvicorn")

INITIAL_ROLES = [
    {"name": "Software Developer", "category": "Engineering", "description": "Backend and fullstack application development with algorithmic focus."},
    {"name": "Data Analyst", "category": "Data", "description": "SQL data extraction, business intelligence, and statistical reporting."},
    {"name": "Data Scientist", "category": "Data", "description": "Predictive modeling, machine learning, and data experimentation."},
    {"name": "Web Developer", "category": "Engineering", "description": "Frontend interfaces, web performance, and responsive architecture."},
    {"name": "Python Developer", "category": "Engineering", "description": "High-performance Python backends, APIs, and automation workflows."},
    {"name": "Java Developer", "category": "Engineering", "description": "Enterprise microservices, Spring Boot, and concurrent systems."},
    {"name": "Business Analyst", "category": "Management", "description": "Requirement elicitation, process workflows, and stakeholder management."},
    {"name": "ML Engineer", "category": "Data & AI", "description": "MLOps, deep learning architectures, and model inference optimization."}
]

def init_db():
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        for r_data in INITIAL_ROLES:
            existing = db.query(models.JobRole).filter(models.JobRole.name == r_data["name"]).first()
            if not existing:
                role = models.JobRole(
                    name=r_data["name"],
                    category=r_data["category"],
                    description=r_data["description"],
                    is_active=True
                )
                db.add(role)
        db.commit()
        logger.info("Database initialized and default job roles verified.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database tables and seed data created successfully!")
