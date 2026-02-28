import { useRef, useState } from "react";

type VideoDemoProps = {
  className?: string;
  src: string;
  poster?: string;
};

export const VideoDemo = ({ className = "", src, poster }: VideoDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
      return;
    }
    video.pause();
    setIsPaused(true);
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      className={`relative mx-auto max-w-[940px] overflow-hidden rounded-[8px] animate-fade-in ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        loop
        muted={isMuted}
        playsInline
        autoPlay
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          if (video.currentTime < 4) {
            video.currentTime = 4;
          }
        }}
        className="aspect-[940/532] w-full object-cover transition-opacity duration-500 opacity-100"
      />
      <button
        type="button"
        aria-label={isPaused ? "Play video" : "Pause video"}
        onClick={handleTogglePlay}
        className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-black/55 backdrop-blur-xl transition-opacity hover:bg-black/70"
      >
        {isPaused ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-white"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-white"
          >
            <rect x="14" y="4" width="4" height="16" rx="1" />
            <rect x="6" y="4" width="4" height="16" rx="1" />
          </svg>
        )}
      </button>
      <button
        type="button"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        onClick={handleToggleMute}
        className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-black/55 backdrop-blur-xl transition-opacity hover:bg-black/70"
      >
        {isMuted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-white"
          >
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-white"
          >
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
            <path d="M16 9a5 5 0 0 1 0 6" />
            <path d="M19 5a10 10 0 0 1 0 14" />
          </svg>
        )}
      </button>
    </div>
  );
};
