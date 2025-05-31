// src/components/CRT/CRTModeToggle.jsx
import React, { useState } from "react";
import { CRTOverlay } from "./CRTOverlay";
import styled from "styled-components";

const ToggleWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  position: relative;
  border-radius: 3.125em;
  overflow: hidden;
  width: auto;
  height: 1.25em;

  &.blue .toggle-checkbox:checked + .toggle-container {
    background-color: #4588ff;
    box-shadow: inset 0.0625em 0 0 #4588ff, inset -0.0625em 0 0 #4588ff,
      inset 0.125em 0.25em 0.125em 0.25em #3952f3;
  }
`;

const ToggleCheckbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: inherit;
`;

const ToggleContainer = styled.div`
  display: flex;
  position: relative;
  border-radius: inherit;
  width: 2.5em;
  height: 1.25em;
  background-color: #d1d4dc;
  box-shadow: inset 0.0625em 0 0 #d4d2de, inset -0.0625em 0 0 #d4d2de,
    inset 0.125em 0.25em 0.125em 0.25em #b5b5c3;
  mask-image: radial-gradient(#fff, #000);
  transition: all 0.4s;
`;

const ToggleBall = styled.div`
  position: relative;
  border-radius: 50%;
  width: 1.25em;
  height: 1.25em;
  background-image: radial-gradient(
      rgba(255, 255, 255, 0.6),
      rgba(255, 255, 255, 0) 16%
    ),
    radial-gradient(#d2d4dc, #babac2);
  background-position: -0.25em -0.25em;
  background-size: auto, calc(100% + 0.25em) calc(100% + 0.25em);
  background-repeat: no-repeat;
  box-shadow: 0.25em 0.25em 0.25em #8d889e,
    inset 0.0625em 0.0625em 0.25em #d1d1d6,
    inset -0.0625em -0.0625em 0.25em #8c869e;
  transition: transform 0.4s, box-shadow 0.4s;

  ${ToggleCheckbox}:checked + ${ToggleContainer} & {
    transform: translateX(100%);
  }
`;

const LabelText = styled.span`
  font-size: 1rem;
  margin-right: 0.25em;
`;

export default function CRTModeToggle() {
  const [crtEnabled, setCrtEnabled] = useState(() => {
    const stored = localStorage.getItem("crtMode");
    return stored === null ? true : stored === "true";
  });

  const toggleCRT = () => {
    setCrtEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("crtMode", next);
      return next;
    });
  };

  return (
    <>
      {crtEnabled && <CRTOverlay $flickerMin={0.1} $flickerMax={0.25} />}
      <ToggleWrapper className="toggle-wrapper blue">
        <LabelText>CRT Mode:</LabelText>
        <ToggleCheckbox
          className="toggle-checkbox"
          checked={crtEnabled}
          onChange={toggleCRT}
        />
        <ToggleContainer className="toggle-container">
          <ToggleBall className="toggle-ball" />
        </ToggleContainer>
      </ToggleWrapper>
    </>
  );
}
