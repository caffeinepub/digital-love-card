// Soft ornamental SVG divider — vines and small flowers
export default function OrnamDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        padding: "24px 0",
      }}
    >
      <svg
        viewBox="0 0 600 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "min(560px, 90vw)", height: "auto" }}
        aria-hidden="true"
      >
        {/* Left vine */}
        <path
          d="M20 30 Q60 10 120 28 Q160 40 200 26 Q230 16 260 30"
          stroke="#6fbf73"
          strokeWidth="1.8"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M60 24 Q70 12 80 22"
          stroke="#6fbf73"
          strokeWidth="1.3"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M130 32 Q140 18 150 30"
          stroke="#6fbf73"
          strokeWidth="1.3"
          fill="none"
          opacity="0.6"
        />

        {/* Left flowers */}
        <circle cx="95" cy="20" r="3.5" fill="#f4d35e" opacity="0.9" />
        <circle cx="95" cy="20" r="1.5" fill="#e8c06a" opacity="1" />
        <circle cx="175" cy="24" r="3" fill="#f4d35e" opacity="0.85" />
        <circle cx="175" cy="24" r="1.2" fill="#e8c06a" opacity="1" />
        <circle cx="50" cy="26" r="2.5" fill="#a8dca8" opacity="0.8" />

        {/* Right vine (mirrored) */}
        <path
          d="M580 30 Q540 10 480 28 Q440 40 400 26 Q370 16 340 30"
          stroke="#6fbf73"
          strokeWidth="1.8"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M540 24 Q530 12 520 22"
          stroke="#6fbf73"
          strokeWidth="1.3"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M470 32 Q460 18 450 30"
          stroke="#6fbf73"
          strokeWidth="1.3"
          fill="none"
          opacity="0.6"
        />

        {/* Right flowers */}
        <circle cx="505" cy="20" r="3.5" fill="#f4d35e" opacity="0.9" />
        <circle cx="505" cy="20" r="1.5" fill="#e8c06a" opacity="1" />
        <circle cx="425" cy="24" r="3" fill="#f4d35e" opacity="0.85" />
        <circle cx="425" cy="24" r="1.2" fill="#e8c06a" opacity="1" />
        <circle cx="550" cy="26" r="2.5" fill="#a8dca8" opacity="0.8" />

        {/* Center motif */}
        <circle
          cx="300"
          cy="30"
          r="8"
          fill="rgba(216,243,220,0.8)"
          stroke="#6fbf73"
          strokeWidth="1.2"
        />
        <text x="300" y="35" textAnchor="middle" fontSize="10" fill="#3a5a40">
          ✿
        </text>
      </svg>
    </div>
  );
}
