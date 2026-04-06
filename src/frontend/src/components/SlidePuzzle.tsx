import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 4;
const TOTAL = GRID * GRID; // 16 tiles
const EMPTY = TOTAL - 1; // index 15 is the blank

function isSolvable(tiles: number[]): boolean {
  // Count inversions (ignore the empty tile)
  let inversions = 0;
  const flat = tiles.filter((t) => t !== EMPTY);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  // For a 4x4 grid:
  // - Find the row of the blank tile from the bottom (1-indexed)
  const emptyIdx = tiles.indexOf(EMPTY);
  const blankRowFromBottom = GRID - Math.floor(emptyIdx / GRID);

  if (blankRowFromBottom % 2 === 0) {
    // blank on even row from bottom → solvable if inversions odd
    return inversions % 2 === 1;
  }
  // blank on odd row from bottom → solvable if inversions even
  return inversions % 2 === 0;
}

function createSolvableShuffle(): number[] {
  // Start from solved state and make random valid moves
  const tiles: number[] = Array.from({ length: TOTAL }, (_, i) => i);

  // Fisher-Yates shuffle then check parity
  let shuffled: number[];
  let attempts = 0;
  do {
    shuffled = [...tiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
    // If not solvable, swap any two non-empty tiles to fix parity
    if (!isSolvable(shuffled) && attempts > 100) {
      // swap first two non-empty tiles to fix parity
      const nonEmpty = shuffled
        .map((v, i) => (v !== EMPTY ? i : -1))
        .filter((i) => i >= 0);
      if (nonEmpty.length >= 2) {
        [shuffled[nonEmpty[0]], shuffled[nonEmpty[1]]] = [
          shuffled[nonEmpty[1]],
          shuffled[nonEmpty[0]],
        ];
      }
      break;
    }
  } while (!isSolvable(shuffled));

  return shuffled;
}

function isSolved(tiles: number[]): boolean {
  return tiles.every((t, i) => t === i);
}

function getNeighbours(idx: number): number[] {
  const row = Math.floor(idx / GRID);
  const col = idx % GRID;
  const neighbours: number[] = [];
  if (row > 0) neighbours.push(idx - GRID);
  if (row < GRID - 1) neighbours.push(idx + GRID);
  if (col > 0) neighbours.push(idx - 1);
  if (col < GRID - 1) neighbours.push(idx + 1);
  return neighbours;
}

interface SlidePuzzleProps {
  puzzleImageUrl: string;
}

export default function SlidePuzzle({ puzzleImageUrl }: SlidePuzzleProps) {
  const [tiles, setTiles] = useState<number[]>(() => createSolvableShuffle());
  const [animating, setAnimating] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const solvedCheckRef = useRef(false);

  const shuffle = useCallback(() => {
    setTiles(createSolvableShuffle());
    setSolved(false);
    setShowCelebration(false);
    solvedCheckRef.current = false;
  }, []);

  useEffect(() => {
    if (!solvedCheckRef.current && isSolved(tiles)) {
      solvedCheckRef.current = true;
      setSolved(true);
      // Small delay so the last tile animation completes
      setTimeout(() => setShowCelebration(true), 300);
    }
  }, [tiles]);

  function handleTileClick(tilePos: number) {
    if (solved || animating.has(tilePos)) return;
    const emptyPos = tiles.indexOf(EMPTY);
    const neighbours = getNeighbours(emptyPos);
    if (!neighbours.includes(tilePos)) return;

    setAnimating((prev) => new Set(prev).add(tilePos));
    setTiles((prev) => {
      const next = [...prev];
      [next[tilePos], next[emptyPos]] = [next[emptyPos], next[tilePos]];
      return next;
    });
    setTimeout(() => {
      setAnimating((prev) => {
        const ns = new Set(prev);
        ns.delete(tilePos);
        return ns;
      });
    }, 160);
  }

  // The puzzle tile size — responsive
  const tilePercent = `${100 / GRID}%`;

  return (
    <section
      data-ocid="puzzle.section"
      style={{
        padding: "clamp(32px, 6vw, 64px) 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes puzzleHeartFloat {
          0%   { transform: translateY(0) scale(1);   opacity: 1; }
          100% { transform: translateY(-60px) scale(1.4); opacity: 0; }
        }
        @keyframes puzzleCelebFade {
          0%   { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Title */}
      <h2
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(1.7rem, 5vw, 2.4rem)",
          color: "#3a5a40",
          margin: "0 0 6px 0",
          lineHeight: 1.2,
          textAlign: "center",
        }}
      >
        we&apos;ll always fix us
      </h2>
      <h3
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
          color: "#b76e79",
          margin: "0 0 32px 0",
          fontWeight: 400,
          textAlign: "center",
          letterSpacing: "0.03em",
        }}
      >
        piece by piece
      </h3>

      {/* Wooden frame container */}
      <div
        style={{
          position: "relative",
          width: "clamp(280px, 80vw, 440px)",
          maxWidth: "100%",
        }}
      >
        {/* Outer wooden frame */}
        <div
          style={{
            borderRadius: "16px",
            padding: "18px",
            background:
              "linear-gradient(145deg, #8B6248 0%, #6b4c32 30%, #7a5a3c 55%, #5c3d22 80%, #6b4c32 100%)",
            boxShadow:
              "0 8px 32px rgba(60,30,10,0.45), inset 0 2px 4px rgba(255,220,180,0.15), inset 0 -2px 4px rgba(0,0,0,0.35)",
            border: "2px solid rgba(255,210,160,0.18)",
          }}
        >
          {/* Wood grain texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "16px",
              backgroundImage: `repeating-linear-gradient(
                12deg,
                transparent 0px,
                transparent 8px,
                rgba(255,200,150,0.04) 8px,
                rgba(255,200,150,0.04) 9px
              )`,
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          {/* Inner frame shadow ring */}
          <div
            style={{
              borderRadius: "10px",
              padding: "8px",
              background:
                "linear-gradient(145deg, #4a2e18 0%, #3a2210 50%, #4a2e18 100%)",
              boxShadow:
                "inset 0 3px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(255,180,100,0.1)",
            }}
          >
            {/* Puzzle grid */}
            <div
              data-ocid="puzzle.canvas_target"
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "100%", // square
                borderRadius: "6px",
                overflow: "hidden",
                background: "#1a0e08",
                boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  gridTemplateColumns: `repeat(${GRID}, ${tilePercent})`,
                  gridTemplateRows: `repeat(${GRID}, ${tilePercent})`,
                  gap: "2px",
                  padding: "2px",
                  background: "#2a1a10",
                }}
              >
                {tiles.map((tileValue, position) => {
                  const isEmpty = tileValue === EMPTY;
                  const emptyPos = tiles.indexOf(EMPTY);
                  const isNeighbour =
                    getNeighbours(emptyPos).includes(position);

                  // Calculate image position for this tile
                  const solvedRow = Math.floor(tileValue / GRID);
                  const solvedCol = tileValue % GRID;

                  return (
                    <div
                      key={`tile-${tileValue}`}
                      data-ocid={`puzzle.item.${position + 1}`}
                      role={isEmpty ? "presentation" : "button"}
                      tabIndex={!isEmpty && isNeighbour ? 0 : -1}
                      onClick={() => !isEmpty && handleTileClick(position)}
                      onKeyDown={(e) => {
                        if (!isEmpty && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handleTileClick(position);
                        }
                      }}
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderRadius: "3px",
                        overflow: "hidden",
                        cursor: isEmpty
                          ? "default"
                          : isNeighbour
                            ? "pointer"
                            : "grab",
                        background: isEmpty
                          ? "#1a0e08"
                          : puzzleImageUrl
                            ? undefined
                            : `hsl(${(tileValue * 24) % 360}, 45%, 75%)`,
                        backgroundImage:
                          !isEmpty && puzzleImageUrl
                            ? `url(${puzzleImageUrl})`
                            : undefined,
                        backgroundSize: puzzleImageUrl
                          ? `${GRID * 100}%`
                          : undefined,
                        backgroundPosition: puzzleImageUrl
                          ? `${(solvedCol / (GRID - 1)) * 100}% ${(solvedRow / (GRID - 1)) * 100}%`
                          : undefined,
                        transition:
                          "transform 0.15s ease, box-shadow 0.15s ease",
                        boxShadow: isEmpty
                          ? "none"
                          : isNeighbour
                            ? "0 0 6px rgba(183,110,121,0.5)"
                            : "inset 0 1px 0 rgba(255,255,255,0.12), 0 1px 3px rgba(0,0,0,0.4)",
                        border: isEmpty ? "none" : "1px solid rgba(0,0,0,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isEmpty && isNeighbour) {
                          e.currentTarget.style.transform = "scale(0.96)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {/* Tile number — shown when no image */}
                      {!isEmpty && !puzzleImageUrl && (
                        <span
                          style={{
                            fontFamily: "'Lora', Georgia, serif",
                            fontSize: "clamp(0.7rem, 2.5vw, 1.1rem)",
                            fontWeight: 700,
                            color: "rgba(80,40,50,0.8)",
                            textShadow: "0 1px 2px rgba(255,255,255,0.4)",
                          }}
                        >
                          {tileValue + 1}
                        </span>
                      )}
                      {/* Tile sheen */}
                      {!isEmpty && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Win overlay */}
              {showCelebration && (
                <div
                  data-ocid="puzzle.success_state"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(26,14,8,0.75)",
                    backdropFilter: "blur(3px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    borderRadius: "6px",
                    animation: "puzzleCelebFade 0.4s ease both",
                    zIndex: 10,
                  }}
                >
                  {/* Floating hearts */}
                  {["🩷", "💕", "🌸", "💞", "✨"].map((h, hi) => (
                    <span
                      key={h}
                      style={{
                        position: "absolute",
                        fontSize: "1.4rem",
                        left: `${15 + hi * 16}%`,
                        top: "60%",
                        animation: `puzzleHeartFloat ${1.2 + hi * 0.25}s ease-out ${hi * 0.15}s infinite`,
                        pointerEvents: "none",
                      }}
                    >
                      {h}
                    </span>
                  ))}

                  <p
                    style={{
                      fontFamily: "'Great Vibes', cursive",
                      fontSize: "clamp(1.4rem, 5vw, 2rem)",
                      color: "#f2d1d4",
                      margin: 0,
                      textAlign: "center",
                      textShadow: "0 2px 12px rgba(183,110,121,0.8)",
                    }}
                  >
                    💕 you solved us!
                  </p>

                  <button
                    type="button"
                    data-ocid="puzzle.button"
                    onClick={shuffle}
                    style={{
                      padding: "10px 24px",
                      borderRadius: "24px",
                      border: "1.5px solid rgba(242,209,212,0.5)",
                      background:
                        "linear-gradient(135deg, rgba(183,110,121,0.6) 0%, rgba(183,110,121,0.3) 100%)",
                      fontFamily: "'Lora', Georgia, serif",
                      fontSize: "0.85rem",
                      color: "#f2d1d4",
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                      backdropFilter: "blur(4px)",
                      transition: "transform 0.15s ease, background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Shuffle again ↺
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Corner wood pegs */}
        {(["tl", "tr", "bl", "br"] as const).map((pegId, pi) => (
          <div
            key={pegId}
            style={{
              position: "absolute",
              top: pi < 2 ? "5px" : undefined,
              bottom: pi >= 2 ? "5px" : undefined,
              left: pi === 0 || pi === 2 ? "5px" : undefined,
              right: pi === 1 || pi === 3 ? "5px" : undefined,
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 35%, #c8a880, #7a5230 60%, #4a3018 100%)",
              boxShadow:
                "0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,160,0.3)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* Shuffle button */}
      {!showCelebration && (
        <button
          type="button"
          data-ocid="puzzle.secondary_button"
          onClick={shuffle}
          style={{
            marginTop: "24px",
            padding: "10px 28px",
            borderRadius: "24px",
            border: "1.5px solid rgba(183,110,121,0.45)",
            background:
              "linear-gradient(135deg, rgba(183,110,121,0.12) 0%, rgba(183,110,121,0.06) 100%)",
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.82rem",
            color: "#b76e79",
            cursor: "pointer",
            letterSpacing: "0.04em",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(183,110,121,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          ↺ shuffle
        </button>
      )}
    </section>
  );
}
