import { useRef, useState } from "react";
import AnnivEditPanel, {
  UNLOCK_TAPS,
  TAP_WINDOW_MS,
} from "./components/AnnivEditPanel";
import AnniversaryFinal from "./components/AnniversaryFinal";
import AudioPlayer from "./components/AudioPlayer";
import BenchScene from "./components/BenchScene";
import BouquetSection from "./components/BouquetSection";
import FenceDivider from "./components/FenceDivider";
import GameSection from "./components/GameSection";
import LiveTimer from "./components/LiveTimer";
import MemoryBed from "./components/MemoryBed";
import OrnamDivider from "./components/OrnamDivider";
import PolaroidGallery2 from "./components/PolaroidGallery2";
import StarCanvas from "./components/StarCanvas";
import { useAnnivContent } from "./hooks/useAnnivContent";

const DISPLAYED_DATE = "08/04/2026";

export default function App() {
  const currentYear = new Date().getFullYear();
  const {
    content,
    setPoems,
    uploadBoardGame,
    uploadCharacter1,
    uploadCharacter2,
    uploadPolaroid,
    updatePolaroidCaption,
    uploadBouquet,
    uploadTreasures,
    setAudio,
    clearAudio,
    saveToBackend,
  } = useAnnivContent();

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
      <StarCanvas />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "860px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          data-ocid="header.section"
          style={{
            textAlign: "center",
            paddingTop: "clamp(40px, 8vh, 80px)",
            paddingBottom: "8px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "43.9px",
              fontWeight: 700,
              color: "#3a5a40",
              margin: 0,
              letterSpacing: "0.06em",
              lineHeight: 1.2,
            }}
          >
            {DISPLAYED_DATE}
          </h1>
          <div
            style={{
              width: "60px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #6fbf73, transparent)",
              margin: "14px auto 0",
              borderRadius: "1px",
            }}
          />
        </header>

        <LiveTimer />
        <BouquetSection bouquetImageUrl={content.bouquetImageUrl} />
        <FenceDivider />
        <GameSection
          boardGameImageUrl={content.boardGameImageUrl}
          onUploadBoardGame={uploadBoardGame}
          poems={content.poems}
          onPoemsChange={setPoems}
        />
        <BenchScene
          character1Url={content.character1Url}
          character2Url={content.character2Url}
        />
        <MemoryBed treasuresImageUrl={content.treasuresImageUrl} />
        <OrnamDivider />
        <PolaroidGallery2
          polaroids={content.polaroids}
          onUpload={uploadPolaroid}
          editMode={editUnlocked}
        />
        <AnniversaryFinal />
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "clamp(24px, 4vw, 40px) 20px",
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(111,191,115,0.2)",
          marginTop: "16px",
        }}
      >
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.82rem",
            color: "#7a9e7e",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          &copy; {currentYear}. Built with{" "}
          <button
            type="button"
            aria-label="secret edit unlock"
            onClick={handleHeartTap}
            style={{
              color: "#6fbf73",
              cursor: "default",
              userSelect: "none",
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              fontSize: "inherit",
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
              color: "#7a9e7e",
              textDecoration: "underline",
              textDecorationColor: "rgba(111,191,115,0.5)",
            }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <AudioPlayer audioDataUrl={content.audioDataUrl} />

      <AnnivEditPanel
        isUnlocked={editUnlocked}
        poems={content.poems}
        onPoemsChange={setPoems}
        boardGameImageUrl={content.boardGameImageUrl}
        polaroids={content.polaroids}
        onUploadBoardGame={uploadBoardGame}
        onUploadCharacter1={uploadCharacter1}
        onUploadCharacter2={uploadCharacter2}
        onUploadPolaroid={uploadPolaroid}
        onUpdatePolaroidCaption={updatePolaroidCaption}
        onUploadBouquet={uploadBouquet}
        onUploadTreasures={uploadTreasures}
        treasuresImageUrl={content.treasuresImageUrl}
        onSave={saveToBackend}
        audioFileName={content.audioFileName}
        setAudio={setAudio}
        clearAudio={clearAudio}
        character1Url={content.character1Url}
        character2Url={content.character2Url}
        bouquetImageUrl={content.bouquetImageUrl}
      />
    </>
  );
}
