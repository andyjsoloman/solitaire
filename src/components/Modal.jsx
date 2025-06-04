import { createPortal } from "react-dom";

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  maxWidth: "400px",
  width: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  color: "#333",
  textAlign: "center",
  gap: "1rem",
};

export default function Modal({ children }) {
  return createPortal(
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>{children}</div>
    </div>,
    document.getElementById("modal-root")
  );
}
