import { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Briefcase, Users, FileText, BarChart, UserCheck, Newspaper, User } from 'lucide-react';
import aisamLogo from '../assets/aisam-logo.webp';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN_AISAM';
  const isRecrutador = user?.role === 'RECRUTADOR';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img src={aisamLogo} alt="AISAM" className="h-10" />
              {title && (
                <span className="text-gray-600">| {title}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.nome}</p>
                <p className="text-gray-500 text-xs">
                  {user?.role === 'ADMIN_AISAM' ? 'Administrador' :
                   user?.role === 'RECRUTADOR' ? 'Recrutador' : 'Candidato'}
                </p>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home size={20} />
                  Dashboard
                </Link>
                <Link
                  to="/admin/vagas"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Briefcase size={20} />
                  Vagas
                </Link>
                <Link
                  to="/admin/associados"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Users size={20} />
                  Associados
                </Link>
                <Link
                  to="/admin/recrutadores"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Users size={20} />
                  Recrutadores
                </Link>
                <Link
                  to="/admin/candidatos"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserCheck size={20} />
                  Candidatos
                </Link>
                <Link
                  to="/admin/noticias"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Newspaper size={20} />
                  Notícias
                </Link>
                <Link
                  to="/admin/relatorios"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BarChart size={20} />
                  Relatórios
                </Link>
                <hr className="my-2 border-gray-200" />
                <Link
                  to="/admin/perfil"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={20} />
                  Meu Perfil
                </Link>
              </>
            )}

            {isRecrutador && (
              <>
                <Link
                  to="/recrutador"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home size={20} />
                  Dashboard
                </Link>
                <Link
                  to="/recrutador/vagas"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Briefcase size={20} />
                  Minhas Vagas
                </Link>
                <Link
                  to="/recrutador/candidaturas"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileText size={20} />
                  Candidaturas
                </Link>
                <Link
                  to="/recrutador/relatorios"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <BarChart size={20} />
                  Relatórios
                </Link>
                <hr className="my-2 border-gray-200" />
                <Link
                  to="/recrutador/perfil"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User size={20} />
                  Meu Perfil
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
