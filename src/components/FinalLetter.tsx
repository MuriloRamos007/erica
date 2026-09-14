import { finalMessage } from "../data/finalMessage";
import photos from "../data/photos.json";
import { useReveal } from "../hooks/useReveal";
import { Heart } from "./Heart";
import { MemoryPhoto, type Photo } from "./MemoryPhoto";
function Paragraph({ text, index }: { text: string; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`letter-paragraph reveal ${visible ? "visible" : ""} ${[2, 5, 8, 10, 11].includes(index) ? "emphasis" : ""} ${index === 8 ? "pause" : ""} ${index >= 10 ? "last-words" : ""} ${index === 12 ? "last-message" : ""}`}
      data-paragraph={index}
    >
      <p>{text}</p>
      {index === 12 && (
        <div className="last-heart">
          <Heart />
        </div>
      )}
    </div>
  );
}
export function FinalLetter({
  onReplay,
  onZoom,
}: {
  onReplay: () => void;
  onZoom: (p: Photo) => void;
}) {
  return (
    <section className="final-letter" aria-label="Carta para Érica">
      <div className="letter-divider" />
      <div className="letter-body">
        {finalMessage.map((text, i) => (
          <div key={i}>
            <Paragraph text={text} index={i} />
            {i === 1 && (
              <div className="letter-memory">
                <MemoryPhoto photo={photos[6]} onZoom={onZoom} />
              </div>
            )}
            {i === 6 && (
              <div className="letter-memory">
                <MemoryPhoto photo={photos[7]} onZoom={onZoom} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="closing-photos">
        {[photos[8], photos[9]].map((p) => (
          <MemoryPhoto key={p.id} photo={p} onZoom={onZoom} />
        ))}
      </div>
      <button className="text-button replay" onClick={onReplay}>
        <span aria-hidden="true">↺</span> Ver tudo outra vez
      </button>
    </section>
  );
}
