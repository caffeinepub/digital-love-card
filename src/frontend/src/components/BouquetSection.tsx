import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const FLOWER_MEANINGS = [
  {
    flower: "Sunflower",
    color: "#f5c518",
    meaning: "adoration, loyalty, longevity",
    img: "/assets/generated/flower-sunflower-transparent.dim_200x200.png",
  },
  {
    flower: "Lavender",
    color: "#9b7fc4",
    meaning: "serenity, calmness, devotion",
    img: "/assets/generated/flower-lavender-transparent.dim_200x200.png",
  },
  {
    flower: "Baby's Breath",
    color: "#e8f4f0",
    meaning: "purity, innocence, everlasting love",
    img: null,
  },
  {
    flower: "Tulips",
    color: "#e85d8a",
    meaning: "declaration of love, perfect love",
    img: "/assets/generated/flower-tulip-transparent.dim_200x200.png",
  },
  {
    flower: "Chrysanthemums",
    color: "#f8e07a",
    meaning: "loyalty, friendship, abundance",
    img: "/assets/generated/flower-chrysanthemum-transparent.dim_200x200.png",
  },
  {
    flower: "Carnation",
    color: "#f4a0c0",
    meaning: "affection, adoration, love",
    img: "/assets/generated/flower-carnation-transparent.dim_200x200.png",
  },
  {
    flower: "Peonies",
    color: "#f9b4c9",
    meaning: "prosperity, good fortune, romance",
    img: "/assets/generated/flower-peony-transparent.dim_200x200.png",
  },
  {
    flower: "Daisies",
    color: "#ffffff",
    meaning: "happiness, innocence, simplicity",
    img: "/assets/generated/flower-daisy-transparent.dim_200x200.png",
  },
];

const BOUQUET_IMG =
  "/assets/generated/bouquet-watercolor-sathwik-transparent.dim_600x750.png";

interface BouquetSectionProps {
  bouquetImageUrl?: string;
}

export default function BouquetSection({
  bouquetImageUrl,
}: BouquetSectionProps) {
  const [open, setOpen] = useState(false);

  // Always use the watercolor image; user-uploaded replaces it
  const imageSrc = bouquetImageUrl || BOUQUET_IMG;

  return (
    <section
      data-ocid="bouquet.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "40px 20px 48px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        style={{ display: "inline-block", position: "relative" }}
      >
        {/* Heading */}
        <h2
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#3a5a40",
            margin: "0 0 6px 0",
          }}
        >
          a bouquet, just for you
        </h2>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.82rem",
            color: "#7a9e7e",
            fontStyle: "italic",
            margin: "0 0 24px 0",
          }}
        >
          tap to discover what each flower means
        </p>

        {/* Bouquet image */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          style={{
            cursor: "pointer",
            display: "inline-block",
            borderRadius: "20px",
            overflow: "visible",
            maxWidth: "380px",
            width: "100%",
          }}
        >
          <img
            src={imageSrc}
            alt="Watercolour bouquet of sunflowers, lavender, baby's breath, tulips, chrysanthemums, carnations, peonies and daisies wrapped in sheer white cloth with a green ribbon for sathwik"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
              objectPosition: "center",
              background: "transparent",
              filter: "drop-shadow(0 12px 28px rgba(58,90,64,0.18))",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Flower meanings modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(40,70,40,0.45)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(255,255,255,0.96)",
                borderRadius: "24px",
                padding: "28px 24px",
                maxWidth: "480px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: "2rem",
                  color: "#3a5a40",
                  textAlign: "center",
                  margin: "0 0 20px",
                }}
              >
                flowers &amp; their meanings
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {FLOWER_MEANINGS.map(({ flower, color, meaning, img }) => (
                  <div
                    key={flower}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      background: "#f8fdf9",
                      borderRadius: "14px",
                      padding: "12px 16px",
                      border: `2px solid ${color}44`,
                    }}
                  >
                    {/* Flower swatch */}
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: img ? "transparent" : color,
                        border: img ? "none" : "2px solid rgba(0,0,0,0.08)",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={flower}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "1.4rem" }}>✿</span>
                      )}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#2d4a30",
                        }}
                      >
                        {flower}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: "0.8rem",
                          color: "#7a9e7e",
                          fontStyle: "italic",
                          marginTop: "2px",
                        }}
                      >
                        {meaning}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  marginTop: "22px",
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #5a8a60, #3a6a40)",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                close ✿
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
