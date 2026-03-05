import { useEffect, useRef } from "react";
import type { GalleryPhotoData } from "../hooks/useEditableContent";

const OCID_MAP: Record<number, string> = {
  0: "gallery.item.1",
  1: "gallery.item.2",
  2: "gallery.item.3",
  3: "gallery.item.4",
  4: "gallery.item.5",
  5: "gallery.item.6",
  6: "gallery.item.7",
  7: "gallery.item.8",
  8: "gallery.item.9",
};

interface GalleryItemProps {
  photo: GalleryPhotoData;
  index: number;
  isMobile?: boolean;
}

function GalleryItem({ photo, index, isMobile = false }: GalleryItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(
      () => {
        el.style.opacity = "1";
        el.style.transform = `rotate(${photo.rotation}deg)`;
      },
      80 + index * 100,
    );
    return () => clearTimeout(t);
  }, [index, photo.rotation]);

  const displaySize = isMobile ? Math.round(photo.size * 0.82) : photo.size;
  const imgHeight = displaySize - 40; // 8px top pad + 28px caption area + 4px gap

  const baseStyle: React.CSSProperties = {
    background: "#fffdf9",
    padding: "8px 8px 32px 8px",
    boxShadow:
      "0 6px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9)",
    width: `${displaySize}px`,
    flexShrink: 0,
    opacity: 0,
    transform: "rotate(0deg) scale(0.96)",
    transition: `
      opacity 0.6s ease ${index * 0.08}s,
      transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) ${index * 0.08}s,
      box-shadow 0.25s ease
    `,
    cursor: "default",
    zIndex: photo.zIndex,
    position: isMobile ? "relative" : "absolute",
  };

  const desktopPositionStyle: React.CSSProperties = isMobile
    ? {}
    : {
        top: `${photo.top}px`,
        left: `${photo.left}px`,
      };

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      el.style.transform = `rotate(${photo.rotation * 0.25}deg) scale(1.1)`;
      el.style.boxShadow =
        "0 20px 60px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.14)";
      el.style.zIndex = "30";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      el.style.transform = `rotate(${photo.rotation}deg) scale(1)`;
      el.style.boxShadow =
        "0 6px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.9)";
      el.style.zIndex = String(photo.zIndex);
    },
  };

  return (
    <div
      ref={ref}
      data-ocid={OCID_MAP[index]}
      style={{ ...baseStyle, ...desktopPositionStyle }}
      {...hoverHandlers}
    >
      <img
        src={photo.src}
        alt={photo.caption}
        style={{
          width: "100%",
          height: `${imgHeight}px`,
          objectFit: "cover",
          display: "block",
        }}
        loading="lazy"
      />
      <span
        style={{
          display: "block",
          fontFamily: "'Dancing Script', cursive",
          fontSize: "0.82rem",
          color: "var(--color-text-light)",
          textAlign: "center",
          marginTop: "8px",
          lineHeight: 1.3,
          letterSpacing: "0.02em",
        }}
      >
        {photo.caption}
      </span>
    </div>
  );
}

interface PolaroidGalleryProps {
  galleryPhotos: GalleryPhotoData[];
}

export default function PolaroidGallery({
  galleryPhotos,
}: PolaroidGalleryProps) {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("visible");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      data-ocid="gallery.section"
      className="gallery-bg"
      style={{
        padding: "clamp(60px, 10vw, 100px) clamp(20px, 4vw, 48px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Linen texture overlay — evokes a real tabletop */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='none'/%3E%3Crect x='0' y='0' width='1' height='1' fill='rgba(92,74,90,0.025)'/%3E%3Crect x='2' y='2' width='1' height='1' fill='rgba(92,74,90,0.025)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1040px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section heading */}
        <div
          ref={headingRef}
          className="fade-in"
          style={{
            textAlign: "center",
            marginBottom: "clamp(40px, 7vw, 64px)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: "0 0 14px 0",
              lineHeight: 1.15,
            }}
          >
            Our Moments
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "1px",
                background: "var(--color-lavender)",
                opacity: 0.7,
              }}
            />
            <span
              style={{
                fontSize: "1rem",
                color: "var(--color-lavender)",
                lineHeight: 1,
                opacity: 0.9,
              }}
            >
              ✦
            </span>
            <div
              style={{
                width: "50px",
                height: "1px",
                background: "var(--color-lavender)",
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* Desktop: true pixel-scatter layout */}
        <div
          className="hidden md:block"
          style={{
            position: "relative",
            // Height: bottom solo photo top:460 + size:182 + caption ~= 680px
            height: "680px",
            width: "100%",
          }}
        >
          {galleryPhotos.map((photo, i) => (
            <GalleryItem
              key={`desktop-${photo.src}`}
              photo={photo}
              index={i}
              isMobile={false}
            />
          ))}
        </div>

        {/* Mobile: flex-wrap with rotated polaroids */}
        <div
          className="flex md:hidden"
          style={{
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingBottom: "12px",
          }}
        >
          {galleryPhotos.map((photo, i) => (
            <GalleryItem
              key={`mobile-${photo.src}`}
              photo={photo}
              index={i}
              isMobile={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
