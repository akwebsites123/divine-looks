import { useEffect, useRef } from "react";
import config from "../config.js";
import Navbar from "../components/Navbar.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import Footer from "../components/Footer.jsx";

// Pexels free stock — barbershop / men's salon (direct CDN URLs)
const HERO_IMG =
  "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1200";
const GALLERY = [
  "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
];

const USPS = [
  {
    icon: "⚡",
    title: "Instant booking",
    desc: "Pick a slot and you're done in under 30 seconds. No calls, no waiting.",
  },
  {
    icon: "✂️",
    title: "Expert stylists",
    desc: "Trained barbers who know fades, beards and colour — men's grooming only.",
  },
  {
    icon: "₹",
    title: "Transparent pricing",
    desc: "Every price on the board is the price you pay. Packages from ₹299.",
  },
];

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: 12,
        letterSpacing: "0.12em",
        color: config.accent,
        textTransform: "lowercase",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function FadeSection({ children, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        padding: "56px 20px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export default function LandingPage({ onBook }) {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        background: "#0a0a0a",
        minHeight: "100vh",
      }}
    >
      <Navbar onBook={onBook} />

      {/* ── Hero ─────────────────────────────── */}
      <header
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 20px 64px",
          backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.85) 70%, #0a0a0a 100%), url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
            fontSize: 12,
            letterSpacing: "0.12em",
            color: config.accent,
            marginBottom: 14,
          }}
        >
          {config.location.toLowerCase()}
        </div>
        <h1
          style={{
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          {config.brand.replace(" Salon", "")}
          <span style={{ color: config.accent }}> Salon</span>
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.5)",
            marginTop: 14,
            lineHeight: 1.6,
          }}
        >
          {config.tagline} Haircuts from ₹100, full grooming packages from
          ₹299 — book your chair before you leave the house.
        </p>
        <button
          onClick={() => onBook()}
          style={{
            marginTop: 28,
            minHeight: 52,
            borderRadius: 50,
            border: "none",
            background: config.accent,
            color: "#0a0a0a",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Book your slot →
        </button>
      </header>

      {/* ── Services ─────────────────────────── */}
      <FadeSection>
        <Eyebrow>01 / services</Eyebrow>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
          The board
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            margin: "10px 0 24px",
            lineHeight: 1.6,
          }}
        >
          Tap any service to book it straight away.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {config.services.map((s) => (
            <ServiceCard key={s.id} service={s} onClick={() => onBook(s.id)} />
          ))}
        </div>
      </FadeSection>

      {/* ── Gallery ──────────────────────────── */}
      <FadeSection>
        <Eyebrow>02 / our work</Eyebrow>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Inside the shop
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 24,
          }}
        >
          {GALLERY.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Salon photo ${i + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
              }}
            />
          ))}
        </div>
      </FadeSection>

      {/* ── Why us ───────────────────────────── */}
      <FadeSection>
        <Eyebrow>03 / why us</Eyebrow>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Why Divine Looks
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 24,
          }}
        >
          {USPS.map((u) => (
            <div
              key={u.title}
              style={{
                padding: "20px 18px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontSize: 22 }}>{u.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 10 }}>
                {u.title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 6,
                  lineHeight: 1.6,
                }}
              >
                {u.desc}
              </div>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ── Bottom CTA ───────────────────────── */}
      <FadeSection
        style={{
          textAlign: "center",
          paddingTop: 32,
        }}
      >
        <div
          style={{
            padding: "44px 24px",
            borderRadius: 16,
            background: `linear-gradient(160deg, rgba(245,158,11,0.14), rgba(245,158,11,0.03))`,
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Ready for your new look?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              marginTop: 10,
            }}
          >
            Slots fill fast in the evenings.
          </p>
          <button
            onClick={() => onBook()}
            style={{
              marginTop: 22,
              minHeight: 52,
              padding: "0 40px",
              borderRadius: 50,
              border: "none",
              background: config.accent,
              color: "#0a0a0a",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Book now
          </button>
        </div>
      </FadeSection>

      <Footer />
    </div>
  );
}
