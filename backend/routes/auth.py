from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SignupIn(BaseModel):
    email: str
    name: str

@router.post('/signup')
async def signup(data: SignupIn):
    # Demo endpoint; in production integrate Firebase/Auth provider
    return {"message": "signup success", "email": data.email}
