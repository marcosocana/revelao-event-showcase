import { useEffect, useRef, useState } from "react";

type VideoDemoProps = {
  className?: string;
  src: string;
  poster?: string;
};

export const VideoDemo = ({ className = "", src, poster }: VideoDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekToStart = () => {
      if (video.currentTime < 4) {
        try {
          video.currentTime = 4;
        } catch {
          // iOS may block programmatic seeking until playback starts.
        }
      }
    };

    const handlePlaying = () => {
      if (isMobile) {
        seekToStart();
      }
    };

    video.addEventListener("playing", handlePlaying);

    if (isInView) {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.autoplay = true;

      if (!isMobile) {
        seekToStart();
      }

      const tryPlay = () => video.play().catch(() => undefined);
      tryPlay();
      requestAnimationFrame(tryPlay);
      setTimeout(tryPlay, 200);

      const handleTouch = () => {
        tryPlay();
        window.removeEventListener("touchstart", handleTouch);
      };
      window.addEventListener("touchstart", handleTouch, { passive: true });
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener("playing", handlePlaying);
    };
  }, [isInView, isMobile]);

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
        preload="auto"
        loop
        muted={isMuted}
        playsInline
        autoPlay
        controls={false}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          if (!isMobile && video.currentTime < 4) {
            video.currentTime = 4;
          }
          if (isInView && video.paused) {
            video.play().catch(() => undefined);
          }
        }}
        onCanPlay={(event) => {
          const video = event.currentTarget;
          if (isInView && video.paused) {
            video.play().catch(() => undefined);
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
