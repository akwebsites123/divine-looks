import { useMemo, useState } from "react";
import config from "../config.js";
import ServiceCard from "../components/ServiceCard.jsx";
import SlotPicker from "../components/SlotPicker.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { createBooking } from "../api/bookings.js";
import { dateKey, formatDateDisplay, formatSlotDisplay } from "../utils/slots.js";

const STEP_LABELS = ["Choose service", "Pick a slot", "Your details"];

export default function BookingPage({
  preselectedServiceId,
  resume,
  onBack,
  onConfirmed,
  onAllSlotsBooked,
}) {
  const [step, setStep] = useState(resume?.step ?? 1);
  const [serviceId, setServiceId] = useState(
    resume?.serviceId ?? preselectedServiceId ?? null
  );
  const [date, setDate] = useState(resume?.date ?? new Date());
  const [time, setTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const service = useMemo(
    () => config.services.find((s) => s.id === serviceId) || null,
    [serviceId]
  );

  const goBack = () => {
    if (step === 1) return onBack();
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const next = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (formValues) => {
    setSubmitting(true);
    // BACKEND: createBooking hits the real API once the Workers backend is live
    const res = await createBooking({
      serviceId: service.id,
      date: dateKey(date),
      time,
      ...formValues,
    });
    setSubmitting(false);
    if (res.success) {
      onConfirmed({
        bookingId: res.bookingId,
        service,
        date,
        time,
        name: formValues.name,
        phone: formValues.phone,
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: "20px 20px 60px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={goBack}
          aria-label="Go back"
          style={{
            minWidth: 44,
            minHeight: 44,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            Step {step}/3
          </div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {STEP_LABELS[step - 1]}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(step / 3) * 100}%`,
            background: config.accent,
            borderRadius: 4,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* ── STEP 1 — Choose service ─────────── */}
      {step === 1 && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {config.services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                selected={s.id === serviceId}
                onClick={() => setServiceId(s.id)}
              />
            ))}
          </div>
          <button
            disabled={!service}
            onClick={next}
            style={{
              marginTop: 24,
              width: "100%",
              minHeight: 52,
              borderRadius: 50,
              border: "none",
              background: service ? config.accent : "rgba(255,255,255,0.1)",
              color: service ? "#0a0a0a" : "rgba(255,255,255,0.35)",
              fontWeight: 800,
              fontSize: 16,
              cursor: service ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
        </div>
      )}

      {/* ── STEP 2 — Pick a slot ────────────── */}
      {step === 2 && service && (
        <div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            <strong>{service.name}</strong> · {service.duration} min · ₹
            {service.price}
          </div>
          <SlotPicker
            service={service}
            date={date}
            selectedTime={time}
            onDateChange={(d) => {
              setDate(d);
              setTime(null);
            }}
            onSelectTime={setTime}
            onAllBooked={(svc, d, allBooked) => {
              // Only escalate to the unavailable page when every slot is
              // genuinely booked (spec: "If ALL slots are booked")
              if (allBooked) onAllSlotsBooked(svc, d);
            }}
          />
          <button
            disabled={!time}
            onClick={next}
            style={{
              marginTop: 24,
              width: "100%",
              minHeight: 52,
              borderRadius: 50,
              border: "none",
              background: time ? config.accent : "rgba(255,255,255,0.1)",
              color: time ? "#0a0a0a" : "rgba(255,255,255,0.35)",
              fontWeight: 800,
              fontSize: 16,
              cursor: time ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
        </div>
      )}

      {/* ── STEP 3 — Your details ───────────── */}
      {step === 3 && service && (
        <div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              fontSize: 14,
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            <strong>{service.name}</strong> · ₹{service.price}
            <br />
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              {formatDateDisplay(date)} at {formatSlotDisplay(time)}
            </span>
          </div>
          <BookingForm onSubmit={handleSubmit} submitting={submitting} />
        </div>
      )}
    </div>
  );
}
