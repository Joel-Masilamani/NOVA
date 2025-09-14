import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import { getEntries } from "../api";

export default function Dashboard({ userId }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8000/entries/${userId}?limit=50`);
        const data = await res.json();
        setEntries(data.entries || []);
      } catch (err) {
        console.error("Error loading entries", err);
      }
    })();
  }, [userId]);

  // Transform data for chart
  const chartData = entries
    .map(e => ({
      date: new Date(e.timestamp).toLocaleDateString(),
      mood: e.mood_score || null,
      sentiment: e.analysis?.sentiment_score || null
    }))
    .reverse(); // oldest first for charting

  return (
    <div>
      <h3>📊 Mood & Sentiment Dashboard</h3>
      {chartData.length === 0 ? (
        <p>No entries yet. Start journaling!</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} label={{ value: "Mood (1-10)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" name="Mood Score" />
            <Line type="monotone" dataKey="sentiment" stroke="#82ca9d" name="Sentiment (-1 to 1)" yAxisId={1} />
            <YAxis yAxisId={1} orientation="right" domain={[-1, 1]} label={{ value: "Sentiment", angle: 90, position: "insideRight" }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Optional area chart showing mood trends */}
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis domain={[0,10]} />
            <Tooltip />
            <Area type="monotone" dataKey="mood" stroke="#8884d8" fillOpacity={1} fill="url(#colorMood)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
