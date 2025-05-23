// src/components/CRT/CRTText.jsx
import styled, { keyframes } from "styled-components";

const rgbShadow = keyframes`
  0% { text-shadow: 1px 0 red, -1px 0 cyan; }
  50% { text-shadow: 2px 0 red, -2px 0 cyan; }
  100% { text-shadow: 1px 0 red, -1px 0 cyan; }
`;

export const CRTText = styled.h1`
  font-size: 100px;
  color: #dddddd;

  text-shadow: 1px 0 red, -1px 0 cyan;
  animation: ${rgbShadow} 3s infinite;
`;
