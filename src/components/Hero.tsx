import testimonial1 from "@/assets/testimonio4-1.png";
import testimonial2 from "@/assets/testimonio2-2.png";
import testimonial3 from "@/assets/testimonio3-2.png";
import testimonial4 from "@/assets/testimonio-6.png";
import puebloQr from "@/assets/puebloqr.png";
import nocheQr from "@/assets/nocheqr.png";

export const Hero = () => {
  const heroTiles = [
    testimonial4,
    testimonial2,
    testimonial1,
    puebloQr,
    testimonial3,
    nocheQr,
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
    return { height, ratios };
  });

  return (
    <section className="heroGridSection" id="inicio" aria-label="Revelao hero">
      <div className="heroGridContainer" style={{ "--hero-top-offset": `${heroTopOffset}px` } as React.CSSProperties}>
        <div className="heroGridBackground" aria-hidden="true">
          <div className="heroGridMask">
            <div className="heroGridItems">
              {heroRows.map((row, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className={`heroGridRow${rowIndex === 0 ? " heroGridRowSpacer" : ""}`}
                style={{ height: `${row.height}px` }}
              >
                  {rowIndex === 0
                    ? null
                    : row.ratios.map((ratio, itemIndex) => {
                        const src = heroTiles[(rowIndex * 12 + itemIndex) % heroTiles.length];
                        return (
                          <div
                            key={`tile-${rowIndex}-${itemIndex}`}
                            className="heroGridItem"
                            style={{ aspectRatio: `${ratio} / 1` }}
                          >
                            <img
                              src={src}
                              alt=""
                              aria-hidden="true"
                              loading="eager"
                              decoding="async"
                              className="heroGridImage"
                            />
                          </div>
                        );
                      })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="heroGradientTop" aria-hidden="true" />
        <div className="heroContent">
          <h1>Revelao</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </section>
  );
};
