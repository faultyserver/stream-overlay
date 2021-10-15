import * as React from "react";

export default function useAnimationFrame<T>(callback: () => T, callbackDeps: any[] = []): T {
  const [result] = React.useState<{ current: T }>(() => ({ current: callback() }));
  const rafId = React.useRef<number>();

  React.useEffect(() => {
    function loop() {
      rafId.current != null && cancelAnimationFrame(rafId.current);
      result.current = callback();
      rafId.current = requestAnimationFrame(loop);
    }

    rafId.current = requestAnimationFrame(loop);
    return () => {
      rafId.current != null && cancelAnimationFrame(rafId.current);
    };
  }, [...callbackDeps]);

  return result.current;
}
