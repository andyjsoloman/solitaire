// src/components/Card.jsx
import styled from "styled-components";

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
    $index > 0 ? `-100px` : "0px"}; /* Slight overlap using negative margin */
  z-index: ${({ $index }) => $index + 1}; /* Ensure the top card stays on top */
`;

const FaceDownOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: #2e3a59;
  border-radius: 8px;
`;

function getSuitSymbol(suit) {
  switch (suit) {
    case "hearts":
      return "♥";
    case "diamonds":
      return "♦";
    case "clubs":
      return "♣";
    case "spades":
      return "♠";
    default:
      return "";
  }
}

function Card({ rank, suit, faceUp, index }) {
  return (
    <CardWrapper $suit={suit} $faceUp={faceUp} $index={index}>
      {faceUp ? `${rank}${getSuitSymbol(suit)}` : <FaceDownOverlay />}
    </CardWrapper>
  );
}

export default Card;
