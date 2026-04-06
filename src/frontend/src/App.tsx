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
import RibbonDivider from "./components/RibbonDivider";
import SlidePuzzle from "./components/SlidePuzzle";
import StarCanvas from "./components/StarCanvas";
import VinylSection from "./components/VinylSection";
import { useAnnivContent } from "./hooks/useAnnivContent";

const DISPLAYED_DATE = "08/04/2026";

export default function App() {
  const currentYear = new Date().getFullYear();
  const {
    content,
    setPoems,
    setSubtext,
    uploadBoardGame,
    uploadBenchImage,
    uploadPolaroid,
    updatePolaroidCaption,
    uploadBouquet,
    uploadTreasures,
    setAudio,
    clearAudio,
    uploadSongAudio,
    uploadSongCover,
    setSongTitle,
    uploadPuzzleImage,
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

        <LiveTimer subtext={content.subtexts.timerSubtext} />
        <BouquetSection
          bouquetImageUrl={content.bouquetImageUrl}
          heading={content.subtexts.bouquetHeading}
          subtext={content.subtexts.bouquetSubtext}
        />
        <FenceDivider />
        <GameSection
          boardGameImageUrl={content.boardGameImageUrl}
          onUploadBoardGame={uploadBoardGame}
          poems={content.poems}
          onPoemsChange={setPoems}
          heading={content.subtexts.gameHeading}
        />
        <BenchScene
          benchImageUrl={content.benchImageUrl}
          caption={content.subtexts.benchCaption}
        />
        <MemoryBed
          treasuresImageUrl={content.treasuresImageUrl}
          heading={content.subtexts.treasuresHeading}
          subtext={content.subtexts.treasuresSubtext}
        />
        <OrnamDivider />
        <PolaroidGallery2
          polaroids={content.polaroids}
          onUpload={uploadPolaroid}
          editMode={editUnlocked}
        />
        <VinylSection songs={content.songs} editMode={editUnlocked} />
        <RibbonDivider />
        <SlidePuzzle puzzleImageUrl={content.puzzleImageUrl} />
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
        onUploadBenchImage={uploadBenchImage}
        onUploadPolaroid={uploadPolaroid}
        onUpdatePolaroidCaption={updatePolaroidCaption}
        onUploadBouquet={uploadBouquet}
        onUploadTreasures={uploadTreasures}
        treasuresImageUrl={content.treasuresImageUrl}
        onSave={saveToBackend}
        audioFileName={content.audioFileName}
        setAudio={setAudio}
        clearAudio={clearAudio}
        benchImageUrl={content.benchImageUrl}
        bouquetImageUrl={content.bouquetImageUrl}
        subtexts={content.subtexts}
        onSubtextChange={setSubtext}
        songs={content.songs}
        uploadSongAudio={uploadSongAudio}
        uploadSongCover={uploadSongCover}
        setSongTitle={setSongTitle}
        puzzleImageUrl={content.puzzleImageUrl}
        uploadPuzzleImage={uploadPuzzleImage}
      />
    </>
  );
}
