import React, { useState } from "react";

export default function MoodSlider({ onSubmit }) {
  const [score, setScore] = useState(5);
  const [emoji, setEmoji] = useState("🙂");

  const emojis = ["😢","😟","😐","🙂","😀","🤩"];
  return (
    <div>
      <h3>How are you feeling?</h3>
      <input type="range" min="1" max="10" value={score} onChange={(e)=>setScore(e.target.value)} />
      <div style={{fontSize: 32}}>{emoji}</div>
      <div>
        {emojis.map(e => (
          <button key={e} onClick={()=>setEmoji(e)} style={{fontSize:24}}>{e}</button>
        ))}
      </div>
      <button onClick={()=>onSubmit({ mood_score: parseInt(score), mood_emoji: emoji })}>Save Mood</button>
    </div>
  );
}
