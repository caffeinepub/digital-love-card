import { useEffect, useRef } from "react";
import PolaroidPhoto from "./PolaroidPhoto";

interface LoveCard {
  id: number;
  title: string;
  description: string;
  photos: Array<{ src: string; rotation: number }>;
}

const LOVE_CARDS: LoveCard[] = [
  {
    id: 1,
    title: "The Way You Care",
    description:
      "You notice the smallest things — the way I go quiet when something's wrong, the songs I play when I'm tired, the moments I need someone near. You show up, always, without me having to ask.",
    photos: [
      { src: "/assets/generated/photo2.dim_600x600.jpg", rotation: -3 },
      { src: "/assets/generated/photo5.dim_600x600.jpg", rotation: 4 },
    ],
  },
  {
    id: 2,
    title: "Your Smile",
    description:
      "Your smile is the kind that doesn't just reach your eyes — it reaches mine too. It's disarming and warm and feels like sunlight after a long grey week.",
    photos: [
      { src: "/assets/generated/photo4.dim_600x600.jpg", rotation: 3 },
      { src: "/assets/generated/photo1.dim_600x600.jpg", rotation: -4 },
    ],
  },
  {
    id: 3,
    title: "How You Hold Me",
    description:
      "There is no safer place in the world than your arms. When you hold me, everything quiets down. The world makes sense again.",
    photos: [
      { src: "/assets/generated/photo8.dim_600x600.jpg", rotation: -2 },
      { src: "/assets/generated/photo3.dim_600x600.jpg", rotation: 3 },
    ],
  },
];

const OCID_MAP: Record<number, string> = {
  1: "things-love.card.1",
  2: "things-love.card.2",
  3: "things-love.card.3",
};

function LoveCardItem({ card, index }: { card: LoveCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const t = setTimeout(() => {
              el.classList.add("visible");
            }, index * 150);
            observer.unobserve(el);
            return () => clearTimeout(t);
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="fade-in love-card"
      data-ocid={OCID_MAP[card.id]}
      style={{
        background: "rgba(255, 252, 250, 0.72)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        borderRadius: "20px",
        padding: "clamp(20px, 4vw, 32px)",
        boxShadow:
          "0 4px 32px rgba(244,167,185,0.18), 0 1px 0 rgba(255,255,255,0.8) inset",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Card header */}
      <h3
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
          fontWeight: 700,
          color: "#D47A91",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontStyle: "italic",
          fontSize: "clamp(0.88rem, 2vw, 0.97rem)",
          lineHeight: 1.75,
          color: "var(--color-text-light)",
          margin: 0,
          flex: 1,
        }}
      >
        {card.description}
      </p>

      {/* Polaroid collage */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingTop: "8px",
          minHeight: "140px",
          position: "relative",
        }}
      >
        {card.photos.map((photo, pi) => (
          <PolaroidPhoto
            key={`card-${card.id}-photo-${pi}`}
            src={photo.src}
            rotation={photo.rotation}
            size={118}
            style={{
              marginLeft: pi === 0 ? 0 : "-22px",
              zIndex: pi + 1,
              transition: "transform 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ThingsILoveSection() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("visible");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      data-ocid="things-love.section"
      className="things-love-bg"
      style={{
        padding: "clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative circles */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(244,167,185,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,184,216,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section heading */}
        <div
          ref={headingRef}
          className="fade-in"
          style={{
            textAlign: "center",
            marginBottom: "clamp(40px, 7vw, 64px)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: "0 0 16px 0",
              lineHeight: 1.15,
            }}
          >
            Things I Love About You
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "1px",
                background: "var(--color-blush)",
                opacity: 0.6,
              }}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#F4A7B9"
              style={{ flexShrink: 0 }}
              aria-hidden="true"
              role="presentation"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <div
              style={{
                width: "60px",
                height: "1px",
                background: "var(--color-blush)",
                opacity: 0.6,
              }}
            />
          </div>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "clamp(20px, 4vw, 32px)",
          }}
        >
          {LOVE_CARDS.map((card, i) => (
            <LoveCardItem key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
