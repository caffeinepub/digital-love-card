import LoveLetterSection from "./components/LoveLetterSection";
import MusicPlayer from "./components/MusicPlayer";
import PolaroidGallery from "./components/PolaroidGallery";
import ThingsILoveSection from "./components/ThingsILoveSection";

/**
 * Soft SVG wave divider — creates a seamless organic boundary between sections.
 * Fill color matches the ambient gradient at each transition point so no band is visible.
 */
function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="wave-divider"
      style={{
        transform: flip ? "scaleY(-1)" : undefined,
        height: "72px",
        position: "relative",
        zIndex: 1,
        marginTop: "-1px",
        marginBottom: "-1px",
      }}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
        role="presentation"
      >
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          fill="rgba(244,167,185,0.09)"
        />
        <path
          d="M0,48 C360,20 720,68 1080,28 C1260,12 1380,40 1440,48 L1440,72 L0,72 Z"
          fill="rgba(201,184,216,0.07)"
        />
      </svg>
    </div>
  );
}

export default function App() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <LoveLetterSection />
        <WaveDivider />
        <ThingsILoveSection />
        <WaveDivider flip />
        <PolaroidGallery />
      </main>

      {/* Footer */}
      <footer
        className="love-footer"
        style={{
          textAlign: "center",
          padding: "clamp(24px, 4vw, 40px) 20px",
        }}
      >
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.82rem",
            color: "var(--color-text-light)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          © {currentYear}. Built with{" "}
          <span style={{ color: "#E8849A" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-text-light)",
              textDecoration: "underline",
              textDecorationColor: "rgba(244,167,185,0.5)",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#D47A91";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-light)";
            }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Persistent music player */}
      <MusicPlayer />
    </>
  );
}
