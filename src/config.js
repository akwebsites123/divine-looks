// ─────────────────────────────────────────────
// BUSINESS CONFIG — single source of truth
// Edit this file to rebrand the entire app.
// ─────────────────────────────────────────────
export default {
  brand: "Divine Looks Men's Salon",
  brandShort: "Divine Looks",
  tagline: "Grooming, done divinely.",
  location: "Gollahalli, Electronic City Phase I, Electronic City, Bengaluru, Hebbagodi, Karnataka 560100", // TODO: replace with exact address
  phone: "+91 7899470147", // TODO: replace with salon's real number
  instagram: "https://instagram.com/amit__kore",
  accent: "#f59e0b",
  accentSoft: "#fffbeb",
  accentDark: "#b45309",
  theme: "dark", // "dark" | "light"
  slotDuration: 60, // minutes
  bookingIdPrefix: "DL",
  services: [
    { id: "s1", name: "Hair Cut", duration: 30, price: 100 },
    { id: "s2", name: "Beard Trim", duration: 20, price: 50 },
    { id: "s3", name: "Hair Wash", duration: 15, price: 50 },
    { id: "s4", name: "Head Massage", duration: 30, price: 200 },
    { id: "s5", name: "Scrub", duration: 30, price: 199 },
    { id: "s6", name: "Hair Colour", duration: 45, price: 350 },
    { id: "s7", name: "D-Tan", duration: 45, price: 399 },
    { id: "s8", name: "Hair Spa", duration: 60, price: 499 },
    { id: "s9", name: "Facial", duration: 60, price: 1199 },
    {
      id: "p1",
      name: "Package: Cut + Wash + Head Massage",
      duration: 60,
      price: 299,
      isPackage: true,
    },
    {
      id: "p2",
      name: "Package: Cut + Beard + Head Massage",
      duration: 60,
      price: 299,
      isPackage: true,
    },
    {
      id: "p3",
      name: "Package: Cut + Beard + Massage + Colour + Wash",
      duration: 90,
      price: 599,
      isPackage: true,
    },
    {
      id: "p4",
      name: "Package: Cut + Beard + D-Tan + Scrub + Wash",
      duration: 90,
      price: 649,
      isPackage: true,
    },
    {
      id: "p5",
      name: "Package: Cut + Beard + Massage + Colour",
      duration: 90,
      price: 799,
      isPackage: true,
    },
  ],
  workingHours: { start: "10:00", end: "20:00" },
  slotIntervalMinutes: 30,
};
