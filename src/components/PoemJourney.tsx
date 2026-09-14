import { useCallback, useEffect, useRef, useState } from "react";
import { poem } from "../data/poem";
import photos from "../data/photos.json";
import { useReveal } from "../hooks/useReveal";
import { Heart } from "./Heart";
import { MemoryPhoto, type Photo } from "./MemoryPhoto";
function PoemVerse({
  text,
  index,
  onReveal,
}: {
  text: string;
  index: number;
  onReveal: (i: number, el: HTMLDivElement) => void;
}) {
  const { ref, visible } = useReveal(() => {
    if (ref.current) onReveal(index, ref.current);
  });
  return (
    <div
      ref={ref}
      data-verse={index + 1}
      className={`verse ${index % 2 ? "verse-right" : "verse-left"} ${visible ? "visible" : ""}`}
    >
      <span className="verse-number">{String(index + 1).padStart(2, "0")}</span>
      <p>{text}</p>
      <span className="verse-dot" />
    </div>
  );
}
export function PoemJourney({
  onComplete,
  onZoom,
}: {
  onComplete: () => void;
  onZoom: (p: Photo) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [secret, setSecret] = useState(false);
  const seen = useRef(new Set<number>());
  const heart = useRef<HTMLButtonElement>(null);
  const clicks = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const reveal = useCallback((i: number, el: HTMLDivElement) => {
    if (seen.current.has(i)) return;
    seen.current.add(i);
    const a = el.getBoundingClientRect(),
      b = heart.current?.getBoundingClientRect();
    if (b && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const mote = document.createElement("span");
      mote.className = "travel-mote";
      document.body.append(mote);
      const x = i % 2 ? a.left : a.right,
        y = a.top + a.height / 2;
      const animation = mote.animate(
        [
          { transform: `translate(${x}px,${y}px) scale(.4)`, opacity: 0 },
          { opacity: 1, offset: 0.2 },
          {
            transform: `translate(${b.left + b.width / 2}px,${b.top + b.height / 2}px) scale(.6)`,
            opacity: 0,
          },
        ],
        { duration: 1000, easing: "cubic-bezier(.3,0,.2,1)" },
      );
      animation.onfinish = () => mote.remove();
      timers.current.push(setTimeout(() => mote.remove(), 1100));
    }
    timers.current.push(setTimeout(() => setProgress(seen.current.size), 850));
  }, []);
  useEffect(() => {
    if (progress === 24) {
      const timer = setTimeout(() => complete.current(), 1400);
      return () => clearTimeout(timer);
    }
  }, [progress]);
  return (
    <section
      className={`journey ${progress === 24 ? "complete" : ""}`}
      aria-label="Poema em 24 versos"
    >
      <header className="journey-heading">
        <span className="eyebrow">CADA PALAVRA, UM POUCO DE NÓS</span>
        <h2>
          Foi assim que você
          <br />
          <em>iluminou tudo.</em>
        </h2>
        <span className="scroll-line" />
      </header>
      <div className="heart-track">
        <div className="heart-sticky">
          <button
            ref={heart}
            className={`progress-heart ${progress === 24 ? "full" : ""}`}
            aria-label={`Coração: ${progress} de 24 partes preenchidas`}
            onClick={() => {
              if (progress === 24 && ++clicks.current % 3 === 0) {
                setSecret(true);
                timers.current.push(setTimeout(() => setSecret(false), 2600));
              }
            }}
          >
            <Heart progress={progress} />
          </button>
          <span className="progress-count" aria-live="polite">
            {String(progress).padStart(2, "0")} <span>/</span> 24
          </span>
          {secret && <span className="secret">Eu te amo, Érica.</span>}
        </div>
      </div>
      <div className="verses">
        {poem.map((text, i) => (
          <div key={i}>
            <PoemVerse text={text} index={i} onReveal={reveal} />
            {[3, 7, 11, 15, 19, 22].includes(i) && (
              <div
                className={`memory-row ${i % 8 === 3 ? "memory-left" : "memory-right"}`}
              >
                <MemoryPhoto
                  photo={photos[[3, 7, 11, 15, 19, 22].indexOf(i)]}
                  onZoom={onZoom}
                  caption={
                    i === 3
                      ? "Um dos meus lugares favoritos: ao seu lado."
                      : i === 11
                        ? "Você deixou meus dias mais bonitos."
                        : undefined
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="journey-outro" />
    </section>
  );
}
