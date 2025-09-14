import os
from google.cloud import aiplatform
from typing import Dict, Any, List

PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT", "YOUR_PROJECT_ID")
LOCATION = os.environ.get("VERTEX_LOCATION", "us-central1")

aiplatform.init(project=PROJECT, location=LOCATION)

# Use text-bison for generation & classification
model = aiplatform.TextGenerationModel.from_pretrained("text-bison@001")

def analyze_journal_text(text: str) -> Dict[str, Any]:
    """
    Returns: sentiment_score (-1 to 1), emotions list, reframing suggestion, risk_level
    Uses a single prompt that instructs the model to extract structured information.
    """
    prompt = f"""
You are a compassionate mental health assistant that only analyzes journal text.
Given the journal entry delimited by triple backticks, respond in JSON with keys:
- sentiment_score (float between -1 and 1)
- emotions (array of short labels, e.g. ["sad", "anxious"])
- reframing (one compassionate cognitive reframe, 30-80 words)
- suggestions (array of up to 3 practical coping tips)
- risk_level: one of "none","low","moderate","high". "high" indicates possible self-harm/suicidal intent or imminent danger.
Journal entry:
```{text}```
Respond only with valid JSON.
"""
    resp = model.predict(prompt, max_output_tokens=512)
    # model.predict returns a response object with .text usually
    try:
        import json
        j = json.loads(resp.text)
        return j
    except Exception as e:
        # fallback: minimal parsing to keep system robust
        return {
            "sentiment_score": 0.0,
            "emotions": [],
            "reframing": "I couldn't analyze this entry properly; try writing a bit more detail.",
            "suggestions": [],
            "risk_level": "none"
        }

def generate_reflective_prompt(prev_text: str = "") -> str:
    """
    Return a single-line or short multi-sentence prompt to ask the user to reflect deeper.
    Example: "What's one small thing that brought you comfort today?"
    """
    instruction = (
        "You are a supportive coach. Create one reflective journaling prompt "
        "that helps the writer explore feelings, be specific, and be non-judgmental. "
        "Keep prompt under 20 words."
    )
    prompt = f"{instruction}\nPrevious note: '''{prev_text}'''"
    resp = model.predict(prompt, max_output_tokens=64)
    return resp.text.strip()
