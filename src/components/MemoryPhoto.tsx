import { useEffect, useRef } from "react";
import photos from "../data/photos.json";
import { useReveal } from "../hooks/useReveal";
export type Photo = (typeof photos)[number];
export function MemoryPhoto({
  photo,
  caption,
  onZoom,
}: {
  photo: Photo;
  caption?: string;
  onZoom: (p: Photo) => void;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`memory reveal ${visible ? "visible" : ""}`}>
      <button
        className="photo-button"
        onClick={() => onZoom(photo)}
        aria-label={`Ampliar ${photo.alt.toLowerCase()}`}
      >
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(max-width: 600px) 82vw, 420px"
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          alt={photo.alt}
        />
        <span className="zoom-mark" aria-hidden="true">
          ↗
        </span>
      </button>
      {caption && <p>{caption}</p>}
    </div>
  );
}
export function PhotoDialog({
  photo,
  onClose,
}: {
  photo: Photo | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (photo) {
      ref.current?.showModal();
      const prior = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prior;
        ref.current?.close();
      };
    }
  }, [photo]);
  return (
    <dialog
      ref={ref}
      className="lightbox"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label="Fotografia ampliada"
    >
      {photo && (
        <>
          <button
            className="close-photo"
            onClick={onClose}
            aria-label="Fechar fotografia"
          >
            ×
          </button>
          <img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
          />
        </>
      )}
    </dialog>
  );
}
