import styled from "styled-components";
import Pile from "./Pile";
import Card from "./Card";
import { isValidMove, rankOrder, checkWin } from "../utils/rules";

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

function GameBoard({
  tableau,
  stock,
  waste,
  setGameState,
  foundations,
  setIsGameWon,
}) {
  function handleDrawCard() {
    setGameState((prev) => {
      // ✅ CASE 1: Draw from stock
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

      // ✅ CASE 2: Reset stock from waste
      if (prev.waste.length > 0) {
        const resetStock = [...prev.waste]
          .map((card) => ({ ...card, faceUp: false })) // turn face-down
          .reverse(); // reverse order

        return {
          ...prev,
          stock: resetStock,
          waste: [],
        };
      }

      // No stock and no waste — do nothing
      return prev;
    });
  }

  function handleDropCard(draggedCard, destColKey) {
    setGameState((prev) => {
      const newTableau = prev.tableau.map((col) => [...col]);
      const newFoundations = { ...prev.foundations };

      const isFoundation = ["hearts", "diamonds", "clubs", "spades"].includes(
        destColKey
      );

      // === ✅ FOUNDATION DROP ===
      if (isFoundation) {
        const destPile = [...newFoundations[destColKey]];
        const topCard = destPile[destPile.length - 1];

        const isAce = draggedCard.rank === "A";
        const isSameSuit = draggedCard.suit === destColKey;
        const isNextInSequence =
          topCard &&
          rankOrder[draggedCard.rank] === rankOrder[topCard.rank] + 1;

        const canPlace =
          (destPile.length === 0 && isAce && isSameSuit) ||
          (topCard && isSameSuit && isNextInSequence);

        if (!canPlace) return prev;

        // From waste
        if (draggedCard.sourceCol === "waste") {
          const newWaste = [...prev.waste];
          const lastCard = newWaste.pop();
          if (lastCard.id !== draggedCard.id) return prev;

          destPile.push(lastCard);
          newFoundations[destColKey] = destPile;

          if (checkWin(newFoundations)) {
            setIsGameWon(true);
          }

          return {
            ...prev,
            waste: newWaste,
            foundations: newFoundations,
          };
        }

        // From tableau
        const sourceColIndex = parseInt(draggedCard.sourceCol);
        const sourceCol = newTableau[sourceColIndex];
        const cardIndex = sourceCol.findIndex((c) => c.id === draggedCard.id);
        const [cardToMove] = sourceCol.splice(cardIndex);

        if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
          sourceCol[sourceCol.length - 1].faceUp = true;
        }

        destPile.push(cardToMove);
        newFoundations[destColKey] = destPile;

        if (checkWin(newFoundations)) {
          setIsGameWon(true);
        }

        return {
          ...prev,
          tableau: newTableau,
          foundations: newFoundations,
        };
      }

      // === ✅ TABLEAU DROP ===
      const destCol = newTableau[destColKey];
      const targetCard =
        destCol.length > 0 ? destCol[destCol.length - 1] : null;

      if (!isValidMove(draggedCard, targetCard)) return prev;

      // From waste
      if (draggedCard.sourceCol === "waste") {
        const newWaste = [...prev.waste];
        const lastCard = newWaste.pop();
        if (lastCard.id !== draggedCard.id) return prev;

        destCol.push(lastCard);

        return {
          ...prev,
          tableau: newTableau,
          waste: newWaste,
        };
      }

      // From foundation
      if (draggedCard.sourceCol?.startsWith("foundation-")) {
        const suit = draggedCard.suit;
        const newFoundationsPile = [...newFoundations[suit]];
        const lastCard = newFoundationsPile.pop();

        if (lastCard?.id !== draggedCard.id) return prev;

        destCol.push(lastCard);
        newFoundations[suit] = newFoundationsPile;

        return {
          ...prev,
          tableau: newTableau,
          foundations: newFoundations,
        };
      }

      // From tableau
      const sourceColIndex = parseInt(draggedCard.sourceCol);
      const sourceCol = newTableau[sourceColIndex];
      const cardIndex = sourceCol.findIndex((c) => c.id === draggedCard.id);
      const movingCards = sourceCol.splice(cardIndex);

      if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }

      destCol.push(...movingCards);

      return {
        ...prev,
        tableau: newTableau,
      };
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

      // ✅ From waste
      if (sourceColKey === "waste") {
        const lastCard = newWaste.pop();
        if (lastCard.id !== card.id) return prev;

        destPile.push(lastCard);
        newFoundations[suit] = destPile;

        if (checkWin(newFoundations)) {
          setIsGameWon(true);
        }

        return {
          ...prev,
          waste: newWaste,
          foundations: newFoundations,
        };
      }

      // ✅ From tableau
      const colIndex = parseInt(sourceColKey);
      const sourceCol = newTableau[colIndex];
      const cardIndex = sourceCol.findIndex((c) => c.id === card.id);
      if (cardIndex !== sourceCol.length - 1) return prev; // must be top card

      const [cardToMove] = sourceCol.splice(cardIndex);
      destPile.push(cardToMove);
      newFoundations[suit] = destPile;

      if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
        sourceCol[sourceCol.length - 1].faceUp = true;
      }

      if (checkWin(newFoundations)) {
        setIsGameWon(true);
      }

      return {
        ...prev,
        tableau: newTableau,
        foundations: newFoundations,
      };
    });
  }

  function getCanDrop(card, destColKey) {
    if (["hearts", "diamonds", "clubs", "spades"].includes(destColKey)) {
      const pile = foundations[destColKey];
      const topCard = pile[pile.length - 1];

      const isSameSuit = card.suit === destColKey;
      const cardValue = rankOrder[card.rank];

      if (!topCard) {
        return isSameSuit && card.rank === "A"; // must be Ace of matching suit
      }

      const topValue = rankOrder[topCard.rank];

      return isSameSuit && cardValue === topValue + 1;
    }

    // For tableau
    return isValidMove(card, tableau[destColKey]?.slice(-1)[0]);
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
        <RightGroup>
          {["hearts", "diamonds", "clubs", "spades"].map((suit) => (
            <Pile
              key={suit}
              columnIndex={suit}
              onDropCard={handleDropCard}
              getCanDrop={(card) => getCanDrop(card, suit)}
            >
              {foundations[suit].length > 0 && (
                <Card
                  {...foundations[suit][foundations[suit].length - 1]}
                  index={0}
                  sourceCol={`foundation-${suit}`}
                />
              )}
            </Pile>
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
