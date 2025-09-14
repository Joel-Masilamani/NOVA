from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Dict
import os

from schemas import MoodEntry, AnalysisResult
import ai_client
import db

app = FastAPI(title="Mood Journal Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load simple local exercises file for endpoints
import json
EXERCISES = json.load(open("exercises.json", "r"))

# Health check
@app.get("/ping")
def ping():
    return {"ok": True}

@app.post("/log_mood")
async def log_mood(entry: MoodEntry):
    entry_dict = entry.dict()
    if entry_dict.get("timestamp") is None:
        entry_dict["timestamp"] = datetime.utcnow().isoformat()
    # Analyze text if present
    analysis = None
    if entry_dict.get("text"):
        analysis = ai_client.analyze_journal_text(entry_dict["text"])
    # Save combined doc
    doc = {
        "user_id": entry.user_id,
        "timestamp": entry_dict["timestamp"],
        "mood_score": entry.mood_score,
        "mood_emoji": entry.mood_emoji,
        "text": entry.text,
        "analysis": analysis
    }
    doc_id = db.save_mood_entry(doc)

    # If high risk -> return special flag so frontend can show emergency resources
    risk = analysis.get("risk_level") if analysis else "none"
    high_risk = risk == "high"
    return {"id": doc_id, "risk_level": risk, "high_risk": high_risk, "analysis": analysis}

@app.get("/entries/{user_id}")
def get_entries(user_id: str, limit: int = 100):
    docs = db.get_user_entries(user_id, limit=limit)
    return {"count": len(docs), "entries": docs}

@app.get("/prompt")
def get_reflective_prompt(previous: str = ""):
    prompt = ai_client.generate_reflective_prompt(previous)
    return {"prompt": prompt}

@app.get("/exercises")
def list_exercises():
    return {"exercises": EXERCISES}

# Optionally, an endpoint to fetch crisis resources for the user's region
@app.get("/resources")
def resources(region: str = "global"):
    # Minimal sample. Expand to include campus counseling, local hotlines, emergency numbers.
    resource_map = {
        "global": [
            {"type": "suicide_hotline", "number": "If you are in immediate danger, call local emergency services."},
            {"type": "online_chat", "url": "https://www.iasp.info/resources/Crisis_Centres/"}
        ],
        "india": [
            {"type": "suicide_hotline", "number": "+91 9152987821 (AASRA)"},
            {"type": "college_counseling", "url": "Insert campus counseling URL here"}
        ]
    }
    return resource_map.get(region.lower(), resource_map["global"])
