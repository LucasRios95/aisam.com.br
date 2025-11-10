import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Plus, Search, Eye, Edit2, Pause, Play, X as XIcon, MapPin, Building } from 'lucide-react';
import vagasService, { type Vaga } from '../../services/vagas';

const regimeLabels: Record<string, string> = {
  presencial: 'Presencial',
  hibrido: 'Híbrido',
  remoto: 'Remoto',
};

const senioridadeLabels: Record<string, string> = {
  estagio: 'Estágio',
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
  especialista: 'Especialista',
};

const statusLabels: Record<string, { label: string; color: string }> = {
  aberta: { label: 'Aberta', color: 'bg-green-100 text-green-700' },
  fechada: { label: 'Fechada', color: 'bg-gray-100 text-gray-700' },
  pausada: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-700' },
};

export default function RecrutadorVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('aberta');

  useEffect(() => {
    carregarVagas();
  }, []);

  async function carregarVagas() {
    try {
      setLoading(true);
      // Busca apenas as vagas do recrutador logado
      const data = await vagasService.listarMinhasVagas();
      setVagas(data);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      alert('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  }

  const vagasFiltradas = vagas.filter((vaga) => {
    const matchSearch =
      vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.descricao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !statusFilter || vaga.status === statusFilter;

    return matchSearch && matchStatus;
  });

  async function handleToggleStatus(vagaId: string, novoStatus: 'aberta' | 'pausada' | 'fechada') {
    try {
      if (novoStatus === 'pausada') {
        await vagasService.pausar(vagaId);
        alert('Vaga pausada com sucesso!');
      } else if (novoStatus === 'aberta') {
        await vagasService.reabrir(vagaId);
        alert('Vaga reaberta com sucesso!');
      } else if (novoStatus === 'fechada') {
        await vagasService.encerrar(vagaId);
        alert('Vaga encerrada com sucesso!');
      }
      await carregarVagas();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      alert(error.response?.data?.message || 'Erro ao atualizar status da vaga');
    }
  }

  if (loading) {
    return (
      <Layout title="Minhas Vagas">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Minhas Vagas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Minhas Vagas</h2>
            <p className="text-gray-600 mt-1">
              Gerencie as vagas que você publicou
            </p>
          </div>

          <Link to="/recrutador/vagas/nova" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nova Vaga
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium">Vagas Abertas</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {vagas.filter((v) => v.status === 'aberta').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <p className="text-sm text-yellow-700 font-medium">Vagas Pausadas</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">
              {vagas.filter((v) => v.status === 'pausada').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <p className="text-sm text-gray-700 font-medium">Vagas Fechadas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {vagas.filter((v) => v.status === 'fechada').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="aberta">Abertas</option>
                <option value="pausada">Pausadas</option>
                <option value="fechada">Fechadas</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Exibindo {vagasFiltradas.length} de {vagas.length} vagas
          </div>
        </div>

        {/* List */}
        {vagasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter
                ? 'Nenhuma vaga encontrada com os filtros aplicados'
                : 'Você ainda não publicou nenhuma vaga'}
            </p>
            {!searchTerm && !statusFilter && (
              <Link to="/recrutador/vagas/nova" className="btn-primary inline-flex items-center gap-2">
                <Plus size={20} />
                Publicar Primeira Vaga
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {vagasFiltradas.map((vaga) => (
              <div key={vaga.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vaga.titulo}
                        </h3>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          {!vaga.empresa_anonima && vaga.associado?.razao_social && (
                            <div className="flex items-center gap-1">
                              <Building size={16} />
                              {vaga.associado.razao_social}
                            </div>
                          )}
                          {vaga.empresa_anonima && (
                            <div className="flex items-center gap-1">
                              <Building size={16} />
                              Vaga Anônima
                            </div>
                          )}

                          {vaga.localidade && (
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              {vaga.localidade}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {vaga.descricao}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusLabels[vaga.status].color
                            }`}
                          >
                            {statusLabels[vaga.status].label}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {regimeLabels[vaga.regime]}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {senioridadeLabels[vaga.senioridade]}
                          </span>

                          {vaga.areas_atuacao?.slice(0, 2).map((area, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {area}
                            </span>
                          ))}
                          {vaga.areas_atuacao && vaga.areas_atuacao.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{vaga.areas_atuacao.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recrutador/vagas/${vaga.id}`}
                      className="p-2 text-gray-600 hover:text-primary-600"
                      title="Visualizar"
                    >
                      <Eye size={20} />
                    </Link>

                    <Link
                      to={`/recrutador/vagas/${vaga.id}/editar`}
                      className="p-2 text-gray-600 hover:text-primary-600"
                      title="Editar"
                    >
                      <Edit2 size={20} />
                    </Link>

                    {vaga.status === 'aberta' && (
                      <button
                        onClick={() => handleToggleStatus(vaga.id, 'pausada')}
                        className="p-2 text-gray-600 hover:text-yellow-600"
                        title="Pausar"
                      >
                        <Pause size={20} />
                      </button>
                    )}

                    {vaga.status === 'pausada' && (
                      <button
                        onClick={() => handleToggleStatus(vaga.id, 'aberta')}
                        className="p-2 text-gray-600 hover:text-green-600"
                        title="Reabrir"
                      >
                        <Play size={20} />
                      </button>
                    )}

                    {vaga.status !== 'fechada' && (
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja fechar esta vaga?')) {
                            handleToggleStatus(vaga.id, 'fechada');
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Fechar vaga"
                      >
                        <XIcon size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
