import { useRef, useState, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Container from './Container';

export default function Carousel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateArrows() {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;

    // Sem isso, navegadores desktop convertem a rolagem vertical do mouse/trackpad em
    // rolagem horizontal quando o cursor passa por cima de uma lista horizontal, travando
    // o usuário aqui e impedindo de descer a página. Só sequestramos o gesto quando ele
    // já é predominantemente horizontal (deltaX maior que deltaY).
    function onWheel(e: WheelEvent) {
      if (!el) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaX;
    }

    el.addEventListener('scroll', updateArrows, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  // Avança uma "página" inteira por clique, como um slideshow, em vez de um scroll parcial.
  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * dir, behavior: 'smooth' });
  }

  const btnBase = 'tap-target flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-card-lg transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-90';
  const btnTheme = dark ? 'bg-white text-navy' : 'bg-navy text-white';

  return (
    <Container>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollBy(-1)}
          disabled={!canLeft}
          className={`${btnBase} ${btnTheme}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/*
          A rolagem fica no elemento de fora (bloco comum), não num flex com
          justify-center — flex centralizado com overflow tem um bug conhecido
          nos navegadores que deixa os primeiros itens inacessíveis ao rolar.
          mx-auto no conteúdo interno centraliza sem esse problema.
        */}
        <div ref={trackRef} className="scrollbar-none min-w-0 flex-1 overflow-x-auto scroll-smooth py-2">
          <div className="mx-auto flex w-fit snap-x snap-mandatory gap-4 px-1 sm:gap-5">{children}</div>
        </div>

        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollBy(1)}
          disabled={!canRight}
          className={`${btnBase} ${btnTheme}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </Container>
  );
}
