import { useState } from "react";
import config from "../config.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export function validateName(name) {
  const v = name.trim();
  if (!v) return "Name is required";
  if (v.length < 2) return "Name must be at least 2 characters";
  if (/\d/.test(v)) return "Name can't contain numbers";
  return "";
}

export function validatePhone(phone) {
  const v = phone.trim();
  if (!v) return "Phone number is required";
  if (!/^\d{10}$/.test(v)) return "Enter exactly 10 digits";
  if (!PHONE_RE.test(v)) return "Must start with 6, 7, 8 or 9";
  return "";
}

function validateEmail(email) {
  const v = email.trim();
  if (!v) return ""; // optional
  if (!EMAIL_RE.test(v)) return "Enter a valid email address";
  return "";
}

const fieldWrap = { marginBottom: 18 };
const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 8,
  color: "rgba(255,255,255,0.8)",
};
const inputStyle = (hasError) => ({
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 12,
  border: hasError
    ? "1px solid #ef4444"
    : "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: 15,
  outline: "none",
});
const errStyle = { fontSize: 12, color: "#ef4444", marginTop: 6 };

export default function BookingForm({ onSubmit, submitting }) {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (field) => (e) => {
    let v = e.target.value;
    if (field === "phone") v = v.replace(/\D/g, "").slice(0, 10);
    if (field === "notes") v = v.slice(0, 200);
    setValues((prev) => ({ ...prev, [field]: v }));
    // Live-clear error once the field becomes valid again
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](v) }));
    }
  };

  const validators = {
    name: validateName,
    phone: validatePhone,
    email: validateEmail,
    notes: () => "",
  };

  const blur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validators[field](values[field]) }));
  };

  const nameValid = !validateName(values.name);
  const phoneValid = !validatePhone(values.phone);
  const canSubmit = nameValid && phoneValid && !submitting;

  const handleSubmit = () => {
    // Re-validate everything on submit
    const newErrors = {
      name: validateName(values.name),
      phone: validatePhone(values.phone),
      email: validateEmail(values.email),
    };
    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true });
    if (Object.values(newErrors).some(Boolean)) return;
    onSubmit(values);
  };

  return (
    <div>
      <style>{`
        @keyframes dl-spin { to { transform: rotate(360deg); } }
        .dl-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div style={fieldWrap}>
        <label style={labelStyle} htmlFor="dl-name">
          Full name <span style={{ color: config.accent }}>*</span>
        </label>
        <input
          id="dl-name"
          className="dl-input"
          style={inputStyle(errors.name)}
          value={values.name}
          onChange={set("name")}
          onBlur={blur("name")}
          placeholder="Rahul Sharma"
          autoComplete="name"
        />
        {errors.name && <div style={errStyle}>{errors.name}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle} htmlFor="dl-phone">
          Phone number <span style={{ color: config.accent }}>*</span>
        </label>
        <div style={{ display: "flex", gap: 8 }}>
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
            id="dl-phone"
            className="dl-input"
            style={{ ...inputStyle(errors.phone), flex: 1 }}
            value={values.phone}
            onChange={set("phone")}
            onBlur={blur("phone")}
            placeholder="98765 43210"
            inputMode="numeric"
            autoComplete="tel-national"
          />
        </div>
        {errors.phone && <div style={errStyle}>{errors.phone}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle} htmlFor="dl-email">
          Email <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id="dl-email"
          className="dl-input"
          style={inputStyle(errors.email)}
          value={values.email}
          onChange={set("email")}
          onBlur={blur("email")}
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
        />
        {errors.email && <div style={errStyle}>{errors.email}</div>}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle} htmlFor="dl-notes">
          Notes / special requests{" "}
          <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id="dl-notes"
          className="dl-input"
          rows={3}
          style={{ ...inputStyle(false), resize: "vertical", minHeight: 80 }}
          value={values.notes}
          onChange={set("notes")}
          placeholder="e.g. Prefer stylist Arjun, arriving 5 min late…"
        />
        <div
          style={{
            fontSize: 12,
            textAlign: "right",
            marginTop: 4,
            color:
              values.notes.length >= 200
                ? "#ef4444"
                : "rgba(255,255,255,0.4)",
          }}
        >
          {values.notes.length}/200
        </div>
      </div>

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        style={{
          width: "100%",
          minHeight: 52,
          borderRadius: 50,
          border: "none",
          background: canSubmit ? config.accent : "rgba(255,255,255,0.1)",
          color: canSubmit ? "#0a0a0a" : "rgba(255,255,255,0.35)",
          fontWeight: 800,
          fontSize: 16,
          cursor: canSubmit ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {submitting && (
          <span
            style={{
              width: 18,
              height: 18,
              border: "2.5px solid rgba(10,10,10,0.25)",
              borderTopColor: "#0a0a0a",
              borderRadius: "50%",
              display: "inline-block",
              animation: "dl-spin 0.8s linear infinite",
            }}
          />
        )}
        {submitting ? "Confirming…" : "Confirm booking"}
      </button>
    </div>
  );
}
