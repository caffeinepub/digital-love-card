import { motion } from "motion/react";

interface BenchSceneProps {
  character1Url?: string;
  character2Url?: string;
}

export default function BenchScene({
  character1Url,
  character2Url,
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
          us, always
        </p>

        {/* Bench scene: characters on either side of bench illustration */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "0px",
            position: "relative",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          {character1Url && (
            <img
              src={character1Url}
              alt="Character 1"
              style={{
                height: "clamp(160px, 28vw, 220px)",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 6px 16px rgba(63,90,58,0.14))",
                position: "relative",
                zIndex: 2,
                marginRight: "-20px",
              }}
            />
          )}
          <img
            src="/assets/generated/bench-scene-transparent.dim_700x450.png"
            alt="Wooden bench"
            style={{
              maxWidth: character1Url || character2Url ? "360px" : "600px",
              width: character1Url || character2Url ? "55%" : "100%",
              height: "auto",
              filter: "drop-shadow(0 8px 28px rgba(63,90,58,0.16))",
              position: "relative",
              zIndex: 1,
            }}
            className="float-slow"
          />
          {character2Url && (
            <img
              src={character2Url}
              alt="Character 2"
              style={{
                height: "clamp(160px, 28vw, 220px)",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 6px 16px rgba(63,90,58,0.14))",
                position: "relative",
                zIndex: 2,
                marginLeft: "-20px",
              }}
            />
          )}
        </div>

        {(!character1Url || !character2Url) && (
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "0.78rem",
              color: "#7a9e7e",
              fontStyle: "italic",
              marginTop: "16px",
            }}
          >
            {!character1Url && !character2Url
              ? "Upload your character PNGs via the edit panel to sit on the bench 🪑"
              : !character1Url
                ? "Upload the first character PNG via the edit panel ✨"
                : "Upload the second character PNG via the edit panel ✨"}
          </p>
        )}
      </motion.div>
    </section>
  );
}
