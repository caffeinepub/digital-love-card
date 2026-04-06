import { useRef, useState } from "react";
import type { SongItem } from "../hooks/useAnnivContent";

interface VinylSectionProps {
  songs: SongItem[];
  editMode: boolean;
}

const VINYL_KEYS = ["v0", "v1", "v2", "v3", "v4", "v5"];

export default function VinylSection({ songs }: VinylSectionProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>(Array(6).fill(null));

  function handleVinylClick(index: number) {
    const audio = audioRefs.current[index];
    if (!audio || !songs[index]?.audioUrl) return;

    if (currentlyPlaying === index) {
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      if (currentlyPlaying !== null) {
        const prev = audioRefs.current[currentlyPlaying];
        if (prev) prev.pause();
      }
      audio.play().catch(() => {
        setCurrentlyPlaying(null);
      });
      setCurrentlyPlaying(index);
    }
  }

  function handleAudioEnded(index: number) {
    setCurrentlyPlaying((prev) => (prev === index ? null : prev));
  }

  return (
    <section
      data-ocid="vinyl.section"
      style={{
        padding: "clamp(32px, 6vw, 64px) 20px",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <h2
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "2.2rem",
          color: "#3a5a40",
          margin: "0 0 8px 0",
          lineHeight: 1.2,
        }}
      >
        Our Songs
      </h2>
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "0.85rem",
          color: "#7a9e7e",
          margin: "0 0 36px 0",
          fontStyle: "italic",
        }}
      >
        click a vinyl to play ♪
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(16px, 4vw, 32px)",
          maxWidth: "680px",
          margin: "0 auto",
        }}
      >
        {VINYL_KEYS.map((key, i) => {
          const song = songs[i] ?? { audioUrl: "", coverUrl: "", title: "" };
          const playing = currentlyPlaying === i;
          const hasAudio = Boolean(song.audioUrl);

          return (
            <button
              key={key}
              type="button"
              data-ocid={`vinyl.item.${i + 1}`}
              aria-label={song.title ? `Play ${song.title}` : `Vinyl ${i + 1}`}
              onClick={() => handleVinylClick(i)}
              style={{
                cursor: hasAudio ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                outline: "none",
                userSelect: "none",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              {/* Vinyl disc container */}
              <div
                style={{
                  width: "clamp(100px, 18vw, 140px)",
                  height: "clamp(100px, 18vw, 140px)",
                  position: "relative",
                  margin: "0 auto",
                }}
              >
                {/* Outer vinyl disc */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: `repeating-radial-gradient(
                      circle,
                      #0a0a0a 0%,
                      #1a1a1a 1.5%,
                      #0a0a0a 2%,
                      #1a1a1a 4%,
                      #0a0a0a 4.5%,
                      #1a1a1a 6.5%,
                      #0a0a0a 7%,
                      #1a1a1a 9%,
                      #0a0a0a 9.5%,
                      #1a1a1a 11.5%,
                      #0a0a0a 12%,
                      #1a1a1a 14%,
                      #0a0a0a 14.5%,
                      #1a1a1a 16.5%,
                      #0a0a0a 17%,
                      #1a1a1a 19%,
                      #0a0a0a 19.5%,
                      #1a1a1a 21.5%,
                      #0a0a0a 22%,
                      #222 100%
                    )`,
                    position: "relative",
                    animation: hasAudio
                      ? "vinylSpin 4s linear infinite"
                      : "none",
                    animationPlayState: playing ? "running" : "paused",
                    boxShadow: playing
                      ? "0 0 24px rgba(111,191,115,0.4), 0 4px 16px rgba(0,0,0,0.5)"
                      : "0 4px 16px rgba(0,0,0,0.5)",
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  {/* Center circle label area */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "37%",
                      height: "37%",
                      borderRadius: "50%",
                      background: song.coverUrl
                        ? `url(${song.coverUrl}) center/cover no-repeat`
                        : "radial-gradient(circle, #4a4a4a 0%, #222 100%)",
                      border: "2px solid rgba(255,255,255,0.18)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Center spindle hole */}
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#111",
                        border: "1px solid rgba(255,255,255,0.15)",
                        flexShrink: 0,
                      }}
                    />
                  </div>

                  {/* Play/pause indicator overlay */}
                  {hasAudio && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8%",
                        right: "8%",
                        width: "22%",
                        height: "22%",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "clamp(8px, 1.5vw, 12px)",
                        color: playing ? "#6fbf73" : "rgba(255,255,255,0.7)",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {playing ? "⏸" : "▶"}
                    </div>
                  )}
                </div>
              </div>

              {/* Song title */}
              <p
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.78rem",
                  color: hasAudio ? "#3a5a40" : "#aac9ab",
                  margin: 0,
                  textAlign: "center",
                  maxWidth: "clamp(90px, 16vw, 130px)",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                  lineHeight: 1.4,
                  minHeight: "2.4em",
                  fontStyle: song.title ? "normal" : "italic",
                }}
              >
                {song.title || (hasAudio ? "Untitled" : "Add song")}
              </p>

              {/* Hidden audio element */}
              <audio
                ref={(el) => {
                  audioRefs.current[i] = el;
                }}
                src={song.audioUrl || undefined}
                onEnded={() => handleAudioEnded(i)}
                preload="none"
                style={{ display: "none" }}
              >
                <track kind="captions" />
              </audio>
            </button>
          );
        })}
      </div>
    </section>
  );
}
