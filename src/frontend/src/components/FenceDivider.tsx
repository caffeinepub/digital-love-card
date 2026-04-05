export default function FenceDivider() {
  // Wood grain lines for a single picket
  const woodGrain = (x: number, w: number) => [
    <line
      key="g1"
      x1={x + w * 0.25}
      y1={10}
      x2={x + w * 0.22}
      y2={155}
      stroke="#7a5a10"
      strokeWidth={0.6}
      opacity={0.4}
    />,
    <line
      key="g2"
      x1={x + w * 0.55}
      y1={10}
      x2={x + w * 0.58}
      y2={155}
      stroke="#7a5a10"
      strokeWidth={0.5}
      opacity={0.3}
    />,
    <line
      key="g3"
      x1={x + w * 0.75}
      y1={10}
      x2={x + w * 0.72}
      y2={120}
      stroke="#7a5a10"
      strokeWidth={0.4}
      opacity={0.25}
    />,
  ];

  // Single picket with pointed top
  const Picket = ({ x }: { x: number }) => {
    const w = 28;
    return (
      <g>
        {/* Shadow */}
        <rect
          x={x + 2}
          y={20}
          width={w}
          height={148}
          rx={2}
          fill="rgba(0,0,0,0.08)"
        />
        {/* Picket body */}
        <polygon
          points={`${x},22 ${x + w / 2},6 ${x + w},22 ${x + w},168 ${x},168`}
          fill="#c89040"
        />
        {/* Top face of point */}
        <polygon points={`${x},22 ${x + w / 2},6 ${x + w},22`} fill="#d8a050" />
        {/* Front face */}
        <polygon
          points={`${x + 3},23 ${x + w / 2},9 ${x + w - 3},23 ${x + w - 3},166 ${x + 3},166`}
          fill="#d49838"
        />
        {/* Wood grain */}
        {woodGrain(x + 3, w - 6)}
        {/* Edge darkening */}
        <line
          x1={x}
          y1={22}
          x2={x}
          y2={168}
          stroke="#9a6a18"
          strokeWidth={1.2}
        />
        <line
          x1={x + w}
          y1={22}
          x2={x + w}
          y2={168}
          stroke="#9a6a18"
          strokeWidth={1.2}
        />
      </g>
    );
  };

  // Horizontal rail
  const Rail = ({ y }: { y: number }) => (
    <g>
      {/* Rail shadow */}
      <rect x={0} y={y + 2} width={1400} height={18} fill="rgba(0,0,0,0.07)" />
      {/* Rail body */}
      <rect x={0} y={y} width={1400} height={16} fill="#bf8828" />
      {/* Rail top highlight */}
      <rect x={0} y={y} width={1400} height={4} fill="#d9a03a" opacity={0.6} />
      {/* Rail grain */}
      {Array.from({ length: 70 }, (_, i) => (
        <line
          // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
          key={`rg-${i}`}
          x1={i * 20 + 5}
          y1={y + 3}
          x2={i * 20 + 18}
          y2={y + 14}
          stroke="#9a6a18"
          strokeWidth={0.5}
          opacity={0.3}
        />
      ))}
    </g>
  );

  // Decorative flower (5 petals)
  const Flower = ({
    cx,
    cy,
    r,
    color,
    centerColor,
  }: {
    cx: number;
    cy: number;
    r: number;
    color: string;
    centerColor: string;
  }) => (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        return (
          <ellipse
            // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
            key={`petal-${i}`}
            cx={cx + r * 1.2 * Math.cos(rad)}
            cy={cy + r * 1.2 * Math.sin(rad)}
            rx={r * 0.85}
            ry={r * 0.55}
            fill={color}
            transform={`rotate(${angle} ${cx + r * 1.2 * Math.cos(rad)} ${cy + r * 1.2 * Math.sin(rad)})`}
            opacity={0.95}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.55} fill={centerColor} />
    </g>
  );

  // Vine leaf
  const Leaf = ({ x, y, rotate }: { x: number; y: number; rotate: number }) => (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      <path d="M0 0 Q8 -10 18 -6 Q12 4 0 0Z" fill="#4a8a3a" opacity={0.85} />
      <line x1={0} y1={0} x2={12} y2={-5} stroke="#3a7a2a" strokeWidth={0.6} />
    </g>
  );

  const picketXPositions = Array.from({ length: 46 }, (_, i) => i * 31);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        lineHeight: 0,
        margin: "8px 0",
        overflow: "hidden",
      }}
    >
      <svg
        role="img"
        aria-label="Decorative wooden fence with climbing vines and flowers"
        viewBox="0 0 1400 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          maxHeight: "200px",
        }}
      >
        <defs>
          <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(216,243,220,0)" />
            <stop offset="100%" stopColor="rgba(216,243,220,0.15)" />
          </linearGradient>
        </defs>

        {/* Ground strip */}
        <rect
          x={0}
          y={160}
          width={1400}
          height={40}
          fill="#a8d48a"
          opacity={0.4}
        />

        {/* Pickets */}
        {picketXPositions.map((x) => (
          <Picket key={`picket-${x}`} x={x} />
        ))}

        {/* Horizontal rails */}
        <Rail y={55} />
        <Rail y={118} />

        {/* ======= VINES along top rail ======= */}
        {/* Main vine path — top of fence */}
        <path
          d="M0 48 Q80 28 160 48 Q240 68 320 42 Q400 16 480 44 Q560 72 640 38 Q720 4 800 40 Q880 76 960 44 Q1040 12 1120 46 Q1200 80 1280 48 Q1360 16 1400 44"
          stroke="#4a8a3a"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Secondary vine */}
        <path
          d="M0 62 Q100 44 200 60 Q300 76 400 54 Q500 32 600 56 Q700 80 800 58 Q900 36 1000 62 Q1100 88 1200 64 Q1300 40 1400 60"
          stroke="#5a9a48"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          opacity={0.7}
        />

        {/* Curly vine tendrils */}
        {[
          { x: 80, y: 40 },
          { x: 200, y: 52 },
          { x: 330, y: 36 },
          { x: 460, y: 50 },
          { x: 590, y: 44 },
          { x: 720, y: 38 },
          { x: 850, y: 52 },
          { x: 980, y: 42 },
          { x: 1100, y: 48 },
          { x: 1230, y: 40 },
          { x: 1380, y: 46 },
        ].map((pos, i) => (
          <path
            // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
            key={`tendril-${i}`}
            d={`M${pos.x} ${pos.y} Q${pos.x + 8} ${pos.y - 14} ${pos.x + 4} ${pos.y - 22} Q${pos.x - 4} ${pos.y - 28} ${pos.x + 2} ${pos.y - 20}`}
            stroke="#5a9a48"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.75}
          />
        ))}

        {/* Leaves along top vine */}
        {[
          { x: 45, y: 44, r: -30 },
          { x: 100, y: 36, r: 20 },
          { x: 160, y: 50, r: -15 },
          { x: 220, y: 38, r: 35 },
          { x: 280, y: 46, r: -25 },
          { x: 340, y: 34, r: 18 },
          { x: 400, y: 48, r: -35 },
          { x: 460, y: 40, r: 22 },
          { x: 520, y: 52, r: -18 },
          { x: 580, y: 36, r: 30 },
          { x: 640, y: 48, r: -22 },
          { x: 700, y: 38, r: 15 },
          { x: 760, y: 50, r: -28 },
          { x: 820, y: 42, r: 25 },
          { x: 880, y: 36, r: -18 },
          { x: 940, y: 50, r: 32 },
          { x: 1000, y: 40, r: -20 },
          { x: 1060, y: 46, r: 18 },
          { x: 1120, y: 34, r: -30 },
          { x: 1180, y: 50, r: 22 },
          { x: 1240, y: 44, r: -15 },
          { x: 1300, y: 38, r: 28 },
          { x: 1360, y: 50, r: -20 },
        ].map((leaf, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
          <Leaf key={`leaf-${i}`} x={leaf.x} y={leaf.y} rotate={leaf.r} />
        ))}

        {/* ======= BOTTOM VINE along lower rail ======= */}
        <path
          d="M0 112 Q100 96 200 114 Q300 132 400 108 Q500 84 600 112 Q700 140 800 112 Q900 84 1000 108 Q1100 132 1200 110 Q1300 88 1400 112"
          stroke="#4a8a3a"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* Leaves along bottom vine */}
        {[
          { x: 60, y: 110, r: 20 },
          { x: 150, y: 104, r: -18 },
          { x: 250, y: 118, r: 25 },
          { x: 360, y: 102, r: -22 },
          { x: 470, y: 108, r: 15 },
          { x: 570, y: 116, r: -28 },
          { x: 680, y: 104, r: 20 },
          { x: 780, y: 114, r: -15 },
          { x: 880, y: 100, r: 25 },
          { x: 990, y: 112, r: -18 },
          { x: 1090, y: 106, r: 22 },
          { x: 1190, y: 116, r: -25 },
          { x: 1300, y: 104, r: 18 },
          { x: 1380, y: 112, r: -20 },
        ].map((leaf, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
          <Leaf key={`bleaf-${i}`} x={leaf.x} y={leaf.y} rotate={leaf.r} />
        ))}

        {/* ======= FLOWERS scattered along vines ======= */}
        {/* Yellow flowers */}
        {[
          { cx: 55, cy: 34, r: 7 },
          { cx: 185, cy: 44, r: 6 },
          { cx: 310, cy: 36, r: 7 },
          { cx: 440, cy: 48, r: 6 },
          { cx: 570, cy: 38, r: 7 },
          { cx: 695, cy: 42, r: 6 },
          { cx: 825, cy: 36, r: 7 },
          { cx: 950, cy: 46, r: 6 },
          { cx: 1080, cy: 38, r: 7 },
          { cx: 1210, cy: 44, r: 6 },
          { cx: 1360, cy: 38, r: 7 },
        ].map((f, i) => (
          <Flower
            // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
            key={`yf-${i}`}
            cx={f.cx}
            cy={f.cy}
            r={f.r}
            color="#f9e04b"
            centerColor="#e8a000"
          />
        ))}

        {/* White flowers */}
        {[
          { cx: 130, cy: 42, r: 6 },
          { cx: 250, cy: 50, r: 7 },
          { cx: 380, cy: 40, r: 6 },
          { cx: 510, cy: 52, r: 7 },
          { cx: 635, cy: 42, r: 6 },
          { cx: 760, cy: 50, r: 7 },
          { cx: 890, cy: 38, r: 6 },
          { cx: 1015, cy: 50, r: 7 },
          { cx: 1140, cy: 42, r: 6 },
          { cx: 1270, cy: 48, r: 7 },
        ].map((f, i) => (
          <Flower
            // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
            key={`wf-${i}`}
            cx={f.cx}
            cy={f.cy}
            r={f.r}
            color="#ffffff"
            centerColor="#f9d71c"
          />
        ))}

        {/* Small flowers along bottom vine */}
        {[
          { cx: 90, cy: 106, r: 5 },
          { cx: 200, cy: 120, r: 5 },
          { cx: 320, cy: 104, r: 5 },
          { cx: 440, cy: 116, r: 5 },
          { cx: 560, cy: 108, r: 5 },
          { cx: 680, cy: 120, r: 5 },
          { cx: 800, cy: 108, r: 5 },
          { cx: 920, cy: 116, r: 5 },
          { cx: 1040, cy: 104, r: 5 },
          { cx: 1160, cy: 118, r: 5 },
          { cx: 1280, cy: 108, r: 5 },
        ].map((f, i) => (
          <Flower
            // biome-ignore lint/suspicious/noArrayIndexKey: static SVG shapes
            key={`bf-${i}`}
            cx={f.cx}
            cy={f.cy}
            r={f.r}
            color={i % 2 === 0 ? "#f9e04b" : "#ffffff"}
            centerColor={i % 2 === 0 ? "#e8a000" : "#f9d71c"}
          />
        ))}

        {/* Subtle sky fade overlay */}
        <rect x={0} y={0} width={1400} height={200} fill="url(#skyFade)" />
      </svg>
    </div>
  );
}
