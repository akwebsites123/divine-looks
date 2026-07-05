// Slot generation & formatting helpers. Pure functions, no side effects.

export function generateSlots(workingHours, intervalMinutes) {
  const [startH, startM] = workingHours.start.split(":").map(Number);
  const [endH, endM] = workingHours.end.split(":").map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  const slots = [];
  for (let t = start; t < end; t += intervalMinutes) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

export function isPastSlot(slotTime, date) {
  const now = new Date();
  const [h, m] = slotTime.split(":").map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(h, m, 0, 0);
  return slotDate <= now;
}

export function formatSlotDisplay(time) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// "Mon, 27 Jun 2025" — Indian display format
export function formatDateDisplay(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// yyyy-mm-dd key for API calls / seeding
export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
