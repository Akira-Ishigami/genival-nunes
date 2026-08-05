import { useEffect, useState } from 'react';
import { ArrowDown, MapPin } from 'lucide-react';
import Container from '../ui/Container';
import CountUp from '../ui/CountUp';
import { scrollToId } from '../layout/Header';
import { useConteudo, useProfessores, useAtividades, useGaleria } from '../../hooks/useContent';

export default function HeroSection() {
  const { conteudo } = useConteudo(['missao']);
  const { professores } = useProfessores();
  const { atividades } = useAtividades();
  const { fotos } = useGaleria();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function onScroll() {
      setOffset(window.scrollY);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const anos = new Date().getFullYear() - 1992;

  const stats = [
    { value: anos, suffix: '', label: 'anos de história' },
    { value: professores.length, suffix: '+', label: 'professores' },
    { value: atividades.length, suffix: '+', label: 'atividades' },
    { value: fotos.length, suffix: '+', label: 'espaços na escola' },
  ];

  return (
    <section id="inicio" className="grain relative overflow-hidden bg-navy pb-24 pt-28 sm:pb-32 sm:pt-36">
      {/* Fachada real da escola, ao fundo */}
      <img
        src="/logo/frente-escola.webp"
        alt="Fachada da EEEFM Deputado Genival Nunes da Costa"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `translateY(${offset * 0.06}px)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/30 sm:from-navy-deep sm:via-navy-deep/75 sm:to-navy-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/5 to-transparent" />

      {/* Blobs decorativos com parallax leve */}
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sky/30 blur-[90px] sm:h-[28rem] sm:w-[28rem]"
        style={{ transform: `translateY(${offset * 0.12}px)` }}
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-green/25 blur-[90px]"
        style={{ transform: `translateY(${offset * -0.08}px)` }}
      />

      <Container className="relative z-[2]">
        <h1 className="max-w-3xl animate-fade-in-up font-display text-[2.6rem] font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
          EEEFM Deputado
          <br />
          <span className="text-sky-light">Genival Nunes</span> da Costa
        </h1>

        <p
          className="mt-6 max-w-lg animate-fade-in-up text-base leading-relaxed text-white/70 sm:text-lg"
          style={{ animationDelay: '120ms' }}
        >
          {conteudo.missao?.corpo ??
            'Formação integral em tempo integral, preparando estudantes para a vida, o trabalho e o exercício da cidadania.'}
        </p>

        <div
          className="mt-8 flex animate-fade-in-up flex-wrap gap-3"
          style={{ animationDelay: '220ms' }}
        >
          <button
            type="button"
            onClick={() => scrollToId('sobre')}
            className="tap-target group inline-flex items-center gap-2 rounded-full bg-yellow px-6 py-3.5 text-sm font-bold text-navy-deep shadow-pop transition-transform active:scale-95 active:shadow-none"
          >
            Conheça a escola
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToId('localizacao')}
            className="tap-target inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <MapPin className="h-4 w-4" /> Como chegar
          </button>
        </div>

        <dl
          className="mt-16 grid animate-fade-in-up grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-8"
          style={{ animationDelay: '320ms' }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/50 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </dl>
      </Container>

      <button
        type="button"
        onClick={() => scrollToId('avisos')}
        aria-label="Rolar para baixo"
        className="absolute bottom-6 left-1/2 z-[2] hidden -translate-x-1/2 animate-float text-white/50 hover:text-white/80 sm:block"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>
  );
}
