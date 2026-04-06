export default function RibbonDivider() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 0",
        position: "relative",
        zIndex: 1,
        overflow: "visible",
      }}
    >
      <svg
        viewBox="0 0 600 110"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "clamp(280px, 80%, 580px)",
          height: "auto",
          filter: "drop-shadow(0 4px 12px rgba(183,110,121,0.25))",
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Rose gold gradient — left ribbon loop */}
          <linearGradient id="rg-left" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2d1d4" />
            <stop offset="30%" stopColor="#e8b4b8" />
            <stop offset="65%" stopColor="#c9848f" />
            <stop offset="100%" stopColor="#b76e79" />
          </linearGradient>
          {/* Rose gold gradient — right ribbon loop */}
          <linearGradient id="rg-right" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2d1d4" />
            <stop offset="30%" stopColor="#e8b4b8" />
            <stop offset="65%" stopColor="#c9848f" />
            <stop offset="100%" stopColor="#b76e79" />
          </linearGradient>
          {/* Knot gradient */}
          <radialGradient id="rg-knot" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f2d1d4" />
            <stop offset="40%" stopColor="#e0a0a8" />
            <stop offset="100%" stopColor="#a05868" />
          </radialGradient>
          {/* Tail shading */}
          <linearGradient id="rg-tail-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8b4b8" />
            <stop offset="100%" stopColor="#c07080" />
          </linearGradient>
          <linearGradient id="rg-tail-r" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8b4b8" />
            <stop offset="100%" stopColor="#c07080" />
          </linearGradient>
          {/* Sheen overlay */}
          <linearGradient id="rg-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,240,242,0.6)" />
            <stop offset="50%" stopColor="rgba(255,240,242,0)" />
          </linearGradient>
          {/* Horizontal ribbon bands */}
          <linearGradient id="rg-band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c8cc" />
            <stop offset="50%" stopColor="#d4909a" />
            <stop offset="100%" stopColor="#f0c8cc" />
          </linearGradient>
        </defs>

        {/* ---- Left horizontal ribbon band ---- */}
        <rect
          x="0"
          y="47"
          width="238"
          height="16"
          rx="2"
          fill="url(#rg-band)"
        />
        {/* shine on left band */}
        <rect
          x="0"
          y="47"
          width="238"
          height="7"
          rx="2"
          fill="rgba(255,245,247,0.35)"
        />

        {/* ---- Right horizontal ribbon band ---- */}
        <rect
          x="362"
          y="47"
          width="238"
          height="16"
          rx="2"
          fill="url(#rg-band)"
        />
        {/* shine on right band */}
        <rect
          x="362"
          y="47"
          width="238"
          height="7"
          rx="2"
          fill="rgba(255,245,247,0.35)"
        />

        {/* ---- Left ribbon loop ---- */}
        {/* Main loop shape — curves up-left from center */}
        <path
          d="M 260 55 C 230 52, 190 20, 165 18 C 145 16, 130 24, 138 38 C 146 52, 178 56, 200 58 C 220 60, 248 58, 260 55 Z"
          fill="url(#rg-left)"
          stroke="rgba(160,80,90,0.25)"
          strokeWidth="0.8"
        />
        {/* Left loop crease / shadow */}
        <path
          d="M 260 55 C 242 54, 218 55, 200 54 C 182 53, 155 46, 145 38"
          fill="none"
          stroke="rgba(140,60,75,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Left loop sheen */}
        <path
          d="M 255 53 C 228 50, 192 22, 172 21 C 158 20, 148 26, 152 33"
          fill="none"
          stroke="rgba(255,240,244,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ---- Right ribbon loop ---- */}
        <path
          d="M 340 55 C 370 52, 410 20, 435 18 C 455 16, 470 24, 462 38 C 454 52, 422 56, 400 58 C 380 60, 352 58, 340 55 Z"
          fill="url(#rg-right)"
          stroke="rgba(160,80,90,0.25)"
          strokeWidth="0.8"
        />
        {/* Right loop crease */}
        <path
          d="M 340 55 C 358 54, 382 55, 400 54 C 418 53, 445 46, 455 38"
          fill="none"
          stroke="rgba(140,60,75,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Right loop sheen */}
        <path
          d="M 345 53 C 372 50, 408 22, 428 21 C 442 20, 452 26, 448 33"
          fill="none"
          stroke="rgba(255,240,244,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ---- Left tail ---- */}
        <path
          d="M 268 62 C 250 66, 210 82, 195 95 C 188 102, 200 108, 210 102 C 225 94, 258 74, 272 66 Z"
          fill="url(#rg-tail-l)"
          stroke="rgba(160,80,90,0.2)"
          strokeWidth="0.8"
        />
        {/* tail notch (v-cut) */}
        <path
          d="M 195 95 L 205 88 L 215 98"
          fill="#d4909a"
          stroke="rgba(160,80,90,0.3)"
          strokeWidth="0.6"
        />

        {/* ---- Right tail ---- */}
        <path
          d="M 332 62 C 350 66, 390 82, 405 95 C 412 102, 400 108, 390 102 C 375 94, 342 74, 328 66 Z"
          fill="url(#rg-tail-r)"
          stroke="rgba(160,80,90,0.2)"
          strokeWidth="0.8"
        />
        {/* right tail notch */}
        <path
          d="M 405 95 L 395 88 L 385 98"
          fill="#d4909a"
          stroke="rgba(160,80,90,0.3)"
          strokeWidth="0.6"
        />

        {/* ---- Centre knot ---- */}
        <ellipse
          cx="300"
          cy="55"
          rx="36"
          ry="28"
          fill="url(#rg-knot)"
          stroke="rgba(160,80,90,0.3)"
          strokeWidth="1"
        />
        {/* Knot sheen */}
        <ellipse
          cx="292"
          cy="46"
          rx="14"
          ry="9"
          fill="rgba(255,240,244,0.38)"
        />
        {/* Knot centre dot */}
        <circle cx="300" cy="55" r="4" fill="rgba(140,60,75,0.35)" />
        <circle cx="300" cy="55" r="2" fill="rgba(255,220,225,0.5)" />

        {/* ---- Edge decorative dots on bands ---- */}
        <circle cx="15" cy="55" r="4" fill="rgba(183,110,121,0.5)" />
        <circle cx="585" cy="55" r="4" fill="rgba(183,110,121,0.5)" />
      </svg>
    </div>
  );
}
