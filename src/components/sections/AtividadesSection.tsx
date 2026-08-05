import { useState } from 'react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import ImageWithFallback from '../ui/ImageWithFallback';
import { useAtividades } from '../../hooks/useContent';
import type { CategoriaAtividade } from '../../types';

const CATEGORIA_COR: Record<string, string> = {
  esportiva: 'bg-green text-white',
  cultural: 'bg-yellow text-navy-deep',
  extracurricular: 'bg-sky text-navy-deep',
  geral: 'bg-white text-navy',
};

const FILTROS: { value: CategoriaAtividade | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'esportiva', label: 'Esportivas' },
  { value: 'cultural', label: 'Culturais' },
  { value: 'extracurricular', label: 'Extracurriculares' },
];

// A primeira atividade filtrada vira um cartaz maior, dando destaque editorial ao grid.
function tamanho(i: number) {
  return i === 0 ? 'sm:col-span-2 sm:row-span-2' : '';
}

export default function AtividadesSection() {
  const { atividades, loading } = useAtividades();
  const [filtro, setFiltro] = useState<CategoriaAtividade | 'todas'>('todas');

  const filtradas = filtro === 'todas' ? atividades : atividades.filter((a) => a.categoria === filtro);

  return (
    <section id="atividades" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          number="03"
          eyebrow="Protagonismo juvenil"
          title="Atividades"
          subtitle="Esporte, cultura e projetos que estimulam a participação dos nossos estudantes."
          align="center"
        />

        <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltro(f.value)}
              className={`tap-target rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filtro === f.value ? 'bg-navy text-white' : 'bg-white text-navy/75 shadow-card hover:text-navy'
              }`}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-72 rounded-3xl" />)}
          </div>
        )}

        {!loading && filtradas.length === 0 && (
          <p className="text-center text-ink/70">Nenhuma atividade nesta categoria ainda.</p>
        )}

        <div className="grid grid-cols-1 gap-5 sm:auto-rows-[13rem] sm:grid-cols-3">
          {filtradas.map((a, i) => (
            <Reveal key={a.id} delay={(i % 6) * 70} className={`group relative overflow-hidden rounded-3xl shadow-card transition-all hover:shadow-card-lg sm:h-full ${tamanho(i)}`}>
              <div className="relative h-64 w-full sm:h-full">
                <ImageWithFallback
                  src={a.foto_url}
                  alt={a.titulo}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 sm:p-6">
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-card ${CATEGORIA_COR[a.categoria] ?? CATEGORIA_COR.geral}`}>
                    {a.categoria}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white sm:text-xl">{a.titulo}</h3>
                  {a.descricao && (
                    <p className="line-clamp-2 max-w-md text-sm leading-relaxed text-white/80 sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:max-h-24 sm:group-hover:opacity-100">
                      {a.descricao}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
