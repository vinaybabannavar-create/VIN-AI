# Placeholder Firebase config initializer for backend (optional)
# To use: provide service account json at path specified in .env FIREBASE_CRED_PATH
import os
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    cred_path = os.getenv('FIREBASE_CRED_PATH', './firebase-key.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
    else:
        db = None
except Exception:
    db = None
