import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import areasService, { type AreaAtuacao } from '../../services/areas';

export default function AdminAreas() {
  const [areas, setAreas] = useState<AreaAtuacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<AreaAtuacao | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    descricao: '',
    ativo: true,
  });

  useEffect(() => {
    carregarAreas();
  }, []);

  async function carregarAreas() {
    try {
      setLoading(true);
      const data = await areasService.listar(false); // Todas as áreas
      setAreas(data);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
      alert('Erro ao carregar áreas de atuação');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(area: AreaAtuacao) {
    setEditingArea(area);
    setFormData({
      nome: area.nome,
      slug: area.slug,
      descricao: area.descricao || '',
      ativo: area.ativo,
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingArea(null);
    setFormData({ nome: '', slug: '', descricao: '', ativo: true });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingArea) {
        await areasService.atualizar(editingArea.id, formData);
        alert('Área atualizada com sucesso!');
      } else {
        await areasService.criar(formData);
        alert('Área criada com sucesso!');
      }
      await carregarAreas();
      handleCancel();
    } catch (error: any) {
      console.error('Erro ao salvar área:', error);
      alert(error.response?.data?.error || error.response?.data?.message || 'Erro ao salvar área');
    }
  }

  async function handleDelete(areaId: string) {
    if (!confirm('Tem certeza que deseja excluir esta área? Esta ação não pode ser desfeita.')) return;

    try {
      await areasService.deletar(areaId);
      alert('Área excluída com sucesso!');
      carregarAreas();
    } catch (error: any) {
      console.error('Erro ao excluir área:', error);
      alert(error.response?.data?.message || 'Erro ao excluir área. Pode haver vagas ou candidatos vinculados a esta área.');
    }
  }

  function generateSlug(nome: string) {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (loading) {
    return (
      <Layout title="Áreas de Atuação">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Áreas de Atuação">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Áreas de Atuação</h2>
            <p className="text-gray-600 mt-1">
              Gerencie as áreas de atuação disponíveis para vagas e candidatos
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Nova Área
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingArea ? 'Editar Área' : 'Nova Área de Atuação'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => {
                      const nome = e.target.value;
                      setFormData({
                        ...formData,
                        nome,
                        slug: generateSlug(nome),
                      });
                    }}
                    className="input-field"
                    placeholder="Ex: Tecnologia da Informação"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (gerado automaticamente)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    className="input-field bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Descrição opcional da área de atuação"
                />
              </div>

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
                  Área ativa (visível para candidatos e vagas)
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  {editingArea ? 'Salvar Alterações' : 'Criar Área'}
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

        {/* List */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Áreas Cadastradas ({areas.length})
          </h3>

          {areas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma área de atuação cadastrada
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Nome
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Slug
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map((area) => (
                    <tr key={area.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{area.nome}</p>
                          {area.descricao && (
                            <p className="text-sm text-gray-500 mt-1">
                              {area.descricao}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {area.slug}
                      </td>
                      <td className="py-3 px-4">
                        {area.ativo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Check size={12} />
                            Ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            <X size={12} />
                            Inativa
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(area)}
                            className="text-primary-600 hover:text-primary-700 p-2"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(area.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
