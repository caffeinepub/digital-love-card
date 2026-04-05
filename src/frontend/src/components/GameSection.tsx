import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { DEFAULT_SUBTEXTS } from "../hooks/useAnnivContent";

const DEFAULT_POEMS: string[] = [
  "In the ordinary days,\nyou made magic feel mundane—\nso woven into my world\nthat I forget to count\nhow lucky I am.\nThen I remember. Always.",

  "You are the middle\nof every sentence I start—\nthe reason the story\ngets good.\nOne year ago: strangers.\nNow: home.",

  "I like who I am\nwhen I'm with you.\nLighter, funnier, braver—\nsomewhere between\nyour laugh and your silence\nI found myself.",

  "There are a thousand versions\nof the future,\nand in every single one\nI am looking for you\nacross the room.\nAnd there you are.",

  "Some loves are loud—\nours is the kind that hums,\nlow and constant,\nlike a fire that never\ngoes out,\njust glows.",

  "Here is what I know:\nmorning is better with you in it.\nEvery road is shorter.\nEvery cold night, warmer.\nHere is what I know:\nyou.",
];

interface GameSectionProps {
  boardGameImageUrl: string;
  onUploadBoardGame: (
    bytes: Uint8Array<ArrayBuffer>,
    fileName: string,
    previewUrl: string,
  ) => void;
  poems: string[];
  onPoemsChange: (poems: string[]) => void;
  heading?: string;
}

