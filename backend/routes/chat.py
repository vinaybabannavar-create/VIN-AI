from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from ai.ai_engine import generate_chat_response

router = APIRouter()

@router.post("/message")
async def chat(
    message: str = Form(...), 
    history: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    import json
    parsed_history = []
    if history:
        try:
            parsed_history = json.loads(history)
        except:
            pass
            
    image_data = None
    if image:
        image_data = await image.read()
    
    response = generate_chat_response(message, parsed_history, image_data)
    return {"reply": response}
