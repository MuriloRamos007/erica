import { useEffect, useRef, useState } from "react";
export function useReveal(onReveal?: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const callback = useRef(onReveal);
  callback.current = onReveal;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          callback.current?.();
          observer.disconnect();
        }
      },
      { rootMargin: "-18% 0px -26% 0px", threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}
