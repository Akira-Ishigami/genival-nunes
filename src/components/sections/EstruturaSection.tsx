import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import ImageWithFallback from '../ui/ImageWithFallback';
import { useGaleria, useConteudo } from '../../hooks/useContent';
import { shuffle } from '../../lib/shuffle';
import type { GaleriaFoto } from '../../types';

const MAX_FOTOS = 8;

// Alterna o tamanho das células para criar um grid tipo "bento", mais editorial que uma grade uniforme.
function tamanho(i: number) {
  const m = i % 6;
  if (m === 0) return 'sm:col-span-2 sm:row-span-2';
  if (m === 3) return 'sm:col-span-2';
  return '';
}

export default function EstruturaSection() {
  const { fotos: todasFotos, loading } = useGaleria();
  const { conteudo } = useConteudo(['estrutura']);
  const [selecionada, setSelecionada] = useState<GaleriaFoto | null>(null);

  // Se houver mais de 8 fotos, sorteia quais aparecem — muda a cada recarregamento da página.
  const fotos = useMemo(() => {
    if (todasFotos.length <= MAX_FOTOS) return todasFotos;
    return shuffle(todasFotos).slice(0, MAX_FOTOS);
  }, [todasFotos]);

  return (
    <section id="estrutura" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          number="04"
          eyebrow="Nosso campo"
          title="Estrutura"
          subtitle={conteudo.estrutura?.corpo ?? 'Conheça os espaços da nossa escola.'}
          align="center"
        />

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-square rounded-3xl" />)}
          </div>
        )}

        {!loading && fotos.length === 0 && (
          <p className="text-center text-ink/50">As fotos da estrutura serão publicadas em breve.</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:auto-rows-[10rem] sm:grid-cols-4">
          {fotos.map((f, i) => (
            <Reveal key={f.id} delay={(i % 8) * 60} className={`aspect-square sm:aspect-auto ${tamanho(i)}`}>
              <button
                type="button"
                onClick={() => setSelecionada(f)}
                className="tap-target group relative block h-full w-full overflow-hidden rounded-3xl shadow-card transition-transform active:scale-95"
              >
                <ImageWithFallback src={f.foto_url} alt={f.titulo} className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 sm:p-4">
                  <p className="font-display text-sm font-semibold text-white">{f.titulo}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {selecionada && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setSelecionada(null)}
        >
          <div
            className="animate-slide-up sm:animate-scale-in safe-bottom w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <ImageWithFallback src={selecionada.foto_url} alt={selecionada.titulo} className="max-h-[60vh] w-full" />
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                aria-label="Fechar"
                className="tap-target absolute right-3 top-3 flex items-center justify-center rounded-full bg-white/90 text-navy shadow-card"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="font-display text-base font-semibold text-navy">{selecionada.titulo}</h3>
              {selecionada.descricao && (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/60">
                  {selecionada.descricao}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
