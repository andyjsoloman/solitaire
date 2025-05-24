import styled from "styled-components";
import Pile, { DummyPile } from "./Pile";
import Card from "./Card";
import { rankOrder, checkWin } from "../utils/rules";

const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  width: 60%;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: end;
  gap: 2rem;
`;

const LeftGroup = styled.div`
  display: flex;
  gap: 2rem;
`;

const RightGroup = styled.div`
  display: flex;
  gap: 2rem;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: end;
  gap: 2rem;
`;

function GameBoard({
  tableau,
  stock,
  waste,
  setGameState,
  foundations,
  setIsGameWon,
  activeCard,
  getCanDrop,
  onDropCard,
}) {
  function handleDrawCard() {
    setGameState((prev) => {
      if (prev.stock.length > 0) {
        const newStock = [...prev.stock];
        const drawnCard = newStock.pop();
        drawnCard.faceUp = true;

        return {
          ...prev,
          stock: newStock,
          waste: [...prev.waste, drawnCard],
        };
      }

      if (prev.waste.length > 0) {
        const resetStock = [...prev.waste]
          .map((card) => ({ ...card, faceUp: false }))
          .reverse();

        return {
          ...prev,
          stock: resetStock,
          waste: [],
        };
      }

      return prev;
    });
  }

  function handleCardDoubleClick(card, sourceColKey) {
    setGameState((prev) => {
      const newTableau = prev.tableau.map((col) => [...col]);
      const newFoundations = { ...prev.foundations };
      const newWaste = [...prev.waste];
      const suit = card.suit;
      const destPile = [...newFoundations[suit]];
      const topCard = destPile[destPile.length - 1];

      const cardValue = rankOrder[card.rank];
      const topValue = topCard ? rankOrder[topCard.rank] : 0;

      const canMoveToFoundation =
        (destPile.length === 0 && card.rank === "A") ||
        (topCard && card.suit === suit && cardValue === topValue + 1);

      if (!canMoveToFoundation) return prev;

      if (sourceColKey === "waste") {
        const lastCard = newWaste.pop();
        if (lastCard.id !== card.id) return prev;

        destPile.push(lastCard);
        newFoundations[suit] = destPile;

        if (checkWin(newFoundations)) setIsGameWon(true);

        return {
          ...prev,
          waste: newWaste,
          foundations: newFoundations,
        };
      }

      const colIndex = parseInt(sourceColKey);
      const sourceCol = newTableau[colIndex];
      const cardIndex = sourceCol.findIndex((c) => c.id === card.id);
      if (cardIndex !== sourceCol.length - 1) return prev;

      const [cardToMove] = sourceCol.splice(cardIndex);
      destPile.push(cardToMove);
      newFoundations[suit] = destPile;

      if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }

      if (checkWin(newFoundations)) setIsGameWon(true);

      return {
        ...prev,
        tableau: newTableau,
        foundations: newFoundations,
      };
    });
  }

  return (
    <BoardWrapper>
      <TopRow>
        <LeftGroup>
          <Pile onClick={handleDrawCard} getCanDrop={() => false}>
            {stock.length > 0 && (
              <Card rank="🂠" suit="back" faceUp={false} index={0} />
            )}
          </Pile>
          <Pile
            columnIndex="waste"
            draggingData={activeCard}
            getCanDrop={() => false}
          >
            {waste && waste.length > 0 && (
              <Card
                {...waste[waste.length - 1]}
                index={0}
                sourceCol="waste"
                onDoubleClick={() =>
                  handleCardDoubleClick(waste[waste.length - 1], "waste")
                }
              />
            )}
          </Pile>
        </LeftGroup>
        <DummyPile />
        <RightGroup>
          {["hearts", "diamonds", "clubs", "spades"].map((suit) => (
            <Pile
              key={suit}
              columnIndex={suit}
              getCanDrop={(card) => getCanDrop(card, suit)}
              draggingData={activeCard}
              onDropCard={onDropCard}
            >
              {foundations[suit].length > 0 && (
                <div className="foundation-card">
                  <Card
                    {...foundations[suit][foundations[suit].length - 1]}
                    index={0}
                    sourceCol={`foundation-${suit}`}
                  />
                </div>
              )}
            </Pile>
          ))}
        </RightGroup>
      </TopRow>

      <BottomRow>
        {tableau.map((column, i) => (
          <Pile
            key={i}
            columnIndex={i}
            getCanDrop={(card) => getCanDrop(card, i)}
            draggingData={activeCard}
          >
            {column.map((card, index) => (
              <Card
                key={card.id}
                {...card}
                index={index}
                sourceCol={String(i)}
                onDoubleClick={() => handleCardDoubleClick(card, String(i))}
              />
            ))}
          </Pile>
        ))}
      </BottomRow>
    </BoardWrapper>
  );
}

export default GameBoard;
