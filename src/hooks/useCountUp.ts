import { useState, useEffect } from "react";

export function useCountUp(end: number, duration: number = 1000): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out sine
      const easeOut = Math.sin((progress * Math.PI) / 2);
      
      setCount(Math.round(easeOut * end));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}
