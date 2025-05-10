export const SUITS = ["hearts", "diamonds", "clubs", "spades"];
export const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export function generateDeck() {
  const deck = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${rank}${suit}`, faceUp: false });
    }
  }

  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function dealCards(shuffledDeck) {
  const tableau = [];
  let deckIndex = 0;

  // Deal cards to 7 tableau columns
  for (let col = 0; col < 7; col++) {
    const column = [];

    for (let row = 0; row <= col; row++) {
      const card = shuffledDeck[deckIndex++];
      column.push({ ...card, faceUp: row === col }); // only top card face up
    }

    tableau.push(column);
  }

  // Remaining cards go into stock
  const stock = shuffledDeck.slice(deckIndex);

  return {
    tableau,
    stock,
    waste: [],
    foundations: {
      hearts: [],
      diamonds: [],
      clubs: [],
      spades: [],
    },
  };
}
