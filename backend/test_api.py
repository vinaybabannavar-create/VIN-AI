import requests

try:
    response = requests.get("http://localhost:8000/career/roadmap?skill=Python&level=fresher")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