export default function GameSection({
  boardGameImageUrl,
  onUploadBoardGame,
  poems,
  heading = DEFAULT_SUBTEXTS.gameHeading,
}: GameSectionProps) {
  const [rolling, setRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [poemOpen, setPoemOpen] = useState(false);
  const boardGameInputRef = useRef<HTMLInputElement>(null);

  function handleDiceClick() {
    if (rolling) return;
    setRolling(true);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setRolling(false);
      setPoemOpen(true);
    }, 850);
  }

  function handleBoardGameUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      const imageBlob = new Blob([bytes], { type: file.type || "image/jpeg" });
      const previewUrl = URL.createObjectURL(imageBlob);
      onUploadBoardGame(bytes, file.name, previewUrl);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  }

  const currentPoems = poems.length === 6 ? poems : DEFAULT_POEMS;
  const currentPoem = diceResult !== null ? currentPoems[diceResult - 1] : "";

  return (
    <section
      data-ocid="game.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "32px 20px 48px",
        maxWidth: "820px",
        margin: "0 auto",
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
        {heading}
      </motion.h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* Board game image upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            ref={boardGameInputRef}
            type="file"
            accept="image/*"
            onChange={handleBoardGameUpload}
            style={{ display: "none" }}
            aria-label="Upload board game photo"
          />
          <button
            type="button"
            data-ocid="game.upload_button"
            onClick={() => boardGameInputRef.current?.click()}
            style={{
              width: "clamp(180px, 33vw, 270px)",
              height: "clamp(180px, 33vw, 270px)",
              borderRadius: "24px",
              border: boardGameImageUrl
                ? "none"
                : "2px dashed rgba(111,191,115,0.5)",
              background: boardGameImageUrl
                ? "transparent"
                : "rgba(216,243,220,0.5)",
              cursor: "pointer",
              overflow: "hidden",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: boardGameImageUrl
                ? "0 6px 28px rgba(63,90,58,0.18)"
                : "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {boardGameImageUrl ? (
              <img
                src={boardGameImageUrl}
                alt="Board game"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "24px",
                }}
              />
            ) : (
              <>
                <span style={{ fontSize: "2.5rem" }}>&#127922;</span>
                <span
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "0.85rem",
                    color: "#7a9e7e",
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: "0 16px",
                    lineHeight: 1.6,
                  }}
                >
                  tap to upload
                  <br />
                  board game photo
                </span>
              </>
            )}
          </button>
        </motion.div>

        {/* Dice */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <button
            type="button"
            data-ocid="game.dice.button"
            onClick={handleDiceClick}
            disabled={rolling}
            aria-label="Roll the dice"
            style={{
              background: "none",
              border: "none",
              cursor: rolling ? "wait" : "pointer",
              padding: 0,
              display: "block",
              transition: "filter 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!rolling) {
                e.currentTarget.style.filter =
                  "brightness(1.08) drop-shadow(0 6px 24px rgba(63,90,58,0.35))";
                e.currentTarget.style.transform = "scale(1.06)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <DiceSVG rolling={rolling} result={diceResult} />
          </button>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.85rem",
              color: "#7a9e7e",
              fontStyle: "italic",
              textAlign: "center",
              margin: 0,
            }}
          >
            {rolling ? "rolling..." : "click the dice for a poem"}
          </p>
        </motion.div>
      </div>

      {/* Poem Modal */}
      <AnimatePresence>
        {poemOpen && diceResult !== null && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setPoemOpen(false)}
          >
            <motion.div
              data-ocid="game.poem.modal"
              className="modal-box"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ textAlign: "center" }}
            >
              <button
                type="button"
                data-ocid="game.poem.close_button"
                onClick={() => setPoemOpen(false)}
                aria-label="Close"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "1px solid rgba(111,191,115,0.35)",
                  background: "rgba(216,243,220,0.5)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  color: "#3a5a40",
                  lineHeight: 1,
                }}
              >
                &#215;
              </button>

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #d8f3dc, #a8dca8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 2px 10px rgba(63,90,58,0.18)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#3a5a40",
                  }}
                >
                  {diceResult}
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "1.5rem",
                  color: "#3a5a40",
                  margin: "0 0 20px 0",
                }}
              >
                a poem for you
              </p>

              <div
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.9,
                  color: "#3a5a40",
                  fontStyle: "italic",
                  whiteSpace: "pre-line",
                  padding: "16px 20px",
                  background: "rgba(216,243,220,0.35)",
                  borderRadius: "14px",
                  border: "1px solid rgba(111,191,115,0.2)",
                }}
              >
                {currentPoem}
              </div>

              <button
                type="button"
                data-ocid="game.roll_again.button"
                onClick={() => {
                  setPoemOpen(false);
                  setTimeout(handleDiceClick, 200);
                }}
                style={{
                  marginTop: "20px",
                  padding: "10px 28px",
                  borderRadius: "24px",
                  border: "none",
                  background: "linear-gradient(135deg, #6fbf73, #4a9450)",
                  color: "#fff",
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  boxShadow: "0 3px 14px rgba(63,90,58,0.2)",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                roll again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Standard die: opposite pairs are 1+6=7, 2+5=7, 3+4=7
// Adjacency: for a given top face, which numbers appear on right and left
const FACE_ADJACENCY: Record<number, [number, number]> = {
  1: [2, 3],
  2: [1, 4],
  3: [1, 5],
  4: [2, 6],
  5: [3, 6],
  6: [4, 5],
};

// ---------------------------------------------------------------------------
// TOP FACE dot positions (isometric rhombus)
function getTopDots(count: number): Array<[number, number]> {
  const cx = 100;
  const cy = 58;

  function gp(col: number, row: number): [number, number] {
    return [cx + col * 22 + row * -4, cy + col * 11 + row * 14];
  }

  const TL = gp(-1, -1);
  const TC = gp(0, -1);
  const TR = gp(1, -1);
  const ML = gp(-1, 0);
  const CC = gp(0, 0);
  const MR = gp(1, 0);
  const BL = gp(-1, 1);
  const BC = gp(0, 1);
  const BR = gp(1, 1);

  void ML;
  void MR;
  void BC;

  switch (count) {
    case 1:
      return [CC];
    case 2:
      return [TL, BR];
    case 3:
      return [TL, CC, BR];
    case 4:
      return [TL, TR, BL, BR];
    case 5:
      return [TL, TR, CC, BL, BR];
    case 6:
      return [TL, TC, TR, BL, BC, BR];
    default:
      return [];
  }
}

// RIGHT FACE dot positions (parallelogram)
function getRightDots(count: number): Array<[number, number]> {
  const cx = 135;
  const cy = 117;

  function gp(col: number, row: number): [number, number] {
    return [cx + col * 17 + row * -4, cy + col * -8 + row * 24];
  }

  const TL = gp(-1, -1);
  const TR = gp(1, -1);
  const ML = gp(-1, 0);
  const MR = gp(1, 0);
  const BL = gp(-1, 1);
  const BR = gp(1, 1);
  const CC = gp(0, 0);

  switch (count) {
    case 1:
      return [CC];
    case 2:
      return [TR, BL];
    case 3:
      return [TR, CC, BL];
    case 4:
      return [TL, TR, BL, BR];
    case 5:
      return [TL, TR, CC, BL, BR];
    case 6:
      return [TL, TR, ML, MR, BL, BR];
    default:
      return [];
  }
}

// LEFT FACE dot positions (parallelogram)
function getLeftDots(count: number): Array<[number, number]> {
  const cx = 65;
  const cy = 117;

  function gp(col: number, row: number): [number, number] {
    return [cx + col * 17 + row * 4, cy + col * 8 + row * 24];
  }

  const TL = gp(-1, -1);
  const TR = gp(1, -1);
  const ML = gp(-1, 0);
  const MR = gp(1, 0);
  const BL = gp(-1, 1);
  const BR = gp(1, 1);
  const CC = gp(0, 0);

  switch (count) {
    case 1:
      return [CC];
    case 2:
      return [TL, BR];
    case 3:
      return [TL, CC, BR];
    case 4:
      return [TL, TR, BL, BR];
    case 5:
      return [TL, TR, CC, BL, BR];
    case 6:
      return [TL, TR, ML, MR, BL, BR];
    default:
      return [];
  }
}

function FaceDots({
  positions,
  fill,
  r,
}: {
  positions: Array<[number, number]>;
  fill: string;
  r: number;
}) {
  return (
    <>
      {positions.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={fill} />
      ))}
    </>
  );
}

