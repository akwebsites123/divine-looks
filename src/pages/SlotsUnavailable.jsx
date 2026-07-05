import { useState } from "react";
import config from "../config.js";
import { joinWaitlist } from "../api/bookings.js";
import { formatDateDisplay, dateKey } from "../utils/slots.js";
import { validateName, validatePhone } from "../components/BookingForm.jsx";

const inputStyle = (hasError) => ({
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 12,
  border: hasError ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: 15,
  outline: "none",
});

export default function SlotsUnavailable({
  service,
  date,
  onTryAnotherDate,
  onChooseDifferentService,
}) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  if (!service || !date) return null;

  const submitWaitlist = async () => {
    const errs = { name: validateName(name), phone: validatePhone(phone) };
    setErrors(errs);
    if (errs.name || errs.phone) return;
    setSubmitting(true);
    // BACKEND: joinWaitlist will POST to the real API later
    await joinWaitlist({ serviceId: service.id, date: dateKey(date), name, phone });
    setSubmitting(false);
    setJoined(true);
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: "72px 20px 60px",
        textAlign: "center",
      }}
    >
      <style>{`@keyframes dl-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 64 }}>📅</div>
      <h1
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginTop: 20,
          letterSpacing: "-0.02em",
        }}
      >
        No slots available
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          marginTop: 10,
          lineHeight: 1.6,
        }}
      >
        All slots for <strong style={{ color: "#fff" }}>{service.name}</strong>{" "}
        on <strong style={{ color: "#fff" }}>{formatDateDisplay(date)}</strong>{" "}
        are booked.
      </p>

      <button
        onClick={() => onTryAnotherDate(service, date)}
        style={{
          marginTop: 28,
          width: "100%",
          minHeight: 52,
          borderRadius: 50,
          border: "none",
          background: config.accent,
          color: "#0a0a0a",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Try another date
      </button>

      {!showWaitlist && !joined && (
        <button
          onClick={() => setShowWaitlist(true)}
          style={{
            marginTop: 12,
            width: "100%",
            minHeight: 52,
            borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Join waitlist
        </button>
      )}

      {showWaitlist && !joined && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
            Join the waitlist
          </div>
          <input
            aria-label="Full name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setErrors((p) => ({ ...p, name: validateName(name) }))}
            style={inputStyle(errors.name)}
          />
          {errors.name && (
            <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>
              {errors.name}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.08)",
                fontSize: 15,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              +91
            </div>
            <input
              aria-label="Phone number"
              placeholder="Phone number"
              inputMode="numeric"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              onBlur={() =>
                setErrors((p) => ({ ...p, phone: validatePhone(phone) }))
              }
              style={{ ...inputStyle(errors.phone), flex: 1 }}
            />
          </div>
          {errors.phone && (
            <div style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>
              {errors.phone}
            </div>
          )}
          <button
            onClick={submitWaitlist}
            disabled={submitting}
            style={{
              marginTop: 16,
              width: "100%",
              minHeight: 48,
              borderRadius: 50,
              border: "none",
              background: config.accent,
              color: "#0a0a0a",
              fontWeight: 800,
              fontSize: 15,
              cursor: submitting ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {submitting && (
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2.5px solid rgba(10,10,10,0.25)",
                  borderTopColor: "#0a0a0a",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "dl-spin 0.8s linear infinite",
                }}
              />
            )}
            {submitting ? "Joining…" : "Join waitlist"}
          </button>
        </div>
      )}

      {joined && (
        <div
          style={{
            marginTop: 20,
            padding: "18px 20px",
            borderRadius: 16,
            border: `1px solid ${config.accent}`,
            background: "rgba(245,158,11,0.1)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          ✅ You're on the waitlist! We'll notify you if a slot opens.
        </div>
      )}

      <button
        onClick={onChooseDifferentService}
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
        Choose a different service →
      </button>
    </div>
  );
}
