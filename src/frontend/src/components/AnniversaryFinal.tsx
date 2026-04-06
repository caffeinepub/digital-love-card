import { motion } from "motion/react";

// Metallic foil balloon letter component
function BalloonLetter({ char, delay = 0 }: { char: string; delay?: number }) {
  if (char === " ")
    return (
      <span
        style={{
          display: "inline-block",
          width: "clamp(0.5rem, 1.5vw, 1.2rem)",
        }}
      />
    );

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 3 + (delay % 0.5),
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        delay,
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      {/* Balloon body */}
      <div
        style={{
          width: "clamp(2.4rem, 6.5vw, 4.6rem)",
          height: "clamp(2.6rem, 7vw, 5rem)",
          borderRadius: "50% 50% 48% 48% / 55% 55% 45% 45%",
          background:
            "radial-gradient(ellipse at 35% 28%, rgba(255,255,255,0.92) 0%, rgba(255,235,220,0.75) 12%, #f0c4a8 28%, #e8a07a 50%, #c97848 72%, #9b5030 88%, #6e3018 100%)",
          boxShadow:
            "0 6px 20px rgba(160,80,40,0.45), inset 0 3px 6px rgba(255,255,255,0.5), inset 0 -3px 8px rgba(80,30,10,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
          // Small specular highlight top-left
        }}
      >
        {/* Secondary specular spot */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "14%",
            left: "22%",
            width: "28%",
            height: "22%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Letter glyph */}
        <span
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontWeight: 700,
            fontSize: "clamp(1.3rem, 3.8vw, 2.8rem)",
            color: "#5a2410",
            textShadow:
              "0 1px 2px rgba(255,180,130,0.5), 0 -1px 1px rgba(60,15,5,0.3)",
            lineHeight: 1,
            userSelect: "none",
            letterSpacing: "-0.02em",
            position: "relative",
            zIndex: 1,
          }}
        >
          {char}
        </span>
      </div>

      {/* Balloon knot nub */}
      <div
        aria-hidden="true"
        style={{
          width: "clamp(4px, 0.6vw, 7px)",
          height: "clamp(4px, 0.6vw, 7px)",
          borderRadius: "50% 50% 40% 40%",
          background: "radial-gradient(ellipse at 40% 30%, #e8a07a, #8c3a18)",
          boxShadow: "0 1px 3px rgba(80,30,10,0.4)",
          flexShrink: 0,
        }}
      />

      {/* String */}
      <div
        aria-hidden="true"
        style={{
          width: "1.5px",
          height: "clamp(18px, 2.5vw, 28px)",
          background:
            "linear-gradient(to bottom, rgba(140,58,24,0.6) 0%, rgba(100,40,15,0.25) 100%)",
          borderRadius: "1px",
          flexShrink: 0,
        }}
      />
    </motion.div>
  );
}

interface LetterEntry {
  char: string;
  pos: number;
  offset: number;
  delay: number;
}

// Word block — letters arc slightly (higher letters in the middle)
function BalloonWord({
  word,
  baseDelay = 0,
}: { word: string; baseDelay?: number }) {
  const letters = word.split("");
  const mid = (letters.length - 1) / 2;

  const entries: LetterEntry[] = letters.map((char, i) => ({
    char,
    pos: i,
    // Arc: center letters slightly higher
    offset: mid === 0 ? 0 : -(1 - Math.abs(i - mid) / mid) * 8,
    delay: baseDelay + i * 0.09,
  }));

  return (
    <div
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "clamp(2px, 0.5vw, 5px)",
      }}
    >
      {entries.map((entry) => (
        <div
          key={`${word}-${entry.pos}`}
          style={{
            transform: `translateY(${entry.offset}px)`,
            display: "inline-block",
          }}
        >
          <BalloonLetter char={entry.char} delay={entry.delay} />
        </div>
      ))}
    </div>
  );
}

export default function AnniversaryFinal() {
  return (
    <section
      data-ocid="anniversary.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "60px 20px 80px",
        textAlign: "center",
        minHeight: "520px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(6px, 1.5vw, 14px)",
        }}
      >
        {/* Top balloon decoration */}
        <div
          aria-hidden="true"
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
            marginBottom: "4px",
            opacity: 0.85,
            letterSpacing: "0.3em",
          }}
        >
          🎈 🎀 🎈
        </div>

        {/* HAPPY */}
        <BalloonWord word="HAPPY" baseDelay={0} />

        {/* ONE YEAR */}
        <div
          style={{
            display: "flex",
            gap: "clamp(6px, 2.5vw, 20px)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <BalloonWord word="ONE" baseDelay={0.5} />
          <BalloonWord word="YEAR" baseDelay={0.8} />
        </div>

        {/* ANNIVERSARY */}
        <BalloonWord word="ANNIVERSARY" baseDelay={1.2} />

        {/* Bottom date decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
            color: "#5f735f",
            marginTop: "clamp(16px, 2.5vw, 28px)",
            letterSpacing: "0.04em",
          }}
        >
          08/04/2025 → 08/04/2026 🌿
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8, duration: 1 }}
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginTop: "8px" }}
        >
          🫶
        </motion.div>
      </motion.div>
    </section>
  );
}
