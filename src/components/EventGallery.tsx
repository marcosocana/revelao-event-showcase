import testimonial1 from "@/assets/testimonio4-1.png";
import testimonial2 from "@/assets/testimonio2-2.png";
import testimonial3 from "@/assets/testimonio3-2.png";
import testimonial4 from "@/assets/testimonio-6.png";
import puebloQr from "@/assets/puebloqr.png";
import nocheQr from "@/assets/nocheqr.png";
import { useI18n, translations } from "@/lib/i18n";

export const EventGallery = () => {
  const { lang } = useI18n();
  const t = translations[lang];

  const items = [
    { label: t.stories.items[0]?.event, image: testimonial4 },
    { label: t.stories.items[1]?.event, image: testimonial2 },
    { label: t.stories.items[2]?.event, image: testimonial1 },
    { label: t.stories.itemsMobileExtra[0]?.event, image: puebloQr },
    { label: t.stories.itemsMobileExtra[1]?.event, image: testimonial3 },
    { label: t.stories.itemsMobileExtra[2]?.event, image: nocheQr },
  ].filter((item) => item.label);

  const columns = [
    items,
    [...items.slice(2), ...items.slice(0, 2)],
    [...items.slice(4), ...items.slice(0, 4)],
  ];

  return (
    <section className="py-12 md:py-24 bg-muted/30 gallery_section" id="para-donde">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            {t.gallery.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.gallery.subtitle}
          </p>
        </div>

        <div className="gallery_blurTop">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="gallery_blurBottom">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="gallery_darkenerTop" />
        <div className="gallery_darkenerBottom" />
        <div className="gallery_items">
          {columns.map((columnItems, columnIndex) => (
            <div key={columnIndex} className="gallery_column">
              <div
                data-direction={columnIndex % 2 === 0 ? "down" : "up"}
                className="gallery_columnInner"
              >
                {[...columnItems, ...columnItems].map((item, index) => (
                  <div key={`${item.label}-${index}`} className="gallery_item">
                    <div className="gallery_media">
                      <div className="gallery_videoWrapper">
                        <img src={item.image} alt={item.label} loading="lazy" />
                      </div>
                    </div>
                    <span className="gallery_name">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
