import "./App.css";
import Card from "./components/Card";
import Leaderboard from "./components/Leaderboard";
import SolitaireGame from "./components/SolitaireGame";
import GameBoard from "./components/GameBoard";

import { useState, useEffect } from "react";

import { generateDeck, shuffleDeck, dealCards } from "./utils/deck";
import supabase from "./lib/supabaseClient";

// Helper to initialize a new game
function getInitialGameState() {
  const deck = shuffleDeck(generateDeck());
  return dealCards(deck);
}

function App() {
  const [gameState, setGameState] = useState(getInitialGameState());
  const [isGameWon, setIsGameWon] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (isGameWon) {
      const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);

      supabase
        .from("leaderboard")
        .insert([
          {
            username: "Player", // replace with user input if available
            time: timeInSeconds,
          },
        ])
        .then((res) => console.log("Score submitted:", res))
        .catch((err) => console.error("Error submitting score:", err));
    }
  }, [isGameWon]);

  function resetGame() {
    setGameState(getInitialGameState());
    setIsGameWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  }
  return (
    <>
      <h1>FUCKIN SOLITAIRE</h1>
      <SolitaireGame />
      <button onClick={resetGame}>🔄 Restart Game</button>
      {isGameWon && <h2>🎉 You win! 🎉</h2>}
      <p>⏱ Time: {elapsedTime}s</p>

      <GameBoard
        tableau={gameState.tableau}
        stock={gameState.stock}
        setGameState={setGameState}
        waste={gameState.waste}
        foundations={gameState.foundations}
        isGameWon={isGameWon}
        setIsGameWon={setIsGameWon}
      />
      <Leaderboard />
    </>
  );
}

export default App;
