import { useState } from "react";
import config from "../config.js";
import { formatDateDisplay, formatSlotDisplay } from "../utils/slots.js";

function buildIcs(booking) {
  const [h, m] = booking.time.split(":").map(Number);
  const start = new Date(booking.date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + booking.service.duration * 60000);
  const fmt = (d) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${config.brand}//Booking//EN`,
    "BEGIN:VEVENT",
    `UID:${booking.bookingId}@divinelooks`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${booking.service.name} — ${config.brand}`,
    `DESCRIPTION:Booking ${booking.bookingId} for ${booking.name} (₹${booking.service.price})`,
    `LOCATION:${config.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 0",
  fontSize: 14,
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};
const rowLabel = { color: "rgba(255,255,255,0.5)" };

export default function ConfirmationPage({ booking, onBookAnother }) {
  const [copied, setCopied] = useState(false);
  if (!booking) return null;

  const shareText = `Just booked ${booking.service.name} at ${config.brand} via oye.nino. Zero investment mein apna booking site:`;

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(booking)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${booking.bookingId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: "48px 20px 60px",
        textAlign: "center",
      }}
    >
      <style>{`
        @keyframes dl-pop { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
        @keyframes dl-draw { to { stroke-dashoffset: 0; } }
      `}</style>

      {/* Animated checkmark */}
      <div
        style={{
          width: 88,
          height: 88,
          margin: "0 auto",
          borderRadius: "50%",
          background: "rgba(245,158,11,0.12)",
          border: `2px solid ${config.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "dl-pop 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path
            d="M10 23 L19 32 L34 13"
            stroke={config.accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 50,
              strokeDashoffset: 50,
              animation: "dl-draw 0.5s ease 0.3s forwards",
            }}
          />
        </svg>
      </div>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginTop: 24,
          letterSpacing: "-0.02em",
        }}
      >
        Booking confirmed!
      </h1>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
        See you at the chair, {booking.name.split(" ")[0]}.
      </p>

      {/* Summary card */}
      <div
        style={{
          marginTop: 28,
          padding: "20px 20px 8px",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          textAlign: "left",
        }}
      >
        <div style={rowStyle}>
          <span style={rowLabel}>Service</span>
          <span style={{ fontWeight: 600, textAlign: "right" }}>
            {booking.service.name} · ₹{booking.service.price}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={rowLabel}>When</span>
          <span style={{ fontWeight: 600 }}>
            {formatDateDisplay(booking.date)}, {formatSlotDisplay(booking.time)}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={rowLabel}>Name</span>
          <span style={{ fontWeight: 600 }}>{booking.name}</span>
        </div>
        <div style={rowStyle}>
          <span style={rowLabel}>Phone</span>
          <span style={{ fontWeight: 600 }}>+91 {booking.phone}</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <span style={rowLabel}>Booking ID</span>
          <span style={{ fontWeight: 700, color: config.accent }}>
            {booking.bookingId}
          </span>
        </div>
      </div>

      <button
        onClick={downloadIcs}
        style={{
          marginTop: 16,
          width: "100%",
          minHeight: 48,
          borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "transparent",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        📅 Add to calendar
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          margin: "32px 0 20px",
          color: "rgba(255,255,255,0.4)",
          fontSize: 13,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        Loved the experience?
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
      </div>

      {/* CTA block */}
      <div
        style={{
          padding: 20,
          borderRadius: 16,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <a
          href={config.instagram}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 48,
            borderRadius: 50,
            background: "linear-gradient(90deg, #f59e0b, #ec4899)",
            color: "#0a0a0a",
            fontWeight: 800,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          {/* Follow @oye.nino on Instagram */}
        </a>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 48,
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Share on WhatsApp
          </a>
          <button
            onClick={copyLink}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 50,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>

      <button
        onClick={onBookAnother}
        style={{
          marginTop: 28,
          background: "none",
          border: "none",
          color: config.accent,
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          minHeight: 44,
        }}
      >
        Book another service →
      </button>
    </div>
  );
}
