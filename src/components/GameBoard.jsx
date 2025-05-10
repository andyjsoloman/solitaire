import styled from "styled-components";
import Pile from "./Pile";
import Card from "./Card";

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

function GameBoard({ tableau, stock }) {
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
          <Pile key={i}>
            {column.map((card, index) => (
              <Card
                key={card.id}
                rank={card.rank}
                suit={card.suit}
                faceUp={card.faceUp}
                index={index}
              />
            ))}
          </Pile>
        ))}
      </BottomRow>
    </BoardWrapper>
  );
}

export default GameBoard;
