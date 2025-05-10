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
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        {deck.map((card) => (
          <Card key={card.id} rank={card.rank} suit={card.suit} />
        ))}
      </div> */}
      <GameBoard tableau={gameState.tableau} stock={gameState.stock} />
      <Leaderboard />
    </>
  );
}

export default App;
