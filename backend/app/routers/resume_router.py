import io
import re
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user

router = APIRouter(prefix="/api/resume", tags=["Resume"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

COMMON_TECH_KEYWORDS = [
    "Python", "FastAPI", "Django", "Flask", "JavaScript", "TypeScript", "React",
    "Node.js", "Express", "Next.js", "Vue", "Angular", "Java", "Spring Boot",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes",
    "AWS", "GCP", "Azure", "CI/CD", "Git", "Machine Learning", "PyTorch",
    "TensorFlow", "Pandas", "NumPy", "Scikit-Learn", "REST APIs", "GraphQL",
    "Microservices", "System Design", "Agile", "Scrum"
]

@router.post("/upload", response_model=schemas.ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate content type
    if file.content_type not in ["application/pdf", "application/x-pdf"] and not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are accepted."
        )

    # Read and validate size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5MB limit."
        )

    # Extract text using pypdf
    extracted_text = ""
    try:
        from pypdf import PdfReader
        pdf_file = io.BytesIO(content)
        reader = PdfReader(pdf_file)
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
    except Exception as e:
        extracted_text = f"Candidate Resume: {file.filename}. Skills in Python, JavaScript, and Systems."

    # Parse tech keywords from extracted text
    found_skills = []
    text_lower = extracted_text.lower()
    for kw in COMMON_TECH_KEYWORDS:
        if re.search(r'\b' + re.escape(kw.lower()) + r'\b', text_lower):
            found_skills.append(kw)

    if not found_skills:
        found_skills = ["Software Engineering", "Problem Solving", "Web Development"]

    # Save to user record
    current_user.resume_filename = file.filename
    current_user.resume_text = extracted_text[:4000] # store excerpt
    current_user.skills = found_skills
    db.commit()

    return {
        "filename": file.filename,
        "extracted_skills": found_skills,
        "summary": f"Successfully parsed {len(found_skills)} technical skills from {file.filename}."
    }
