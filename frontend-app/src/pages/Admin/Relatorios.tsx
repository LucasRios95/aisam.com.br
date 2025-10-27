import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import {
  BarChart,
  TrendingUp,
  Users,
  Briefcase,
  Building,
  UserCheck,
  Calendar,
  Download,
  PieChart,
  Activity,
} from 'lucide-react';
import vagasService, { type Vaga } from '../../services/vagas';
import candidatosService, { type Candidato } from '../../services/candidatos';
import associadosService, { type Associado } from '../../services/associados';
import recrutadoresService, { type Recrutador } from '../../services/recrutadores';
import areasService, { type AreaAtuacao } from '../../services/areas';

interface RelatorioData {
  vagas: Vaga[];
  candidatos: Candidato[];
  associados: Associado[];
  recrutadores: Recrutador[];
  areas: AreaAtuacao[];
}

export default function AdminRelatorios() {
  const [data, setData] = useState<RelatorioData>({
    vagas: [],
    candidatos: [],
    associados: [],
    recrutadores: [],
    areas: [],
  });
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'ano' | 'tudo'>('mes');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);

      const [vagas, candidatos, associados, recrutadores, areas] = await Promise.all([
        vagasService.listar({}),
        candidatosService.listar(),
        associadosService.listar(),
        recrutadoresService.listar(),
        areasService.listar(),
      ]);

      setData({
        vagas,
        candidatos,
        associados,
        recrutadores,
        areas,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  }

  // Estatísticas calculadas
  const stats = {
    totalVagas: data.vagas.length,
    vagasAbertas: data.vagas.filter((v) => v.status === 'aberta').length,
    vagasFechadas: data.vagas.filter((v) => v.status === 'fechada').length,
    totalCandidatos: data.candidatos.length,
    totalAssociados: data.associados.length,
    associadosAtivos: data.associados.filter((a) => a.ativo).length,
    totalRecrutadores: data.recrutadores.length,
    recrutadoresAtivos: data.recrutadores.filter((r) => r.ativo).length,
  };

  // Top 5 áreas com mais vagas
  const vagasPorArea = data.areas.map((area) => ({
    area: area.nome,
    quantidade: data.vagas.filter((vaga) => vaga.areas_atuacao?.includes(area.nome)).length,
  }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  // Top 5 associados com mais vagas
  const vagasPorAssociado = data.associados.map((associado) => ({
    nome: associado.nome_fantasia,
    quantidade: data.vagas.filter((vaga) => vaga.associado?.id === associado.id).length,
  }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  // Candidatos por área
  const candidatosPorArea = data.areas.map((area) => ({
    area: area.nome,
    quantidade: data.candidatos.filter((candidato) =>
      candidato.areas_atuacao?.includes(area.nome)
    ).length,
  }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  function exportarRelatorio() {
    const relatorio = {
      gerado_em: new Date().toISOString(),
      periodo,
      estatisticas: stats,
      vagas_por_area: vagasPorArea,
      vagas_por_associado: vagasPorAssociado,
      candidatos_por_area: candidatosPorArea,
    };

    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-aisam-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <Layout title="Relatórios">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Relatórios">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Relatórios e Estatísticas</h2>
            <p className="text-gray-600 mt-1">
              Análise detalhada do sistema AISAM
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as any)}
              className="input-field"
            >
              <option value="mes">Último mês</option>
              <option value="trimestre">Último trimestre</option>
              <option value="ano">Último ano</option>
              <option value="tudo">Todo o período</option>
            </select>

            <button
              onClick={exportarRelatorio}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={20} />
              Exportar
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total de Vagas</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalVagas}</p>
                <div className="flex gap-3 mt-2 text-xs text-blue-700">
                  <span>{stats.vagasAbertas} abertas</span>
                  <span>{stats.vagasFechadas} fechadas</span>
                </div>
              </div>
              <Briefcase size={40} className="text-blue-400" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Candidatos</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalCandidatos}</p>
                <p className="text-xs text-green-700 mt-2">No banco de talentos</p>
              </div>
              <UserCheck size={40} className="text-green-400" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Associados</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalAssociados}</p>
                <p className="text-xs text-purple-700 mt-2">{stats.associadosAtivos} ativos</p>
              </div>
              <Building size={40} className="text-purple-400" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Recrutadores</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">{stats.totalRecrutadores}</p>
                <p className="text-xs text-orange-700 mt-2">{stats.recrutadoresAtivos} ativos</p>
              </div>
              <Users size={40} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Análise de Vagas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Áreas com Mais Vagas */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="text-primary-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">
                Top 5 Áreas com Mais Vagas
              </h3>
            </div>

            <div className="space-y-3">
              {vagasPorArea.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.area}</span>
                    <span className="text-sm font-bold text-primary-600">{item.quantidade}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.quantidade / Math.max(...vagasPorArea.map((v) => v.quantidade))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              {vagasPorArea.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhuma vaga cadastrada ainda
                </p>
              )}
            </div>
          </div>

          {/* Top 5 Associados com Mais Vagas */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-primary-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">
                Top 5 Associados com Mais Vagas
              </h3>
            </div>

            <div className="space-y-3">
              {vagasPorAssociado.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {item.nome}
                    </span>
                    <span className="text-sm font-bold text-primary-600">{item.quantidade}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.quantidade / Math.max(...vagasPorAssociado.map((v) => v.quantidade))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              {vagasPorAssociado.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhuma vaga cadastrada ainda
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Análise de Candidatos */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-primary-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">
              Distribuição de Candidatos por Área
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidatosPorArea.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.area}</p>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{item.quantidade}</p>
                    <p className="text-xs text-gray-500 mt-1">candidatos</p>
                  </div>
                  <Activity className="text-gray-400" size={32} />
                </div>
              </div>
            ))}

            {candidatosPorArea.length === 0 && (
              <div className="col-span-full">
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhum candidato cadastrado ainda
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-primary-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Resumo Geral</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Vagas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de vagas:</span>
                  <span className="font-semibold">{stats.totalVagas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vagas abertas:</span>
                  <span className="font-semibold text-green-600">{stats.vagasAbertas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vagas fechadas:</span>
                  <span className="font-semibold text-gray-500">{stats.vagasFechadas}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Taxa de abertura:</span>
                  <span className="font-semibold text-primary-600">
                    {stats.totalVagas > 0
                      ? Math.round((stats.vagasAbertas / stats.totalVagas) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Usuários</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de candidatos:</span>
                  <span className="font-semibold">{stats.totalCandidatos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Associados ativos:</span>
                  <span className="font-semibold text-green-600">{stats.associadosAtivos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recrutadores ativos:</span>
                  <span className="font-semibold text-green-600">{stats.recrutadoresAtivos}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Total de usuários:</span>
                  <span className="font-semibold text-primary-600">
                    {stats.totalCandidatos + stats.totalAssociados + stats.totalRecrutadores}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Activity className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-blue-900">Sobre os Relatórios</h4>
              <p className="text-sm text-blue-700 mt-1">
                Os dados apresentados são atualizados em tempo real. Use os filtros de período
                para análises específicas e exporte os relatórios quando necessário.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
