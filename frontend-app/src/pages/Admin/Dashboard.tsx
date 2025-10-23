import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Briefcase, Users, Building, FileText, TrendingUp } from 'lucide-react';
import vagasService from '../../services/vagas';
import associadosService from '../../services/associados';
import recrutadoresService from '../../services/recrutadores';

interface Stats {
  totalVagas: number;
  vagasAbertas: number;
  vagasFechadas: number;
  totalAssociados: number;
  totalRecrutadores: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVagas: 0,
    vagasAbertas: 0,
    vagasFechadas: 0,
    totalAssociados: 0,
    totalRecrutadores: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);

      const [todasVagas, vagasAbertas, vagasFechadas, associados, recrutadores] = await Promise.allSettled([
        vagasService.listar({}),
        vagasService.listar({ status: 'aberta' }),
        vagasService.listar({ status: 'fechada' }),
        associadosService.listar(),
        recrutadoresService.listar(),
      ]);

      setStats({
        totalVagas: todasVagas.status === 'fulfilled' ? todasVagas.value.length : 0,
        vagasAbertas: vagasAbertas.status === 'fulfilled' ? vagasAbertas.value.length : 0,
        vagasFechadas: vagasFechadas.status === 'fulfilled' ? vagasFechadas.value.length : 0,
        totalAssociados: associados.status === 'fulfilled' ? associados.value.length : 0,
        totalRecrutadores: recrutadores.status === 'fulfilled' ? recrutadores.value.length : 0,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Dashboard Administrativo">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Administrativo">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h2>
          <p className="text-gray-600 mt-1">Visão geral do sistema AISAM</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Vagas</p>
                <p className="text-3xl font-bold mt-2">{stats.totalVagas}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {stats.vagasAbertas} abertas | {stats.vagasFechadas} fechadas
                </p>
              </div>
              <Briefcase size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Associados</p>
                <p className="text-3xl font-bold mt-2">{stats.totalAssociados}</p>
                <p className="text-purple-100 text-xs mt-1">Empresas cadastradas</p>
              </div>
              <Building size={40} className="text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Recrutadores</p>
                <p className="text-3xl font-bold mt-2">{stats.totalRecrutadores}</p>
                <p className="text-green-100 text-xs mt-1">Usuários ativos</p>
              </div>
              <Users size={40} className="text-green-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerenciamento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/vagas"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Vagas</p>
                  <p className="text-sm text-gray-600">Gerenciar todas as vagas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/associados"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Associados</p>
                  <p className="text-sm text-gray-600">Empresas cadastradas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/recrutadores"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Recrutadores</p>
                  <p className="text-sm text-gray-600">Gerenciar usuários</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/relatorios"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Relatórios</p>
                  <p className="text-sm text-gray-600">Análises e estatísticas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/areas"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Áreas de Atuação</p>
                  <p className="text-sm text-gray-600">Gerenciar tags de vagas</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Backend API</span>
              </div>
              <span className="text-sm text-green-600">Operacional</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Banco de Dados</span>
              </div>
              <span className="text-sm text-green-600">Operacional</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Serviço de E-mail</span>
              </div>
              <span className="text-sm text-green-600">Operacional</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
