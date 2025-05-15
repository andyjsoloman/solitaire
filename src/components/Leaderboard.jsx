import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { formatTime } from "../utils/formatTime";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("time", { ascending: true }) // fastest times first
        .limit(10);

      if (!error) setScores(data);
    }
    fetchScores();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {scores.map((s) => (
          <li key={s.id}>
            {s.username} — {formatTime(s.time)}
          </li>
        ))}
      </ul>
    </div>
  );
}
