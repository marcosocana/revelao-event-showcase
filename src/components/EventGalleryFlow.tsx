import testimonial1 from "@/assets/testimonio4-1.png";
import testimonial2 from "@/assets/testimonio2-2.png";
import testimonial3 from "@/assets/testimonio3-2.png";
import testimonial4 from "@/assets/testimonio-6.png";
import puebloQr from "@/assets/puebloqr.png";
import nocheQr from "@/assets/nocheqr.png";
import { useI18n, translations } from "@/lib/i18n";

const flowItems = [
  { label: "ANIVERSARIO DE 25 AÑOS", image: testimonial3 },
  { label: "BODA", image: testimonial4 },
  { label: "CENA DE EMPRESA", image: testimonial1 },
  { label: "FIESTA DE PUEBLO", image: puebloQr },
  { label: "CUMPLEAÑOS DE 30", image: testimonial2 },
  { label: "NOCHE ESPECIAL", image: nocheQr },
];

export const EventGalleryFlow = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const columns = [
    flowItems,
    [...flowItems.slice(2), ...flowItems.slice(0, 2)],
    [...flowItems.slice(4), ...flowItems.slice(0, 4)],
  ];

  return (
    <section className="gallery_gallery__gccP0" id="gallery-flow" aria-label={t.gallery.title}>
      <div className="container px-4 mx-auto">
        <div className="gallery_mediaWrap">
          <div className="gallery_gradientBlurTop__HpD_I">
            <div />
            <div />
            <div />
            <div />
          </div>
          <div className="gallery_gradientBlurBottom__JyOqD">
            <div />
            <div />
            <div />
            <div />
          </div>
          <div className="gallery_gradientDarkenerTop__WB3Ck" />
          <div className="gallery_gradientDarkenerBottom__beJ_V" />

          <div className="gallery_items__s42jn">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="gallery_column__Q1Uug">
                <div
                  data-direction={columnIndex % 2 === 0 ? "down" : "up"}
                  className="gallery_columnInner__2mGXI"
                >
                  {[...column, ...column].map((item, index) => (
                    <div key={`${item.label}-${index}`} className="gallery_item__trquU">
                      <div className="gallery_media__EUyD3">
                        <div className="gallery_videoWrapper__PpYIS">
                          <img src={item.image} alt={item.label} loading="lazy" />
                        </div>
                      </div>
                      <span className="gallery_name__phfqE">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
