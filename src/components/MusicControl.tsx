import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
export type MusicHandle = { start: () => void; reset: () => void };
export const MusicControl = forwardRef<MusicHandle, { quiet: boolean }>(
  function MusicControl({ quiet }, ref) {
    const audio = useRef<HTMLAudioElement>(null);
    const [available, setAvailable] = useState(false);
    const [playing, setPlaying] = useState(false);
    useEffect(() => {
      if (!import.meta.env.VITE_HAS_MUSIC) return;
      const controller = new AbortController();
      fetch(`${import.meta.env.BASE_URL}music.mp3`, {
        method: "HEAD",
        signal: controller.signal,
      })
        .then((r) => {
          if (
            r.ok &&
            /audio|octet-stream/i.test(r.headers.get("content-type") || "")
          )
            setAvailable(true);
        })
        .catch(() => {});
      return () => controller.abort();
    }, []);
    const start = () => {
      if (available)
        audio.current
          ?.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
    };
    useImperativeHandle(ref, () => ({
      start,
      reset: () => {
        audio.current?.pause();
        if (audio.current) audio.current.currentTime = 0;
        setPlaying(false);
      },
    }));
    useEffect(() => {
      if (audio.current) audio.current.volume = quiet ? 0.2 : 0.35;
    }, [quiet, available]);
    return available ? (
      <>
        <audio
          ref={audio}
          src={`${import.meta.env.BASE_URL}music.mp3`}
          loop
          preload="none"
          onError={() => setAvailable(false)}
        />
        <button
          className="music-control"
          aria-label={playing ? "Pausar música" : "Reproduzir música"}
          aria-pressed={playing}
          onClick={() => {
            if (playing) {
              audio.current?.pause();
              setPlaying(false);
            } else start();
          }}
        >
          {playing ? "Ⅱ" : "♫"}
          <span>{playing ? "Pausar" : "Música"}</span>
        </button>
      </>
    ) : null;
  },
);
