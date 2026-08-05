import { useState, type FormEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RequireDesktop from '../../components/admin/RequireDesktop';

export default function LoginPage() {
  const { signIn, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const msg = await signIn(email, senha);
    if (msg) setErro('E-mail ou senha inválidos.');
    setEnviando(false);
  }

  return (
    <RequireDesktop>
    <div className="grain safe-top safe-bottom relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-sky/25 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-green/20 blur-[100px]" />

      <div className="relative w-full max-w-sm">
        <div className="animate-scale-in rounded-3xl bg-white p-8 shadow-modal">
          <div className="mb-7 flex flex-col items-center gap-4 text-center">
            <span className="flex h-14 items-center justify-center rounded-xl bg-white px-2 py-1.5 ring-1 ring-navy/10">
              <img src="/logo/logo.webp" alt="Logo do Programa de Educação Integral" className="h-full w-auto object-contain" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-navy">Acesso restrito</h1>
              <p className="mt-1 text-xs text-ink/50">Painel administrativo — EEEFM Genival Nunes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-navy/15 px-4 py-3 text-sm text-ink transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/25"
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-xl border border-navy/15 px-4 py-3 pr-11 text-sm text-ink transition-colors focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/25"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
                  className="tap-target absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center text-ink/40 hover:text-ink/70"
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{erro}</p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="tap-target mt-2 flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white shadow-card transition-all hover:bg-navy-light active:scale-95 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" /> {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
        </Link>
      </div>
    </div>
    </RequireDesktop>
  );
}
