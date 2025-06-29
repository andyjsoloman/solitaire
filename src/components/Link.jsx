import React from "react";
import styled from "styled-components";

const StyledLink = styled.a`
  background: linear-gradient(
    to bottom,
    #fff 0%,
    #fff 50%,
    #ededed 51%,
    #ededed 100%
  );
  border: 1px solid #959595;
  border-radius: 4px;
  padding: 1px 20px;
  box-shadow: inset 0 0 0 1px #fff;
  font-family: inherit;
  cursor: pointer;
  color: black;
  &:hover {
    background: linear-gradient(
      to bottom,
      #cee4f9 0%,
      #9dcbf2 50%,
      #81bff2 51%,
      #ccf1fa 100%
    );
    border: 1px solid #5056a7;
    box-shadow: inset 0 0 0 1px #bcd6ed;
    color: black;
  }
`;

const Link = ({ children, ...props }) => (
  <StyledLink {...props}>{children}</StyledLink>
);

export default Link;
