import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView';

// Anima de 0 até `value` quando o número entra na tela — dá vida aos números
// calculados a partir do que o admin cadastrou (quantidade de professores, etc.).
export default function CountUp({
  value,
  suffix = '',
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || value <= 0) return;
    started.current = true;

    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {value > 0 ? display : '—'}
      {value > 0 && suffix}
    </span>
  );
}
