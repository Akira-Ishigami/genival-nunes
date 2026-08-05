import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import ImageWithFallback from '../ui/ImageWithFallback';
import Carousel from '../ui/Carousel';
import { useSecoes } from '../../hooks/useSecoes';
import { useSecaoBySlug } from '../../hooks/useContent';
import type { Secao } from '../../types';

function BlocoSecao({ secao, numero }: { secao: Secao; numero: number }) {
  const { itens, loading } = useSecaoBySlug(secao.slug);

  return (
    <section id={`secao-${secao.slug}`} className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          number={String(numero).padStart(2, '0')}
          eyebrow="Conteúdo"
          title={secao.titulo}
          subtitle={secao.descricao ?? undefined}
          align="center"
        />
      </Container>

      {loading && (
        <Container>
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-56 w-44 shrink-0 rounded-3xl sm:h-64 sm:w-56" />
            ))}
          </div>
        </Container>
      )}

      {!loading && itens.length === 0 && (
        <Container>
          <p className="text-center text-ink/50">Nenhum conteúdo publicado nesta seção ainda.</p>
        </Container>
      )}

      {!loading && itens.length > 0 && (
        <Carousel>
          {itens.map((item, i) => (
            <Reveal key={item.id} delay={(i % 8) * 60} className="w-44 shrink-0 snap-start sm:w-56 lg:w-64">
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">
                <ImageWithFallback src={item.foto_url} alt={item.titulo ?? ''} className="aspect-square w-full" />
                {(item.titulo || item.descricao) && (
                  <div className="p-4">
                    {item.titulo && <h3 className="line-clamp-1 font-display text-sm font-semibold text-navy">{item.titulo}</h3>}
                    {item.descricao && <p className="line-clamp-2 text-xs text-ink/50">{item.descricao}</p>}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </Carousel>
      )}
    </section>
  );
}

export default function SecoesDinamicasSection() {
  const { secoes } = useSecoes();

  return (
    <>
      {secoes.map((s, i) => (
        <BlocoSecao key={s.id} secao={s} numero={i + 5} />
      ))}
    </>
  );
}
