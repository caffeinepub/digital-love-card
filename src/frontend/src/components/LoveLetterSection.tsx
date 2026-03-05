import { useEffect, useRef } from "react";
import FloatingHearts from "./FloatingHearts";

const LETTER_PARAGRAPHS: Array<{ id: string; text: string }> = [
  {
    id: "para-shift",
    text: "From the very first moment I saw you, I knew something in my world had shifted. There was nothing dramatic about it — no thunderclap, no fireworks — just the quiet, unmistakable feeling that I was exactly where I was supposed to be. Like a compass needle finding north after years of drifting. You walked into my life and everything rearranged itself, gently, irreversibly.",
  },
  {
    id: "para-ordinary",
    text: "You have this incredible way of making ordinary moments feel extraordinary. A Tuesday evening suddenly becomes something I'll remember forever. A walk to nowhere in particular becomes an adventure. Watching you do the simplest things — sipping coffee, laughing at something ridiculous, getting lost in thought — I find myself thinking: this is it. This is what people write songs about.",
  },
  {
    id: "para-laugh",
    text: "I love how you laugh at your own jokes even before you finish telling them, how you get completely absorbed in the things you love, how your eyes light up when you're excited about something. I love the way you notice the world — the way you point out things I would have walked right past. You've made me see everything more clearly, more tenderly.",
  },
  {
    id: "para-stillness",
    text: "In a world that moves so fast, you are my stillness. You are the place I come back to. When everything feels uncertain and loud, there is something in your presence that settles me — like the first breath after a long run, like sunlight after a grey, grey week. You don't fix things, but somehow, being near you makes everything feel more manageable, more okay.",
  },
  {
    id: "para-choose",
    text: "I want you to know that every single day, I choose you. Not out of habit, not out of convenience — but because loving you is the best and most deliberate thing I have ever done. You are my favourite story, my most treasured chapter. And I hope that in some small way, you feel that every time I look at you.",
  },
];

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

export default function LoveLetterSection() {
  const headingRef = useRef<HTMLDivElement>(null);

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
          {LETTER_PARAGRAPHS.map((para, i) => (
            <AnimatedParagraph
              key={para.id}
              id={para.id}
              text={para.text}
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
