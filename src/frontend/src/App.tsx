import { useRef, useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import EditPanel from "./components/EditPanel";
import LoveLetterSection from "./components/LoveLetterSection";
import PolaroidGallery from "./components/PolaroidGallery";
import ThingsILoveSection from "./components/ThingsILoveSection";
import { useEditableContent } from "./hooks/useEditableContent";

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

// How many times the footer heart must be tapped to unlock edit mode
const UNLOCK_TAPS = 5;
const TAP_WINDOW_MS = 3000;

export default function App() {
  const currentYear = new Date().getFullYear();
  const {
    content,
    setLetterText,
    setLoveCards,
    setGalleryPhotos,
    setSpotifyUrl,
    setAudio,
    clearAudio,
  } = useEditableContent();

  // Secret tap unlock: tap the heart in the footer UNLOCK_TAPS times within TAP_WINDOW_MS
  const [editUnlocked, setEditUnlocked] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleHeartTap() {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= UNLOCK_TAPS) {
      tapCountRef.current = 0;
      setEditUnlocked((prev) => !prev);
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_WINDOW_MS);
  }

  return (
    <>
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <LoveLetterSection letterText={content.letterText} />
        <WaveDivider />
        <ThingsILoveSection loveCards={content.loveCards} />
        <WaveDivider flip />
        <PolaroidGallery galleryPhotos={content.galleryPhotos} />
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
          {/* Tap 5× quickly to unlock edit mode */}© {currentYear}. Built with{" "}
          <button
            type="button"
            aria-label="secret edit unlock"
            onClick={handleHeartTap}
            style={{
              color: "#E8849A",
              cursor: "default",
              userSelect: "none",
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              fontSize: "inherit",
              lineHeight: "inherit",
              display: "inline",
            }}
          >
            ♥
          </button>{" "}
          using{" "}
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

      {/* Background audio player — autoplays uploaded file */}
      <AudioPlayer audioDataUrl={content.audioDataUrl} />

      {/* Edit panel — only shown when unlocked via secret tap */}
      <EditPanel
        isUnlocked={editUnlocked}
        letterText={content.letterText}
        loveCards={content.loveCards}
        galleryPhotos={content.galleryPhotos}
        spotifyUrl={content.spotifyUrl}
        audioFileName={content.audioFileName}
        setLetterText={setLetterText}
        setLoveCards={setLoveCards}
        setGalleryPhotos={setGalleryPhotos}
        setSpotifyUrl={setSpotifyUrl}
        setAudio={setAudio}
        clearAudio={clearAudio}
      />
    </>
  );
}
