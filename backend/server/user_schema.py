from pydantic import BaseModel, EmailStr

# Schema for user registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Schema for user login
class UserLogin(BaseModel):
    username: str
    password: str

# Schema for representing a user (without password)
class User(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True
