import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import type {
  GalleryPhotoData,
  LoveCardData,
} from "../hooks/useEditableContent";

interface EditPanelProps {
  isUnlocked: boolean;
  letterText: string;
  loveCards: LoveCardData[];
  galleryPhotos: GalleryPhotoData[];
  spotifyUrl: string;
  audioFileName: string;
  setLetterText: (text: string) => void;
  setLoveCards: (cards: LoveCardData[]) => void;
  setGalleryPhotos: (photos: GalleryPhotoData[]) => void;
  setSpotifyUrl: (url: string) => void;
  setAudio: (dataUrl: string, fileName: string) => void;
  clearAudio: () => void;
}

type TabId = "letter" | "cards" | "music" | "gallery";

const TAB_LABELS: { id: TabId; label: string }[] = [
  { id: "letter", label: "Letter" },
  { id: "cards", label: "Cards" },
  { id: "music", label: "Music" },
  { id: "gallery", label: "Gallery" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid rgba(244,167,185,0.4)",
  background: "rgba(255,252,248,0.9)",
  fontFamily: "'Lora', Georgia, serif",
  fontSize: "0.82rem",
  color: "var(--color-text)",
  outline: "none",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Lora', Georgia, serif",
  fontSize: "0.72rem",
  fontWeight: 600,
  color: "var(--color-text-light)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  display: "block",
  marginBottom: "4px",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "'Dancing Script', cursive",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: "#D47A91",
  margin: "0 0 12px 0",
};

export default function EditPanel({
  isUnlocked,
  letterText,
  loveCards,
  galleryPhotos,
  audioFileName,
  setLetterText,
  setLoveCards,
  setGalleryPhotos,
  setAudio,
  clearAudio,
}: EditPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("letter");
  const [audioUploading, setAudioUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleAudioFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAudio(reader.result as string, file.name);
      setAudioUploading(false);
    };
    reader.onerror = () => setAudioUploading(false);
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  if (!isUnlocked) return null;

  const updateCard = (
    cardIndex: number,
    field: keyof LoveCardData,
    value: string,
  ) => {
    const updated = loveCards.map((card, i) => {
      if (i !== cardIndex) return card;
      return { ...card, [field]: value };
    });
    setLoveCards(updated);
  };

  const updateCardPhoto = (
    cardIndex: number,
    photoIndex: number,
    src: string,
  ) => {
    const updated = loveCards.map((card, i) => {
      if (i !== cardIndex) return card;
      const newPhotos = card.photos.map((p, pi) =>
        pi === photoIndex ? { ...p, src } : p,
      );
      return { ...card, photos: newPhotos };
    });
    setLoveCards(updated);
  };

  const updateGalleryPhoto = (
    photoIndex: number,
    field: "src" | "caption",
    value: string,
  ) => {
    const updated = galleryPhotos.map((p, i) =>
      i === photoIndex ? { ...p, [field]: value } : p,
    );
    setGalleryPhotos(updated);
  };

  return (
    <>
      {/* Overlay */}
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
              background: "rgba(92,74,90,0.18)",
              backdropFilter: "blur(2px)",
              zIndex: 200,
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
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
              width: "min(360px, 100vw)",
              background: "rgba(255,252,248,0.98)",
              backdropFilter: "blur(12px)",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
              boxShadow: "4px 0 32px rgba(92,74,90,0.12)",
              overflowY: "auto",
            }}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 20px 16px",
                borderBottom: "1px solid rgba(244,167,185,0.2)",
                position: "sticky",
                top: 0,
                background: "rgba(255,252,248,0.98)",
                zIndex: 1,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#D47A91",
                  margin: 0,
                }}
              >
                Customise ✏️
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
                  border: "1px solid rgba(244,167,185,0.4)",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-light)",
                  fontSize: "1.1rem",
                  lineHeight: 1,
                  transition: "background 0.15s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(244,167,185,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid rgba(244,167,185,0.15)",
                padding: "0 20px",
                gap: "4px",
                position: "sticky",
                top: "65px",
                background: "rgba(255,252,248,0.98)",
                zIndex: 1,
              }}
            >
              {TAB_LABELS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  data-ocid={
                    tab.id === "cards"
                      ? "edit.cards.tab"
                      : tab.id === "gallery"
                        ? "edit.gallery.tab"
                        : undefined
                  }
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "10px 14px",
                    border: "none",
                    background: "transparent",
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.8rem",
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    color:
                      activeTab === tab.id
                        ? "#D47A91"
                        : "var(--color-text-light)",
                    cursor: "pointer",
                    borderBottom:
                      activeTab === tab.id
                        ? "2px solid #D47A91"
                        : "2px solid transparent",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                    whiteSpace: "nowrap",
                    marginBottom: "-1px",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ padding: "20px", flex: 1 }}>
              {/* Letter Tab */}
              {activeTab === "letter" && (
                <div>
                  <p style={{ ...labelStyle, marginBottom: "8px" }}>
                    Each paragraph separated by a blank line
                  </p>
                  <textarea
                    data-ocid="edit.letter.textarea"
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value)}
                    rows={14}
                    placeholder="Write your love letter here…&#10;&#10;Each paragraph separated by a blank line."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.7,
                      minHeight: "280px",
                    }}
                  />
                </div>
              )}

              {/* Cards Tab */}
              {activeTab === "cards" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {loveCards.map((card, i) => (
                    <div
                      key={card.title || i}
                      style={{
                        padding: "14px",
                        background: "rgba(244,167,185,0.06)",
                        borderRadius: "12px",
                        border: "1px solid rgba(244,167,185,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <p style={sectionHeadingStyle}>Card {i + 1}</p>
                      <div>
                        <label style={labelStyle} htmlFor={`card-title-${i}`}>
                          Title
                        </label>
                        <input
                          id={`card-title-${i}`}
                          type="text"
                          value={card.title}
                          onChange={(e) =>
                            updateCard(i, "title", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle} htmlFor={`card-desc-${i}`}>
                          Description
                        </label>
                        <textarea
                          id={`card-desc-${i}`}
                          value={card.description}
                          onChange={(e) =>
                            updateCard(i, "description", e.target.value)
                          }
                          rows={3}
                          style={{ ...inputStyle, resize: "vertical" }}
                        />
                      </div>
                      {card.photos.slice(0, 2).map((photo, pi) => (
                        <div key={photo.src || `photo-url-${pi}`}>
                          <label
                            style={labelStyle}
                            htmlFor={`card-${i}-photo-${pi}`}
                          >
                            Photo {pi + 1} URL
                          </label>
                          <input
                            id={`card-${i}-photo-${pi}`}
                            type="text"
                            value={photo.src}
                            onChange={(e) =>
                              updateCardPhoto(i, pi, e.target.value)
                            }
                            placeholder="https://..."
                            style={inputStyle}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Music Tab */}
              {activeTab === "music" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <p style={sectionHeadingStyle}>Background Music</p>
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.78rem",
                      color: "var(--color-text-light)",
                      margin: 0,
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    Upload an MP3 or audio file — it will play automatically
                    when your love card opens ♪
                  </p>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFile}
                    style={{ display: "none" }}
                    aria-label="Upload audio file"
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    data-ocid="edit.music.upload_button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={audioUploading}
                    style={{
                      padding: "12px 20px",
                      borderRadius: "10px",
                      border: "1.5px dashed rgba(244,167,185,0.6)",
                      background: "rgba(244,167,185,0.06)",
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.85rem",
                      color: "#D47A91",
                      cursor: audioUploading ? "wait" : "pointer",
                      transition:
                        "background 0.2s ease, border-color 0.2s ease",
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={(e) => {
                      if (!audioUploading)
                        e.currentTarget.style.background =
                          "rgba(244,167,185,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(244,167,185,0.06)";
                    }}
                  >
                    {audioUploading
                      ? "Loading…"
                      : audioFileName
                        ? "Replace song"
                        : "♫  Choose audio file"}
                  </button>

                  {/* Current file status */}
                  {audioFileName && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        background: "rgba(244,167,185,0.08)",
                        borderRadius: "10px",
                        border: "1px solid rgba(244,167,185,0.22)",
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>🎵</span>
                      <span
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.8rem",
                          color: "var(--color-text)",
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
                          color: "var(--color-text-light)",
                          fontSize: "1rem",
                          lineHeight: 1,
                          padding: "2px 4px",
                          borderRadius: "4px",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#D47A91";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "var(--color-text-light)";
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Gallery Tab */}
              {activeTab === "gallery" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <p style={sectionHeadingStyle}>Gallery Photos</p>
                  {galleryPhotos.map((photo, i) => (
                    <div
                      key={photo.src || `gallery-${photo.caption}-${i}`}
                      style={{
                        padding: "12px",
                        background: "rgba(244,167,185,0.06)",
                        borderRadius: "10px",
                        border: "1px solid rgba(244,167,185,0.18)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <p
                        style={{
                          ...sectionHeadingStyle,
                          fontSize: "0.95rem",
                          margin: "0 0 6px 0",
                        }}
                      >
                        Photo {i + 1}
                      </p>
                      <div>
                        <label style={labelStyle} htmlFor={`gallery-src-${i}`}>
                          Photo URL
                        </label>
                        <input
                          id={`gallery-src-${i}`}
                          type="text"
                          value={photo.src}
                          onChange={(e) =>
                            updateGalleryPhoto(i, "src", e.target.value)
                          }
                          placeholder="https://..."
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label
                          style={labelStyle}
                          htmlFor={`gallery-caption-${i}`}
                        >
                          Caption
                        </label>
                        <input
                          id={`gallery-caption-${i}`}
                          type="text"
                          value={photo.caption}
                          onChange={(e) =>
                            updateGalleryPhoto(i, "caption", e.target.value)
                          }
                          placeholder="a sweet memory"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating open button */}
      <button
        type="button"
        data-ocid="edit.open_modal_button"
        onClick={() => setIsOpen(true)}
        title="Edit this love card"
        aria-label="Open edit panel"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #C9B8D8 0%, #A894C0 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 20px rgba(201,184,216,0.5), 0 2px 8px rgba(0,0,0,0.1)",
          zIndex: 100,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          color: "#fff",
          fontSize: "1.2rem",
          lineHeight: 1,
          animation: "fadeIn 1s ease 2s both",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 6px 28px rgba(201,184,216,0.65), 0 3px 10px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 4px 20px rgba(201,184,216,0.5), 0 2px 8px rgba(0,0,0,0.1)";
        }}
      >
        ✏️
      </button>
    </>
  );
}
