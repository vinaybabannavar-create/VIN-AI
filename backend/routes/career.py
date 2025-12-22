from fastapi import APIRouter, Query
from ai.ai_engine import generate_career_roadmap

router = APIRouter()

@router.get('/roadmap')
async def get_roadmap(skill: str = Query(...), level: str = Query('fresher')):
    roadmap = generate_career_roadmap(skill, level)
    return {"skill": skill, "level": level, "roadmap": roadmap}
