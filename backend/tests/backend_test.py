"""Backend API tests for Patent Filing app"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://innovate-file-patent.preview.emergentagent.com").rstrip("/")
ADMIN_EMAIL = "admin@patentfiling.com"
ADMIN_PASSWORD = "Admin@123"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return s


# ─── Topics ───
class TestTopics:
    def test_get_topics_returns_10(self, client):
        r = client.get(f"{BASE_URL}/api/topics")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 10
        assert all("id" in t and "title" in t and "category" in t for t in data)

    def test_get_single_topic(self, client):
        r = client.get(f"{BASE_URL}/api/topics/1")
        assert r.status_code == 200
        assert r.json()["id"] == 1

    def test_get_invalid_topic(self, client):
        r = client.get(f"{BASE_URL}/api/topics/999")
        assert r.status_code == 404


# ─── Auth ───
class TestAuth:
    def test_login_success(self, client):
        r = client.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "access_token" in r.cookies

    def test_login_invalid(self, client):
        r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPass"})
        assert r.status_code in (401, 429)

    def test_auth_me_unauth(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_auth_me_authed(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ─── Applications ───
class TestApplications:
    def test_create_application_and_track(self, client):
        payload = {
            "student_name": "TEST_Student",
            "email": "test_student@example.com",
            "phone": "9999999999",
            "college_name": "TEST_College",
            "course_year": "B.Tech 3rd Year",
            "topic_id": 1,
            "abstract": "Test abstract content"
        }
        r = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "tracking_id" in data
        assert data["tracking_id"].startswith("PAT-")
        assert data["status"] == "submitted"
        tracking_id = data["tracking_id"]

        # Track
        r2 = requests.get(f"{BASE_URL}/api/applications/track/{tracking_id}")
        assert r2.status_code == 200
        td = r2.json()
        assert td["tracking_id"] == tracking_id
        assert td["student_name"] == "TEST_Student"
        assert td["status"] == "submitted"
        pytest.tracking_id = tracking_id

    def test_create_with_invalid_topic(self):
        payload = {
            "student_name": "TEST",
            "email": "t@e.com",
            "phone": "1",
            "college_name": "c",
            "course_year": "y",
            "topic_id": 99,
            "abstract": ""
        }
        r = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert r.status_code == 400

    def test_track_invalid_id(self):
        r = requests.get(f"{BASE_URL}/api/applications/track/PAT-INVALID")
        assert r.status_code == 404

    def test_get_applications_requires_admin(self):
        r = requests.get(f"{BASE_URL}/api/applications")
        assert r.status_code == 401

    def test_admin_list_applications(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/applications")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_update_status(self, admin_session):
        tid = getattr(pytest, "tracking_id", None)
        if not tid:
            pytest.skip("No tracking id")
        r = admin_session.put(
            f"{BASE_URL}/api/applications/{tid}/status",
            json={"status": "under_review", "admin_notes": "Reviewing now"},
        )
        assert r.status_code == 200
        assert r.json()["new_status"] == "under_review"

        # Verify persistence
        r2 = requests.get(f"{BASE_URL}/api/applications/track/{tid}")
        assert r2.status_code == 200
        assert r2.json()["status"] == "under_review"
        assert r2.json()["admin_notes"] == "Reviewing now"

    def test_admin_invalid_status(self, admin_session):
        tid = getattr(pytest, "tracking_id", None)
        if not tid:
            pytest.skip("No tracking id")
        r = admin_session.put(
            f"{BASE_URL}/api/applications/{tid}/status",
            json={"status": "invalid_status", "admin_notes": ""},
        )
        assert r.status_code == 400


# ─── Stats ───
class TestStats:
    def test_stats_requires_admin(self):
        r = requests.get(f"{BASE_URL}/api/stats")
        assert r.status_code == 401

    def test_stats_authed(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/stats")
        assert r.status_code == 200
        data = r.json()
        for k in ["total", "submitted", "in_progress", "filed", "granted", "topic_distribution"]:
            assert k in data


# ─── Logout ───
class TestLogout:
    def test_logout(self, client):
        s = requests.Session()
        s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.post(f"{BASE_URL}/api/auth/logout")
        assert r.status_code == 200
        r2 = s.get(f"{BASE_URL}/api/auth/me")
        assert r2.status_code == 401
