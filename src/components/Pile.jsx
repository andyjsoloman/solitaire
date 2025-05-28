// src/components/Pile.jsx
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";

// Base layout styles shared by both interactive and dummy versions
const BasePileWrapper = styled.div`
  width: 80px;
  min-height: 120px;
  border-radius: 8px;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 60px;
    min-height: 90px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    width: 40px;
    min-height: 60px;
    border-radius: 4px;
  }
`;

// Interactive wrapper with drag-and-drop visual styling
const PileWrapper = styled(BasePileWrapper)`
  border: 1px dashed #aaa;
  background-color: ${({ $isOver, $canDrop, $isSelfDrop }) => {
    if (!$isOver) return "transparent";
    if ($isSelfDrop) return "transparent";
    return $canDrop ? "#d0ffd0" : "#ffd0d0";
  }};
  transition: background-color 0.2s;
`;

function Pile({ children, columnIndex, draggingData, getCanDrop, onClick }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `pile-${columnIndex}`,
    data: { columnIndex },
  });

  const canDrop =
    draggingData && typeof getCanDrop === "function"
      ? getCanDrop(draggingData, columnIndex)
      : false;

  const isSelfDrop =
    draggingData?.sourceCol === columnIndex ||
    (draggingData?.sourceCol === "waste" && columnIndex === "waste");

  return (
    <PileWrapper
      ref={setNodeRef}
      $isOver={isOver}
      $canDrop={canDrop}
      $isSelfDrop={isSelfDrop}
      onClick={onClick}
    >
      {children}
    </PileWrapper>
  );
}

// Dummy version that only shares layout without interaction
export function DummyPile({ children }) {
  return <BasePileWrapper>{children}</BasePileWrapper>;
}

export default Pile;
