import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/public/HomePage';

import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProfessoresAdminPage from './pages/admin/ProfessoresAdminPage';
import AtividadesAdminPage from './pages/admin/AtividadesAdminPage';
import GaleriaAdminPage from './pages/admin/GaleriaAdminPage';
import PostsAdminPage from './pages/admin/PostsAdminPage';
import VidaEstudantilAdminPage from './pages/admin/VidaEstudantilAdminPage';

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
  return <Outlet />;
}

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/admin/login', element: <LoginPage /> },
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
