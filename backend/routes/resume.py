from fastapi import APIRouter, Form
from ai.ai_engine import generate_resume

router = APIRouter()

@router.post('/create')
async def create_resume(name: str = Form(...), skills: str = Form(...), projects: str = Form(...)):
    resume_text = generate_resume(name, skills, projects)
    return {"resume": resume_text}
