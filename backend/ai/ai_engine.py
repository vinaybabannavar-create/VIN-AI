import os
import base64
import PIL.Image
import io
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    # Fallback to OPENAI_API_KEY if user accidentally put it there, 
    # but GEMINI keys are different. Better to be explicit.
    GEMINI_API_KEY = os.getenv('OPENAI_API_KEY') 
    
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is missing in backend/.env. AI features will fail.")
else:
    print(f"INFO: Gemini API Key loaded (starts with {GEMINI_API_KEY[:3]}...)")

genai.configure(api_key=GEMINI_API_KEY)

# Use Gemini Flash Latest - verified working for this specific key
MODEL_NAME = "gemini-flash-latest"
model = genai.GenerativeModel(MODEL_NAME)

def generate_career_roadmap(skill: str, level: str = "fresher") -> str:
    prompt = (
        f"Create a detailed, step-by-step roadmap for a {level} who wants to learn {skill}.\n"
        "Include topics, suggested duration per topic, projects, and interview prep tips."
    )
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"ERROR inside generate_career_roadmap: {e}")
        return f"(Gemini call failed: {e})\nFallback suggestion: Start with basics, build small projects, practice interviews."

def generate_resume(name: str, skills: str, projects: str) -> str:
    prompt = (
        f"Create an ATS friendly resume for {name}.\nSkills: {skills}.\nProjects: {projects}.\n"
        "Keep it concise and formatted with bullets and headings."
    )
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"(Gemini call failed: {e})\nResume draft:\n- Name: {name}\n- Skills: {skills}\n- Projects: {projects}"

def generate_chat_response(message: str, history: list = None, image_data: bytes = None) -> str:
    print(f"DEBUG: Generating chat response for message: {message[:20]}...")
    try:
        # Convert frontend history to Gemini format if provided
        gemini_history = []
        if history:
            for msg in history[-10:]: # Keep last 10 messages for context
                role = "user" if msg['type'] == 'user' else "model"
                gemini_history.append({"role": role, "parts": [msg['content']]})
        
        chat_session = model.start_chat(history=gemini_history)
        
        if image_data:
            print("DEBUG: Processing with image...")
            img = PIL.Image.open(io.BytesIO(image_data))
            response = chat_session.send_message([message, img])
        else:
            print("DEBUG: Processing text-only...")
            response = chat_session.send_message(message)
            
        print("DEBUG: Gemini response received successfully.")
        return response.text
    except Exception as e:
        print(f"CRITICAL ERROR in generate_chat_response: {str(e)}")
        return f"I'm having trouble connecting to my brain right now. (Error: {str(e)})"
