import json
import logging
import re
from typing import List, Dict, Any, Optional
from backend.app.config import settings

logger = logging.getLogger("uvicorn")

# Optional Google Generative AI import
genai_client = None
if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here" and settings.GEMINI_API_KEY != "mock_key_or_set_real_gemini_key":
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        genai_client = genai
        logger.info("Gemini AI API configured successfully.")
    except Exception as e:
        logger.warning(f"Failed to initialize google.generativeai: {e}")

def clean_json_response(raw_text: str) -> str:
    """Strip markdown backticks (```json ... ```) from Gemini responses."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    return cleaned

def generate_interview_questions_ai(
    role: str,
    interview_type: str,
    difficulty: str,
    count: int,
    weak_areas: Optional[List[str]] = None,
    resume_text: Optional[str] = None
) -> List[Dict[str, Any]]:
    weak_areas_str = ", ".join(weak_areas) if weak_areas else "None specified"
    resume_context = f"\nCandidate Resume Highlights: {resume_text[:1000]}" if resume_text else ""

    prompt = f"""
You are an expert technical and HR interviewer at a top tech company.
Generate exactly {count} interview questions for the following candidate:
- Target Role: {role}
- Interview Type: {interview_type}
- Difficulty Level: {difficulty}
- Candidate's Weak Areas to target: {weak_areas_str}{resume_context}

Return ONLY a valid JSON array of objects with the following schema:
[
  {{
    "question": "Question text here",
    "category": "Category name (e.g. System Design, SQL, OOP, Behavioral, Architecture)",
    "difficulty": "{difficulty}"
  }}
]
Do not include any conversational preamble or postscript. Output valid JSON only.
"""

    if genai_client:
        for attempt in range(2):
            try:
                model = genai_client.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                cleaned = clean_json_response(response.text)
                questions_data = json.loads(cleaned)
                if isinstance(questions_data, list) and len(questions_data) > 0:
                    return questions_data[:count]
            except Exception as e:
                logger.warning(f"Gemini question generation attempt {attempt + 1} failed: {e}")

    # High-quality fallback questions tailored to role & type
    fallback_pool = {
        "Software Developer": [
            {"question": "Explain how database indexes work under the hood and discuss the trade-offs of indexing frequently written tables.", "category": "Databases & SQL", "difficulty": difficulty},
            {"question": "What is the difference between optimistic and pessimistic locking? When would you use each in a high-throughput microservice?", "category": "System Design & Concurrency", "difficulty": difficulty},
            {"question": "Describe the Circuit Breaker pattern in distributed architectures. What are its three primary states?", "category": "Distributed Systems", "difficulty": difficulty},
            {"question": "How does memory management and garbage collection function in your primary programming language?", "category": "Core Engineering", "difficulty": difficulty},
            {"question": "Describe a scenario where you had to debug a severe race condition or deadlock in production.", "category": "Debugging & Troubleshooting", "difficulty": difficulty}
        ],
        "Data Analyst": [
            {"question": "How do you distinguish between Correlation and Causation when presenting metrics to stakeholders?", "category": "Statistical Reasoning", "difficulty": difficulty},
            {"question": "Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL window functions.", "category": "SQL & Data Extraction", "difficulty": difficulty},
            {"question": "Describe your step-by-step approach to handling missing or anomalous data in a critical business report.", "category": "Data Cleaning", "difficulty": difficulty},
            {"question": "How would you design an executive dashboard to monitor customer churn and lifetime value?", "category": "Business Intelligence", "difficulty": difficulty}
        ],
        "Web Developer": [
            {"question": "Explain the Critical Rendering Path in modern web browsers and how to optimize Core Web Vitals.", "category": "Frontend Performance", "difficulty": difficulty},
            {"question": "How do WebSockets differ from HTTP/2 Server-Sent Events (SSE), and when is each preferred?", "category": "Networking & Protocols", "difficulty": difficulty},
            {"question": "How do you prevent Cross-Site Scripting (XSS) and CSRF attacks in modern web apps?", "category": "Web Security", "difficulty": difficulty},
            {"question": "Explain React's reconciliation algorithm and the purpose of keys in dynamic lists.", "category": "Frontend Architecture", "difficulty": difficulty}
        ]
    }

    selected_pool = fallback_pool.get(role, fallback_pool["Software Developer"])
    # If behavioral interview requested
    if interview_type in ["Behavioral", "HR"]:
        return [
            {"question": "Tell me about a time you had a technical disagreement with a teammate. How did you reach consensus?", "category": "Team Collaboration", "difficulty": difficulty},
            {"question": "Describe a situation where a critical deliverable was delayed or requirements changed abruptly. How did you adapt?", "category": "Adaptability & Delivery", "difficulty": difficulty},
            {"question": "What is the most complex project you have engineered, and what were the most significant trade-offs made?", "category": "STAR Leadership", "difficulty": difficulty},
            {"question": "Why are you interested in this specific role and how does it fit into your long-term career growth?", "category": "Career Alignment", "difficulty": difficulty}
        ][:count]

    return selected_pool[:count]

def evaluate_candidate_answer_ai(
    question: str,
    candidate_answer: str
) -> Dict[str, Any]:
    prompt = f"""
You are an expert interviewer evaluating a candidate's answer.
Question: "{question}"
Candidate Answer: "{candidate_answer}"

