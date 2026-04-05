import { motion } from "motion/react";

// Balloon letter component — rose gold gradient text
function BalloonLetter({ char, delay = 0 }: { char: string; delay?: number }) {
  if (char === " ")
    return <span style={{ display: "inline-block", width: "0.4em" }} />;
  return (
    <motion.span
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        delay,
      }}
      style={{
        display: "inline-block",
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontWeight: 700,
        fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
        background:
          "linear-gradient(160deg, #f5ddd7 0%, #e8c4b8 20%, #d4956a 45%, #e8c4b8 70%, #f5ddd7 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 2px 6px rgba(212,149,106,0.4))",
        textShadow: "none",
        lineHeight: 1.1,
        letterSpacing: "0.04em",
        userSelect: "none",
      }}
    >
      {char}
    </motion.span>
  );
}

interface LetterEntry {
  char: string;
  pos: number;
  offset: number;
  delay: number;
}

// Word block — letters arc slightly
function BalloonWord({
  word,
  baseDelay = 0,
}: { word: string; baseDelay?: number }) {
  const letters = word.split("");
  const mid = (letters.length - 1) / 2;

  const entries: LetterEntry[] = letters.map((char, i) => ({
    char,
    pos: i,
    offset: mid === 0 ? 0 : -(1 - Math.abs(i - mid) / mid) * 6,
    delay: baseDelay + i * 0.08,
  }));

  return (
    <div
      className="balloon-word"
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "2px",
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
        minHeight: "480px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {/* String decorations */}
        <div
          aria-hidden="true"
          style={{ fontSize: "1.4rem", marginBottom: "8px", opacity: 0.7 }}
        >
          🎈 🎀 🎈
        </div>

        {/* HAPPY */}
        <BalloonWord word="HAPPY" baseDelay={0} />

        {/* ONE YEAR */}
        <div
          style={{
            display: "flex",
            gap: "clamp(8px, 3vw, 24px)",
            marginTop: "4px",
          }}
        >
          <BalloonWord word="ONE" baseDelay={0.5} />
          <BalloonWord word="YEAR" baseDelay={0.8} />
        </div>

        {/* ANNIVERSARY */}
        <BalloonWord word="ANNIVERSARY" baseDelay={1.2} />

        {/* Bottom decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
            color: "#5f735f",
            marginTop: "28px",
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
          style={{ fontSize: "2rem", marginTop: "12px" }}
        >
          🫶
        </motion.div>
      </motion.div>
    </section>
  );
}
