import { useState } from "react";
import styles from "./carreteo.module.css";

// Capturas reales de la cámara Carreteo (revelao.cam/carreteo/:slug) en un móvil en horizontal.
const estados = [
  {
    titulo: "Gira la rueda",
    texto: "Como en una desechable: arrastra la rueda para avanzar el carrete.",
    imagen: "/carreteo/camara-inicio.jpg",
    alt: "Cámara Carreteo con el contador a 0 de 25 y el aviso Avanza la rueda",
  },
  {
    titulo: "Encuadra y dispara",
    texto: "Abre el visor si quieres, enciende el flash y pulsa el disparador.",
    imagen: "/carreteo/camara-lista-visor.jpg",
    alt: "Cámara Carreteo con el visor abierto y el aviso Lista para disparar",
  },
  {
    titulo: "Cuenta cada foto",
    texto: "El contador baja con cada disparo. 25 fotos: piensa antes de disparar.",
    imagen: "/carreteo/camara-tras-disparo.jpg",
    alt: "Cámara Carreteo con el flash encendido y el contador en 8 de 25",
  },
  {
    titulo: "Espera al revelado",
    texto: "Con el carrete completo, la cámara te dice cuándo se revelan las fotos.",
    imagen: "/carreteo/camara-completa.jpg",
    alt: "Cámara Carreteo con el carrete completo, 25 de 25, y la fecha del revelado",
  },
];

export function CarreteoDemo() {
  const [activo, setActivo] = useState(0);
  const estado = estados[activo];

  return (
    <div className={styles.demoWrap}>
      <figure className={styles.phoneLandscape}>
        {estados.map((item, index) => (
          <img
            key={item.imagen}
            src={item.imagen}
            alt={item.alt}
            width={1600}
            height={739}
            loading="lazy"
            className={index === activo ? styles.demoShotActive : styles.demoShot}
            aria-hidden={index !== activo}
          />
        ))}
      </figure>
      <div className={styles.demoTabs} role="tablist" aria-label="Pasos de la cámara">
        {estados.map((item, index) => (
          <button
            key={item.titulo}
            type="button"
            role="tab"
            aria-selected={index === activo}
            className={index === activo ? styles.demoTabActive : styles.demoTab}
            onClick={() => setActivo(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.titulo}
          </button>
        ))}
      </div>
      <p className={styles.demoCaption} aria-live="polite">{estado.texto}</p>
    </div>
  );
}