function DiceSVG({
  rolling,
  result,
}: {
  rolling: boolean;
  result: number | null;
}) {
  const topFace = result ?? 1;
  const [rightFace, leftFace] = FACE_ADJACENCY[topFace];

  const topDots = getTopDots(topFace);
  const rightDots = getRightDots(rightFace);
  const leftDots = getLeftDots(leftFace);

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={rolling ? "dice-rolling" : ""}
      style={{
        width: "clamp(160px, 30vw, 240px)",
        height: "auto",
        display: "block",
        filter: "drop-shadow(0 12px 28px rgba(63,90,58,0.30))",
        transition: "transform 0.2s ease",
      }}
      role="img"
      aria-label="Dice"
    >
      {/* Top face */}
      <path
        d="M100 20 L170 58 L100 96 L30 58 Z"
        fill="#ffffff"
        stroke="#c8e6c9"
        strokeWidth="1.5"
      />
      {/* Right face */}
      <path
        d="M170 58 L170 138 L100 176 L100 96 Z"
        fill="#e8f5e9"
        stroke="#c8e6c9"
        strokeWidth="1.5"
      />
      {/* Left face */}
      <path
        d="M30 58 L100 96 L100 176 L30 138 Z"
        fill="#f1f8f1"
        stroke="#c8e6c9"
        strokeWidth="1.5"
      />
      {/* Bottom edge shadow */}
      <path
        d="M30 138 L100 176 L170 138"
        stroke="#a5d6a7"
        strokeWidth="1"
        fill="none"
      />

      {/* Dots */}
      <FaceDots positions={topDots} fill="#2e7d32" r={5} />
      <FaceDots positions={rightDots} fill="#388e3c" r={4} />
      <FaceDots positions={leftDots} fill="#43a047" r={4} />

      {/* Highlight edges */}
      <path
        d="M100 20 L170 58"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M100 20 L30 58"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Ground shadow */}
      <ellipse cx="100" cy="188" rx="55" ry="8" fill="rgba(0,0,0,0.10)" />
    </svg>
  );
}

export { DEFAULT_POEMS };
