import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import {
  DEFAULT_SUBTEXTS,
  type SongItem,
  type SubtextContent,
} from "../hooks/useAnnivContent";
import { DEFAULT_POEMS } from "./GameSection";

const POEM_SLOTS = [
  { id: "pslot-1", pos: 0 },
  { id: "pslot-2", pos: 1 },
  { id: "pslot-3", pos: 2 },
  { id: "pslot-4", pos: 3 },
  { id: "pslot-5", pos: 4 },
  { id: "pslot-6", pos: 5 },
];

const POL_SLOTS = Array.from({ length: 20 }, (_, i) => ({
  id: `polslot-${i}`,
  pos: i,
}));

const SONG_SLOTS = Array.from({ length: 6 }, (_, i) => ({
  id: `songslot-${i}`,
  pos: i,
}));

interface AnnivEditPanelProps {
  isUnlocked: boolean;
  poems: string[];
  onPoemsChange: (poems: string[]) => void;
  boardGameImageUrl: string;
  polaroids: Array<{ src: string; caption: string; rotation: number }>;
  onUploadBoardGame: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  onUploadBenchImage: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  onUploadPolaroid: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  onUpdatePolaroidCaption: (index: number, caption: string) => void;
  onUploadBouquet: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  onSave: () => Promise<void>;
  audioFileName: string;
  setAudio: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  clearAudio: () => void;
  benchImageUrl: string;
  bouquetImageUrl: string;
  treasuresImageUrl: string;
  onUploadTreasures: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  subtexts: SubtextContent;
  onSubtextChange: (key: keyof SubtextContent, value: string) => void;
  songs: SongItem[];
  uploadSongAudio: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  uploadSongCover: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  setSongTitle: (index: number, title: string) => void;
  puzzleImageUrl: string;
  uploadPuzzleImage: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
}

type TabId =
  | "poems"
  | "bouquet"
  | "treasures"
  | "bench"
  | "photos"
  | "music"
  | "songs"
  | "puzzle";

const TAB_LABELS: { id: TabId; label: string }[] = [
  { id: "poems", label: "Poems" },
  { id: "bouquet", label: "Bouquet" },
  { id: "treasures", label: "Treasures" },
  { id: "bench", label: "Bench" },
  { id: "photos", label: "Photos" },
  { id: "music", label: "Music" },
  { id: "songs", label: "Songs" },
  { id: "puzzle", label: "Puzzle" },
];

export const UNLOCK_TAPS = 5;
export const TAP_WINDOW_MS = 3000;

type SaveState = "idle" | "saving" | "saved" | "error";

