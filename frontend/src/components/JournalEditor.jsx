import React, { useState } from "react";
import { postMood, getPrompt } from "../api";

export default function JournalEditor({ userId }) {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [prompt, setPrompt] = useState("");

  const askPrompt = async () => {
    const r = await getPrompt(text);
    setPrompt(r.prompt);
  };

  const submit = async () => {
    const payload = {
      user_id: userId,
      timestamp: new Date().toISOString(),
      text
    };
    const res = await postMood(payload);
    setAnalysis(res.analysis);
    if (res.high_risk) {
      alert("This entry appears high-risk. Please use immediate support resources provided on the next screen.");
    } else {
      alert("Saved! Here's a quick suggestion: " + (res.analysis?.suggestions?.[0] || "—"));
    }
  };

  return (
    <div>
      <h3>Journal</h3>
      <textarea rows={8} value={text} onChange={(e)=>setText(e.target.value)} />
      <div>
        <button onClick={askPrompt}>Get a reflective prompt</button>
        <button onClick={submit}>Submit Journal</button>
      </div>
      {prompt && <div><b>Prompt:</b> {prompt}</div>}
      {analysis && <div>
        <h4>Analysis</h4>
        <div>Sentiment: {analysis.sentiment_score}</div>
        <div>Emotions: {analysis.emotions?.join(", ")}</div>
        <div>Reframe: {analysis.reframing}</div>
      </div>}
    </div>
  );
}
