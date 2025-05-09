import { useState } from "react";
import SubmitScore from "./SubmitScore";

export default function SolitaireGame() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Placeholder scoring + end game
  function simulateGameWin() {
    setScore(Math.floor(Math.random() * 1000));
    setGameOver(true);
  }

  return (
    <div>
      <h1>Solitaire</h1>
      {!gameOver ? (
        <button onClick={simulateGameWin}>Simulate Win</button>
      ) : (
        <>
          <p>Game Over! Your score: {score}</p>
          <SubmitScore score={score} onSubmitted={() => setGameOver(false)} />
        </>
      )}
    </div>
  );
}
