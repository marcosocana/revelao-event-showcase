import { useEffect, useRef } from "react";

const socialVideos = [
  {
    src: "/rrss/testimonio1.mp4",
    poster: "/rrss/testimonio1-poster.jpg",
    label: "Revelao en redes sociales 1",
  },
  {
    src: "/rrss/testimonio3.mp4",
    poster: "/rrss/testimonio3-poster.jpg",
    label: "Revelao en redes sociales 3",
  },
  {
    src: "/rrss/testimonio4.mp4",
    poster: "/rrss/testimonio4-poster.jpg",
    label: "Revelao en redes sociales 4",
  },
  {
    src: "/rrss/testimonio2.mp4",
    poster: "/rrss/testimonio2-poster.jpg",
    label: "Revelao en redes sociales 2",
  },
];

export const SocialVideos = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const videos = videoRefs.current;

    const mobileQuery = window.matchMedia("(max-width: 639px)");
    let animationFrame = 0;

    const updateSelectedVideo = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        if (!mobileQuery.matches) {
          videos.forEach((video) => video?.pause());
          return;
        }

        const carouselRect = carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;
        let selectedIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        videos.forEach((video, index) => {
          if (!video) return;
          const rect = video.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - carouselCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            selectedIndex = index;
          }
        });

        videos.forEach((video, index) => {
          if (!video) return;
          if (index === selectedIndex) {
            video.muted = true;
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      });
    };

    carousel.addEventListener("scroll", updateSelectedVideo, { passive: true });
    window.addEventListener("resize", updateSelectedVideo);
    mobileQuery.addEventListener("change", updateSelectedVideo);
    updateSelectedVideo();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      carousel.removeEventListener("scroll", updateSelectedVideo);
      window.removeEventListener("resize", updateSelectedVideo);
      mobileQuery.removeEventListener("change", updateSelectedVideo);
      videos.forEach((video) => video?.pause());
    };
  }, []);

  return (
    <section className="bg-transparent py-12 md:py-24" id="rrss">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="revelao-h2 text-center">Revelao en las redes</h2>
        </div>

        <div ref={carouselRef} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-auto sm:grid sm:max-w-6xl sm:grid-cols-2 sm:justify-items-center sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 md:gap-8">
          {socialVideos.map((video, index) => (
            <div
              key={video.src}
              className="w-[76vw] max-w-[260px] shrink-0 snap-center overflow-hidden rounded-[8px] border border-border bg-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] sm:w-full md:max-w-[290px]"
            >
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                className="aspect-[9/16] w-full bg-black object-cover"
                aria-label={video.label}
                controls
                loop
                muted
                playsInline
                poster={video.poster}
                preload="metadata"
              >
                <source src={video.src} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
