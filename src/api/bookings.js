// ─────────────────────────────────────────────
// API LAYER — all network calls live here.
// Mock now; swap function bodies when the
// Hono + Cloudflare D1 backend ships (Episode 3).
// ─────────────────────────────────────────────
// BACKEND: const BASE_URL = "https://api.yourdomain.workers.dev";

import config from "../config.js";
import { generateSlots } from "../utils/slots.js";

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

// Deterministic pseudo-random per (serviceId, date, slot) so booked slots
// stay stable across re-renders within a session.
function seededRandom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export async function getAvailableSlots(serviceId, date) {
  await delay();
  // BACKEND: return fetch(`${BASE_URL}/slots?serviceId=${serviceId}&date=${date}`).then(r => r.json());
  const times = generateSlots(config.workingHours, config.slotIntervalMinutes);

  // Mock: mark 3-4 pseudo-random slots as already booked for this day
  const targetBooked = 3 + (seededRandom(`${serviceId}|${date}|count`) > 0.5 ? 1 : 0);
  const ranked = times
    .map((time) => ({ time, r: seededRandom(`${serviceId}|${date}|${time}`) }))
    .sort((a, b) => a.r - b.r);
  const bookedSet = new Set(ranked.slice(0, targetBooked).map((s) => s.time));

  return {
    slots: times.map((time) => ({ time, available: !bookedSet.has(time) })),
  };
}

export async function createBooking(payload) {
  await delay();
  // BACKEND: return fetch(`${BASE_URL}/bookings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(r => r.json());
  const bookingId = `${config.bookingIdPrefix}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;
  return { success: true, bookingId, ...payload };
}

export async function joinWaitlist(payload) {
  await delay();
  // BACKEND: return fetch(`${BASE_URL}/waitlist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(r => r.json());
  return { success: true, ...payload };
}
