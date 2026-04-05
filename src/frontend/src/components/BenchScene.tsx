import { motion } from "motion/react";
import { DEFAULT_SUBTEXTS } from "../hooks/useAnnivContent";

interface BenchSceneProps {
  benchImageUrl?: string;
  caption?: string;
}

export default function BenchScene({
  benchImageUrl,
  caption = DEFAULT_SUBTEXTS.benchCaption,
}: BenchSceneProps) {
  return (
    <section
      data-ocid="bench.section"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "32px 20px 48px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
      >
        <p
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            color: "#5f735f",
            margin: "0 0 28px 0",
          }}
        >
          {caption}
        </p>

        {benchImageUrl ? (
          /* Uploaded photo — large, centered, prominent */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <img
              src={benchImageUrl}
              alt="Us on the bench"
              style={{
                maxWidth: "min(90%, 600px)",
                width: "100%",
                height: "auto",
                margin: "0 auto",
                display: "block",
                borderRadius: "16px",
                filter:
                  "drop-shadow(0 8px 32px rgba(63,90,58,0.22)) drop-shadow(0 2px 8px rgba(63,90,58,0.12))",
              }}
            />
            {/* Bench illustration as a small decorative footer */}
            <img
              src="/assets/generated/bench-scene-transparent.dim_700x450.png"
              alt="Wooden bench"
              style={{
                width: "340px",
                maxWidth: "80%",
                height: "auto",
                opacity: 0.6,
                filter: "drop-shadow(0 4px 12px rgba(63,90,58,0.1))",
              }}
            />
          </div>
        ) : (
          /* No image yet — show bench illustration with hint */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <img
              src="/assets/generated/bench-scene-transparent.dim_700x450.png"
              alt="Wooden bench"
              style={{
                maxWidth: "min(100%, 600px)",
                width: "100%",
                height: "auto",
                filter: "drop-shadow(0 8px 28px rgba(63,90,58,0.16))",
              }}
              className="float-slow"
            />
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "0.78rem",
                color: "#7a9e7e",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Upload your bench photo via the edit panel 🪑
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
