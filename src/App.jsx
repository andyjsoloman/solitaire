import "./App.css";
import Card from "./components/Card";
import Leaderboard from "./components/Leaderboard";
import SolitaireGame from "./components/SolitaireGame";
import GameBoard from "./components/GameBoard";

import { useState } from "react";

import { generateDeck, shuffleDeck, dealCards } from "./utils/deck";

function App() {
  const [gameState, setGameState] = useState(() => {
    const deck = shuffleDeck(generateDeck());
    return dealCards(deck);
  });

  return (
    <>
      <h1>FUCKIN SOLITAIRE</h1>
      <SolitaireGame />
      <GameBoard
        tableau={gameState.tableau}
        stock={gameState.stock}
        setGameState={setGameState}
      />
      <Leaderboard />
    </>
  );
}

export default App;
