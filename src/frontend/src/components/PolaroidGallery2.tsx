import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface PolaroidData {
  src: string;
  caption: string;
  rotation: number;
}

interface PolaroidGallery2Props {
  polaroids: PolaroidData[];
  onUpload?: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  editMode?: boolean;
}

// Wood clip SVG — scales with card width
function WoodClip({ size = 24 }: { size?: number }) {
  return (
    <svg
      className="wood-clip"
      viewBox="0 0 20 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: size, height: Math.round(size * 1.4), flexShrink: 0 }}
    >
      <rect x="7" y="0" width="6" height="18" rx="3" fill="#8B6914" />
      <rect x="6" y="6" width="8" height="3" rx="1" fill="#6B4F10" />
      <rect x="7" y="0" width="6" height="8" rx="3" fill="#A07820" />
    </svg>
  );
}

// Pre-computed delay values
const LIGHT_DELAYS_9 = [0, 0.22, 0.44, 0.66, 0.88, 1.1, 1.32, 1.54, 1.76];
const LIGHT_IDS_9 = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9"];

// Fairy lights along a thread line
function FairyLights() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "6px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {LIGHT_IDS_9.map((id, pos) => (
        <span
          key={id}
          className="fairy-light"
          style={{ animationDelay: `${LIGHT_DELAYS_9[pos]}s` }}
        />
      ))}
    </div>
  );
}

const PLACEHOLDER_COLORS = [
  "#c5e8c7",
  "#b8dfc0",
  "#ccebd0",
  "#bfe4c5",
  "#d2edd5",
  "#c0e6c8",
  "#b5dcbc",
  "#cbe9cf",
  "#bde2c3",
  "#d0ecda",
];

const CARD_GAP = 12;
const VISIBLE = 4;
// Horizontal padding on each side inside the polaroid frame (from .polaroid-card padding: 8px 8px 36px 8px)
const POLAROID_PADDING_H = 8; // 8px left + 8px right = 16px total

function PolaroidCard({
  src,
  caption,
  rotation,
  index,
  cardWidth,
  onUpload,
  editMode,
}: {
  src: string;
  caption: string;
  rotation: number;
  index: number;
  cardWidth: number;
  onUpload?: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  editMode?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Photo area must fit INSIDE the polaroid padding, so subtract the horizontal padding
  const photoSize = cardWidth - POLAROID_PADDING_H * 2;
  const clipSize = Math.max(14, Math.round(cardWidth * 0.18));
  const captionFontSize = `${Math.max(0.55, cardWidth * 0.007)}rem`;

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;
    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      const blob = new Blob([bytes], { type: file.type });
      const previewUrl = URL.createObjectURL(blob);
      onUpload(index, bytes, file.name, previewUrl);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        width: `${cardWidth}px`,
      }}
    >
      <WoodClip size={clipSize} />
      <motion.div
        className="polaroid-card"
        data-ocid={`polaroid.item.${index + 1}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "top center",
          width: `${cardWidth}px`,
          boxSizing: "border-box",
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={editMode ? () => fileInputRef.current?.click() : undefined}
      >
        {editMode && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
            aria-label={`Upload polaroid ${index + 1}`}
          />
        )}
        {/* Photo area — square, sized to fit within the polaroid padding */}
        <div
          style={{
            width: `${photoSize}px`,
            height: `${photoSize}px`,
            background: src
              ? undefined
              : PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length],
            overflow: "hidden",
            position: "relative",
          }}
        >
          {src ? (
            <img
              src={src}
              alt={caption || `Memory ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {editMode ? (
                <>
                  <span style={{ fontSize: "1.2rem" }}>📷</span>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "#5f735f",
                      fontStyle: "italic",
                    }}
                  >
                    tap to add
                  </span>
                </>
              ) : (
                <span style={{ fontSize: "1.2rem", opacity: 0.4 }}>🌿</span>
              )}
            </div>
          )}
        </div>
        {/* Caption — fills the padded content width */}
        <div
          style={{
            width: "100%",
            paddingTop: "4px",
            fontFamily: "'Great Vibes', cursive",
            fontSize: captionFontSize,
            color: "#5f735f",
            textAlign: "center",
            lineHeight: 1.3,
            minHeight: "20px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {caption}
        </div>
      </motion.div>
    </div>
  );
}

