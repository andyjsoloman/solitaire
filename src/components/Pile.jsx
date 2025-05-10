import { useDrop } from "react-dnd";
import styled from "styled-components";

const PileWrapper = styled.div`
  width: 80px;
  min-height: 120px;
  border: 1px dashed #aaa;
  border-radius: 8px;
  padding: 4px;
  position: relative;
  background-color: ${({ $isOver, $canDrop, $isSelfDrop }) => {
    if (!$isOver) return "transparent";
    if ($isSelfDrop) return "transparent";
    return $canDrop ? "#d0ffd0" : "#ffd0d0";
  }};
  transition: background-color 0.2s;
`;

function Pile({ children, onDropCard, columnIndex, getCanDrop, onClick }) {
  const [{ isOver, canDrop, draggedItem }, dropRef] = useDrop({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      draggedItem: monitor.getItem(),
    }),
    drop: (draggedCard) => {
      if (getCanDrop?.(draggedCard, columnIndex)) {
        onDropCard?.(draggedCard, columnIndex);
      }
    },
    canDrop: (draggedCard) => getCanDrop?.(draggedCard, columnIndex),
  });

  const isSelfDrop =
    draggedItem?.sourceCol === columnIndex ||
    (draggedItem?.sourceCol === "waste" && columnIndex === "waste");

  return (
    <PileWrapper
      ref={dropRef}
      $isOver={isOver}
      $canDrop={canDrop}
      $isSelfDrop={isSelfDrop}
      onClick={onClick}
    >
      {children}
    </PileWrapper>
  );
}

export default Pile;
