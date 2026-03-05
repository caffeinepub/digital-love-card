interface PolaroidPhotoProps {
  src: string;
  caption?: string;
  rotation?: number;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  "data-ocid"?: string;
}

export default function PolaroidPhoto({
  src,
  caption,
  rotation = 0,
  size = 160,
  style,
  className,
  "data-ocid": dataOcid,
}: PolaroidPhotoProps) {
  return (
    <div
      className={`polaroid ${className ?? ""}`}
      data-ocid={dataOcid}
      style={{
        transform: `rotate(${rotation}deg)`,
        width: `${size}px`,
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={src}
        alt={caption ?? "memory"}
        style={{
          width: "100%",
          height: `${size - 36}px`,
          objectFit: "cover",
          display: "block",
        }}
        loading="lazy"
      />
      {caption && <span className="polaroid-caption">{caption}</span>}
    </div>
  );
}