const DEFAULT_ROT_10 = [-4, 3, -2, 5, -3, 3, -5, 2, -3, 4];

// Pre-computed stable keys for 10 card slots and 7 dot positions
const CARD_SLOT_IDS_0 = [
  "s0c0",
  "s0c1",
  "s0c2",
  "s0c3",
  "s0c4",
  "s0c5",
  "s0c6",
  "s0c7",
  "s0c8",
  "s0c9",
];
const CARD_SLOT_IDS_10 = [
  "s1c0",
  "s1c1",
  "s1c2",
  "s1c3",
  "s1c4",
  "s1c5",
  "s1c6",
  "s1c7",
  "s1c8",
  "s1c9",
];
const DOT_IDS_0 = ["d0-0", "d0-1", "d0-2", "d0-3", "d0-4", "d0-5", "d0-6"];
const DOT_IDS_10 = ["d1-0", "d1-1", "d1-2", "d1-3", "d1-4", "d1-5", "d1-6"];

// A single swipeable string of 10 polaroids showing 4 at a time
function PolaroidString({
  startIndex,
  cardIds,
  dotIds,
  polaroids,
  onUpload,
  editMode,
}: {
  startIndex: number;
  cardIds: string[];
  dotIds: string[];
  polaroids: PolaroidData[];
  onUpload?: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  editMode?: boolean;
}) {
  const [page, setPage] = useState(0);
  const totalSlots = 10;
  const maxPage = totalSlots - VISIBLE; // 6 pages (indices 0..6)

  // Measure the available width for the card viewport
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      // Account for the two arrow buttons (32px each) and gaps (12px each side)
      const arrowsAndGaps = 32 * 2 + 12 * 2;
      const available = el.getBoundingClientRect().width - arrowsAndGaps;
      setContainerWidth(Math.max(available, 0));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // cardWidth = (viewportWidth - 3 gaps) / 4
  const cardWidth =
    containerWidth > 0
      ? Math.floor((containerWidth - (VISIBLE - 1) * CARD_GAP) / VISIBLE)
      : 100; // safe fallback until measured

  const stride = cardWidth + CARD_GAP;
  const viewportWidth = VISIBLE * stride - CARD_GAP;
  const offsetX = -(page * stride);

  // Touch / pointer drag tracking
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
  }

  function onPointerUp() {
    if (dragStartX.current === null) return;
    const delta = dragDelta.current;
    const threshold = 40;
    if (delta < -threshold) {
      setPage((p) => Math.min(p + 1, maxPage));
    } else if (delta > threshold) {
      setPage((p) => Math.max(p - 1, 0));
    }
    dragStartX.current = null;
    dragDelta.current = 0;
    setDragging(false);
  }

  function prev() {
    setPage((p) => Math.max(p - 1, 0));
  }
  function next() {
    setPage((p) => Math.min(p + 1, maxPage));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      style={{ marginBottom: "48px", position: "relative" }}
    >
      {/* Thread with fairy lights */}
      <div style={{ position: "relative", height: "20px", marginBottom: "0" }}>
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "5%",
            right: "5%",
            height: "2px",
            background:
              "linear-gradient(90deg, rgba(139,105,20,0.3) 0%, rgba(139,105,20,0.6) 50%, rgba(139,105,20,0.3) 100%)",
            borderRadius: "1px",
          }}
        />
        <FairyLights />
      </div>

      {/* Swipeable viewport — full width row with arrows */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* Left arrow */}
        <button
          type="button"
          aria-label="Previous polaroids"
          onClick={prev}
          disabled={page === 0}
          data-ocid="polaroid.pagination_prev"
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1.5px solid rgba(111,191,115,0.5)",
            background:
              page === 0 ? "rgba(216,243,220,0.3)" : "rgba(216,243,220,0.8)",
            cursor: page === 0 ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: page === 0 ? "rgba(90,138,96,0.3)" : "#3a5a40",
            transition: "all 0.2s ease",
            boxShadow: page === 0 ? "none" : "0 2px 8px rgba(58,90,64,0.15)",
          }}
        >
          ‹
        </button>

        {/* Clipping window — fills remaining space */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            cursor: dragging ? "grabbing" : "grab",
            // Explicit pixel width only after we've measured
            width: containerWidth > 0 ? `${viewportWidth}px` : undefined,
            maxWidth: "100%",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Sliding track — all 10 cards side by side */}
          <motion.div
            style={{
              display: "flex",
              gap: `${CARD_GAP}px`,
              userSelect: "none",
            }}
            animate={{ x: offsetX }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            {cardIds.map((cid, i) => {
              const globalIdx = startIndex + i;
              const p = polaroids[globalIdx] ?? {
                src: "",
                caption: "",
                rotation: 0,
              };
              return (
                <PolaroidCard
                  key={cid}
                  src={p.src}
                  caption={p.caption}
                  rotation={p.rotation || DEFAULT_ROT_10[i % 10]}
                  index={globalIdx}
                  cardWidth={cardWidth}
                  onUpload={onUpload}
                  editMode={editMode}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          aria-label="Next polaroids"
          onClick={next}
          disabled={page >= maxPage}
          data-ocid="polaroid.pagination_next"
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1.5px solid rgba(111,191,115,0.5)",
            background:
              page >= maxPage
                ? "rgba(216,243,220,0.3)"
                : "rgba(216,243,220,0.8)",
            cursor: page >= maxPage ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: page >= maxPage ? "rgba(90,138,96,0.3)" : "#3a5a40",
            transition: "all 0.2s ease",
            boxShadow:
              page >= maxPage ? "none" : "0 2px 8px rgba(58,90,64,0.15)",
          }}
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          marginTop: "12px",
        }}
      >
        {dotIds.map((did, i) => (
          <button
            key={did}
            type="button"
            aria-label={`Go to position ${i + 1}`}
            onClick={() => setPage(i)}
            style={{
              width: page === i ? "16px" : "6px",
              height: "6px",
              borderRadius: "3px",
              border: "none",
              background: page === i ? "#5a8a60" : "rgba(90,138,96,0.3)",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function PolaroidGallery2({
  polaroids,
  onUpload,
  editMode = false,
}: PolaroidGallery2Props) {
  // Ensure we have at least 20 slots (2 strings × 10 each)
  const paddedPolaroids = [...polaroids];
  while (paddedPolaroids.length < 20) {
    paddedPolaroids.push({ src: "", caption: "", rotation: 0 });
  }

  return (
    <section
      data-ocid="polaroid.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "32px 16px 48px",
        // Prevent any horizontal overflow from this section
        overflow: "hidden",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
          color: "#3a5a40",
          textAlign: "center",
          margin: "0 0 32px 0",
        }}
      >
        moments we collected
      </motion.h2>

      {/* String 1 — polaroids 0-9 */}
      <PolaroidString
        startIndex={0}
        cardIds={CARD_SLOT_IDS_0}
        dotIds={DOT_IDS_0}
        polaroids={paddedPolaroids}
        onUpload={onUpload}
        editMode={editMode}
      />

      {/* String 2 — polaroids 10-19 */}
      <PolaroidString
        startIndex={10}
        cardIds={CARD_SLOT_IDS_10}
        dotIds={DOT_IDS_10}
        polaroids={paddedPolaroids}
        onUpload={onUpload}
        editMode={editMode}
      />
    </section>
  );
}
