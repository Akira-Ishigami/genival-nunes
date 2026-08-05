import { CalendarDays, Pin } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import ImageWithFallback from '../ui/ImageWithFallback';
import Carousel from '../ui/Carousel';
import { usePostsAtivos } from '../../hooks/useContent';

function formatData(d: string) {
  const [, m, day] = d.split('-');
  return `${day}/${m}`;
}

export default function PostsSection() {
  const { posts } = usePostsAtivos();

  if (posts.length === 0) return null;

  return (
    <section id="avisos" className="scroll-mt-20 border-y border-navy/10 bg-sand py-12 sm:py-16">
      <Container>
        <Reveal className="mb-6 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-sky-dark" />
          <h2 className="font-display text-xl font-semibold text-navy sm:text-2xl">Avisos e novidades</h2>
        </Reveal>
      </Container>

      <Carousel>
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={i * 90} className="w-64 shrink-0 snap-start sm:w-72 lg:w-80">
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">
              <div className="relative">
                <ImageWithFallback src={p.foto_url} alt={p.titulo} className="h-40 w-full" />
                {p.fixado && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-deep shadow-card">
                    <Pin className="h-3 w-3" /> Destaque
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-dark">
                  {formatData(p.data_inicio)}
                  {p.data_fim ? ` — ${formatData(p.data_fim)}` : ''}
                </p>
                <h3 className="font-display text-base font-semibold text-navy">{p.titulo}</h3>
                {p.conteudo && <p className="line-clamp-3 flex-1 text-sm text-ink/60">{p.conteudo}</p>}
              </div>
            </article>
          </Reveal>
        ))}
      </Carousel>
    </section>
  );
}
