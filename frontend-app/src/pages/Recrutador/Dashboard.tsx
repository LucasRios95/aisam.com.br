import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Briefcase, Users, CheckCircle, Clock, PlusCircle } from 'lucide-react';
import vagasService from '../../services/vagas';
import candidaturasService from '../../services/candidaturas';

interface Stats {
  totalVagas: number;
  vagasAbertas: number;
  totalCandidaturas: number;
  candidaturasNaoAvaliadas: number;
}

export default function RecrutadorDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVagas: 0,
    vagasAbertas: 0,
    totalCandidaturas: 0,
    candidaturasNaoAvaliadas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);

      // CRÍTICO: Usa listarMinhasVagas para garantir que só vê suas próprias vagas e candidaturas
      const [todasVagas, candidaturas] = await Promise.all([
        vagasService.listarMinhasVagas(),
        candidaturasService.listar({}),
      ]);

      const vagasAbertas = todasVagas.filter((v) => v.status === 'aberta');

      const candidaturasNaoAvaliadas = candidaturas.filter(
        (c) => c.status === 'pendente'
      ).length;

      setStats({
        totalVagas: todasVagas.length,
        vagasAbertas: vagasAbertas.length,
        totalCandidaturas: candidaturas.length,
        candidaturasNaoAvaliadas,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">Visão geral das suas vagas e candidaturas</p>
          </div>

          <Link
            to="/recrutador/vagas/nova"
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Nova Vaga
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Vagas</p>
                <p className="text-3xl font-bold mt-2">{stats.totalVagas}</p>
              </div>
              <Briefcase size={40} className="text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Vagas Abertas</p>
                <p className="text-3xl font-bold mt-2">{stats.vagasAbertas}</p>
              </div>
              <CheckCircle size={40} className="text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Candidaturas</p>
                <p className="text-3xl font-bold mt-2">{stats.totalCandidaturas}</p>
              </div>
              <Users size={40} className="text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Não Avaliadas</p>
                <p className="text-3xl font-bold mt-2">{stats.candidaturasNaoAvaliadas}</p>
              </div>
              <Clock size={40} className="text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/recrutador/vagas"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Gerenciar Vagas</p>
                  <p className="text-sm text-gray-600">Visualize e edite suas vagas publicadas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/recrutador/candidaturas"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="text-primary-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">Ver Candidaturas</p>
                  <p className="text-sm text-gray-600">Analise os candidatos às suas vagas</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        {stats.candidaturasNaoAvaliadas > 0 && (
          <div className="card bg-orange-50 border-orange-200">
            <div className="flex items-start gap-3">
              <Clock className="text-orange-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Atenção: Candidaturas Pendentes
                </h3>
                <p className="text-gray-600 mt-1">
                  Você tem {stats.candidaturasNaoAvaliadas} candidatura(s) aguardando avaliação.
                </p>
                <Link
                  to="/recrutador/candidaturas"
                  className="inline-block mt-3 text-orange-600 font-medium hover:text-orange-700"
                >
                  Ver candidaturas →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
