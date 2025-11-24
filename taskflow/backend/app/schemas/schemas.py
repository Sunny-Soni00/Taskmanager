# backend/app/schemas/schemas.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

# ----------------
# User
# ----------------
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    code_id: Optional[str] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    code_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

#user login
class UserLogin(BaseModel):
    email: str
    password: str

# ----------------
# Auth
# ----------------
class Token(BaseModel):
    access_token: str
    token_type: str

# ----------------
# Team
# ----------------
class TeamCreate(BaseModel):
    name: str

class TeamOut(BaseModel):
    id: int
    name: str
    owner_id: int

    model_config = {"from_attributes": True}

class AddMemberIn(BaseModel):
    code_id: str

# ----------------
# Project
# ----------------
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    team_id: Optional[int] = None

class ProjectOut(BaseModel):
    id: int
    team_id: Optional[int]
    name: str
    description: Optional[str]

    model_config = {"from_attributes": True}

# ----------------
# Task
# ----------------
class TaskCreate(BaseModel):
    project_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None

class TaskOut(BaseModel):
    id: int
    project_id: Optional[int]
    title: str
    description: Optional[str]
    assignee_id: Optional[int]
    priority: str
    status: str
    due_date: Optional[datetime]
    created_by: Optional[int]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}
