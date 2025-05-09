import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SubmitScore({ score, onSubmitted }) {
  const [username, setUsername] = useState("");

  async function handleSubmit() {
    if (!username) return;
    await supabase.from("leaderboard").insert([{ username, score }]);
    onSubmitted();
  }

  return (
    <div>
      <h3>Submit Score</h3>
      <input
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
