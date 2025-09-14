from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MoodEntry(BaseModel):
    user_id: str
    timestamp: Optional[datetime]
    mood_score: Optional[int]   # 1-10
    mood_emoji: Optional[str]
    text: Optional[str]

class AnalysisResult(BaseModel):
    sentiment_score: float
    emotions: List[str]
    reframing: Optional[str]
    risk_level: Optional[str]  # "none", "low", "moderate", "high"
    suggestions: Optional[List[str]]
