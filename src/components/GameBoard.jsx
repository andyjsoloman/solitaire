import styled from "styled-components";
import Pile from "./Pile";
import Card from "./Card";
import { isValidMove } from "../utils/rules";

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RightGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

function GameBoard({ tableau, stock, setGameState }) {
  function handleDropCard(draggedCard, destColIndex) {
    setGameState((prev) => {
      const newTableau = prev.tableau.map((col) => [...col]);

      const sourceColIndex = newTableau.findIndex((col) =>
        col.some((card) => card.id === draggedCard.id)
      );
      const cardIndex = newTableau[sourceColIndex].findIndex(
        (c) => c.id === draggedCard.id
      );
      const movingCards = newTableau[sourceColIndex].slice(cardIndex);
      const movingCard = movingCards[0];

      const destCol = newTableau[destColIndex];
      const targetCard =
        destCol.length > 0 ? destCol[destCol.length - 1] : null;

      // ✅ Check if move is valid
      if (!isValidMove(movingCard, targetCard)) return prev;

      // 🧹 Remove from source
      newTableau[sourceColIndex].splice(cardIndex);

      // ✅ Flip last face-down card in source, if any
      const sourceCol = newTableau[sourceColIndex];
      if (
        sourceCol.length > 0 &&
        sourceCol[sourceCol.length - 1].faceUp === false
      ) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }

      // ➕ Add to destination
      newTableau[destColIndex].push(...movingCards);

      return {
        ...prev,
        tableau: newTableau,
      };
    });
  }

  function getCanDrop(card, destColIndex) {
    const destCol = tableau[destColIndex];
    const targetCard = destCol.length > 0 ? destCol[destCol.length - 1] : null;
    return isValidMove(card, targetCard);
  }

  return (
    <BoardWrapper>
      {/* Top Row */}
      <TopRow>
        <LeftGroup>
          <Pile>{stock.length > 0 && <Card />}</Pile>
          <Pile /> {/* Waste */}
        </LeftGroup>
        <RightGroup>
          {[...Array(4)].map((_, i) => (
            <Pile key={i} />
          ))}
        </RightGroup>
      </TopRow>

      {/* Bottom Row - Tableau */}
      <BottomRow>
        {tableau.map((column, i) => (
          <Pile
            key={i}
            columnIndex={i}
            onDropCard={handleDropCard}
            getCanDrop={(card) => getCanDrop(card, i)}
          >
            {column.map((card, index) => (
              <Card key={card.id} {...card} index={index} sourceCol={i} />
            ))}
          </Pile>
        ))}
      </BottomRow>
    </BoardWrapper>
  );
}

export default GameBoard;
