import { useMemo } from "react";

interface HeartProps {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const HEART_COLORS = [
  "#F4A7B9",
  "#E8849A",
  "#F9C8D4",
  "#D4879A",
  "#F2A0B2",
  "#ECBBC8",
];

function Heart({ left, size, duration, delay, color }: Omit<HeartProps, "id">) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        bottom: "-5%",
        width: `${size}px`,
        height: `${size}px`,
        animation: `floatHeart ${duration}s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
        role="presentation"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
}

export default function FloatingHearts() {
  const hearts = useMemo<HeartProps[]>(() => {
    const items: HeartProps[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        left: (i * 7.3 + 2) % 96,
        size: 12 + (i % 5) * 2.5,
        duration: 10 + (i % 7) * 1.2,
        delay: (i * 0.8) % 10,
        color: HEART_COLORS[i % HEART_COLORS.length],
      });
    }
    return items;
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {hearts.map(({ id, ...props }) => (
        <Heart key={id} {...props} />
      ))}
    </div>
  );
}
