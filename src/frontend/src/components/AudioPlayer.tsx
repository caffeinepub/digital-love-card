import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  audioDataUrl: string;
}

export default function AudioPlayer({ audioDataUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Attempt autoplay as soon as we have audio
  useEffect(() => {
    if (!audioDataUrl) return;
    const audio = new Audio(audioDataUrl);
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    // Try to autoplay; if browser blocks it, update state so button shows correctly
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [audioDataUrl]);

  function handleToggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }

  if (!audioDataUrl) return null;

  return (
    <button
      type="button"
      data-ocid="audio.toggle"
      onClick={handleToggle}
      title={isPlaying ? "Pause music" : "Play music"}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      className="music-btn"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background: isPlaying
          ? "linear-gradient(135deg, #F4A7B9 0%, #E8849A 100%)"
          : "linear-gradient(135deg, #C9B8D8 0%, #A894C0 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: isPlaying
          ? "0 4px 20px rgba(244,167,185,0.5), 0 2px 8px rgba(0,0,0,0.1)"
          : "0 4px 20px rgba(201,184,216,0.5), 0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 100,
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease",
        color: "#fff",
        fontSize: "1.3rem",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {isPlaying ? (
        // Pause icon (two bars)
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        // Musical note icon
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )}
    </button>
  );
}
