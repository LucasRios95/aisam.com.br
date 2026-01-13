import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, Edit2, Trash2, Building, Check, X, Power } from 'lucide-react';
import associadosService, { type Associado } from '../../services/associados';

export default function AdminAssociados() {
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAssociado, setEditingAssociado] = useState<Associado | null>(null);
  const [formData, setFormData] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    ativo: true,
  });

  useEffect(() => {
    carregarAssociados();
  }, []);

  async function carregarAssociados() {
    try {
      setLoading(true);
      const data = await associadosService.listar(false); // Todos os associados
      setAssociados(data);
    } catch (error) {
      console.error('Erro ao carregar associados:', error);
      alert('Erro ao carregar associados');
    } finally {
      setLoading(false);
    }
  }

  const associadosFiltrados = associados.filter(
    (associado) =>
      associado.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associado.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associado.cnpj.includes(searchTerm)
  );

  function handleEdit(associado: Associado) {
    setEditingAssociado(associado);
    setFormData({
      razao_social: associado.razao_social,
      nome_fantasia: associado.nome_fantasia || '',
      cnpj: associado.cnpj,
      email: associado.email,
      telefone: associado.telefone || '',
      endereco: associado.endereco || '',
      cidade: associado.cidade || '',
      estado: associado.estado || '',
      cep: associado.cep || '',
      ativo: associado.ativo,
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingAssociado(null);
    setFormData({
      razao_social: '',
      nome_fantasia: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      ativo: true,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingAssociado) {
        await associadosService.atualizar(editingAssociado.id, formData);
        alert('Associado atualizado com sucesso!');
      } else {
        await associadosService.criar(formData);
        alert('Associado criado com sucesso!');
      }
      await carregarAssociados();
      handleCancel();
    } catch (error: any) {
      console.error('Erro ao salvar associado:', error);
      alert(error.response?.data?.error || 'Erro ao salvar associado');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este associado?')) return;

    try {
      await associadosService.deletar(id);
      alert('Associado excluído com sucesso!');
      await carregarAssociados();
    } catch (error) {
      console.error('Erro ao excluir associado:', error);
      alert('Erro ao excluir associado');
    }
  }

  async function handleToggleStatus(associado: Associado) {
    const acao = associado.ativo ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${acao} este associado?`)) return;

    try {
      if (associado.ativo) {
        await associadosService.desativar(associado.id);
      } else {
        await associadosService.ativar(associado.id);
      }
      alert(`Associado ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`);
      await carregarAssociados();
    } catch (error) {
      console.error(`Erro ao ${acao} associado:`, error);
      alert(`Erro ao ${acao} associado`);
    }
  }

  if (loading) {
    return (
      <Layout title="Associados">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Associados">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Associados</h2>
            <p className="text-gray-600 mt-1">
              Gerencie as empresas associadas ao sistema
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Associado
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total de Associados</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{associados.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium">Ativos</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {associados.filter((a) => a.ativo).length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <p className="text-sm text-gray-700 font-medium">Inativos</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {associados.filter((a) => !a.ativo).length}
            </p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAssociado ? 'Editar Associado' : 'Novo Associado'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social *
                  </label>
                  <input
                    type="text"
                    value={formData.razao_social}
                    onChange={(e) =>
                      setFormData({ ...formData, razao_social: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Fantasia
                  </label>
                  <input
                    type="text"
                    value={formData.nome_fantasia}
                    onChange={(e) =>
                      setFormData({ ...formData, nome_fantasia: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cnpj: e.target.value })
                    }
                    className="input-field"
                    placeholder="00.000.000/0000-00"
                    required
                    disabled={!!editingAssociado}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    className="input-field"
                    placeholder="(00) 0000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value })
                    }
                    className="input-field"
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                  className="input-field"
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">Selecione</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>

              {editingAssociado && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 text-sm text-gray-700">
                    Associado ativo
                  </label>
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingAssociado ? 'Salvar Alterações' : 'Criar Associado'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        {!showForm && (
          <div className="card">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Exibindo {associadosFiltrados.length} de {associados.length} associados
            </div>
          </div>
        )}

        {/* List */}
        {!showForm &&
          (associadosFiltrados.length === 0 ? (
            <div className="card text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum associado encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {associadosFiltrados.map((associado) => (
                <div key={associado.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Building className="text-primary-600 mt-1" size={24} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {associado.razao_social}
                          </h3>
                          {associado.ativo ? (
                            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <Check size={12} />
                              Ativo
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              <X size={12} />
                              Inativo
                            </span>
                          )}
                        </div>

                        {associado.nome_fantasia && (
                          <p className="text-sm text-gray-600 mt-1">
                            {associado.nome_fantasia}
                          </p>
                        )}

                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>CNPJ: {associado.cnpj}</p>
                          <p>E-mail: {associado.email}</p>
                          {associado.telefone && <p>Tel: {associado.telefone}</p>}
                          {associado.cidade && associado.estado && (
                            <p>
                              {associado.cidade} - {associado.estado}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(associado)}
                        className={`p-2 ${
                          associado.ativo
                            ? 'text-gray-600 hover:text-orange-600'
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                        title={associado.ativo ? 'Desativar' : 'Ativar'}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(associado)}
                        className="p-2 text-gray-600 hover:text-primary-600"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(associado.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </Layout>
  );
}
