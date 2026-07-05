import config from "../config.js";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "40px 20px 32px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16 }}>
        {config.brand}
        <span style={{ color: config.accent }}>.</span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          marginTop: 10,
          lineHeight: 1.7,
        }}
      >
        {config.location}
        <br />
        <a
          href={`tel:${config.phone.replace(/\s/g, "")}`}
          style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
        >
          {config.phone}
        </a>
        <br />
        <a
          href={config.instagram}
          target="_blank"
          rel="noreferrer"
          style={{ color: config.accent, textDecoration: "none" }}
        >
          {/* Instagram */}
        </a>
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          marginTop: 20,
        }}
      >
        Built by{" "}
        <a
          href="https://instagram.com/amit__kore"
          target="_blank"
          rel="noreferrer"
          style={{
            color: config.accent,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Ak
        </a>
        .
      </div>
    </footer>
  );
}
