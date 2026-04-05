import { motion } from "motion/react";
import { useRef } from "react";

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

// Wood clip SVG
function WoodClip() {
  return (
    <svg
      className="wood-clip"
      viewBox="0 0 20 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="7" y="0" width="6" height="18" rx="3" fill="#8B6914" />
      <rect x="6" y="6" width="8" height="3" rx="1" fill="#6B4F10" />
      <rect x="7" y="0" width="6" height="8" rx="3" fill="#A07820" />
    </svg>
  );
}

// Pre-computed delay values avoid array index in JSX key
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

function PolaroidCard({
  src,
  caption,
  rotation,
  index,
  onUpload,
  editMode,
}: {
  src: string;
  caption: string;
  rotation: number;
  index: number;
  onUpload?: (
    index: number,
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  editMode?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <WoodClip />
      <motion.div
        className="polaroid-card"
        data-ocid={`polaroid.item.${index + 1}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "top center",
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
        <div
          style={{
            width: "130px",
            height: "130px",
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
                  <span style={{ fontSize: "1.6rem" }}>📷</span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "#5f735f",
                      fontStyle: "italic",
                    }}
                  >
                    tap to add
                  </span>
                </>
              ) : (
                <span style={{ fontSize: "1.8rem", opacity: 0.4 }}>🌿</span>
              )}
            </div>
          )}
        </div>
        <div
          style={{
            paddingTop: "6px",
            fontFamily: "'Great Vibes', cursive",
            fontSize: "0.85rem",
            color: "#5f735f",
            textAlign: "center",
            lineHeight: 1.3,
            minHeight: "26px",
          }}
        >
          {caption}
        </div>
      </motion.div>
    </div>
  );
}

// Stable slot IDs for rows
const ROW1_SLOTS = [
  { id: "p0", pos: 0 },
  { id: "p1", pos: 1 },
  { id: "p2", pos: 2 },
  { id: "p3", pos: 3 },
  { id: "p4", pos: 4 },
];
const ROW2_SLOTS = [
  { id: "p5", pos: 0, globalIndex: 5 },
  { id: "p6", pos: 1, globalIndex: 6 },
  { id: "p7", pos: 2, globalIndex: 7 },
  { id: "p8", pos: 3, globalIndex: 8 },
  { id: "p9", pos: 4, globalIndex: 9 },
];

const DEFAULT_ROT1 = [-4, 3, -2, 5, -3];
const DEFAULT_ROT2 = [3, -5, 2, -3, 4];

export default function PolaroidGallery2({
  polaroids,
  onUpload,
  editMode = false,
}: PolaroidGallery2Props) {
  return (
    <section
      data-ocid="polaroid.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "32px 20px 48px",
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

      {/* Row 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: "40px", position: "relative" }}
      >
        <div
          style={{ position: "relative", height: "16px", marginBottom: "0" }}
        >
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(6px, 2vw, 18px)",
            flexWrap: "nowrap",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {ROW1_SLOTS.map((slot) => {
            const p = polaroids[slot.pos] ?? {
              src: "",
              caption: "",
              rotation: 0,
            };
            return (
              <PolaroidCard
                key={slot.id}
                src={p.src}
                caption={p.caption}
                rotation={p.rotation || DEFAULT_ROT1[slot.pos]}
                index={slot.pos}
                onUpload={onUpload}
                editMode={editMode}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Row 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{ position: "relative" }}
      >
        <div
          style={{ position: "relative", height: "16px", marginBottom: "0" }}
        >
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

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(6px, 2vw, 18px)",
            flexWrap: "nowrap",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {ROW2_SLOTS.map((slot) => {
            const p = polaroids[slot.globalIndex] ?? {
              src: "",
              caption: "",
              rotation: 0,
            };
            return (
              <PolaroidCard
                key={slot.id}
                src={p.src}
                caption={p.caption}
                rotation={p.rotation || DEFAULT_ROT2[slot.pos]}
                index={slot.globalIndex}
                onUpload={onUpload}
                editMode={editMode}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
