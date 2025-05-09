import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
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
            {s.username} — {s.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
