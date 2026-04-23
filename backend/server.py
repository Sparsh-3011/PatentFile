from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import bcrypt
import jwt
import secrets
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ─── Patent Topics ───
PATENT_TOPICS = [
    {
        "id": 1,
        "title": "AI-Based Real-Time Fraud Detection System for Digital Payments",
        "category": "FinTech / AI",
        "description": "A system leveraging artificial intelligence to detect and prevent fraudulent transactions in real-time across digital payment platforms.",
        "icon": "shield"
    },
    {
        "id": 2,
        "title": "Explainable AI Framework for Healthcare Diagnosis Systems",
        "category": "Healthcare / AI",
        "description": "An AI framework that provides transparent and interpretable diagnostic recommendations for healthcare professionals.",
        "icon": "heart"
    },
    {
        "id": 3,
        "title": "Deep Learning Model for Early Detection of Diseases from Medical Images",
        "category": "Healthcare / Deep Learning",
        "description": "A deep learning-based approach for early disease detection through analysis of medical imaging data.",
        "icon": "scan"
    },
    {
        "id": 4,
        "title": "Predictive Analytics Model for Stock Market Trend Forecasting",
        "category": "Finance / Analytics",
        "description": "A predictive analytics model that uses machine learning to forecast stock market trends and patterns.",
        "icon": "trending-up"
    },
    {
        "id": 5,
        "title": "AI-Powered Smart Traffic Management System Using Reinforcement Learning",
        "category": "Smart City / AI",
        "description": "An intelligent traffic management system that uses reinforcement learning to optimize traffic flow in real-time.",
        "icon": "traffic-cone"
    },
    {
        "id": 6,
        "title": "Federated Learning System for Privacy-Preserving Data Sharing",
        "category": "Privacy / ML",
        "description": "A federated learning framework enabling collaborative model training while preserving data privacy across organizations.",
        "icon": "lock"
    },
    {
        "id": 7,
        "title": "Sentiment Analysis Model for Social Media Using NLP Techniques",
        "category": "NLP / Social Media",
        "description": "An NLP-based sentiment analysis model for extracting opinions and emotions from social media content.",
        "icon": "message-circle"
    },
    {
        "id": 8,
        "title": "AI-Based Cybersecurity Threat Detection and Prevention System",
        "category": "Cybersecurity / AI",
        "description": "An AI-driven system for detecting, analyzing, and preventing cybersecurity threats in real-time.",
        "icon": "bug"
    },
    {
        "id": 9,
        "title": "Edge AI Framework for Real-Time IoT Data Processing",
        "category": "IoT / Edge Computing",
        "description": "A framework for deploying AI models at the edge for real-time processing of IoT sensor data.",
        "icon": "cpu"
    },
    {
        "id": 10,
        "title": "Generative AI Model for Synthetic Data Generation in Healthcare",
        "category": "Healthcare / GenAI",
        "description": "A generative AI model that creates synthetic healthcare data for research and model training purposes.",
        "icon": "database"
    }
]

# ─── Password Utils ───
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# ─── JWT Utils ───
def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# ─── Auth Helper ───
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ─── Pydantic Models ───
class LoginRequest(BaseModel):
    email: str
    password: str

class ApplicationCreate(BaseModel):
    student_name: str
    email: str
    phone: str
    college_name: str
    course_year: str
    topic_id: int
    abstract: str = ""

class StatusUpdate(BaseModel):
    status: str
    admin_notes: str = ""

class TrackRequest(BaseModel):
    tracking_id: str

