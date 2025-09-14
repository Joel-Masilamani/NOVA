import React, { useEffect, useState } from "react";
import { getExercises } from "../api";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  useEffect(()=> {
    getExercises().then(r => setExercises(r.exercises || []));
  }, []);
  return (
    <div>
      <h3>Exercises</h3>
      {exercises.map(ex => (
        <div key={ex.id} style={{border:"1px solid #ddd", padding:12, margin:8}}>
          <h4>{ex.title}</h4>
          <ol>
            {ex.instructions.map((i, idx) => <li key={idx}>{i}</li>)}
          </ol>
        </div>
      ))}
    </div>
  );
}
