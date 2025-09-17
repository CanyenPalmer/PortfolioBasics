import { useEffect, useRef, useState } from "react";

type Options = {
  threshold?: number;
  rearmOnExit?: boolean; // if true: re-trigger when fully left and re-entered
};

export function useOnceInView<T extends HTMLElement>({
  threshold = 0.6,
  rearmOnExit = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [entered, setEntered] = useState(false);
  const [armed, setArmed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && armed) {
            setEntered(true);
            setArmed(false);
          } else if (!e.isIntersecting && rearmOnExit && !armed) {
            setEntered(false);
            setArmed(true);
          }
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [armed, rearmOnExit, threshold]);

  return { ref, entered };
}
