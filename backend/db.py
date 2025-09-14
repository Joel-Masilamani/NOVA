from google.cloud import firestore
from typing import Dict, Any
import os

# Ensure GOOGLE_APPLICATION_CREDENTIALS env var points to your service account JSON
db = firestore.Client(project=os.environ.get("GOOGLE_CLOUD_PROJECT", "YOUR_PROJECT_ID"))

def save_mood_entry(entry: Dict[str, Any]) -> str:
    col = db.collection("mood_entries")
    doc_ref = col.document()
    doc_ref.set(entry)
    return doc_ref.id

def get_user_entries(user_id: str, limit: int = 100):
    col = db.collection("mood_entries")
    docs = col.where("user_id", "==", user_id).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit).stream()
    return [d.to_dict() for d in docs]
