import { useEffect, useState } from "react";
import config from "../config.js";
import { getAvailableSlots } from "../api/bookings.js";
import {
  isPastSlot,
  formatSlotDisplay,
  formatDateDisplay,
  dateKey,
  isSameDay,
} from "../utils/slots.js";

function Spinner() {
  return (
    <>
      <style>{`@keyframes dl-spin { to { transform: rotate(360deg); } }`}</style>
      <div
        aria-label="Loading slots"
        style={{
          width: 28,
          height: 28,
          margin: "40px auto",
          border: "3px solid rgba(255,255,255,0.15)",
          borderTopColor: config.accent,
          borderRadius: "50%",
          animation: "dl-spin 0.8s linear infinite",
        }}
      />
    </>
  );
}

export default function SlotPicker({
  service,
  date,
  selectedTime,
  onDateChange,
  onSelectTime,
  onAllBooked,
}) {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const today = new Date();
  const isToday = isSameDay(date, today);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getAvailableSlots(service.id, dateKey(date)).then((res) => {
      if (!alive) return;
      const enriched = res.slots.map((s) => ({
        ...s,
        past: isToday && isPastSlot(s.time, date),
      }));
      setSlots(enriched);
      setLoading(false);
      // Edge case: every slot is booked (or booked/past) → escalate
      const anyBookable = enriched.some((s) => s.available && !s.past);
      const allBooked = enriched.every((s) => !s.available);
      if (allBooked || !anyBookable) onAllBooked?.(service, date, allBooked);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.id, dateKey(date)]);

  const arrowStyle = (disabled) => ({
    minWidth: 44,
    minHeight: 44,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: disabled ? "rgba(255,255,255,0.2)" : "#fff",
    fontSize: 18,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div>
      {/* Date navigator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          aria-label="Previous date"
          disabled={isToday}
          onClick={() => {
            const prev = new Date(date);
            prev.setDate(prev.getDate() - 1);
            onDateChange(prev);
          }}
          style={arrowStyle(isToday)}
        >
          ←
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {formatDateDisplay(date)}
          </div>
          {isToday && (
            <div style={{ fontSize: 12, color: config.accent, marginTop: 2 }}>
              Today
            </div>
          )}
        </div>
        <button
          aria-label="Next date"
          onClick={() => {
            const next = new Date(date);
            next.setDate(next.getDate() + 1);
            onDateChange(next);
          }}
          style={arrowStyle(false)}
        >
          →
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const isBooked = !slot.available;
            const isPast = slot.past;
            const disabled = isBooked || isPast;
            return (
              <button
                key={slot.time}
                disabled={disabled}
                onClick={() => onSelectTime(slot.time)}
                style={{
                  minHeight: 48,
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: disabled ? "not-allowed" : "pointer",
                  transition: "background 0.15s, color 0.15s",
                  border: isSelected
                    ? `2px solid ${config.accent}`
                    : "1px solid rgba(255,255,255,0.12)",
                  background: isSelected
                    ? config.accent
                    : disabled
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.07)",
                  color: isSelected
                    ? "#0a0a0a"
                    : disabled
                    ? "rgba(255,255,255,0.25)"
                    : "rgba(255,255,255,0.9)",
                }}
              >
                {formatSlotDisplay(slot.time)}
                {isBooked && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 500,
                      marginTop: 2,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
