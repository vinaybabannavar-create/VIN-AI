from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.career import router as career_router
from routes.resume import router as resume_router
from routes.chat import router as chat_router

app = FastAPI(title="AI Career Platform Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(career_router, prefix="/career")
app.include_router(resume_router, prefix="/resume")
app.include_router(chat_router, prefix="/chat")

@app.get("/")
async def root():
    return {"message": "AI Career Platform Backend Running"}