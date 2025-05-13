import "./App.css";
import Card from "./components/Card";
import Leaderboard from "./components/Leaderboard";
import SolitaireGame from "./components/SolitaireGame";
import GameBoard from "./components/GameBoard";

import { useState, useEffect } from "react";

import { generateDeck, shuffleDeck, dealCards } from "./utils/deck";
import supabase from "./lib/supabaseClient";
import Modal from "./components/Modal";

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
  const [playerName, setPlayerName] = useState("");
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (isGameWon) {
      setShowWinModal(true);
    }
  }, [isGameWon]);

  async function submitScore() {
    const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);

    if (!playerName) return alert("Please enter your name");

    const { error } = await supabase.from("leaderboard").insert([
      {
        username: playerName,
        time: timeInSeconds,
      },
    ]);

    if (error) {
      console.error("Submission failed:", error);
      return alert("Failed to save score.");
    }

    setShowWinModal(false);
    setPlayerName("");
  }

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
      {showWinModal && (
        <Modal>
          <h2>🎉 You win!</h2>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={submitScore}>Submit</button>
        </Modal>
      )}

      <Leaderboard />
    </>
  );
}

export default App;
