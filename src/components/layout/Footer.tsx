import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Container from '../ui/Container';
import { useContato } from '../../hooks/useContent';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '../ui/BrandIcons';

export default function Footer() {
  const { contato } = useContato();

  const year = new Date().getFullYear();

  return (
    <footer className="grain safe-bottom relative bg-navy-deep text-white/70">
      <Container className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <span className="mb-3 flex h-12 w-fit items-center justify-center rounded-xl bg-white px-1.5 py-1 shadow-card">
            <img src="/logo/logo.webp" alt="Logo do Programa de Educação Integral" className="h-full w-auto object-contain" />
          </span>
          <h3 className="font-display text-lg font-bold text-white">EEEFM Deputado Genival Nunes da Costa</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Educação integral em tempo integral, preparando estudantes para a vida, o trabalho e o exercício da
            cidadania.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">Contato</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {contato?.endereco && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  {contato.endereco}, {contato.bairro} — {contato.cidade}
                </span>
              </li>
            )}
            {contato?.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${contato.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target -ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4 text-accent" /> WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">Redes sociais</h4>
          <div className="mt-3 flex gap-3">
            {contato?.instagram && (
              <a
                href={`https://instagram.com/${contato.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="tap-target flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-brand-dark"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {contato?.facebook && (
              <a
                href={contato.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="tap-target flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-brand-dark"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
            {contato?.whatsapp && (
              <a
                href={`https://wa.me/${contato.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="tap-target flex items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-brand-dark"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/55 sm:flex-row">
          <p>
            {/*
              Ponto de acesso do painel administrativo: propositalmente discreto,
              sem estilo de link, sem ícone — não deve chamar atenção visual.
            */}
            <Link
              to="/admin/login"
              aria-label="Acesso restrito"
              className="tap-target -ml-2 inline-flex items-center px-2 py-1 text-white/40 no-underline hover:text-white/40"
              style={{ cursor: 'default' }}
            >
              ©
            </Link>{' '}
            {year} EEEFM Deputado Genival Nunes da Costa. Todos os direitos reservados.
          </p>
          <p>Vilhena/RO</p>
        </Container>
      </div>

      <div className="border-t border-white/5">
        <Container className="flex justify-center py-4">
          <p className="text-[11px] text-white/50">
            Feito por{' '}
            <a
              href="https://www.instagram.com/dev__akira/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/70 transition-colors hover:text-yellow"
            >
              Akira Ishigami Magalhães
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
