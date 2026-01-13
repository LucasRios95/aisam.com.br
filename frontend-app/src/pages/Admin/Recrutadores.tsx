import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, Mail, Shield, ShieldCheck, Trash2, Check, X, Building } from 'lucide-react';
import recrutadoresService, { type Recrutador } from '../../services/recrutadores';
import associadosService, { type Associado } from '../../services/associados';

const perfilLabels: Record<string, { label: string; icon: any; color: string }> = {
  admin: { label: 'Admin', icon: ShieldCheck, color: 'text-purple-600' },
  recrutador: { label: 'Recrutador', icon: Shield, color: 'text-blue-600' },
};

export default function AdminRecrutadores() {
  const [recrutadores, setRecrutadores] = useState<Recrutador[]>([]);
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    perfil: 'recrutador' as 'admin' | 'recrutador',
    associado_id: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const [recrutadoresData, associadosData] = await Promise.all([
        recrutadoresService.listar(),
        associadosService.listar(),
      ]);
      setRecrutadores(recrutadoresData);
      setAssociados(associadosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  const recrutadoresFiltrados = recrutadores.filter(
    (recrutador) =>
      recrutador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recrutador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recrutador.associado?.razao_social.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleCancel() {
    setShowForm(false);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      perfil: 'recrutador',
      associado_id: '',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validar senhas
    if (formData.senha.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      const { confirmarSenha, ...dadosRecrutador } = formData;
      await recrutadoresService.criar(dadosRecrutador);
      alert('Recrutador criado com sucesso!');
      await carregarDados();
      handleCancel();
    } catch (error: any) {
      console.error('Erro ao criar recrutador:', error);
      alert(error.response?.data?.error || 'Erro ao criar recrutador');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este recrutador?')) return;

    try {
      await recrutadoresService.deletar(id);
      alert('Recrutador excluído com sucesso!');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao excluir recrutador:', error);
      alert('Erro ao excluir recrutador');
    }
  }

  if (loading) {
    return (
      <Layout title="Recrutadores">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Recrutadores">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recrutadores</h2>
            <p className="text-gray-600 mt-1">
              Gerencie os usuários recrutadores do sistema
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Recrutador
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total de Recrutadores</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{recrutadores.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium">Ativos</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {recrutadores.filter((r) => r.ativo).length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Admin</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">
              {recrutadores.filter((r) => r.perfil === 'admin').length}
            </p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Criar Novo Recrutador
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Preencha os dados do recrutador e defina uma senha de acesso
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="input-field"
                    minLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    className="input-field"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil *
                  </label>
                  <select
                    value={formData.perfil}
                    onChange={(e) =>
                      setFormData({ ...formData, perfil: e.target.value as any })
                    }
                    className="input-field"
                    required
                  >
                    <option value="recrutador">Recrutador</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Admin: Pode gerenciar vagas de todos os recrutadores do associado
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associado *
                  </label>
                  <select
                    value={formData.associado_id}
                    onChange={(e) =>
                      setFormData({ ...formData, associado_id: e.target.value })
                    }
                    className="input-field"
                    required
                  >
                    <option value="">Selecione um associado</option>
                    {associados
                      .filter((a) => a.ativo)
                      .map((associado) => (
                        <option key={associado.id} value={associado.id}>
                          {associado.razao_social}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Plus size={20} />
                  Criar Recrutador
                </button>
                <button type="button" onClick={handleCancel} className="btn-secondary">
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
                placeholder="Buscar por nome, e-mail ou associado..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Exibindo {recrutadoresFiltrados.length} de {recrutadores.length} recrutadores
            </div>
          </div>
        )}

        {/* List */}
        {!showForm &&
          (recrutadoresFiltrados.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">Nenhum recrutador encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recrutadoresFiltrados.map((recrutador) => {
                const PerfilIcon = perfilLabels[recrutador.perfil].icon;
                return (
                  <div
                    key={recrutador.id}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {recrutador.nome}
                          </h3>
                          {recrutador.ativo ? (
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

                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            {recrutador.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Building size={14} />
                            {recrutador.associado?.razao_social || 'Associado não encontrado'}
                          </p>
                          <p
                            className={`flex items-center gap-2 font-medium ${
                              perfilLabels[recrutador.perfil].color
                            }`}
                          >
                            <PerfilIcon size={14} />
                            {perfilLabels[recrutador.perfil].label}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(recrutador.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </Layout>
  );
}
