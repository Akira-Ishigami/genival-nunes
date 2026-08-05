import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import Container from '../ui/Container';
import { useSecoes } from '../../hooks/useSecoes';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const NAV_LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'avisos', label: 'Avisos' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'atividades', label: 'Atividades' },
  { id: 'estrutura', label: 'Estrutura' },
  { id: 'localizacao', label: 'Localização' },
];

// Portais externos usados pela equipe da escola (Ideb, formação, sistema estadual, etc.)
const LINKS_UTEIS = [
  { label: 'QEdu | Ideb', href: 'https://qedu.org.br/escola/11033428-eeef-deputado-genival-nunes-da-costa/ideb' },
  { label: 'Formação Continuada', href: 'https://formacaoescolagenivalnunes.com.br' },
  { label: 'Portal do Estudante', href: 'https://sde.seduc.ro.gov.br/portal/login.php' },
  { label: 'Escola.com.br', href: 'https://escolas.com.br/eeefm-deputado-genival-nunes-da-costa-11033428' },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { secoes } = useSecoes();
  const linksRef = useRef<HTMLDivElement>(null);

  const links = [
    ...NAV_LINKS.filter((l) => l.id !== 'avisos'),
    ...secoes.map((s) => ({ id: `secao-${s.slug}`, label: s.titulo })),
  ];
  const active = useScrollSpy(links.map((l) => l.id));

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (linksRef.current && !linksRef.current.contains(e.target as Node)) setLinksOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function goTo(id: string) {
    setOpen(false);
    scrollToId(id);
  }

  return (
    <header
      className={`safe-top fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-card backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <button
          type="button"
          onClick={() => goTo('inicio')}
          className={`flex items-center gap-2.5 font-display text-sm font-bold transition-colors sm:text-base ${
            scrolled ? 'text-navy' : 'text-white'
          }`}
        >
          <span className="flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-1.5 py-1 shadow-card sm:h-12">
            <img
              src="/logo/logo.webp"
              alt="Logo do Programa de Educação Integral"
              className="h-full w-auto object-contain"
            />
          </span>
          <span className="text-left leading-tight">
            Genival Nunes
            <span
              className={`block text-[10px] font-normal uppercase tracking-[0.18em] sm:text-[11px] ${
                scrolled ? 'text-navy/60' : 'text-white/70'
              }`}
            >
              Educação Integral
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => goTo(l.id)}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                scrolled ? 'text-navy/70 hover:text-navy' : 'text-white/80 hover:text-white'
              } ${active === l.id ? (scrolled ? '!text-navy' : '!text-white') : ''}`}
            >
              {l.label}
              {active === l.id && (
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-[2.5px] rounded-full ${
                    scrolled ? 'bg-yellow-dark' : 'bg-yellow'
                  }`}
                />
              )}
            </button>
          ))}

          <div className="relative ml-1" ref={linksRef}>
            <button
              type="button"
              onClick={() => setLinksOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                scrolled
                  ? 'border-navy/15 text-navy/70 hover:text-navy'
                  : 'border-white/25 text-white/80 hover:text-white'
              }`}
            >
              Links Úteis
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${linksOpen ? 'rotate-180' : ''}`} />
            </button>

            {linksOpen && (
              <div className="animate-scale-in absolute right-0 top-full mt-2 w-60 origin-top-right rounded-2xl border border-navy/10 bg-white p-2 shadow-modal">
                {LINKS_UTEIS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setLinksOpen(false)}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-navy/80 transition-colors hover:bg-sand hover:text-navy"
                  >
                    {l.label}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-navy/40" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
          className={`tap-target flex items-center justify-center rounded-full lg:hidden ${
            scrolled ? 'text-navy' : 'text-white'
          }`}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="animate-slide-down safe-bottom absolute inset-x-0 top-16 z-30 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-navy/10 bg-white shadow-modal sm:top-20 lg:hidden">
          <nav className="flex flex-col p-3">
            <p className="mb-1 px-4 text-xs font-bold uppercase tracking-wide text-navy/40">Links Úteis</p>
            {LINKS_UTEIS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="tap-target flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-base font-semibold text-navy/70 active:bg-sand"
              >
                {l.label}
                <ExternalLink className="h-4 w-4 shrink-0 text-navy/40" />
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export { scrollToId };
