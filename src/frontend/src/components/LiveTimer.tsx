import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const START_DATE = new Date("2025-04-08T00:00:00");

interface TimeUnits {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeSince(start: Date): TimeUnits {
  const now = new Date();
  const diff = now.getTime() - start.getTime();

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    weeks: totalWeeks,
    days: totalDays,
    hours: totalHours,
    minutes: totalMinutes,
    seconds: totalSeconds,
  };
}

const UNITS: { key: keyof TimeUnits; label: string; emoji: string }[] = [
  { key: "years", label: "Years", emoji: "🌿" },
  { key: "months", label: "Months", emoji: "🌙" },
  { key: "weeks", label: "Weeks", emoji: "🍀" },
  { key: "days", label: "Days", emoji: "☀️" },
  { key: "hours", label: "Hours", emoji: "⏳" },
  { key: "minutes", label: "Minutes", emoji: "🌸" },
  { key: "seconds", label: "Seconds", emoji: "✨" },
];

export default function LiveTimer() {
  const [time, setTime] = useState<TimeUnits>(() => calcTimeSince(START_DATE));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime(calcTimeSince(START_DATE));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section
      data-ocid="timer.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "32px 24px 48px",
        maxWidth: "820px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          color: "#5f735f",
          margin: "0 0 28px 0",
          letterSpacing: "0.02em",
        }}
      >
        we've been us for...
      </motion.p>

      {/* Top row: Years, Months, Weeks, Days */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {UNITS.slice(0, 4).map((unit, i) => (
          <motion.div
            key={unit.key}
            className="timer-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              padding: "20px 12px",
              border: "1px solid rgba(111,191,115,0.25)",
              boxShadow: "0 4px 20px rgba(63,90,58,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div style={{ fontSize: "1.2rem" }}>{unit.emoji}</div>
            <div
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 700,
                color: "#3a5a40",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {time[unit.key].toLocaleString()}
            </div>
            <div
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#7a9e7e",
              }}
            >
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom row: Hours, Minutes, Seconds — wider cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {UNITS.slice(4).map((unit, i) => (
          <motion.div
            key={unit.key}
            className="timer-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72 + i * 0.08, duration: 0.6 }}
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              padding: "22px 16px",
              border: "1px solid rgba(111,191,115,0.25)",
              boxShadow: "0 4px 20px rgba(63,90,58,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div style={{ fontSize: "1.2rem" }}>{unit.emoji}</div>
            <div
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 700,
                color: "#3a5a40",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              {time[unit.key].toLocaleString()}
            </div>
            <div
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#7a9e7e",
              }}
            >
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
