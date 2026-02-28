import { useEffect, useMemo, useRef } from "react";
import heroVideoEsc1 from "@/assets/esc1.mp4";
import heroVideoEsc2 from "@/assets/esc2.mp4";
import heroVideoEsc33 from "@/assets/esc33.mp4";
import heroVideoEsc4 from "@/assets/esc4.mp4";
import heroVideoEsc5 from "@/assets/esc5.mp4";
import heroVideoEsc6 from "@/assets/esc6.mp4";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const heroTiles = [
    "/hero/11.png",
    "/hero/12.png",
    "/hero/13.png",
    "/hero/14.png",
    "/hero/15.png",
    "/hero/16.png",
    "/hero/17.png",
    "/hero/18.png",
    "/hero/19.png",
    "/hero/20.png",
    "/hero/21.png",
  ];
  const heroVideos = [
    heroVideoEsc1,
    heroVideoEsc2,
    heroVideoEsc33,
    heroVideoEsc4,
    heroVideoEsc5,
    heroVideoEsc6,
  ];
  const rowPatterns = [
    [1.4, 0.9, 1.2, 0.8, 1.6, 1.0],
    [1.1, 1.5, 0.75, 1.3, 0.9],
    [0.9, 1.25, 1.0, 0.8, 1.4, 0.95],
    [1.6, 0.85, 1.15, 0.75, 1.3],
  ];
  const rowHeights = [205, 190, 200, 185, 195, 180];
  const gridGap = 14;
  const gridPadding = 20;
  const heroTopOffset = rowHeights[0] + gridGap + gridPadding;
  const getRepeatCount = (height: number) => {
    if (height <= 155) return 12;
    if (height <= 170) return 11;
    return 10;
  };

  const heroRows = rowHeights.map((height, index) => {
    const basePattern = rowPatterns[index % rowPatterns.length];
    const repeatCount = getRepeatCount(height);
    const ratios = Array.from({ length: repeatCount }, (_, itemIndex) => (
      basePattern[itemIndex % basePattern.length]
    ));
    const tiledRatios = [...ratios, ...ratios];
    return {
      height,
      ratios: tiledRatios,
    };
  });
  const heroFirstRowTop = useMemo(() => heroTopOffset, [heroTopOffset]);

  useEffect(() => {
    const updateSubtitleOffset = () => {
      const container = containerRef.current;
      const subtitle = subtitleRef.current;
      if (!container || !subtitle) return;
      const containerRect = container.getBoundingClientRect();
      const subtitleRect = subtitle.getBoundingClientRect();
      const offset = Math.max(0, subtitleRect.top - containerRect.top);
      container.style.setProperty("--hero-subtitle-top", `${offset}px`);
    };

    updateSubtitleOffset();
    window.addEventListener("resize", updateSubtitleOffset);
    return () => window.removeEventListener("resize", updateSubtitleOffset);
  }, []);

  return (
    <section className="heroGridSection" id="inicio" aria-label="Revelao hero">
      <div
        ref={containerRef}
        className="heroGridContainer"
        style={{
          "--hero-top-offset": `${heroTopOffset}px`,
          "--hero-subtitle-top": `${heroFirstRowTop}px`,
        } as React.CSSProperties}
      >
        <div className="heroGridBackground" aria-hidden="true">
          <div className="heroGridMask">
            <div className="heroGridItems">
              {heroRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`heroGridRow${rowIndex === 0 ? " heroGridRowSpacer" : ""}`}
                style={{ "--row-height": `${row.height}px` } as React.CSSProperties}
              >
                  {rowIndex === 0
                    ? null
                  : (() => {
                      let lastIndex = -1;
                      return row.ratios.map((ratio, itemIndex) => {
                        let srcIndex = (rowIndex * 13 + itemIndex) % heroTiles.length;
                        if (srcIndex === lastIndex) {
                          srcIndex = (srcIndex + 1) % heroTiles.length;
                        }
                        lastIndex = srcIndex;
                        const src = heroTiles[srcIndex];
                      const videoIndex = Math.floor(itemIndex / 4);
                      const videoSrc = heroVideos[videoIndex % heroVideos.length];
                      const isVideo = (itemIndex + 1) % 4 === 0;
                      return (
                        <div
                          key={`tile-${rowIndex}-${itemIndex}`}
                          className="heroGridItem"
                          style={{ aspectRatio: `${ratio} / 1` }}
                        >
                          {isVideo ? (
                            videoSrc ? (
                              <video
                                src={videoSrc}
                                className="heroGridImage"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                              />
                            ) : (
                              <img
                                src={src}
                                alt=""
                                aria-hidden="true"
                                loading="eager"
                                decoding="async"
                                className="heroGridImage"
                              />
                            )
                          ) : (
                            <img
                              src={src}
                              alt=""
                              aria-hidden="true"
                              loading="eager"
                              decoding="async"
                              className="heroGridImage"
                            />
                          )}
                        </div>
                      );
                    });
                    })()}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="heroGradientTop" aria-hidden="true" />
        <div className="heroCtaWrap">
          <a
            href="https://acceso.revelao.cam/nuevoeventodemo"
            target="_blank"
            rel="noopener noreferrer"
            className="heroCtaButton ctaRed"
            data-hero-cta
          >
            <span className="ctaTextDesktop">Pruébalo gratis</span>
            <span className="ctaTextMobile">Probar gratis</span>
          </a>
        </div>
        <div className="heroContent">
          <div className="heroShimmerGroup">
            <h1 className="heroTitleShimmer">Revelao</h1>
            <p ref={subtitleRef}>
              <strong className="heroSubtitleShimmer">
                El momento más especial, desde todos los ángulos
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
