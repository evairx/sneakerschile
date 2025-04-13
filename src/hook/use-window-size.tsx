import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

const windowSize = signal({ width: window.innerWidth, height: window.innerHeight });

export function useWindowSize() {
  useEffect(() => {
    const handleResize = () => {
      windowSize.value = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}