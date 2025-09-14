const BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

export async function postMood(entry) {
  const res = await fetch(`${BASE}/log_mood`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry)
  });
  return res.json();
}

export async function getPrompt(previous="") {
  const res = await fetch(`${BASE}/prompt?previous=${encodeURIComponent(previous)}`);
  return res.json();
}

export async function getExercises() {
  const res = await fetch(`${BASE}/exercises`);
  return res.json();
}

export async function getResources(region="global") {
  const res = await fetch(`${BASE}/resources?region=${region}`);
  return res.json();
}
