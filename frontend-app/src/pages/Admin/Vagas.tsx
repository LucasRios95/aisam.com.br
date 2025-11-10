import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Search, Filter, Eye, Edit2, Trash2, Building, MapPin, X, Mail, Briefcase } from 'lucide-react';
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

export default function AdminVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    carregarVagas();
  }, []);

  async function carregarVagas() {
    try {
      setLoading(true);
      const data = await vagasService.listar({});
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
      vaga.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.localidade?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !statusFilter || vaga.status === statusFilter;

    return matchSearch && matchStatus;
  });

  async function handleDelete(vagaId: string) {
    if (!confirm('Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.')) return;

    try {
      await vagasService.deletar(vagaId);
      alert('Vaga excluída com sucesso!');
      carregarVagas();
    } catch (error: any) {
      console.error('Erro ao excluir vaga:', error);
      alert(error.response?.data?.message || 'Erro ao excluir vaga');
    }
  }

  function handleView(vaga: Vaga) {
    setSelectedVaga(vaga);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedVaga(null);
  }

  if (loading) {
    return (
      <Layout title="Gerenciar Vagas">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gerenciar Vagas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Vagas</h2>
            <p className="text-gray-600 mt-1">
              Visualize e gerencie todas as vagas do sistema
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
                placeholder="Buscar por título, descrição ou localidade..."
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
            <p className="text-gray-500">Nenhuma vaga encontrada</p>
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
                              Empresa Confidencial
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
                    <button
                      onClick={() => handleView(vaga)}
                      className="p-2 text-gray-600 hover:text-primary-600"
                      title="Visualizar"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => alert('Funcionalidade de edição em desenvolvimento')}
                      className="p-2 text-gray-600 hover:text-primary-600"
                      title="Editar"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(vaga.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                      title="Excluir"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      {showModal && selectedVaga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Detalhes da Vaga</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Título e Status */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedVaga.titulo}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusLabels[selectedVaga.status].color
                    }`}
                  >
                    {statusLabels[selectedVaga.status].label}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {regimeLabels[selectedVaga.regime]}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {senioridadeLabels[selectedVaga.senioridade]}
                  </span>
                </div>
              </div>

              {/* Empresa */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Building size={20} />
                  <span className="font-semibold">Empresa</span>
                </div>
                {selectedVaga.empresa_anonima ? (
                  <p className="text-gray-600">Empresa Confidencial</p>
                ) : (
                  <div className="text-gray-600">
                    <p className="font-medium">{selectedVaga.associado?.razao_social}</p>
                    {selectedVaga.associado?.cnpj && (
                      <p className="text-sm">CNPJ: {selectedVaga.associado.cnpj}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Localidade */}
              {selectedVaga.localidade && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <MapPin size={20} />
                    <span className="font-semibold">Localidade</span>
                  </div>
                  <p className="text-gray-600">{selectedVaga.localidade}</p>
                </div>
              )}

              {/* Descrição */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Briefcase size={20} />
                  <span className="font-semibold">Descrição</span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedVaga.descricao}</p>
              </div>

              {/* Áreas de Atuação */}
              {selectedVaga.areas_atuacao && selectedVaga.areas_atuacao.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Áreas de Atuação</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVaga.areas_atuacao.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contato */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Mail size={20} />
                  <span className="font-semibold">E-mail para contato</span>
                </div>
                <a
                  href={`mailto:${selectedVaga.email_contato}`}
                  className="text-primary-600 hover:underline"
                >
                  {selectedVaga.email_contato}
                </a>
              </div>

              {/* Recrutador */}
              {selectedVaga.recrutador && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Recrutador Responsável</h4>
                  <p className="text-gray-600">{selectedVaga.recrutador.nome}</p>
                  <p className="text-sm text-gray-500">{selectedVaga.recrutador.email}</p>
                </div>
              )}

              {/* Datas */}
              <div className="border-t pt-4 text-sm text-gray-500">
                <p>Criada em: {new Date(selectedVaga.created_at).toLocaleString('pt-BR')}</p>
                <p>Atualizada em: {new Date(selectedVaga.updated_at).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button onClick={closeModal} className="btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
