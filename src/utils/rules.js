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
    // Only Kings can move to empty column
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
