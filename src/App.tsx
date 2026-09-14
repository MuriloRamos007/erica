import { useRef, useState } from "react";
import { HeartCard } from "./components/HeartCard";
import { BirthdayIntro } from "./components/BirthdayIntro";
import { PoemJourney } from "./components/PoemJourney";
import { FinalLetter } from "./components/FinalLetter";
import { PhotoDialog, type Photo } from "./components/MemoryPhoto";
import { MusicControl, type MusicHandle } from "./components/MusicControl";
export default function App() {
  const [stage, setStage] = useState<"closed" | "intro" | "story">("closed");
  const [finished, setFinished] = useState(false);
  const [run, setRun] = useState(0);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const music = useRef<MusicHandle>(null);
  const replay = async () => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const check = () => {
          if (window.scrollY < 2 || performance.now() - start > 2400) resolve();
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhoto(null);
    setFinished(false);
    setStage("closed");
    setRun((r) => r + 1);
    music.current?.reset();
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLButtonElement>(".heart-card")
        ?.focus({ preventScroll: true }),
    );
  };
  return (
    <>
      <div className="ambient" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 19 + 9) % 100}%`,
              animationDelay: `${-i * 1.7}s`,
            }}
          />
        ))}
      </div>
      <main key={run}>
        {stage === "closed" ? (
          <HeartCard
            onOpen={() => setStage("intro")}
            onInteract={() => music.current?.start()}
          />
        ) : stage === "intro" ? (
          <BirthdayIntro
            onContinue={() => {
              setStage("story");
              window.scrollTo(0, 0);
            }}
          />
        ) : (
          <>
            <PoemJourney
              onComplete={() => setFinished(true)}
              onZoom={setPhoto}
            />
            {finished && <FinalLetter onReplay={replay} onZoom={setPhoto} />}
          </>
        )}
      </main>
      <MusicControl ref={music} quiet={finished} />
      <PhotoDialog photo={photo} onClose={() => setPhoto(null)} />
    </>
  );
}
