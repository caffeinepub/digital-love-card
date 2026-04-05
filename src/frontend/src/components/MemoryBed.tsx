import { motion } from "motion/react";

interface MemoryBedProps {
  treasuresImageUrl?: string;
}

export default function MemoryBed({ treasuresImageUrl }: MemoryBedProps) {
  const imageSrc =
    treasuresImageUrl ||
    "/assets/generated/little-treasures-flatlay.dim_900x700.jpg";

  return (
    <section
      data-ocid="memory.section"
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
        <h2
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
            color: "#3a5a40",
            margin: "0 0 8px 0",
          }}
        >
          little treasures
        </h2>
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "0.82rem",
            color: "#7a9e7e",
            fontStyle: "italic",
            margin: "0 0 28px 0",
          }}
        >
          every small thing I keep because of you 🧶
        </p>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", damping: 22 }}
          style={{
            display: "inline-block",
            width: "100%",
            maxWidth: "860px",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow:
              "0 12px 40px rgba(63,90,58,0.18), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <img
            src={imageSrc}
            alt="Flatlay of keepsake items including bracelets, plushies, candle, heart with sathu, cactus jack plate, and crocheted sunflower"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
