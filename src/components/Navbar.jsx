import config from "../config.js";

export default function Navbar({ onBook }) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>
        {config.brandShort}
        <span style={{ color: config.accent }}>.</span>
      </div>
      <button
        onClick={() => onBook()}
        style={{
          minHeight: 44,
          padding: "0 20px",
          borderRadius: 50,
          border: "none",
          background: config.accent,
          color: "#0a0a0a",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        Book now
      </button>
    </nav>
  );
}
