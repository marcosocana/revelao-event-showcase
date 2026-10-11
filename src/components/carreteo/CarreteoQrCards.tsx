import { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "@/pages/carreteo.module.css";

// Las tarjetas de ejemplo abren la demo de la cámara: escanéalas con el móvil para probarla.
export const DEMO_CAMERA_URL = "https://www.revelao.cam/carreteo?demo=camara";

const cards = [
  { id: "amarilla", nombre: "Amarilla", evento: "Boda de Lucía & Pablo", fecha: "12 · 06 · 2027", className: styles.qrCardYellow },
  { id: "grafito", nombre: "Grafito", evento: "Los 30 de Marta", fecha: "Sábado 21 · 22:00", className: styles.qrCardDark },
  { id: "crema", nombre: "Crema", evento: "Lucía & Pablo", fecha: "Finca El Olivar · 2027", className: styles.qrCardCream },
];

export const CarreteoQrCards = () => {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(DEMO_CAMERA_URL, { errorCorrectionLevel: "H", margin: 1, width: 360, color: { dark: "#111113", light: "#ffffff" } })
      .then((url) => { if (!cancelled) setQr(url); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.qrGrid}>
      {cards.map((card) => (
        <figure className={styles.qrItem} key={card.id}>
          <div className={`${styles.qrCard} ${card.className}`}>
            <p className={styles.qrBrand}>CARRETEO<span>.</span></p>
            <p className={styles.qrEvent}>{card.evento}</p>
            <div className={styles.qrCode}>
              {qr ? <img src={qr} alt={`Código QR de ejemplo, diseño ${card.nombre.toLowerCase()}`} width={180} height={180} /> : <span />}
            </div>
            <p className={styles.qrText}>Accede a tu cámara desechable desde este código QR.</p>
            <p className={styles.qrHint}>No malgastes disparos, solo tienes 25 fotos :)</p>
            <p className={styles.qrDate}>{card.fecha}</p>
          </div>
          <figcaption>Diseño {card.nombre.toLowerCase()}</figcaption>
        </figure>
      ))}
    </div>
  );
};
