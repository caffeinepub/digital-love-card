import { useEffect, useRef, useState } from "react";

const MUSIC_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setShowPrompt(false);
      } catch {
        // Autoplay blocked — show prompt
        setShowPrompt(true);
        setIsPlaying(false);
      }
    };

    // Small delay to let page settle
    const t = setTimeout(tryAutoplay, 800);

    return () => {
      clearTimeout(t);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      try {
        await audio.play();
        setIsPlaying(true);
        setShowPrompt(false);
      } catch {
        setShowPrompt(true);
      }
    } else {
      const next = !isMuted;
      audio.muted = next;
      setIsMuted(next);
    }
  };

  return (
    <>
      {/* Autoplay prompt */}
      {showPrompt && !isPlaying && (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
            right: "24px",
            background: "rgba(255,252,248,0.96)",
            border: "1px solid rgba(244,167,185,0.4)",
            borderRadius: "12px",
            padding: "10px 14px",
            boxShadow: "0 4px 20px rgba(244,167,185,0.25)",
            zIndex: 50,
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.8rem",
            color: "var(--color-text-light)",
            backdropFilter: "blur(8px)",
            animation: "fadeInUp 0.4s ease forwards",
            maxWidth: "160px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          ♪ Tap to play music
        </div>
      )}

      {/* Music toggle button */}
      <button
        type="button"
        data-ocid="music.toggle"
        onClick={handleToggle}
        title={
          isPlaying ? (isMuted ? "Unmute music" : "Mute music") : "Play music"
        }
        aria-label={
          isPlaying ? (isMuted ? "Unmute music" : "Mute music") : "Play music"
        }
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
        {!isPlaying ? (
          // Play icon
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : isMuted ? (
          // Muted icon
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          // Music note playing icon
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
        )}
      </button>
    </>
  );
}
