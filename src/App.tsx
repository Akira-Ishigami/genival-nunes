import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/public/HomePage';

// O painel admin só carrega pra quem realmente acessa /admin/* — assim o
// pacote JS que o Google baixa pra indexar o site público fica bem menor
// (o tempo de carregamento conta pro ranqueamento nas buscas).
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const ProfessoresAdminPage = lazy(() => import('./pages/admin/ProfessoresAdminPage'));
const AtividadesAdminPage = lazy(() => import('./pages/admin/AtividadesAdminPage'));
const GaleriaAdminPage = lazy(() => import('./pages/admin/GaleriaAdminPage'));
const PostsAdminPage = lazy(() => import('./pages/admin/PostsAdminPage'));
const VidaEstudantilAdminPage = lazy(() => import('./pages/admin/VidaEstudantilAdminPage'));

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
    </div>
  );
}

// Rotas /admin/* não redirecionam para /admin/login quando não autenticado:
// voltam para a home pública, para não revelar que a rota de admin existe.
function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return (
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<Spinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'professores', element: <ProfessoresAdminPage /> },
          { path: 'atividades', element: <AtividadesAdminPage /> },
          { path: 'galeria', element: <GaleriaAdminPage /> },
          { path: 'posts', element: <PostsAdminPage /> },
          { path: 'secoes', element: <VidaEstudantilAdminPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
