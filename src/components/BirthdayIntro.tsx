import { useEffect, useRef } from "react";
export function BirthdayIntro({ onContinue }: { onContinue: () => void }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => title.current?.focus(), []);
  return (
    <section className="intro">
      <span className="eyebrow">UM DIA INTEIRO PARA CELEBRAR VOCÊ</span>
      <h1 ref={title} tabIndex={-1}>
        Feliz aniversário,
        <br />
        <em>Érica.</em>
      </h1>
      <span className="intro-date">15 de setembro</span>
      <div className="intro-rule" />
      <p>
        Eu poderia simplesmente te desejar feliz aniversário...
        <br />
        mas queria fazer algo que mostrasse um pouco do que você trouxe para a
        minha vida.
      </p>
      <button className="text-button" onClick={onContinue}>
        Continue <span aria-hidden="true">♡ &nbsp; ↓</span>
      </button>
    </section>
  );
}
