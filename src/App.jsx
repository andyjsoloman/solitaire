import "./App.css";
import Card from "./components/Card";
import Leaderboard from "./components/Leaderboard";
import SolitaireGame from "./components/SolitaireGame";
import GameBoard from "./components/GameBoard";

import { useState } from "react";

import { generateDeck, shuffleDeck, dealCards } from "./utils/deck";

// Helper to initialize a new game
function getInitialGameState() {
  const deck = shuffleDeck(generateDeck());
  return dealCards(deck);
}

function App() {
  const [gameState, setGameState] = useState(getInitialGameState());
  const [isGameWon, setIsGameWon] = useState(false);

  function resetGame() {
    setGameState(getInitialGameState());
    setIsGameWon(false);
  }

  return (
    <>
      <h1>FUCKIN SOLITAIRE</h1>
      <SolitaireGame />
      <button onClick={resetGame}>🔄 Restart Game</button>
      {isGameWon && <h2>🎉 You win! 🎉</h2>}

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
