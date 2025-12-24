import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
key = os.getenv('GEMINI_API_KEY')

with open('debug_gemini.log', 'w') as f:
    f.write(f"Testing key starts with: {key[:5]}...\n") 
    genai.configure(api_key=key)
    
    test_models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-flash-latest', 'gemini-2.0-flash', 'gemini-pro']
    
    for model_name in test_models:
        f.write(f"\n--- Testing {model_name} ---\n")
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content('Hi')
            f.write(f"SUCCESS with {model_name}!\n")
            f.write(response.text + "\n")
            break # Stop if we find a working one
        except Exception as e:
            f.write(f"FAILURE with {model_name}: {str(e)}\n")