function readFileAsBytes(
  file: File,
): Promise<{ bytes: Uint8Array<ArrayBuffer>; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      const blob = new Blob([bytes], { type: file.type });
      const previewUrl = URL.createObjectURL(blob);
      resolve({ bytes, previewUrl });
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default function AnnivEditPanel({
  isUnlocked,
  poems,
  onPoemsChange,
  boardGameImageUrl,
  polaroids,
  onUploadBoardGame,
  onUploadBenchImage,
  onUploadPolaroid,
  onUpdatePolaroidCaption,
  onUploadBouquet,
  onSave,
  audioFileName,
  setAudio,
  clearAudio,
  benchImageUrl,
  bouquetImageUrl,
  treasuresImageUrl,
  onUploadTreasures,
  subtexts,
  onSubtextChange,
  songs,
  uploadSongAudio,
  uploadSongCover,
  setSongTitle,
  puzzleImageUrl,
  uploadPuzzleImage,
}: AnnivEditPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("poems");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [audioUploading, setAudioUploading] = useState(false);

  const boardGameInputRef = React.useRef<HTMLInputElement>(null);
  const benchImageInputRef = React.useRef<HTMLInputElement>(null);
  const audioInputRef = React.useRef<HTMLInputElement>(null);
  const bouquetInputRef = React.useRef<HTMLInputElement>(null);
  const treasuresInputRef = React.useRef<HTMLInputElement>(null);
  const puzzleInputRef = React.useRef<HTMLInputElement>(null);
  const polaroidInputRefs = React.useRef<Map<number, HTMLInputElement>>(
    new Map(),
  );
  const songAudioInputRefs = React.useRef<Map<number, HTMLInputElement>>(
    new Map(),
  );
  const songCoverInputRefs = React.useRef<Map<number, HTMLInputElement>>(
    new Map(),
  );
  const saveTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const currentPoems = poems.length === 6 ? poems : [...DEFAULT_POEMS];
  const st = subtexts ?? DEFAULT_SUBTEXTS;

  function updatePoem(index: number, value: string) {
    const updated = [...currentPoems];
    updated[index] = value;
    onPoemsChange(updated);
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (
      bytes: Uint8Array<ArrayBuffer>,
      fileName: string,
      previewUrl: string,
    ) => void,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { bytes, previewUrl } = await readFileAsBytes(file);
    callback(bytes, file.name, previewUrl);
    e.target.value = "";
  }

  async function handlePolaroidUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { bytes, previewUrl } = await readFileAsBytes(file);
    onUploadPolaroid(index, bytes, file.name, previewUrl);
    e.target.value = "";
  }

  function handleAudioFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      const blob = new Blob([bytes], { type: file.type || "audio/mpeg" });
      const previewUrl = URL.createObjectURL(blob);
      setAudio(bytes, file.name, previewUrl);
      setAudioUploading(false);
    };
    reader.onerror = () => setAudioUploading(false);
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }

  async function handleSongAudioUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { bytes, previewUrl } = await readFileAsBytes(file);
    uploadSongAudio(index, bytes, file.name, previewUrl);
    e.target.value = "";
  }

  async function handleSongCoverUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { bytes, previewUrl } = await readFileAsBytes(file);
    uploadSongCover(index, bytes, file.name, previewUrl);
    e.target.value = "";
  }

  async function handleSave() {
    if (saveState === "saving") return;
    setSaveState("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    try {
      await onSave();
      setSaveState("saved");
      saveTimeoutRef.current = setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      saveTimeoutRef.current = setTimeout(() => setSaveState("idle"), 3000);
    }
  }

  const saveButtonLabel =
    saveState === "saving"
      ? "Saving…"
      : saveState === "saved"
        ? "Saved ✓"
        : saveState === "error"
          ? "Error — try again"
          : "Save changes";

  const saveButtonBg =
    saveState === "saved"
      ? "linear-gradient(135deg, #7EC8A0 0%, #5BAA82 100%)"
      : saveState === "error"
        ? "linear-gradient(135deg, #e57373 0%, #c62828 100%)"
        : "linear-gradient(135deg, #6fbf73 0%, #4a9450 100%)";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(111,191,115,0.4)",
    background: "rgba(255,255,255,0.9)",
    fontFamily: "'Lora', Georgia, serif",
    fontSize: "0.82rem",
    color: "#3a5a40",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#7a9e7e",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    display: "block",
    marginBottom: "4px",
  };

  const uploadButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1.5px dashed rgba(111,191,115,0.5)",
    background: "rgba(216,243,220,0.4)",
    fontFamily: "'Lora', Georgia, serif",
    fontSize: "0.82rem",
    color: "#3a5a40",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    transition: "background 0.15s ease",
  };

  const sectionDivider = (
    <div
      style={{
        height: "1px",
        background: "rgba(111,191,115,0.2)",
        margin: "4px 0 8px",
      }}
    />
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(30,60,32,0.25)",
              backdropFilter: "blur(2px)",
              zIndex: 200,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            data-ocid="edit.panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "min(380px, 100vw)",
              background: "rgba(247,255,248,0.98)",
              backdropFilter: "blur(12px)",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
              boxShadow: "4px 0 32px rgba(30,60,32,0.14)",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 20px 16px",
                borderBottom: "1px solid rgba(111,191,115,0.2)",
                position: "sticky",
                top: 0,
                background: "rgba(247,255,248,0.98)",
                zIndex: 2,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "1.5rem",
                  color: "#3a5a40",
                  margin: 0,
                }}
              >
                Edit ✏️
              </h2>
              <button
                type="button"
                data-ocid="edit.close_button"
                onClick={() => setIsOpen(false)}
                aria-label="Close edit panel"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid rgba(111,191,115,0.4)",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5f735f",
                  fontSize: "1.1rem",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Tabs — 2-row grid so all 7 are always visible */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderBottom: "1px solid rgba(111,191,115,0.15)",
                position: "sticky",
                top: "65px",
                background: "rgba(247,255,248,0.98)",
                zIndex: 2,
              }}
            >
              {TAB_LABELS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  data-ocid={`edit.${tab.id}.tab`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "9px 2px",
                    border: "none",
                    background:
                      activeTab === tab.id
                        ? "rgba(111,191,115,0.15)"
                        : "transparent",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.72rem",
                    fontWeight: activeTab === tab.id ? 700 : 400,
                    color: activeTab === tab.id ? "#3a5a40" : "#7a9e7e",
                    cursor: "pointer",
                    borderBottom:
                      activeTab === tab.id
                        ? "2px solid #6fbf73"
                        : "2px solid transparent",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div
              style={{
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* ---- Poems Tab ---- */}
              {activeTab === "poems" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Timer subtext */}
                  <div>
                    <label style={labelStyle} htmlFor="timer-subtext-input">
                      Timer caption
                    </label>
                    <input
                      id="timer-subtext-input"
                      type="text"
                      value={st.timerSubtext}
                      onChange={(e) =>
                        onSubtextChange("timerSubtext", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.timerSubtext}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {sectionDivider}

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Edit the 6 poems — one will appear randomly when the dice is
                    rolled.
                  </p>
                  {POEM_SLOTS.map((slot) => (
                    <div key={slot.id}>
                      <label
                        style={labelStyle}
                        htmlFor={`poem-input-${slot.id}`}
                      >
                        Poem {slot.pos + 1} (dice roll {slot.pos + 1})
                      </label>
                      <textarea
                        id={`poem-input-${slot.id}`}
                        data-ocid="edit.poem.textarea"
                        value={currentPoems[slot.pos] ?? ""}
                        onChange={(e) => updatePoem(slot.pos, e.target.value)}
                        rows={5}
                        style={{ ...inputStyle, lineHeight: 1.6 }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ---- Bouquet Tab ---- */}
              {activeTab === "bouquet" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Subtext fields */}
                  <div>
                    <label style={labelStyle} htmlFor="bouquet-heading-input">
                      Section heading
                    </label>
                    <input
                      id="bouquet-heading-input"
                      type="text"
                      value={st.bouquetHeading}
                      onChange={(e) =>
                        onSubtextChange("bouquetHeading", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.bouquetHeading}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="bouquet-subtext-input">
                      Subtitle
                    </label>
                    <input
                      id="bouquet-subtext-input"
                      type="text"
                      value={st.bouquetSubtext}
                      onChange={(e) =>
                        onSubtextChange("bouquetSubtext", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.bouquetSubtext}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {sectionDivider}

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload your own bouquet photo (PNG with transparent
                    background works best ✨)
                  </p>

                  <input
                    ref={bouquetInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, onUploadBouquet)}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    data-ocid="edit.bouquet.upload_button"
                    onClick={() => bouquetInputRef.current?.click()}
                    style={{ ...uploadButtonStyle, padding: "16px" }}
                  >
                    {bouquetImageUrl ? (
                      <>
                        <img
                          src={bouquetImageUrl}
                          alt="Current bouquet"
                          style={{
                            width: "60px",
                            height: "80px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                        Replace bouquet photo
                      </>
                    ) : (
                      <>🌸 Upload bouquet photo</>
                    )}
                  </button>

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.72rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    After uploading, tap Save changes so it appears when others
                    view the page.
                  </p>
                </div>
              )}

              {/* ---- Treasures Tab ---- */}
              {activeTab === "treasures" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Subtext fields */}
                  <div>
                    <label style={labelStyle} htmlFor="treasures-heading-input">
                      Section heading
                    </label>
                    <input
                      id="treasures-heading-input"
                      type="text"
                      value={st.treasuresHeading}
                      onChange={(e) =>
                        onSubtextChange("treasuresHeading", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.treasuresHeading}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="treasures-subtext-input">
                      Subtitle
                    </label>
                    <input
                      id="treasures-subtext-input"
                      type="text"
                      value={st.treasuresSubtext}
                      onChange={(e) =>
                        onSubtextChange("treasuresSubtext", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.treasuresSubtext}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {sectionDivider}

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload your own photo for the Little Treasures section ✨
                  </p>

                  <input
                    ref={treasuresInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, onUploadTreasures)}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    data-ocid="edit.treasures.upload_button"
                    onClick={() => treasuresInputRef.current?.click()}
                    style={{ ...uploadButtonStyle, padding: "16px" }}
                  >
                    {treasuresImageUrl ? (
                      <>
                        <img
                          src={treasuresImageUrl}
                          alt="Current treasures"
                          style={{
                            width: "80px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        Replace treasures photo
                      </>
                    ) : (
                      <>🧶 Upload treasures photo</>
                    )}
                  </button>

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.72rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    After uploading, tap Save changes so it appears when others
                    view the page.
                  </p>
                </div>
              )}

              {/* ---- Bench Tab ---- */}
              {activeTab === "bench" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Bench caption */}
                  <div>
                    <label style={labelStyle} htmlFor="bench-caption-input">
                      Bench caption
                    </label>
                    <input
                      id="bench-caption-input"
                      type="text"
                      value={st.benchCaption}
                      onChange={(e) =>
                        onSubtextChange("benchCaption", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.benchCaption}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {sectionDivider}

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload a photo of you two on the bench
                  </p>

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.72rem",
                      color: "#7a9e7e",
                      margin: "-8px 0 0",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    Upload a photo with both of you — it’ll be displayed large
                    and centred on the bench scene ✨
                  </p>

                  <input
                    ref={benchImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, onUploadBenchImage)}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    data-ocid="edit.bench.upload_button"
                    onClick={() => benchImageInputRef.current?.click()}
                    style={{ ...uploadButtonStyle, padding: "16px" }}
                  >
                    {benchImageUrl ? (
                      <>
                        <img
                          src={benchImageUrl}
                          alt="Current bench"
                          style={{
                            width: "72px",
                            height: "56px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        Replace bench photo
                      </>
                    ) : (
                      <>🪑 Upload bench photo</>
                    )}
                  </button>

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.72rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    After uploading, tap Save changes so it appears when others
                    view the page.
                  </p>
                </div>
              )}

              {/* ---- Photos Tab ---- */}
              {activeTab === "photos" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* Game heading */}
                  <div>
                    <label style={labelStyle} htmlFor="game-heading-input">
                      Game section heading
                    </label>
                    <input
                      id="game-heading-input"
                      type="text"
                      value={st.gameHeading}
                      onChange={(e) =>
                        onSubtextChange("gameHeading", e.target.value)
                      }
                      placeholder={DEFAULT_SUBTEXTS.gameHeading}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  {sectionDivider}

                  {/* Board game photo */}
                  <div>
                    <p
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: "#3a5a40",
                        margin: "0 0 8px 0",
                      }}
                    >
                      Board game photo
                    </p>
                    <input
                      ref={boardGameInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, onUploadBoardGame)}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      data-ocid="edit.boardgame.upload_button"
                      onClick={() => boardGameInputRef.current?.click()}
                      style={uploadButtonStyle}
                    >
                      {boardGameImageUrl ? (
                        <>
                          <img
                            src={boardGameImageUrl}
                            alt=""
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                          Replace photo
                        </>
                      ) : (
                        <>📷 Upload board game photo</>
                      )}
                    </button>
                  </div>

                  {/* Polaroid photos */}
                  <div>
                    <p
                      style={{
                        fontFamily: "'Lora', Georgia, serif",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        color: "#3a5a40",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Polaroid photos (20 slots — 10 per string)
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {POL_SLOTS.map((slot) => {
                        const p = polaroids[slot.pos] ?? {
                          src: "",
                          caption: "",
                          rotation: 0,
                        };
                        return (
                          <div
                            key={slot.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "8px 10px",
                              background: "rgba(216,243,220,0.35)",
                              borderRadius: "10px",
                              border: "1px solid rgba(111,191,115,0.2)",
                            }}
                          >
                            <input
                              ref={(el) => {
                                if (el)
                                  polaroidInputRefs.current.set(slot.pos, el);
                                else polaroidInputRefs.current.delete(slot.pos);
                              }}
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handlePolaroidUpload(e, slot.pos)
                              }
                              style={{ display: "none" }}
                            />
                            <button
                              type="button"
                              data-ocid="edit.polaroid.upload_button"
                              onClick={() =>
                                polaroidInputRefs.current.get(slot.pos)?.click()
                              }
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                flexShrink: 0,
                                background: p.src
                                  ? "transparent"
                                  : "rgba(111,191,115,0.15)",
                                border: "1.5px dashed rgba(111,191,115,0.4)",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {p.src ? (
                                <img
                                  src={p.src}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <span style={{ fontSize: "1rem" }}>+</span>
                              )}
                            </button>
                            <input
                              type="text"
                              value={p.caption}
                              onChange={(e) =>
                                onUpdatePolaroidCaption(
                                  slot.pos,
                                  e.target.value,
                                )
                              }
                              placeholder={`Caption ${slot.pos + 1}`}
                              style={{
                                ...inputStyle,
                                fontSize: "0.76rem",
                                padding: "6px 10px",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ---- Music Tab ---- */}
              {activeTab === "music" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload an MP3 — it will autoplay when the page opens ♪
                  </p>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFile}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    data-ocid="edit.music.upload_button"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={audioUploading}
                    style={{ ...uploadButtonStyle, padding: "14px 20px" }}
                  >
                    {audioUploading
                      ? "Loading…"
                      : audioFileName
                        ? "Replace song"
                        : "♯  Choose audio file"}
                  </button>
                  {audioFileName && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        background: "rgba(216,243,220,0.4)",
                        borderRadius: "10px",
                        border: "1px solid rgba(111,191,115,0.2)",
                      }}
                    >
                      <span>🎵</span>
                      <span
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.8rem",
                          color: "#3a5a40",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {audioFileName}
                      </span>
                      <button
                        type="button"
                        data-ocid="edit.music.delete_button"
                        onClick={clearAudio}
                        aria-label="Remove audio"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#7a9e7e",
                          fontSize: "1rem",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ---- Songs Tab ---- */}
              {activeTab === "songs" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload audio and a cover image for each of the 6 vinyl
                    players ♪
                  </p>
                  {SONG_SLOTS.map(({ id: songSlotId, pos: i }) => (
                    <div
                      key={songSlotId}
                      style={{
                        padding: "14px",
                        background: "rgba(216,243,220,0.35)",
                        borderRadius: "12px",
                        border: "1px solid rgba(111,191,115,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                          color: "#3a5a40",
                          margin: 0,
                        }}
                      >
                        Vinyl {i + 1}
                      </p>

                      {/* Title input */}
                      <input
                        type="text"
                        value={songs[i]?.title || ""}
                        onChange={(e) => setSongTitle(i, e.target.value)}
                        placeholder={`Song ${i + 1} title`}
                        style={{
                          ...inputStyle,
                          fontSize: "0.8rem",
                          resize: "none",
                        }}
                      />

                      {/* Audio upload */}
                      <input
                        ref={(el) => {
                          if (el) songAudioInputRefs.current.set(i, el);
                          else songAudioInputRefs.current.delete(i);
                        }}
                        type="file"
                        accept="audio/*,video/mp4"
                        onChange={(e) => handleSongAudioUpload(e, i)}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        data-ocid={`vinyl.song.upload_button.${i + 1}`}
                        onClick={() =>
                          songAudioInputRefs.current.get(i)?.click()
                        }
                        style={{
                          ...uploadButtonStyle,
                          justifyContent: "flex-start",
                          padding: "10px 12px",
                          fontSize: "0.78rem",
                        }}
                      >
                        {songs[i]?.audioUrl
                          ? "🎵 Replace audio"
                          : "🎵 Upload audio (mp3/mp4)"}
                      </button>

                      {/* Cover upload */}
                      <input
                        ref={(el) => {
                          if (el) songCoverInputRefs.current.set(i, el);
                          else songCoverInputRefs.current.delete(i);
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSongCoverUpload(e, i)}
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        data-ocid={`vinyl.cover.upload_button.${i + 1}`}
                        onClick={() =>
                          songCoverInputRefs.current.get(i)?.click()
                        }
                        style={{
                          ...uploadButtonStyle,
                          justifyContent: "flex-start",
                          padding: "10px 12px",
                          fontSize: "0.78rem",
                        }}
                      >
                        {songs[i]?.coverUrl ? (
                          <>
                            <img
                              src={songs[i].coverUrl}
                              alt=""
                              style={{
                                width: "32px",
                                height: "32px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginRight: "8px",
                              }}
                            />
                            Replace cover
                          </>
                        ) : (
                          "🖼️ Upload cover image"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ---- Puzzle Tab ---- */}
              {activeTab === "puzzle" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#3a5a40",
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    Puzzle Image
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.6,
                    }}
                  >
                    Upload the image that will be used as the puzzle. A square
                    photo works best ✨
                  </p>

                  <input
                    ref={puzzleInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, uploadPuzzleImage)}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    data-ocid="edit.puzzle.upload_button"
                    onClick={() => puzzleInputRef.current?.click()}
                    style={{ ...uploadButtonStyle, padding: "16px" }}
                  >
                    {puzzleImageUrl ? (
                      <>
                        <img
                          src={puzzleImageUrl}
                          alt="Current puzzle"
                          style={{
                            width: "72px",
                            height: "72px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        Replace puzzle photo
                      </>
                    ) : (
                      <>🧩 Upload puzzle photo</>
                    )}
                  </button>

                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.72rem",
                      color: "#7a9e7e",
                      margin: 0,
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    After uploading, tap Save changes so it appears when others
                    view the page.
                  </p>
                </div>
              )}
            </div>

            {/* Save button */}
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid rgba(111,191,115,0.2)",
                position: "sticky",
                bottom: 0,
                background: "rgba(247,255,248,0.98)",
                zIndex: 2,
              }}
            >
              <button
                type="button"
                data-ocid="edit.save_button"
                onClick={handleSave}
                disabled={saveState === "saving"}
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: saveButtonBg,
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#fff",
                  cursor: saveState === "saving" ? "wait" : "pointer",
                  boxShadow: "0 3px 16px rgba(63,90,58,0.25)",
                  transition: "transform 0.15s ease",
                }}
              >
                {saveButtonLabel}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating open button */}
      {isUnlocked && (
        <button
          type="button"
          data-ocid="edit.open_modal_button"
          onClick={() => setIsOpen(true)}
          title="Edit anniversary card"
          aria-label="Open edit panel"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6fbf73 0%, #4a9450 100%)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(63,90,58,0.28)",
            zIndex: 100,
            color: "#fff",
            fontSize: "1.2rem",
            animation: "fadeIn 1s ease 2s both",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✏️
        </button>
      )}
    </>
  );
}
