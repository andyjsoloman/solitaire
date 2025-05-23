// src/components/CRT/CRTModeToggle.jsx
import React, { useState } from "react";
import { CRTOverlay } from "./CRTOverlay";
import styled from "styled-components";

const ToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: #111;
  color: #eee;
  border: 1px solid #eee;
  z-index: 100000;
  cursor: pointer;

  &:hover {
    background: #222;
  }
`;

export default function CRTModeToggle() {
  const [crtEnabled, setCrtEnabled] = useState(() => {
    const stored = localStorage.getItem("crtMode");
    return stored === null ? true : stored === "true";
  });

  const toggleCRT = () => {
    setCrtEnabled((prev) => {
      localStorage.setItem("crtMode", !prev);
      return !prev;
    });
  };

  return (
    <>
      {crtEnabled && <CRTOverlay $flickerMin={0.1} $flickerMax={0.25} />}
      <ToggleButton onClick={toggleCRT}>
        CRT Mode {crtEnabled ? "ON" : "OFF"}
      </ToggleButton>
    </>
  );
}
