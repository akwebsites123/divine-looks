import config from "../config.js";

export default function ServiceCard({ service, selected = false, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        minHeight: 44,
        padding: "16px 18px",
        borderRadius: 16,
        border: selected
          ? `2px solid ${config.accent}`
          : "1px solid rgba(255,255,255,0.1)",
        background: selected ? config.accentSoft : "rgba(255,255,255,0.03)",
        color: selected ? "#0a0a0a" : "#fff",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.15s, background 0.15s, color 0.15s",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.35 }}>
          {service.name}
          {service.isPackage && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: selected ? config.accentDark : config.accent,
              }}
            >
              Value
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 13,
            marginTop: 4,
            color: selected ? "rgba(10,10,10,0.6)" : "rgba(255,255,255,0.5)",
          }}
        >
          {service.duration} min
        </div>
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 17,
          color: selected ? config.accentDark : config.accent,
          whiteSpace: "nowrap",
        }}
      >
        ₹{service.price}
      </div>
    </button>
  );
}
