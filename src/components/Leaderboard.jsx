import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../lib/supabaseClient";
import { formatTime } from "../utils/formatTime";

const Wrapper = styled.div`
  background: #dde7dd;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 500px;
  min-width: 400px;
  margin: 2rem auto;
  color: #1a1a1a;

  box-shadow: 0 8px 24px rgba(74, 49, 49, 0.3);
  @media (max-width: 650px) {
    min-width: 340px;
  }
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 0.5px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.4rem;

  background-color: ${({ index }) => {
    if (index === 0) return "rgb(255, 215, 0, 0.6)"; // Gold
    if (index === 1) return "rgb(192, 192, 192, 0.6)"; // Silver
    if (index === 2) return "rgb(205, 127, 50, 0.6)"; // Bronze
    return "rgba(255, 255, 255, 0.2)";
  }};
  color: #1a1a1a;

  &:hover {
    background-color: ${({ index }) =>
      index > 2 ? "rgba(255, 255, 255, 0.08)" : null};
  }
`;

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("time", { ascending: true })
        .limit(10);

      if (!error) setScores(data);
    }
    fetchScores();
  }, []);

  return (
    <Wrapper>
      <Title>Leaderboard</Title>
      <List>
        {scores.map((s, i) => (
          <ListItem key={s.id} index={i}>
            <span>{s.username}</span>
            <span>{formatTime(s.time)}</span>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
}
