import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type VideoDemoProps = {
  className?: string;
  src: string;
  poster?: string;
};

export const VideoDemo = ({ className = "", src, poster }: VideoDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => {
      video
        .play()
        .then(() => setIsPaused(false))
        .catch(() => setIsPaused(true));
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "hidden" && isInView) {
        tryPlay();
      }
    };

    video.muted = isMuted;
    video.defaultMuted = isMuted;
    video.autoplay = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    if (isInView) {
      tryPlay();
      setTimeout(tryPlay, 120);
    } else {
      video.pause();
      setIsPaused(true);
    }

    const handleTouchStart = () => tryPlay();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isInView, isMuted]);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPaused(false))
        .catch(() => setIsPaused(true));
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
    video.play().catch(() => undefined);
  };

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto max-w-[940px] overflow-hidden rounded-[8px] opacity-100 ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        data-src={src}
        poster={poster}
        preload="none"
        loop
        muted={isMuted}
        playsInline
        autoPlay
        controls={false}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
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
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        className="aspect-[940/532] w-full object-cover transition-opacity duration-500 opacity-100"
      />
      <button
        type="button"
        aria-label={isPaused ? "Play video" : "Pause video"}
        onClick={handleTogglePlay}
        className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-black/55 backdrop-blur-xl transition-opacity hover:bg-black/70"
      >
        {isPaused ? <Play className="size-5 text-white" /> : <Pause className="size-5 text-white" />}
      </button>
      <button
        type="button"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        onClick={handleToggleMute}
        className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-black/55 backdrop-blur-xl transition-opacity hover:bg-black/70"
      >
        {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
      </button>
    </div>
  );
};
