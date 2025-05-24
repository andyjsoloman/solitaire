// src/App.jsx
import styled from "styled-components";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core";

import "./App.css";
import Card from "./components/Card";
import Leaderboard from "./components/Leaderboard";
import GameBoard from "./components/GameBoard";
import { useState, useEffect } from "react";
import { generateDeck, shuffleDeck, dealCards } from "./utils/deck";
import supabase from "./lib/supabaseClient";
import Modal from "./components/Modal";
import { formatTime } from "./utils/formatTime";
import { CRTOverlay } from "./components/CRTOverlay";
import { CRTText } from "./components/CRTText";
import CRTModeToggle from "./components/CRTModeToggle";
import VictoryEmitter from "./components/VictoryEmitter";
import { getCanDrop as canDropRule, handleDropCard } from "./utils/rules";

const MainDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 60px;
`;

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
  const [finalTime, setFinalTime] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (isGameWon) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isGameWon]);

  useEffect(() => {
    if (isGameWon) {
      setFinalTime(Math.floor((Date.now() - startTime) / 1000));
      setShowWinModal(true);
    }
  }, [isGameWon, startTime]);

  async function submitScore() {
    if (!playerName) return alert("Please enter your name");

    const { error } = await supabase.from("leaderboard").insert([
      {
        username: playerName,
        time: finalTime,
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
    setFinalTime(null);
  }

  function handleDragStart(event) {
    setActiveCard(event.active.data.current);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const draggedCard = active.data.current;
    const targetKey = over.data?.current?.columnIndex;
    console.log("Drag End:", { draggedCard, targetKey });

    if (
      draggedCard &&
      targetKey !== undefined &&
      canDropRule(draggedCard, targetKey, gameState)
    ) {
      setGameState((prev) =>
        handleDropCard(draggedCard, targetKey, prev, setIsGameWon)
      );
    }
    setActiveCard(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <CRTModeToggle />
      <CRTText>SOLITAIRE</CRTText>
      <h1>SOLITAIRE</h1>
      <button onClick={resetGame}>🔄 Restart Game</button>
      {isGameWon && <h2>🎉 You win! 🎉</h2>}
      {!isGameWon && <p>⏱ Time: {formatTime(elapsedTime, true)}</p>}

      <MainDiv>
        <Leaderboard />
        <GameBoard
          tableau={gameState.tableau}
          stock={gameState.stock}
          waste={gameState.waste}
          foundations={gameState.foundations}
          setGameState={setGameState}
          isGameWon={isGameWon}
          setIsGameWon={setIsGameWon}
          activeCard={activeCard}
          getCanDrop={(card, destKey) => canDropRule(card, destKey, gameState)}
        />
        <DragOverlay>
          {activeCard ? (
            <Card {...activeCard} faceUp={true} index={0} isOverlay />
          ) : null}
        </DragOverlay>
        {isGameWon && <VictoryEmitter foundations={gameState.foundations} />}
        {showWinModal && (
          <Modal>
            <h3 style={{ color: "black" }}>
              🎉 You win! Enter a Name for the Leaderboard
            </h3>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <p style={{ color: "black" }}>
              Final time: {formatTime(finalTime)}
            </p>
            <button onClick={submitScore}>Submit</button>
          </Modal>
        )}
      </MainDiv>
    </DndContext>
  );
}

export default App;
