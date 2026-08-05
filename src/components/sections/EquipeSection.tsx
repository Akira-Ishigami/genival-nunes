import { useState } from 'react';
import { X } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import ImageWithFallback from '../ui/ImageWithFallback';
import Carousel from '../ui/Carousel';
import { useProfessores, useConteudo } from '../../hooks/useContent';
import type { Professor, CategoriaEquipe } from '../../types';

const GRUPOS: { categoria: CategoriaEquipe; titulo: string }[] = [
  { categoria: 'gestao', titulo: 'Gestão' },
  { categoria: 'professor', titulo: 'Docentes' },
  { categoria: 'tecnica', titulo: 'Equipe Técnica' },
];

const GRUPO_COR: Record<CategoriaEquipe, string> = {
  gestao: 'bg-sky',
  professor: 'bg-yellow-dark',
  tecnica: 'bg-green',
};

const GRUPO_TEXTO: Record<CategoriaEquipe, string> = {
  gestao: 'text-sky-dark',
  professor: 'text-yellow-dark',
  tecnica: 'text-green-dark',
};

const GRUPO_LABEL: Record<CategoriaEquipe, string> = {
  gestao: 'Gestão',
  professor: 'Docente',
  tecnica: 'Equipe Técnica',
};

export default function EquipeSection() {
  const { professores, loading } = useProfessores();
  const { conteudo } = useConteudo(['equipe']);
  const [selecionado, setSelecionado] = useState<Professor | null>(null);
  const [filtro, setFiltro] = useState<CategoriaEquipe>('gestao');

  const pessoas = professores.filter((p) => p.categoria === filtro);

  return (
    <section id="equipe" className="scroll-mt-20 bg-navy py-20 sm:py-28">
      <Container>
        <SectionHeading
          number="02"
          eyebrow="Nossa comunidade"
          title="Equipe da Escola"
          subtitle={
            conteudo.equipe?.corpo ??
            'Profissionais qualificados, dedicados e experientes, comprometidos com a formação dos nossos estudantes.'
          }
          light
          align="center"
        />

        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {GRUPOS.map((g) => {
            const total = professores.filter((p) => p.categoria === g.categoria).length;
            return (
              <button
                key={g.categoria}
                type="button"
                onClick={() => setFiltro(g.categoria)}
                className={`tap-target rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  filtro === g.categoria
                    ? 'bg-sky text-navy-deep'
                    : 'border border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {g.titulo}
                {total > 0 && <span className="ml-1.5 opacity-60">({total})</span>}
              </button>
            );
          })}
        </Reveal>
      </Container>

      {loading && (
        <Container>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-64 w-44 shrink-0 rounded-3xl sm:h-72 sm:w-52" />
            ))}
          </div>
        </Container>
      )}

      {!loading && pessoas.length === 0 && (
        <Container>
          <p className="text-center text-white/50">Em breve, essa equipe será publicada aqui.</p>
        </Container>
      )}

      {!loading && pessoas.length > 0 && (
        <Carousel dark>
          {pessoas.map((p, i) => (
            <Reveal key={p.id} delay={(i % 6) * 70} className="w-36 shrink-0 snap-start sm:w-44 md:w-48 lg:w-52">
              <button
                type="button"
                onClick={() => setSelecionado(p)}
                className="tap-target group flex w-full flex-col overflow-hidden rounded-3xl bg-white/5 text-left ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:ring-yellow/60 active:scale-95"
              >
                <ImageWithFallback src={p.foto_url} alt={p.nome} className="aspect-[3/4] w-full" />
                <div className="p-4">
                  <h4 className="line-clamp-1 font-display text-sm font-semibold text-white">{p.nome}</h4>
                  {p.cargo && <p className="line-clamp-1 text-xs text-yellow-light">{p.cargo}</p>}
                </div>
              </button>
            </Reveal>
          ))}
        </Carousel>
      )}

      {selecionado && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setSelecionado(null)}
        >
          <div
            className="animate-slide-up sm:animate-scale-in safe-bottom w-full max-w-sm overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <ImageWithFallback src={selecionado.foto_url} alt={selecionado.nome} className="aspect-square w-full sm:aspect-[4/3]" />
              <button
                type="button"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar"
                className="tap-target absolute right-3 top-3 flex items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-7">
              <p className={`mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${GRUPO_TEXTO[selecionado.categoria]}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${GRUPO_COR[selecionado.categoria]}`} />
                {GRUPO_LABEL[selecionado.categoria]}
              </p>
              <h3 className="font-display text-2xl font-semibold text-navy">{selecionado.nome}</h3>
              {(selecionado.cargo || selecionado.disciplina) && (
                <p className="mt-0.5 text-sm text-ink/50">
                  {selecionado.cargo}
                  {selecionado.cargo && selecionado.disciplina && ' · '}
                  {selecionado.disciplina}
                </p>
              )}
              {selecionado.bio && (
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/70">{selecionado.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
