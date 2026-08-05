import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Trophy, Images, Megaphone, Sparkles, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RequireDesktop from './RequireDesktop';

const NAV = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: 'Avisos', icon: Megaphone },
  { to: '/admin/professores', label: 'Equipe', icon: Users },
  { to: '/admin/atividades', label: 'Atividades', icon: Trophy },
  { to: '/admin/galeria', label: 'Fotos da Estrutura', icon: Images },
  { to: '/admin/secoes', label: 'Vida Estudantil', icon: Sparkles },
];

// O painel só roda no computador (ver RequireDesktop), então não precisa de menu hambúrguer/mobile.
export default function AdminLayout() {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <RequireDesktop>
      <div className="flex h-screen overflow-hidden bg-bg">
        <aside className="flex h-full w-64 shrink-0 flex-col bg-brand-dark">
          <div className="p-5 text-sm font-bold text-white">Painel Admin</div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `tap-target flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/10 p-3">
            <p className="truncate px-3 py-1 text-xs text-slate-400">{profile?.nome}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="tap-target flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" /> Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </RequireDesktop>
  );
}
