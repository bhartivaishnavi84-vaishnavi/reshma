import os
import sys
import unittest
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main import app
from backend.app.database import Base, engine
from backend.app.init_db import init_db

class TestBackendAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Initialize database tables
        init_db()
        cls.client = TestClient(app)
        cls.test_email = f"testuser_{os.getpid()}@example.com"
        cls.test_password = "SecurePassword123!"

    def test_01_health_and_root(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json().get("status"), "ok")

        root_res = self.client.get("/")
        self.assertEqual(root_res.status_code, 200)
        self.assertEqual(root_res.json().get("status"), "online")

    def test_02_register_and_login(self):
        # 1. Register
        reg_payload = {
            "name": "Integration Test Candidate",
            "email": self.test_email,
            "password": self.test_password,
            "target_role": "Software Developer",
            "experience_level": "Intermediate"
        }
        reg_res = self.client.post("/api/register", json=reg_payload)
        self.assertEqual(reg_res.status_code, 200)
        reg_data = reg_res.json()
        self.assertIn("access_token", reg_data)
        self.assertEqual(reg_data["user"]["email"], self.test_email)
        TestBackendAPI.token = reg_data["access_token"]
        TestBackendAPI.user_id = reg_data["user"]["id"]

        # 2. Login
        login_res = self.client.post("/api/login", json={
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(login_res.status_code, 200)
        self.assertIn("access_token", login_res.json())

    def test_03_authenticated_me(self):
        headers = {"Authorization": f"Bearer {TestBackendAPI.token}"}
        res = self.client.get("/api/me", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["email"], self.test_email)

    def test_04_interview_lifecycle(self):
        headers = {"Authorization": f"Bearer {TestBackendAPI.token}"}

        # 1. Start Interview
        start_payload = {
            "role": "Software Developer",
            "interview_type": "Technical",
            "difficulty": "Intermediate",
            "question_count": 2,
            "mode": "text"
        }
        start_res = self.client.post("/api/interview/start", json=start_payload, headers=headers)
        self.assertEqual(start_res.status_code, 200)
        intv_data = start_res.json()
        self.assertIn("id", intv_data)
        self.assertEqual(len(intv_data["questions"]), 2)
        intv_id = intv_data["id"]
        q1_id = intv_data["questions"][0]["id"]

        # 2. Submit Answer
        ans_payload = {
            "answer_text": "Optimistic locking assumes collisions are rare and verifies record version tags upon commit. Pessimistic locking acquires explicit database row locks upfront.",
            "audio_duration_seconds": 15
        }
        ans_res = self.client.post(
            f"/api/interview/{intv_id}/answer?question_id={q1_id}",
            json=ans_payload,
            headers=headers
        )
        self.assertEqual(ans_res.status_code, 200)
        eval_data = ans_res.json()
        self.assertIn("score", eval_data)
        self.assertIn("strengths", eval_data)
        self.assertGreaterEqual(eval_data["score"], 0)

        # 3. Complete Interview
        complete_res = self.client.post(f"/api/interview/{intv_id}/complete", headers=headers)
        self.assertEqual(complete_res.status_code, 200)
        comp_data = complete_res.json()
        self.assertIn("overall_score", comp_data)
        self.assertIn("category_breakdown", comp_data)

    def test_05_personalized_plan_lifecycle(self):
        headers = {"Authorization": f"Bearer {TestBackendAPI.token}"}

        # 1. Fetch or create plan
        plan_res = self.client.get(f"/api/plans/{TestBackendAPI.user_id}", headers=headers)
        self.assertEqual(plan_res.status_code, 200)
        plan_data = plan_res.json()
        self.assertIn("days", plan_data)
        self.assertGreater(len(plan_data["days"]), 0)

        # 2. Toggle Task
        first_task = plan_data["days"][0]["tasks"][0]
        task_id = first_task["id"]
        toggle_res = self.client.put(
            f"/api/plans/tasks/{task_id}",
            json={"is_completed": True},
            headers=headers
        )
        self.assertEqual(toggle_res.status_code, 200)
        self.assertTrue(toggle_res.json()["is_completed"])

    def test_06_performance_and_history(self):
        headers = {"Authorization": f"Bearer {TestBackendAPI.token}"}

        # 1. History
        hist_res = self.client.get("/api/interviews/history", headers=headers)
        self.assertEqual(hist_res.status_code, 200)
        self.assertIsInstance(hist_res.json(), list)

        # 2. Performance
        perf_res = self.client.get(f"/api/performance/{TestBackendAPI.user_id}", headers=headers)
        self.assertEqual(perf_res.status_code, 200)
        perf_data = perf_res.json()
        self.assertIn("average_score", perf_data)
        self.assertIn("trend", perf_data)

    def test_07_authorization_security(self):
        # Attempt to access another user's plan without auth
        unauth_res = self.client.get("/api/plans/99999")
        self.assertEqual(unauth_res.status_code, 401)

        # Cross-user access attempt
        headers = {"Authorization": f"Bearer {TestBackendAPI.token}"}
        cross_res = self.client.get("/api/plans/99999", headers=headers)
        self.assertEqual(cross_res.status_code, 403)

if __name__ == "__main__":
    unittest.main()
