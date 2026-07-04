const socialVideos = [
  {
    src: "/rrss/testimonio1.mp4",
    label: "Revelao en redes sociales 1",
  },
  {
    src: "/rrss/testimonio2.mp4",
    label: "Revelao en redes sociales 2",
  },
];

export const SocialVideos = () => {
  return (
    <section className="bg-transparent py-12 md:py-24" id="rrss">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="revelao-h2 text-center">Revelao en RRSS</h2>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:gap-8">
          {socialVideos.map((video, index) => (
            <div
              key={video.src}
              className="w-full max-w-[260px] overflow-hidden rounded-[8px] border border-border bg-white shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] md:max-w-[290px]"
            >
              <video
                className="aspect-[9/16] w-full bg-black object-cover"
                aria-label={video.label}
                autoPlay={index === 0}
                controls
                loop
                muted
                playsInline
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
