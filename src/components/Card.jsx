// src/components/Card.jsx
import styled from "styled-components";
import { useDraggable } from "@dnd-kit/core";

const CardWrapper = styled.div.attrs({})`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  background-color: ${({ $faceUp }) => ($faceUp ? "white" : "#2e3a59")};
  color: ${({ $suit }) =>
    $suit === "hearts" || $suit === "diamonds" ? "red" : "black"};
  border: 1px solid #999;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  position: relative;
  margin-top: ${({ $index }) =>
    $index > 0 ? `calc(-1.25 * var(--card-offset, 80px))` : "0px"};

  @media (max-width: 768px) {
    --card-offset: 60px;
  }

  @media (max-width: 480px) {
    --card-offset: 50px;
  }
  z-index: ${({ $index }) => $index + 1};
  cursor: ${({ $isDraggable }) => ($isDraggable ? "grab" : "default")};
  touch-action: none; /* Important for mobile drag */
  z-index: ${({ $isOverlay, $index }) => ($isOverlay ? 9999 : $index + 1)};

  @media (max-width: 768px) {
    width: 60px;
    height: 90px;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 75px;
    font-size: 16px;
  }
`;

const FaceDownOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: #2e3a59;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardBackIcon = styled.img`
  width: 40px;
  height: auto;
`;

function getCardImageFilename(suit, rank) {
  const suitMap = {
    hearts: "HEART",
    diamonds: "DIAMOND",
    clubs: "CLUB",
    spades: "SPADE",
  };

  const rankMap = {
    A: "1",
    J: "11-JACK",
    Q: "12-QUEEN",
    K: "13-KING",
  };

  const normalizedSuit = suitMap[suit.toLowerCase()] || suit.toUpperCase();
  const rankKey = rank.toString().toUpperCase();
  const normalizedRank = rankMap[rankKey] || rankKey;

  return `${normalizedSuit}-${normalizedRank}.svg`;
}

function Card({
  rank,
  suit,
  faceUp,
  index,
  id,
  sourceCol,
  onDoubleClick,
  // eslint-disable-next-line no-unused-vars
  isOverlay = false,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `card-${id}`,
    data: { id, rank, suit, index, sourceCol },
    disabled: !faceUp,
  });

  return (
    <CardWrapper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      $suit={suit}
      $faceUp={faceUp}
      $index={index}
      $isDraggable={faceUp}
      onDoubleClick={onDoubleClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {faceUp ? (
        <img
          src={`/cards/${getCardImageFilename(suit, rank)}`}
          alt={`${rank} of ${suit}`}
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        />
      ) : (
        <FaceDownOverlay>
          <CardBackIcon src="/TrebleClef.svg" alt="Card back" />
        </FaceDownOverlay>
      )}
    </CardWrapper>
  );
}

export default Card;
