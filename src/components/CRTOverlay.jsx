// src/components/CRT/CRTOverlay.jsx
import styled, { keyframes } from "styled-components";

// Flicker range can now be controlled by a CSS variable or prop
const flicker = keyframes`
  0%, 100% { opacity: var(--flicker-min, 0.25); }
  50% { opacity: var(--flicker-max, 0.35); }
`;

export const CRTOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999;

  --flicker-min: ${({ flickerMin }) => flickerMin || 0.2};
  --flicker-max: ${({ flickerMax }) => flickerMax || 0.3};

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 99999;
    pointer-events: none;
  }

  &::before {
    background: linear-gradient(
        rgba(18, 16, 16, 0) 50%,
        rgba(0, 0, 0, 0.25) 50%
      ),
      linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
      );
    background-size: 100% 2px, 3px 100%;
  }

  &::after {
    background: rgba(18, 16, 16, 0.1);
    animation: ${flicker} 1s infinite;
  }
`;
