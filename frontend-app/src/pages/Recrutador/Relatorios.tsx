import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import {
  BarChart,
  TrendingUp,
  Users,
  Briefcase,
  Calendar,
  Download,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import vagasService, { type Vaga } from '../../services/vagas';
import candidaturasService, { type Candidatura } from '../../services/candidaturas';

interface RelatorioData {
  vagas: Vaga[];
  candidaturas: Candidatura[];
}

interface Stats {
  totalVagas: number;
  vagasAbertas: number;
  vagasPausadas: number;
  vagasFechadas: number;
  totalCandidaturas: number;
  candidaturasEmAnalise: number;
  candidaturasContatadas: number;
  candidaturasFinalizadas: number;
}

export default function RecrutadorRelatorios() {
  const [data, setData] = useState<RelatorioData>({
    vagas: [],
    candidaturas: [],
  });
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'ano' | 'tudo'>('mes');

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  async function carregarDados() {
    try {
      setLoading(true);

      // CRÍTICO: Usa listarMinhasVagas para garantir que só vê suas próprias vagas
      const [vagas, candidaturas] = await Promise.all([
        vagasService.listarMinhasVagas(),
        candidaturasService.listar(),
      ]);

      setData({
        vagas,
        candidaturas,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  }

  // Estatísticas calculadas
  const stats: Stats = {
    totalVagas: data.vagas.length,
    vagasAbertas: data.vagas.filter((v) => v.status === 'aberta').length,
    vagasPausadas: data.vagas.filter((v) => v.status === 'pausada').length,
    vagasFechadas: data.vagas.filter((v) => v.status === 'fechada').length,
    totalCandidaturas: data.candidaturas.length,
    candidaturasEmAnalise: data.candidaturas.filter((c) => c.status === 'em_analise' || c.status === 'interessado').length,
    candidaturasContatadas: data.candidaturas.filter((c) => c.status === 'contatado').length,
    candidaturasFinalizadas: data.candidaturas.filter((c) => c.status === 'finalizado').length,
  };

  // Vagas com mais candidaturas
  const vagasPopulares = data.vagas
    .map((vaga) => ({
      titulo: vaga.titulo,
      candidaturas: data.candidaturas.filter((c) => c.vaga_id === vaga.id).length,
    }))
    .sort((a, b) => b.candidaturas - a.candidaturas)
    .slice(0, 5);

  // Candidaturas por status
  const candidaturasPorStatus = [
    {
      status: 'Interessado',
      quantidade: data.candidaturas.filter((c) => c.status === 'interessado').length,
    },
    {
      status: 'Em Análise',
      quantidade: data.candidaturas.filter((c) => c.status === 'em_analise').length,
    },
    {
      status: 'Contatado',
      quantidade: data.candidaturas.filter((c) => c.status === 'contatado').length,
    },
    {
      status: 'Finalizado',
      quantidade: data.candidaturas.filter((c) => c.status === 'finalizado').length,
    },
  ];

  // Função para exportar CSV
  const exportarCSV = () => {
    const csvData = [
      ['Tipo', 'Descrição', 'Quantidade'],
      ['Vagas', 'Total', stats.totalVagas],
      ['Vagas', 'Abertas', stats.vagasAbertas],
      ['Vagas', 'Pausadas', stats.vagasPausadas],
      ['Vagas', 'Fechadas', stats.vagasFechadas],
      ['Candidaturas', 'Total', stats.totalCandidaturas],
      ['Candidaturas', 'Em Análise', stats.candidaturasEmAnalise],
      ['Candidaturas', 'Contatadas', stats.candidaturasContatadas],
      ['Candidaturas', 'Finalizadas', stats.candidaturasFinalizadas],
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios e Estatísticas</h1>
            <p className="text-gray-500 mt-1">Acompanhe o desempenho das suas vagas</p>
          </div>
          <div className="flex gap-2">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="mes">Último mês</option>
              <option value="trimestre">Último trimestre</option>
              <option value="ano">Último ano</option>
              <option value="tudo">Tudo</option>
            </select>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Download className="h-5 w-5" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total de Vagas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalVagas}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {stats.vagasAbertas} abertas
              </span>
              <span className="text-gray-500 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                {stats.vagasFechadas} fechadas
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Candidaturas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCandidaturas}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Total de inscrições recebidas
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Em Análise</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.candidaturasEmAnalise}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Aguardando revisão
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Finalizadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.candidaturasFinalizadas}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Processos concluídos
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vagas Mais Populares */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Vagas Mais Populares
              </h2>
            </div>
            <div className="space-y-3">
              {vagasPopulares.length > 0 ? (
                vagasPopulares.map((vaga, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{vaga.titulo}</p>
                    </div>
                    <span className="ml-2 px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                      {vaga.candidaturas}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma vaga cadastrada</p>
              )}
            </div>
          </div>

          {/* Candidaturas por Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Candidaturas por Status
              </h2>
            </div>
            <div className="space-y-3">
              {candidaturasPorStatus.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{item.status}</span>
                    <span className="text-gray-900 font-semibold">{item.quantidade}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-yellow-500' :
                        index === 2 ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}
                      style={{
                        width: `${stats.totalCandidaturas > 0 ? (item.quantidade / stats.totalCandidaturas) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo Detalhado */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Resumo Detalhado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status das Vagas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Abertas</span>
                  <span className="font-semibold text-green-600">{stats.vagasAbertas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Pausadas</span>
                  <span className="font-semibold text-yellow-600">{stats.vagasPausadas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Fechadas</span>
                  <span className="font-semibold text-gray-600">{stats.vagasFechadas}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Fluxo de Candidaturas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Novas</span>
                  <span className="font-semibold text-blue-600">
                    {candidaturasPorStatus.find(c => c.status === 'Interessado')?.quantidade || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Em revisão</span>
                  <span className="font-semibold text-yellow-600">
                    {candidaturasPorStatus.find(c => c.status === 'Em Análise')?.quantidade || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Contatadas</span>
                  <span className="font-semibold text-purple-600">{stats.candidaturasContatadas}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Taxa de conversão</span>
                  <span className="font-semibold text-primary">
                    {stats.totalCandidaturas > 0
                      ? `${((stats.candidaturasFinalizadas / stats.totalCandidaturas) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Média por vaga</span>
                  <span className="font-semibold text-primary">
                    {stats.totalVagas > 0
                      ? (stats.totalCandidaturas / stats.totalVagas).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
