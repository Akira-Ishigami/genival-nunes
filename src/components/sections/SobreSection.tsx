import { BookOpen, Eye, Heart, Quote } from 'lucide-react';
import Container from '../ui/Container';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { useConteudo } from '../../hooks/useContent';

const BLOCOS = [
  { chave: 'visao', icon: Eye, cor: 'group-hover:bg-green' },
  { chave: 'valores', icon: Heart, cor: 'group-hover:bg-sky' },
];

export default function SobreSection() {
  const { conteudo, loading } = useConteudo(['historia', 'missao', ...BLOCOS.map((b) => b.chave)]);
  const historia = conteudo.historia;
  const missao = conteudo.missao;

  return (
    <section id="sobre" className="scroll-mt-20 bg-cream py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              number="01"
              eyebrow="Nossa escola"
              title="Uma trajetória de compromisso com a educação"
              subtitle="Desde 1992 formando estudantes de Vilhena/RO através do Programa de Educação Integral."
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            {loading && (
              <>
                <div className="skeleton h-72 rounded-3xl" />
                <div className="skeleton h-28 rounded-3xl" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-3xl" />)}
                </div>
              </>
            )}

            {!loading && historia && (
              <Reveal>
                <article className="group overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card transition-all hover:shadow-card-lg">
                  <div className="relative">
                    <img
                      src="/logo/frente-escola.webp"
                      alt="Fachada da EEEFM Deputado Genival Nunes da Costa"
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-72"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-navy-deep/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      Nossa fachada, no Bairro Boa Esperança
                    </span>
                  </div>
                  <div className="p-7 sm:p-9">
                    <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-cream transition-colors group-hover:bg-sky">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-navy sm:text-2xl">{historia.titulo}</h3>
                    <p className="mt-3 max-w-3xl whitespace-pre-line text-base leading-[1.75] text-ink/70">
                      {historia.corpo}
                    </p>
                  </div>
                </article>
              </Reveal>
            )}

            {!loading && missao && (
              <Reveal>
                <article className="relative overflow-hidden rounded-3xl bg-navy p-7 shadow-card sm:p-9">
                  <Quote className="absolute -right-2 -top-2 h-24 w-24 text-white/5" strokeWidth={1} />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow">{missao.titulo}</p>
                  <p className="relative mt-3 max-w-2xl whitespace-pre-line font-display text-xl font-medium leading-snug text-white sm:text-2xl">
                    {missao.corpo}
                  </p>
                </article>
              </Reveal>
            )}

            {!loading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {BLOCOS.map(({ chave, icon: Icon, cor }, i) => {
                  const c = conteudo[chave];
                  if (!c) return null;
                  return (
                    <Reveal key={chave} delay={(i % 4) * 90}>
                      <article className="group h-full rounded-3xl border border-navy/10 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-lg sm:p-7">
                        <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-cream transition-colors ${cor}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="font-display text-lg font-semibold text-navy">{c.titulo}</h3>
                        <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.7] text-ink/70">{c.corpo}</p>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
