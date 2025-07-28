from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import asyncio
from contextlib import asynccontextmanager

# 配置
SECRET_KEY = os.getenv("JWT_SECRET", "your_jwt_secret_key_here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/school_system")

# 密碼加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# 全域變數
db = None

# Pydantic 模型
class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    userType: str
    name: str
    department: str
    studentId: Optional[str] = None
    staffId: Optional[str] = None
    position: Optional[str] = None
    grade: Optional[int] = None

class UserLogin(BaseModel):
    username: str
    password: str
    userType: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    userType: str
    name: str
    department: str
    studentId: Optional[str] = None
    staffId: Optional[str] = None
    position: Optional[str] = None
    grade: Optional[int] = None
    status: str
    createdAt: datetime
    lastLogin: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# 資料庫連接
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時連接資料庫
    global db
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client.school_system
    
    # 初始化資料庫
    await init_database()
    
    yield
    
    # 關閉時斷開連接
    client.close()

# 創建 FastAPI 應用
app = FastAPI(
    title="校務系統 API",
    description="School System API with MongoDB",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 工具函數
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# 初始化資料庫
async def init_database():
    print("🚀 正在初始化資料庫...")
    
    # 清空現有用戶資料（重設密碼）
    await db.users.delete_many({})
    print("🗑️ 已清空現有用戶資料")
    
    # 創建默認用戶 - 密碼統一設為 123
    default_users = [
        {
            "username": "admin",
            "password": get_password_hash("123"),
            "email": "admin@school.edu.tw",
            "userType": "admin",
            "name": "系統管理員",
            "department": "資訊中心",
            "status": "active",
            "createdAt": datetime.utcnow(),
            "lastLogin": None
        },
        {
            "username": "student1",
            "password": get_password_hash("123"),
            "email": "student1@school.edu.tw",
            "userType": "student",
            "name": "學生一號",
            "department": "資訊工程系",
            "studentId": "S001",
            "grade": 1,
            "status": "active",
            "createdAt": datetime.utcnow(),
            "lastLogin": None
        },
        {
            "username": "teacher1",
            "password": get_password_hash("123"),
            "email": "teacher1@school.edu.tw",
            "userType": "staff",
            "name": "教師一號",
            "department": "資訊工程系",
            "staffId": "T001",
            "position": "副教授",
            "status": "active",
            "createdAt": datetime.utcnow(),
            "lastLogin": None
        },
        {
            "username": "hr1",
            "password": get_password_hash("123"),
            "email": "hr1@school.edu.tw",
            "userType": "hr",
            "name": "人事一號",
            "department": "人事部",
            "staffId": "H001",
            "position": "人事專員",
            "status": "active",
            "createdAt": datetime.utcnow(),
            "lastLogin": None
        }
    ]
    
    # 插入默認用戶
    result = await db.users.insert_many(default_users)
    print(f"📝 已建立 {len(result.inserted_ids)} 個預設用戶")
    
    # 創建索引
    await db.users.create_index("username", unique=True)
    await db.users.create_index("email", unique=True)
    print("📑 已建立資料庫索引")
    
    print("✅ 資料庫初始化完成")

# API 路由
@app.get("/api/health")
async def health_check():
    """健康檢查端點"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if db is not None else "disconnected"
    }

@app.post("/api/login", response_model=Token)
async def login(user_data: UserLogin):
    # 驗證用戶
    user = await db.users.find_one({"username": user_data.username})
    if not user or not verify_password(user_data.password, user["password"]) or user["userType"] != user_data.userType:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="帳號或密碼錯誤"
        )
    
    # 更新最後登入時間
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"lastLogin": datetime.utcnow()}}
    )
    
    # 創建訪問令牌
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    # 準備用戶響應
    user_response = UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        userType=user["userType"],
        name=user["name"],
        department=user["department"],
        studentId=user.get("studentId"),
        staffId=user.get("staffId"),
        position=user.get("position"),
        grade=user.get("grade"),
        status=user["status"],
        createdAt=user["createdAt"],
        lastLogin=user.get("lastLogin")
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.post("/api/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # 檢查用戶名是否已存在
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用戶名已存在"
        )
    
    # 檢查郵箱是否已存在
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="郵箱已存在"
        )
    
    # 創建新用戶
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict["password"] = hashed_password
    user_dict["status"] = "active"
    user_dict["createdAt"] = datetime.utcnow()
    user_dict["lastLogin"] = None
    
    result = await db.users.insert_one(user_dict)
    
    # 取得創建的用戶
    user = await db.users.find_one({"_id": result.inserted_id})
    
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
        userType=user["userType"],
        name=user["name"],
        department=user["department"],
        studentId=user.get("studentId"),
        staffId=user.get("staffId"),
        position=user.get("position"),
        grade=user.get("grade"),
        status=user["status"],
        createdAt=user["createdAt"],
        lastLogin=user.get("lastLogin")
    )

@app.get("/api/users/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    if current_user["userType"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="權限不足"
        )
    
    stats = {}
    for user_type in ["admin", "student", "staff", "hr"]:
        count = await db.users.count_documents({"userType": user_type, "status": "active"})
        stats[user_type] = count
    
    return stats

@app.get("/api/users/{user_type}")
async def get_users_by_type(user_type: str, current_user: dict = Depends(get_current_user)):
    if current_user["userType"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="權限不足"
        )
    
    users = []
    async for user in db.users.find({"userType": user_type, "status": "active"}):
        users.append(UserResponse(
            id=str(user["_id"]),
            username=user["username"],
            email=user["email"],
            userType=user["userType"],
            name=user["name"],
            department=user["department"],
            studentId=user.get("studentId"),
            staffId=user.get("staffId"),
            position=user.get("position"),
            grade=user.get("grade"),
            status=user["status"],
            createdAt=user["createdAt"],
            lastLogin=user.get("lastLogin")
        ))
    
    return users

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
