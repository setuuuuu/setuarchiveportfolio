import { useState } from "react";

type Props = {
  imageUrl: string;
  videoUrl?: string | null;
  alt: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
};

export function CoverMedia({ imageUrl, videoUrl, alt, imgClassName, loading }: Props) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = !!videoUrl;

  if (playing && hasVideo) {
    return (
      <div className="relative h-full w-full">
        <video
          src={videoUrl!}
          poster={imageUrl || undefined}
          controls
          autoPlay
          playsInline
          className={imgClassName ?? "block h-full w-full object-cover"}
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPlaying(false);
          }}
          aria-label="Close video"
          className="absolute right-2 top-2 z-10 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-paper"
        >
          ×
        </button>
      </div>
    );
  }

  if (!imageUrl) {
    return <div className="h-full w-full bg-paper-soft" />;
  }

  return (
    <div className="relative h-full w-full">
      <img
        src={imageUrl}
        alt={alt}
        loading={loading ?? "lazy"}
        className={imgClassName ?? "block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"}
      />
      {hasVideo && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPlaying(true);
          }}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition hover:bg-black/20"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper/90 text-ink shadow">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" aria-hidden="true">
              <path d="M0 0 L18 10 L0 20 Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
