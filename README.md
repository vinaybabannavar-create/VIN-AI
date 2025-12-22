# AI Career Platform (Simple Starter)

This repo contains a starter AI Career Platform:
- Backend: FastAPI (OpenAI integration)
- Frontend: React + Vite (simple pages)

## Quick start

1. Backend
```bash
cd backend
python -m venv venv
# activate venv on Windows: venv\\Scripts\\Activate.ps1 (or activate.bat)
# on Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
# copy .env.example to .env and set OPENAI_API_KEY
uvicorn main:app --reload --port 8000
```

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open frontend (Vite) at http://localhost:5173 and backend at http://localhost:8000

## Note
Set your OpenAI key in backend/.env. The default model in backend/ai/ai_engine.py is 'gpt-4o-mini'.
