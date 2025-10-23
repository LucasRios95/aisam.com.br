import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Search, Filter, Eye, Check, X, Clock, Mail, Phone, MapPin, FileText } from 'lucide-react';
import candidaturasService, { type Candidatura } from '../../services/candidaturas';

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  em_analise: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700', icon: Eye },
  aprovada: { label: 'Aprovada', color: 'bg-green-100 text-green-700', icon: Check },
  reprovada: { label: 'Reprovada', color: 'bg-red-100 text-red-700', icon: X },
};

export default function RecrutadorCandidaturas() {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pendente');
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);

  useEffect(() => {
    carregarCandidaturas();
  }, []);

  async function carregarCandidaturas() {
    try {
      setLoading(true);
      // Busca candidaturas das vagas do recrutador logado
      const data = await candidaturasService.listar({});
      setCandidaturas(data);
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error);
      alert('Erro ao carregar candidaturas');
    } finally {
      setLoading(false);
    }
  }

  const candidaturasFiltradas = candidaturas.filter((candidatura) => {
    const matchSearch =
      candidatura.vaga?.titulo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !statusFilter || candidatura.status === statusFilter;

    return matchSearch && matchStatus;
  });

  async function handleAtualizarStatus(candidaturaId: string, novoStatus: string) {
    try {
      await candidaturasService.atualizarStatus(candidaturaId, novoStatus);
      alert('Status atualizado com sucesso!');
      await carregarCandidaturas();
      setSelectedCandidatura(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  }

  if (loading) {
    return (
      <Layout title="Candidaturas">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Candidaturas">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Candidaturas Recebidas</h2>
          <p className="text-gray-600 mt-1">
            Analise os candidatos que se inscreveram em suas vagas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <p className="text-sm text-yellow-700 font-medium">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">
              {candidaturas.filter((c) => c.status === 'pendente').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Em Análise</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {candidaturas.filter((c) => c.status === 'em_analise').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium">Aprovadas</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {candidaturas.filter((c) => c.status === 'aprovada').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <p className="text-sm text-red-700 font-medium">Reprovadas</p>
            <p className="text-3xl font-bold text-red-900 mt-2">
              {candidaturas.filter((c) => c.status === 'reprovada').length}
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
                placeholder="Buscar por vaga..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendentes</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovada">Aprovadas</option>
                <option value="reprovada">Reprovadas</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Exibindo {candidaturasFiltradas.length} de {candidaturas.length} candidaturas
          </div>
        </div>

        {/* List */}
        {candidaturasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">
              {searchTerm || statusFilter
                ? 'Nenhuma candidatura encontrada com os filtros aplicados'
                : 'Você ainda não recebeu candidaturas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {candidaturasFiltradas.map((candidatura) => {
              const StatusIcon = statusLabels[candidatura.status].icon;
              return (
                <div
                  key={candidatura.id}
                  className="card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCandidatura(candidatura)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {candidatura.vaga?.titulo || 'Vaga sem título'}
                      </h3>
                      {!candidatura.vaga?.empresa_anonima && candidatura.vaga?.associado?.razao_social && (
                        <p className="text-sm text-gray-600">
                          {candidatura.vaga.associado.razao_social}
                        </p>
                      )}
                    </div>
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        statusLabels[candidatura.status].color
                      }`}
                    >
                      <StatusIcon size={12} />
                      {statusLabels[candidatura.status].label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>
                      Candidatura recebida em{' '}
                      {new Date(candidatura.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidatura(candidatura);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Ver Detalhes →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedCandidatura && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCandidatura(null)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Detalhes da Candidatura
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedCandidatura.vaga?.titulo}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCandidatura(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status da Candidatura
                  </label>
                  <div className="flex gap-2">
                    {Object.entries(statusLabels).map(([status, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            handleAtualizarStatus(selectedCandidatura.id, status)
                          }
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCandidatura.status === status
                              ? config.color
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Icon size={16} />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Informações do Candidato */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Informações do Candidato
                  </h4>
                  {selectedCandidatura.candidato ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Mail className="text-gray-400 mt-0.5" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">E-mail</p>
                          <a
                            href={`mailto:${selectedCandidatura.candidato.email}`}
                            className="text-sm font-medium text-primary-600 hover:underline"
                          >
                            {selectedCandidatura.candidato.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="text-gray-400 mt-0.5" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Telefone</p>
                          <a
                            href={`tel:${selectedCandidatura.candidato.telefone}`}
                            className="text-sm font-medium text-gray-900"
                          >
                            {selectedCandidatura.candidato.telefone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="text-gray-400 mt-0.5" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">Localização</p>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedCandidatura.candidato.cidade}, {selectedCandidatura.candidato.estado}
                          </p>
                        </div>
                      </div>

                      {selectedCandidatura.candidato.areas_atuacao && selectedCandidatura.candidato.areas_atuacao.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Áreas de Atuação</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidatura.candidato.areas_atuacao.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedCandidatura.candidato.resumo_curriculo && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Resumo do Currículo</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedCandidatura.candidato.resumo_curriculo}
                          </p>
                        </div>
                      )}

                      {selectedCandidatura.candidato.curriculo_url && (
                        <div className="flex items-center gap-2 pt-2">
                          <FileText className="text-gray-400" size={16} />
                          <a
                            href={selectedCandidatura.candidato.curriculo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:underline font-medium"
                          >
                            Baixar Currículo (PDF)
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Atenção:</strong> As informações do candidato não estão disponíveis.
                        Isso pode ocorrer se o backend não estiver retornando os dados completos na listagem.
                      </p>
                    </div>
                  )}
                </div>

                {/* Data da Candidatura */}
                <div className="border-t pt-4 text-sm text-gray-500">
                  <p>
                    <strong>Candidatura recebida em:</strong>{' '}
                    {new Date(selectedCandidatura.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedCandidatura(null)}
                  className="w-full btn-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
