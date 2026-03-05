import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface SpotifyPlayerProps {
  spotifyUrl: string;
}

function toEmbedUrl(url: string): string | null {
  if (!url.trim()) return null;
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes("spotify.com")) return null;
    // pathname like /track/TRACK_ID or /playlist/PLAYLIST_ID
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const [type, id] = parts;
    if (!["track", "playlist", "album", "episode"].includes(type)) return null;
    return `https://open.spotify.com/embed/${type}/${id}`;
  } catch {
    return null;
  }
}

export default function SpotifyPlayer({ spotifyUrl }: SpotifyPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const embedUrl = toEmbedUrl(spotifyUrl);

  return (
    <>
      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ocid="spotify.panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: "88px",
              right: "24px",
              width: "300px",
              background: "rgba(255,252,248,0.97)",
              border: "1px solid rgba(244,167,185,0.35)",
              borderRadius: "16px",
              boxShadow:
                "0 8px 32px rgba(244,167,185,0.3), 0 2px 8px rgba(0,0,0,0.08)",
              overflow: "hidden",
              zIndex: 99,
              backdropFilter: "blur(12px)",
            }}
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="300"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{ display: "block", borderRadius: "16px" }}
                title="Spotify Player"
              />
            ) : (
              <div
                style={{
                  padding: "16px 20px",
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.82rem",
                  color: "var(--color-text-light)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Add a Spotify link in the Edit panel ✏️
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        type="button"
        data-ocid="spotify.toggle"
        onClick={() => setIsOpen((v) => !v)}
        title={isOpen ? "Close music player" : "Open music player"}
        aria-label={isOpen ? "Close music player" : "Open music player"}
        className="music-btn"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #F4A7B9 0%, #E8849A 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 20px rgba(244,167,185,0.5), 0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 100,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          color: "#fff",
          fontSize: "1.3rem",
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 6px 28px rgba(244,167,185,0.65), 0 3px 10px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(244,167,185,0.5), 0 2px 8px rgba(0,0,0,0.1)";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="presentation"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>
    </>
  );
}
