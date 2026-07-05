# Divine Looks Men's Salon — Booking App

Config-driven salon booking web app. React 18 + Vite, zero UI libraries,
mock API layer ready to swap for a real backend.

## Quick start

```bash
npm install
npm run dev        # local dev at http://localhost:5173
```

## Rebranding / editing services

Everything — brand name, phone, prices, working hours, slot interval,
accent colour — lives in **`src/config.js`**. No other file needs touching.

> Current placeholders to replace in `src/config.js`:
> `location` (exact address) and `phone` (salon's real number).

## Build & deploy to Cloudflare Pages

```bash
npm run build      # generates dist/
```

1. Push repo to GitHub.
2. Cloudflare dashboard → Pages → Create project → connect repo.
3. Build command: `npm run build` · Output directory: `dist`.
4. `public/_redirects` (`/* /index.html 200`) is already included so SPA
   routing works on Pages.

## Connecting the real backend (Episode 3)

All network calls live in **`src/api/bookings.js`** — the only file that
changes when the Hono + Cloudflare D1 backend ships:

```js
const BASE_URL = "https://api.yourdomain.workers.dev";
// swap each mock body for a real fetch(), keep the same signatures
```

Search the codebase for `// BACKEND:` comments to see every touchpoint.
Future: add `wrangler.toml` for the Workers backend.

## Structure

```
src/
├── config.js            business config (single source of truth)
├── App.jsx              useState-based view router
├── api/bookings.js      all API calls (mock, 800ms delay)
├── pages/               Landing, Booking (3-step), Confirmation, SlotsUnavailable
├── components/          Navbar, ServiceCard, SlotPicker, BookingForm, Footer
└── utils/slots.js       slot generation + date/time formatting
```

built by Amit kore.
