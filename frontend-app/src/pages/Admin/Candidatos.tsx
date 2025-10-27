import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, Mail, Phone, MapPin, Calendar, FileText, Trash2, Edit, X, Upload, ExternalLink } from 'lucide-react';
import candidatosService, { type Candidato } from '../../services/candidatos';
import areasService, { type AreaAtuacao } from '../../services/areas';

export default function AdminCandidatos() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [areas, setAreas] = useState<AreaAtuacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [curriculoFile, setCurriculoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    resumo_curriculo: '',
    areas_atuacao: [] as string[],
    consentimento_dados: true,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const [candidatosData, areasData] = await Promise.all([
        candidatosService.listar(),
        areasService.listar(),
      ]);
      setCandidatos(candidatosData);
      setAreas(areasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  const candidatosFiltrados = candidatos.filter(
    (candidato) =>
      candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setCurriculoFile(null);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: '',
      resumo_curriculo: '',
      areas_atuacao: [],
      consentimento_dados: true,
    });
  }

  function handleEdit(candidato: Candidato) {
    setEditingId(candidato.id);
    setFormData({
      nome: candidato.nome,
      email: candidato.email,
      telefone: candidato.telefone,
      cidade: candidato.cidade,
      estado: candidato.estado,
      resumo_curriculo: candidato.resumo_curriculo,
      areas_atuacao: candidato.areas_atuacao || [],
      consentimento_dados: candidato.consentimento_dados,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      let candidatoId = editingId;

      if (editingId) {
        // Atualizar
        const { email, consentimento_dados, ...dadosAtualizacao } = formData;
        await candidatosService.atualizarAdmin(editingId, dadosAtualizacao);
        alert('Candidato atualizado com sucesso!');
      } else {
        // Criar
        const novoCandidato = await candidatosService.criarAdmin(formData);
        candidatoId = novoCandidato.id;
        alert('Candidato criado com sucesso!');
      }

      // Upload de currículo se houver arquivo
      if (curriculoFile && candidatoId) {
        try {
          await candidatosService.uploadCurriculo(candidatoId, curriculoFile);
          alert('Currículo anexado com sucesso!');
        } catch (error) {
          console.error('Erro ao fazer upload do currículo:', error);
          alert('Candidato salvo, mas houve erro ao anexar o currículo');
        }
      }

      await carregarDados();
      handleCancel();
    } catch (error: any) {
      console.error('Erro ao salvar candidato:', error);

      // Tratamento de erros de validação detalhados
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          const errorMessages = validationErrors.map((err: any) =>
            `${err.field || 'Campo'}: ${err.message || err}`
          ).join('\n');
          alert(`Erros de validação:\n\n${errorMessages}`);
        } else {
          alert(error.response?.data?.message || 'Erro de validação. Verifique os campos e tente novamente.');
        }
      } else {
        alert(error.response?.data?.message || 'Erro ao salvar candidato');
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione apenas arquivos PDF');
        e.target.value = '';
        return;
      }
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        e.target.value = '';
        return;
      }
      setCurriculoFile(file);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este candidato? Esta ação não pode ser desfeita.')) return;

    try {
      await candidatosService.deletar(id);
      alert('Candidato excluído com sucesso!');
      await carregarDados();
    } catch (error) {
      console.error('Erro ao excluir candidato:', error);
      alert('Erro ao excluir candidato');
    }
  }

  function handleAreaToggle(areaNome: string) {
    setFormData((prev) => ({
      ...prev,
      areas_atuacao: prev.areas_atuacao.includes(areaNome)
        ? prev.areas_atuacao.filter((a) => a !== areaNome)
        : [...prev.areas_atuacao, areaNome],
    }));
  }

  if (loading) {
    return (
      <Layout title="Candidatos">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Candidatos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Candidatos</h2>
            <p className="text-gray-600 mt-1">
              Gerencie os candidatos cadastrados no sistema
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Candidato
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total de Candidatos</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{candidatos.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium">Com Currículo</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {candidatos.filter((c) => c.curriculo_url).length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Cadastrados Hoje</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">
              {candidatos.filter((c) => {
                const hoje = new Date().toDateString();
                return new Date(c.created_at).toDateString() === hoje;
              }).length}
            </p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Editar Candidato' : 'Criar Novo Candidato'}
              </h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

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
                    disabled={!!editingId}
                  />
                  {editingId && (
                    <p className="text-xs text-gray-500 mt-1">
                      O e-mail não pode ser alterado
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="input-field"
                    placeholder="(11) 99999-9999"
                    pattern="(\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}"
                    title="Formato: (11) 99999-9999 ou 11999999999"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: (11) 99999-9999
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="RS">Rio Grande do Sul</option>
                    {/* Adicione mais estados conforme necessário */}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Áreas de Atuação *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {areas.map((area) => (
                    <label key={area.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.areas_atuacao.includes(area.nome)}
                        onChange={() => handleAreaToggle(area.nome)}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span>{area.nome}</span>
                    </label>
                  ))}
                </div>
                {formData.areas_atuacao.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Selecione pelo menos uma área de atuação
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumo / Currículo * (mínimo 50 caracteres)
                </label>
                <textarea
                  value={formData.resumo_curriculo}
                  onChange={(e) => setFormData({ ...formData, resumo_curriculo: e.target.value })}
                  className="input-field"
                  rows={6}
                  placeholder="Descreva a experiência profissional, formação acadêmica e principais competências..."
                  minLength={50}
                  maxLength={5000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.resumo_curriculo.length}/5000 caracteres
                  {formData.resumo_curriculo.length < 50 && (
                    <span className="text-red-500 ml-2">
                      (Faltam {50 - formData.resumo_curriculo.length} caracteres)
                    </span>
                  )}
                </p>
              </div>

              {/* Upload de Currículo PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anexar Currículo (PDF)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 cursor-pointer transition-colors">
                    <Upload size={20} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {curriculoFile ? curriculoFile.name : 'Clique para selecionar o arquivo PDF'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {curriculoFile && (
                    <button
                      type="button"
                      onClick={() => setCurriculoFile(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Remover arquivo"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                {editingId && candidatos.find(c => c.id === editingId)?.curriculo_url && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                    <FileText size={16} />
                    <a
                      href={candidatos.find(c => c.id === editingId)?.curriculo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      Visualizar currículo atual
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Formato aceito: PDF | Tamanho máximo: 5MB
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                  disabled={formData.areas_atuacao.length === 0}
                >
                  {editingId ? (
                    <>
                      <Edit size={20} />
                      Atualizar Candidato
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Criar Candidato
                    </>
                  )}
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
                placeholder="Buscar por nome, e-mail ou cidade..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Exibindo {candidatosFiltrados.length} de {candidatos.length} candidatos
            </div>
          </div>
        )}

        {/* List */}
        {!showForm &&
          (candidatosFiltrados.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">Nenhum candidato encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {candidatosFiltrados.map((candidato) => (
                <div
                  key={candidato.id}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {candidato.nome}
                        </h3>
                        {candidato.curriculo_url && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <FileText size={12} />
                            Currículo
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2">
                          <Mail size={14} />
                          {candidato.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone size={14} />
                          {candidato.telefone}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin size={14} />
                          {candidato.cidade} - {candidato.estado}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(candidato.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      {candidato.areas_atuacao && candidato.areas_atuacao.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {candidato.areas_atuacao.map((area, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {candidato.resumo_curriculo}
                      </p>

                      {candidato.curriculo_url && (
                        <div className="mt-3">
                          <a
                            href={candidato.curriculo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <FileText size={16} />
                            Visualizar Currículo PDF
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(candidato)}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(candidato.id)}
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
