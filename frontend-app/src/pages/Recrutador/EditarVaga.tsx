import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Save, X } from 'lucide-react';
import vagasService from '../../services/vagas';
import areasService, { type AreaAtuacao } from '../../services/areas';

export default function EditarVaga() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [areas, setAreas] = useState<AreaAtuacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    diferenciais: '',
    beneficios: '',
    salario_min: '',
    salario_max: '',
    localidade: '',
    regime: 'presencial' as 'presencial' | 'hibrido' | 'remoto',
    senioridade: 'pleno' as 'estagio' | 'junior' | 'pleno' | 'senior' | 'especialista',
    empresa_anonima: false,
    areas_atuacao: [] as string[],
    email_contato: '',
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setCarregando(true);
      const [vagaData, areasData] = await Promise.all([
        vagasService.buscarPorId(id!),
        areasService.listar()
      ]);

      setAreas(areasData);
      setFormData({
        titulo: vagaData.titulo || '',
        descricao: vagaData.descricao || '',
        requisitos: (vagaData as any).requisitos || '',
        diferenciais: (vagaData as any).diferenciais || '',
        beneficios: (vagaData as any).beneficios || '',
        salario_min: (vagaData as any).salario_min || '',
        salario_max: (vagaData as any).salario_max || '',
        localidade: vagaData.localidade || '',
        regime: (vagaData.regime || 'presencial') as 'presencial' | 'hibrido' | 'remoto',
        senioridade: vagaData.senioridade as any || 'pleno',
        empresa_anonima: vagaData.empresa_anonima || false,
        areas_atuacao: vagaData.areas_atuacao || [],
        email_contato: vagaData.email_contato || '',
      });
    } catch (error) {
      console.error('Erro ao carregar vaga:', error);
      alert('Erro ao carregar vaga');
      navigate('/recrutador/vagas');
    } finally {
      setCarregando(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.areas_atuacao.length === 0) {
      alert('Selecione pelo menos uma área de atuação');
      return;
    }

    try {
      setLoading(true);
      await vagasService.atualizar(id!, formData);
      alert('Vaga atualizada com sucesso!');
      navigate('/recrutador/vagas');
    } catch (error: any) {
      console.error('Erro ao atualizar vaga:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar vaga');
    } finally {
      setLoading(false);
    }
  }

  if (carregando) {
    return (
      <Layout title="Editar Vaga">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Editar Vaga">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Vaga</h2>
            <p className="text-gray-600 mt-1">
              Atualize as informações da vaga
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Vaga *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Desenvolvedor Full Stack"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Vaga *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="input-field"
                  rows={4}
                  placeholder="Descreva as principais atividades e responsabilidades da posição"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regime de Trabalho *
                  </label>
                  <select
                    value={formData.regime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        regime: e.target.value as any,
                      })
                    }
                    className="input-field"
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="remoto">Remoto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senioridade *
                  </label>
                  <select
                    value={formData.senioridade}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        senioridade: e.target.value as any,
                      })
                    }
                    className="input-field"
                    required
                  >
                    <option value="estagio">Estágio</option>
                    <option value="junior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="senior">Sênior</option>
                    <option value="especialista">Especialista</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localidade
                </label>
                <input
                  type="text"
                  value={formData.localidade}
                  onChange={(e) =>
                    setFormData({ ...formData, localidade: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: São Paulo - SP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail do Responsável *
                </label>
                <input
                  type="email"
                  value={formData.email_contato}
                  onChange={(e) =>
                    setFormData({ ...formData, email_contato: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: recrutamento@empresa.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este e-mail será usado para receber candidaturas
                </p>
              </div>
            </div>
          </div>

          {/* Requisitos e Diferenciais */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Requisitos e Qualificações
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requisitos *
                </label>
                <textarea
                  value={formData.requisitos}
                  onChange={(e) =>
                    setFormData({ ...formData, requisitos: e.target.value })
                  }
                  className="input-field"
                  rows={4}
                  placeholder="Liste os requisitos obrigatórios para a vaga"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diferenciais
                </label>
                <textarea
                  value={formData.diferenciais}
                  onChange={(e) =>
                    setFormData({ ...formData, diferenciais: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Liste qualificações desejáveis mas não obrigatórias"
                />
              </div>
            </div>
          </div>

          {/* Benefícios e Remuneração */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Benefícios e Remuneração
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefícios
                </label>
                <textarea
                  value={formData.beneficios}
                  onChange={(e) =>
                    setFormData({ ...formData, beneficios: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Liste os benefícios oferecidos (vale alimentação, plano de saúde, etc.)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salário Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.salario_min}
                    onChange={(e) =>
                      setFormData({ ...formData, salario_min: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ex: 5000"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salário Máximo (R$)
                  </label>
                  <input
                    type="number"
                    value={formData.salario_max}
                    onChange={(e) =>
                      setFormData({ ...formData, salario_max: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ex: 8000"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Áreas de Atuação */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Áreas de Atuação *
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Selecione as áreas relacionadas a esta vaga
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {areas.map((area) => (
                <label
                  key={area.id}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.areas_atuacao.includes(area.nome)
                      ? 'bg-primary-50 border-primary-500'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.areas_atuacao.includes(area.nome)}
                    onChange={() => handleAreaToggle(area.nome)}
                    className="h-4 w-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {area.nome}
                  </span>
                </label>
              ))}
            </div>

            {formData.areas_atuacao.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                Selecione pelo menos uma área de atuação
              </p>
            )}
          </div>

          {/* Privacidade */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Privacidade
            </h3>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.empresa_anonima}
                onChange={(e) =>
                  setFormData({ ...formData, empresa_anonima: e.target.checked })
                }
                className="mt-1 h-4 w-4 text-primary-600 rounded"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Publicar como vaga anônima
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  O nome da empresa não será exibido publicamente. Informações de
                  contato serão mascaradas.
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/recrutador/vagas')}
              className="btn-secondary flex items-center gap-2"
            >
              <X size={20} />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
