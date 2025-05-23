import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Card from "./Card";
import gsap from "gsap";

const SUITS = ["hearts", "diamonds", "clubs", "spades"];

export default function VictoryEmitter({ foundations }) {
  const containerRef = useRef(null);
  const [emittedCards, setEmittedCards] = useState([]);
  const [emissionIndexBySuit, setEmissionIndexBySuit] = useState({
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    spades: 0,
  });
  const cardIdRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const piles = document.querySelectorAll(".foundation-card");

      piles.forEach((el, i) => {
        const suit = SUITS[i];
        const pile = foundations[suit];
        const index = emissionIndexBySuit[suit];

        if (!pile || index >= pile.length || !el) return;

        const cardToEmit = pile[index];
        const rect = el.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        const newCard = {
          id: cardIdRef.current++,
          cardData: cardToEmit,
          origin: {
            x: rect.left + scrollX,
            y: rect.top + scrollY,
          },
        };

        setEmittedCards((prev) => [...prev, newCard]);

        setEmissionIndexBySuit((prev) => ({
          ...prev,
          [suit]: prev[suit] + 1,
        }));
      });
    }, 300);

    return () => clearInterval(interval);
  }, [foundations, emissionIndexBySuit]);

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      }}
    >
      {emittedCards.map((emitted) => (
        <AnimatedCard
          key={emitted.id}
          card={emitted.cardData}
          startX={emitted.origin.x}
          startY={emitted.origin.y}
          onComplete={() =>
            setEmittedCards((prev) => prev.filter((c) => c.id !== emitted.id))
          }
        />
      ))}
    </div>,
    document.body
  );
}

function AnimatedCard({ card, startX, startY, onComplete }) {
  const cardRef = useRef();

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.set(cardRef.current, {
      x: startX,
      y: startY,
    });

    gsap.to(cardRef.current, {
      x: window.innerWidth + 200,
      y: `+=${Math.random() * 60 - 30}`,
      rotation: Math.random() * 180 - 90,
      duration: 2.5,
      ease: "power1.inOut",
      onComplete,
    });
  }, [startX, startY, onComplete]);

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        width: "80px",
        height: "120px",
        zIndex: 1000,
        willChange: "transform",
      }}
    >
      <Card {...card} faceUp index={0} draggableOverride={false} />
    </div>
  );
}