# ─── Auth Endpoints ───
@api_router.post("/auth/login")
async def login(req: LoginRequest, response: Response, request: Request):
    email = req.email.lower().strip()
    client_ip = request.client.host if request.client else "unknown"
    identifier = f"{client_ip}:{email}"

    # Brute force check
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        lockout_until = attempt.get("locked_until")
        if lockout_until and datetime.now(timezone.utc) < lockout_until:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        else:
            await db.login_attempts.delete_one({"identifier": identifier})

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": datetime.now(timezone.utc) + timedelta(minutes=15)}},
            upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)

    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")

    return {"id": user_id, "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "user")}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        new_access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(key="access_token", value=new_access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ─── Topics Endpoints ───
@api_router.get("/topics")
async def get_topics():
    return PATENT_TOPICS

@api_router.get("/topics/{topic_id}")
async def get_topic(topic_id: int):
    for t in PATENT_TOPICS:
        if t["id"] == topic_id:
            return t
    raise HTTPException(status_code=404, detail="Topic not found")

# ─── Application Endpoints ───
@api_router.post("/applications")
async def create_application(app_data: ApplicationCreate):
    tracking_id = f"PAT-{secrets.token_hex(4).upper()}"

    topic = None
    for t in PATENT_TOPICS:
        if t["id"] == app_data.topic_id:
            topic = t
            break
    if not topic:
        raise HTTPException(status_code=400, detail="Invalid topic selected")

    doc = {
        "tracking_id": tracking_id,
        "student_name": app_data.student_name,
        "email": app_data.email.lower().strip(),
        "phone": app_data.phone,
        "college_name": app_data.college_name,
        "course_year": app_data.course_year,
        "topic_id": app_data.topic_id,
        "topic_title": topic["title"],
        "abstract": app_data.abstract,
        "status": "submitted",
        "admin_notes": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.applications.insert_one(doc)
    return {
        "tracking_id": tracking_id,
        "message": "Application submitted successfully! Save your tracking ID to check status.",
        "student_name": app_data.student_name,
        "topic_title": topic["title"],
        "status": "submitted"
    }

@api_router.get("/applications")
async def get_applications(request: Request, status: Optional[str] = None, search: Optional[str] = None):
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    query = {}
    if status and status != "all":
        query["status"] = status
    if search:
        query["$or"] = [
            {"student_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"tracking_id": {"$regex": search, "$options": "i"}},
            {"college_name": {"$regex": search, "$options": "i"}}
        ]

    applications = await db.applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return applications

@api_router.get("/applications/track/{tracking_id}")
async def track_application(tracking_id: str):
    app = await db.applications.find_one({"tracking_id": tracking_id}, {"_id": 0})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found. Please check your tracking ID.")
    return {
        "tracking_id": app["tracking_id"],
        "student_name": app["student_name"],
        "topic_title": app["topic_title"],
        "status": app["status"],
        "admin_notes": app.get("admin_notes", ""),
        "created_at": app["created_at"],
        "updated_at": app["updated_at"]
    }

@api_router.put("/applications/{tracking_id}/status")
async def update_application_status(tracking_id: str, status_data: StatusUpdate, request: Request):
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    valid_statuses = ["submitted", "under_review", "in_progress", "abstract_needed", "filing", "filed", "acknowledged", "granted"]
    if status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

    result = await db.applications.update_one(
        {"tracking_id": tracking_id},
        {"$set": {"status": status_data.status, "admin_notes": status_data.admin_notes, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Status updated successfully", "tracking_id": tracking_id, "new_status": status_data.status}

# ─── Stats Endpoint ───
@api_router.get("/stats")
async def get_stats(request: Request):
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    total = await db.applications.count_documents({})
    submitted = await db.applications.count_documents({"status": "submitted"})
    in_progress = await db.applications.count_documents({"status": {"$in": ["under_review", "in_progress", "abstract_needed", "filing"]}})
    filed = await db.applications.count_documents({"status": {"$in": ["filed", "acknowledged"]}})
    granted = await db.applications.count_documents({"status": "granted"})

    # Topic-wise distribution
    pipeline = [{"$group": {"_id": "$topic_title", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    topic_stats = await db.applications.aggregate(pipeline).to_list(20)

    return {
        "total": total,
        "submitted": submitted,
        "in_progress": in_progress,
        "filed": filed,
        "granted": granted,
        "topic_distribution": [{"topic": s["_id"], "count": s["count"]} for s in topic_stats]
    }

# ─── Startup ───
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.applications.create_index("tracking_id", unique=True)
    await db.applications.create_index("email")
    await seed_admin()

async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@patentfiling.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")

    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n## Auth Endpoints\n- POST /api/auth/login\n- GET /api/auth/me\n- POST /api/auth/logout\n- POST /api/auth/refresh\n")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
