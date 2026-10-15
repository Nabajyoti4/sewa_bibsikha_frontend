import { useEffect, useState } from "react";
import useInView from "../hooks/useInView";

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const CountUp = ({ value, suffix = "", duration = 1800 }: CountUpProps) => {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {current}
      {suffix}
    </span>
  );
};

export default CountUp;