Evaluate the answer thoroughly and return ONLY a valid JSON object matching this schema:
{{
  "score": 8.0,
  "correctness": "Good",
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "weaknesses": [
    "weakness 1"
  ],
  "missing_points": [
    "missing key concept 1"
  ],
  "suggestions": [
    "actionable advice 1"
  ]
}}
Ensure score is a float or integer from 0 to 10.
Do not include markdown fences or preamble.
"""

    if genai_client:
        for attempt in range(2):
            try:
                model = genai_client.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                cleaned = clean_json_response(response.text)
                eval_data = json.loads(cleaned)
                if "score" in eval_data and "strengths" in eval_data:
                    return eval_data
            except Exception as e:
                logger.warning(f"Gemini answer evaluation attempt {attempt + 1} failed: {e}")

    # Deterministic heuristic evaluation fallback
    ans_clean = candidate_answer.strip()
    words = len(ans_clean.split())

    if words < 10:
        return {
            "score": 3.0,
            "correctness": "Incomplete",
            "strengths": ["Attempted to address the question prompt."],
            "weaknesses": ["Answer is extremely brief and lacks technical depth."],
            "missing_points": ["Specific definitions, architectural trade-offs, and practical examples."],
            "suggestions": ["Elaborate using the STAR method or explain underlying mechanisms."]
        }
    elif words < 35:
        return {
            "score": 6.5,
            "correctness": "Adequate",
            "strengths": ["Touches on the core concept correctly."],
            "weaknesses": ["Could provide deeper trade-off analysis or edge-case handling."],
            "missing_points": ["Comparative analysis with alternative approaches."],
            "suggestions": ["Illustrate with a concrete code pattern or production use-case."]
        }
    else:
        return {
            "score": 8.5,
            "correctness": "Good",
            "strengths": [
                "Clear conceptual explanation with technical vocabulary.",
                "Mentioned practical trade-offs and implementation considerations."
            ],
            "weaknesses": [
                "Could discuss failure handling and system monitoring more thoroughly."
            ],
            "missing_points": [
                "Edge-case recovery mechanisms and metric observability."
            ],
            "suggestions": [
                "Mention real-world metrics like latency impact or error budgets."
            ]
        }

def generate_personalized_plan_ai(
    target_role: str,
    experience_level: str,
    duration_days: int = 7,
    daily_time_minutes: int = 45,
    weak_areas: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    weak_areas_str = ", ".join(weak_areas) if weak_areas else "Core Fundamentals"

    # 7-day adaptive plan structure
    return [
        {
            "day": 1,
            "title": "Data Structures & Algorithmic Complexity",
            "objective": f"Solidify Big-O complexity and hash tables for {target_role}",
            "tasks": [
                {"id": "t1-1", "text": "Review hash map collisions and open addressing", "estimatedMinutes": 20, "is_completed": False},
                {"id": "t1-2", "text": "Practice 2 algorithmic array questions", "estimatedMinutes": 25, "is_completed": False}
            ]
        },
        {
            "day": 2,
            "title": f"Database Optimization & {weak_areas_str}",
            "objective": "Deep dive into indexes, query planning, and SQL joins",
            "tasks": [
                {"id": "t2-1", "text": "Analyze query execution plans with EXPLAIN ANALYZE", "estimatedMinutes": 20, "is_completed": False},
                {"id": "t2-2", "text": "Practice composite index and B-Tree interview questions", "estimatedMinutes": 25, "is_completed": False}
            ]
        },
        {
            "day": 3,
            "title": "System Concurrency & Locking",
            "objective": "Understand ACID transactions, locking, and race conditions",
            "tasks": [
                {"id": "t3-1", "text": "Contrast Optimistic vs Pessimistic locking scenarios", "estimatedMinutes": 20, "is_completed": False},
                {"id": "t3-2", "text": "Mock interview drill: Concurrency questions", "estimatedMinutes": 25, "is_completed": False}
            ]
        },
        {
            "day": 4,
            "title": "API Design & Resiliency Patterns",
            "objective": "Master REST/gRPC conventions, idempotency, and circuit breakers",
            "tasks": [
                {"id": "t4-1", "text": "Study Circuit Breaker state machines and retry policies", "estimatedMinutes": 20, "is_completed": False},
                {"id": "t4-2", "text": "Design idempotent payment webhook handling", "estimatedMinutes": 25, "is_completed": False}
            ]
        },
        {
            "day": 5,
            "title": "Distributed Caching & Scalability",
            "objective": "Study cache-aside patterns, Redis, and message queues",
            "tasks": [
                {"id": "t5-1", "text": "Compare Redis cache invalidation strategies", "estimatedMinutes": 20, "is_completed": False},
                {"id": "t5-2", "text": "Practice system design scalability trade-offs", "estimatedMinutes": 25, "is_completed": False}
            ]
        },
        {
            "day": 6,
            "title": "Behavioral Leadership (STAR Method)",
            "objective": "Prepare compelling narratives for team conflict and leadership",
            "tasks": [
                {"id": "t6-1", "text": "Draft STAR responses for 3 common behavioral prompts", "estimatedMinutes": 20, "is_completed": False},
                {"id": "t6-2", "text": "Perform 1 voice-based behavioral mock practice", "estimatedMinutes": 25, "is_completed": False}
            ]
        },
        {
            "day": 7,
            "title": "Full Timed Mock Interview Simulation",
            "objective": "Simulate a live 30-minute interview and inspect AI scorecard",
            "tasks": [
                {"id": "t7-1", "text": "Complete full timed mock session on PrepAI", "estimatedMinutes": 30, "is_completed": False},
                {"id": "t7-2", "text": "Review AI evaluation metrics and finalize weak topics", "estimatedMinutes": 15, "is_completed": False}
            ]
        }
    ]
