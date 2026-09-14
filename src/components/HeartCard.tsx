import { useEffect, useRef, useState } from "react";
import { Heart } from "./Heart";
export function HeartCard({
  onOpen,
  onInteract,
}: {
  onOpen: () => void;
  onInteract: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <section className={`cover ${opening ? "opening" : ""}`}>
      <span className="eyebrow cover-date">
        15 / 09 <span>·</span> PARA ÉRICA
      </span>
      <div className="cover-halo" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="cover-center">
        <div className="little-star">✧</div>
        <button
          className="heart-card"
          aria-label="Abrir a carta de aniversário para Érica"
          disabled={opening}
          onPointerMove={(e) => {
            if (e.pointerType === "mouse") {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty(
                "--tilt",
                `${(e.clientX - r.left - r.width / 2) / 35}deg`,
              );
            }
          }}
          onPointerLeave={(e) =>
            e.currentTarget.style.setProperty("--tilt", "0deg")
          }
          onClick={() => {
            setOpening(true);
            onInteract();
            timer.current = setTimeout(
              onOpen,
              matchMedia("(prefers-reduced-motion: reduce)").matches
                ? 150
                : 1700,
            );
          }}
        >
          <span className="card-half left">
            <Heart side="left" />
          </span>
          <span className="card-half right">
            <Heart side="right" />
          </span>
          <span className="card-seam" />
        </button>
        <p className="cover-whisper">Tenho algo para você...</p>
        <span className="touch-hint">
          TOQUE NO CORAÇÃO <span>↗</span>
        </span>
      </div>
      <div className="cover-bottom">
        <span className="fine-line" />
        <span>uma pequena surpresa, só sua</span>
        <span className="fine-line" />
      </div>
    </section>
  );
}
