import { useRef, useState } from "react";
import type { SongItem } from "../hooks/useAnnivContent";

interface VinylSectionProps {
  songs: SongItem[];
  editMode: boolean;
}

const VINYL_KEYS = ["v0", "v1", "v2", "v3", "v4", "v5"];

function VinylPlayer({
  song,
  playing,
  hasAudio,
  onClick,
  audioRef,
  onEnded,
  index,
}: {
  song: SongItem;
  playing: boolean;
  hasAudio: boolean;
  onClick: () => void;
  audioRef: (el: HTMLAudioElement | null) => void;
  onEnded: () => void;
  index: number;
}) {
  const size = "clamp(130px, 22vw, 180px)";

  return (
    <div
      data-ocid={`vinyl.item.${index + 1}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        userSelect: "none",
      }}
    >
      {/* Vinyl player chassis */}
      <button
        type="button"
        style={{
          position: "relative",
          width: size,
          height: size,
          cursor: hasAudio ? "pointer" : "default",
          background: "none",
          border: "none",
          padding: 0,
          overflow: "hidden",
          borderRadius: "12px",
        }}
        onClick={onClick}
        aria-label={song.title ? `Play ${song.title}` : `Vinyl ${index + 1}`}
      >
        {/* Player base / platter background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            background:
              "linear-gradient(145deg, #2a1f1a 0%, #1a120e 60%, #0e0a07 100%)",
            boxShadow: playing
              ? "0 6px 24px rgba(111,191,115,0.35), 0 2px 10px rgba(0,0,0,0.7)"
              : "0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
            transition: "box-shadow 0.3s ease",
          }}
        />

        {/* Platter rim ring */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "88%",
            height: "88%",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3a2a22 0%, #1c1410 100%)",
            border: "2px solid rgba(255,255,255,0.06)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.5) inset",
          }}
        />

        {/* Spinning vinyl disc — clipped to stay inside the chassis */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "78%",
            height: "78%",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
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
              animation: "vinylSpin 3.5s linear infinite",
              animationPlayState: playing ? "running" : "paused",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Center label circle — larger for visible cover art */}
            <div
              style={{
                width: "50%",
                height: "50%",
                borderRadius: "50%",
                background: song.coverUrl
                  ? `url(${song.coverUrl}) center/cover no-repeat`
                  : "radial-gradient(circle, #4a4a4a 0%, #222 100%)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Spindle hole */}
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.12)",
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tonearm pivot base (top-right corner) */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "8%",
            width: "14%",
            height: "14%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, #b8a898, #6b5a4e 55%, #3a2e28 100%)",
            boxShadow:
              "0 1px 4px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)",
            zIndex: 10,
          }}
        />

        {/* Tonearm */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "12%",
            width: "3px",
            height: "58%",
            background: "linear-gradient(to bottom, #c8b8a8, #9a8878, #7a6858)",
            borderRadius: "2px",
            transformOrigin: "top center",
            transform: playing ? "rotate(-28deg)" : "rotate(-18deg)",
            transition: "transform 0.8s ease",
            boxShadow: "1px 0 3px rgba(0,0,0,0.5)",
            zIndex: 9,
          }}
        >
          {/* Tonearm headshell / cartridge at the end */}
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%) rotate(15deg)",
              width: "10px",
              height: "7px",
              background: "linear-gradient(to bottom, #a09080, #6a5a50)",
              borderRadius: "1px 1px 3px 3px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      </button>

      {/* Song title */}
      <p
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "0.78rem",
          color: hasAudio ? "#3a5a40" : "#aac9ab",
          margin: 0,
          textAlign: "center",
          maxWidth: "clamp(100px, 18vw, 160px)",
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
        ref={audioRef}
        src={song.audioUrl || undefined}
        onEnded={onEnded}
        preload="none"
        style={{ display: "none" }}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}

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
        tap a vinyl to play ♪
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(16px, 4vw, 36px)",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        {VINYL_KEYS.map((key, i) => {
          const song = songs[i] ?? { audioUrl: "", coverUrl: "", title: "" };
          const playing = currentlyPlaying === i;
          const hasAudio = Boolean(song.audioUrl);

          return (
            <VinylPlayer
              key={key}
              song={song}
              playing={playing}
              hasAudio={hasAudio}
              onClick={() => handleVinylClick(i)}
              audioRef={(el) => {
                audioRefs.current[i] = el;
              }}
              onEnded={() => handleAudioEnded(i)}
              index={i}
            />
          );
        })}
      </div>
    </section>
  );
}
