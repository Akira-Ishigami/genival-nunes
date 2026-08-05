import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ArrowLeft } from 'lucide-react';
import { useIsDesktop } from '../../hooks/useIsDesktop';

// O painel admin foi desenhado só pra uso no computador — em vez de uma versão mobile
// espremida e confusa (o público daqui é leigo em tecnologia), bloqueamos com uma mensagem clara.
export default function RequireDesktop({ children }: { children: ReactNode }) {
  const isDesktop = useIsDesktop();

  if (isDesktop) return <>{children}</>;

  return (
    <div className="grain safe-top safe-bottom relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-6 text-center">
      <div className="relative flex flex-col items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Monitor className="h-7 w-7" />
        </span>
        <h1 className="font-display text-xl font-semibold text-white">Acesse pelo computador</h1>
        <p className="max-w-xs text-sm leading-relaxed text-white/60">
          O painel administrativo funciona melhor num computador. Abra este endereço num notebook ou
          computador pra continuar.
        </p>
        <Link
          to="/"
          className="tap-target mt-2 flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>
      </div>
    </div>
  );
}
