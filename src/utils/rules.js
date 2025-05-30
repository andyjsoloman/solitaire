// src/utils/rules.js

const colorMap = {
  hearts: "red",
  diamonds: "red",
  spades: "black",
  clubs: "black",
};

export const rankOrder = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
};

export function isValidMove(movingCard, targetCard) {
  if (!targetCard) {
    return movingCard.rank === "K";
  }

  const movingColor = colorMap[movingCard.suit];
  const targetColor = colorMap[targetCard.suit];
  const movingValue = rankOrder[movingCard.rank];
  const targetValue = rankOrder[targetCard.rank];

  return movingColor !== targetColor && movingValue === targetValue - 1;
}

export function checkWin(foundations) {
  return (
    foundations.hearts.length === 13 &&
    foundations.diamonds.length === 13 &&
    foundations.clubs.length === 13 &&
    foundations.spades.length === 13
  );
}

export function getCanDrop(card, destColKey, gameState) {
  const { foundations, tableau } = gameState;
  if (["hearts", "diamonds", "clubs", "spades"].includes(destColKey)) {
    const pile = foundations[destColKey];
    const topCard = pile[pile.length - 1];
    const isSameSuit = card.suit === destColKey;
    const cardValue = rankOrder[card.rank];

    if (!topCard) return isSameSuit && card.rank === "A";
    const topValue = rankOrder[topCard.rank];
    return isSameSuit && cardValue === topValue + 1;
  }

  return isValidMove(card, tableau[destColKey]?.slice(-1)[0]);
}

export function handleDropCard(draggedCard, destColKey, prev, setIsGameWon) {
  const newTableau = prev.tableau.map((col) => [...col]);
  const newFoundations = { ...prev.foundations };

  if (draggedCard.sourceCol === "waste" && destColKey === "waste") {
    return prev; // no state change needed
  }

  const isFoundation = ["hearts", "diamonds", "clubs", "spades"].includes(
    destColKey
  );

  if (isFoundation) {
    const destPile = [...newFoundations[destColKey]];
    const topCard = destPile[destPile.length - 1];
    const isAce = draggedCard.rank === "A";
    const isSameSuit = draggedCard.suit === destColKey;
    const isNextInSequence =
      topCard && rankOrder[draggedCard.rank] === rankOrder[topCard.rank] + 1;
    const canPlace =
      (destPile.length === 0 && isAce && isSameSuit) ||
      (topCard && isSameSuit && isNextInSequence);
    if (!canPlace) return prev;

    if (draggedCard.sourceCol === "waste") {
      const newWaste = [...prev.waste];
      const lastCard = newWaste.pop();
      if (lastCard.id !== draggedCard.id) return prev;

      destPile.push(lastCard);
      newFoundations[destColKey] = destPile;

      if (checkWin(newFoundations)) setIsGameWon(true);
      return {
        ...prev,
        waste: newWaste,
        foundations: newFoundations,
      };
    }

    const sourceColIndex = parseInt(draggedCard.sourceCol);
    const sourceCol = newTableau[sourceColIndex];
    const cardIndex = sourceCol.findIndex((c) => c.id === draggedCard.id);
    const [cardToMove] = sourceCol.splice(cardIndex);
    if (sourceCol.length > 0 && !sourceCol[sourceCol.length - 1].faceUp) {
      sourceCol[sourceCol.length - 1].faceUp = true;
    }

    destPile.push(cardToMove);
    newFoundations[destColKey] = destPile;
    if (checkWin(newFoundations)) setIsGameWon(true);

    return {
      ...prev,
      tableau: newTableau,
      foundations: newFoundations,
    };
  }

  const destCol = newTableau[destColKey];
  const targetCard = destCol.length > 0 ? destCol[destCol.length - 1] : null;
  if (!isValidMove(draggedCard, targetCard)) return prev;

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
}
