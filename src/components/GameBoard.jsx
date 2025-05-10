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

function GameBoard({ tableau, stock, waste, setGameState }) {
  function handleDrawCard() {
    setGameState((prev) => {
      if (prev.stock.length === 0) return prev;

      const newStock = [...prev.stock];
      const drawnCard = newStock.pop();
      drawnCard.faceUp = true;

      return {
        ...prev,
        stock: newStock,
        waste: [...prev.waste, drawnCard],
      };
    });
  }

  function handleDropCard(draggedCard, destColIndex) {
    setGameState((prev) => {
      const newTableau = prev.tableau.map((col) => [...col]);

      // Get destination info
      const destCol = newTableau[destColIndex];
      const targetCard =
        destCol.length > 0 ? destCol[destCol.length - 1] : null;

      if (!isValidMove(draggedCard, targetCard)) return prev;

      // Determine source
      if (draggedCard.sourceCol === "waste") {
        const newWaste = [...prev.waste];
        const lastCard = newWaste.pop();

        if (lastCard.id !== draggedCard.id) return prev; // fail-safe

        destCol.push(lastCard);

        return {
          ...prev,
          tableau: newTableau,
          waste: newWaste,
        };
      }

      // Otherwise: from tableau
      const sourceColIndex = parseInt(draggedCard.sourceCol);
      const sourceCol = newTableau[sourceColIndex];
      const cardIndex = sourceCol.findIndex((c) => c.id === draggedCard.id);
      const movingCards = sourceCol.splice(cardIndex);

      // Flip if needed
      if (
        sourceCol.length > 0 &&
        sourceCol[sourceCol.length - 1].faceUp === false
      ) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }

      destCol.push(...movingCards);

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
          <Pile onClick={handleDrawCard}>
            {stock.length > 0 ? (
              <Card rank="🂠" suit="back" faceUp={false} index={0} />
            ) : null}
          </Pile>
          <Pile columnIndex="waste">
            {waste && waste.length > 0 && (
              <Card {...waste[waste.length - 1]} index={0} sourceCol="waste" />
            )}
          </Pile>
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
