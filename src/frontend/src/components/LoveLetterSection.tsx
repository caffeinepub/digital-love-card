import { useEffect, useRef } from "react";
import FloatingHearts from "./FloatingHearts";

interface ParagraphProps {
  text: string;
  index: number;
  id: string;
}

function AnimatedParagraph({ text, index, id }: ParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const timeout = setTimeout(() => {
              el.classList.add("visible");
            }, index * 180);
            observer.unobserve(el);
            return () => clearTimeout(timeout);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <p
      ref={ref}
      id={id}
      className="fade-in letter-paragraph"
      style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize: "clamp(1.1rem, 2vw, 1.28rem)",
        lineHeight: 2.1,
        color: "var(--color-text)",
        textAlign: "left",
        letterSpacing: "0.01em",
        margin: "0 0 2.8rem 0",
      }}
    >
      {text}
    </p>
  );
}

interface LoveLetterSectionProps {
  letterText: string;
}

export default function LoveLetterSection({
  letterText,
}: LoveLetterSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const paragraphs = letterText
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const t = setTimeout(() => el.classList.add("visible"), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      data-ocid="love-letter.section"
      className="love-letter-bg"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)",
        overflow: "hidden",
      }}
    >
      <FloatingHearts />

      {/* Decorative top flourish */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, transparent, rgba(244,167,185,0.6), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "660px",
          margin: "0 auto",
          padding: "0 clamp(8px, 3vw, 24px)",
        }}
      >
        {/* Heading */}
        <div
          ref={headingRef}
          className="fade-in"
          style={{
            textAlign: "left",
            marginBottom: "clamp(36px, 6vw, 60px)",
          }}
        >
          <h1
            className="glow-heading"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: "0 0 16px 0",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            For You 🤍
          </h1>
          {/* Letter-style ruled separator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: 0.55,
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--color-blush), transparent)",
              }}
            />
            <span
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "0.85rem",
                color: "var(--color-text-light)",
                letterSpacing: "0.12em",
                whiteSpace: "nowrap",
              }}
            >
              a letter, just for you
            </span>
          </div>
        </div>

        {/* Love letter paragraphs */}
        <div style={{ position: "relative" }}>
          {/* Opening ornamental quote */}
          <div
            aria-hidden="true"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(5rem, 12vw, 9rem)",
              lineHeight: 0.8,
              color: "rgba(244, 167, 185, 0.28)",
              position: "absolute",
              top: "-1.2rem",
              left: "-0.5rem",
              pointerEvents: "none",
              userSelect: "none",
              fontWeight: 700,
            }}
          >
            "
          </div>
          {paragraphs.map((text, i) => (
            <AnimatedParagraph
              key={text.slice(0, 24)}
              id={`para-${i}`}
              text={text}
              index={i}
            />
          ))}
        </div>

        {/* Closing signature */}
        <div
          style={{
            textAlign: "right",
            marginTop: "1rem",
            paddingTop: "1.4rem",
            borderTop: "1px solid rgba(244,167,185,0.2)",
            opacity: 0,
            animation: "fadeInUp 1s ease 1.2s forwards",
          }}
        >
          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(1.3rem, 3vw, 1.7rem)",
              color: "#E8849A",
              fontWeight: 600,
              margin: "0 0 4px 0",
              lineHeight: 1.3,
            }}
          >
            With all my love, always ♡
          </p>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: "var(--color-text-light)",
              margin: 0,
              letterSpacing: "0.04em",
              opacity: 0.7,
            }}
          >
            yours, completely
          </p>
        </div>
      </div>

      {/* Decorative bottom flourish */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, transparent, rgba(201,184,216,0.6), transparent)",
        }}
      />
    </section>
  );
}
