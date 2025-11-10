import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Save, X } from 'lucide-react';
import noticiasService from '../../services/noticias';

export default function EditarNoticia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [tags, setTags] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    imagem_url: '',
    autor: '',
    fonte: '',
    fonte_url: '',
    publicada: false,
    destaque: false,
    data_publicacao: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    carregarNoticia();
  }, [id]);

  async function carregarNoticia() {
    if (!id) return;

    try {
      setLoadingData(true);
      const noticia = await noticiasService.buscarPorId(id);

      setFormData({
        titulo: noticia.titulo,
        resumo: noticia.resumo || '',
        conteudo: noticia.conteudo,
        imagem_url: noticia.imagem_url || '',
        autor: noticia.autor || '',
        fonte: noticia.fonte || '',
        fonte_url: noticia.fonte_url || '',
        publicada: noticia.publicada,
        destaque: noticia.destaque,
        data_publicacao: noticia.data_publicacao.split('T')[0],
      });

      if (noticia.tags && noticia.tags.length > 0) {
        setTags(noticia.tags.join(', '));
      }
    } catch (error) {
      console.error('Erro ao carregar notícia:', error);
      alert('Erro ao carregar notícia');
      navigate('/admin/noticias');
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    try {
      setLoading(true);

      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await noticiasService.atualizar(id, {
        ...formData,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      alert('Notícia atualizada com sucesso!');
      navigate('/admin/noticias');
    } catch (error: any) {
      console.error('Erro ao atualizar notícia:', error);
      alert(error.response?.data?.message || 'Erro ao atualizar notícia');
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <Layout title="Editar Notícia">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Editar Notícia">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Notícia</h2>
            <p className="text-gray-600 mt-1">
              Atualize as informações da notícia
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
                  Título da Notícia *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Nova parceria com empresa de tecnologia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resumo
                </label>
                <textarea
                  value={formData.resumo}
                  onChange={(e) =>
                    setFormData({ ...formData, resumo: e.target.value })
                  }
                  className="input-field"
                  rows={3}
                  placeholder="Breve resumo da notícia (será exibido na listagem)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo da Notícia *
                </label>
                <textarea
                  value={formData.conteudo}
                  onChange={(e) =>
                    setFormData({ ...formData, conteudo: e.target.value })
                  }
                  className="input-field"
                  rows={10}
                  placeholder="Escreva o conteúdo completo da notícia..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={formData.imagem_url}
                  onChange={(e) =>
                    setFormData({ ...formData, imagem_url: e.target.value })
                  }
                  className="input-field"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {formData.imagem_url && (
                  <div className="mt-2">
                    <img
                      src={formData.imagem_url}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={formData.autor}
                    onChange={(e) =>
                      setFormData({ ...formData, autor: e.target.value })
                    }
                    className="input-field"
                    placeholder="Nome do autor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Publicação *
                  </label>
                  <input
                    type="date"
                    value={formData.data_publicacao}
                    onChange={(e) =>
                      setFormData({ ...formData, data_publicacao: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fonte */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Fonte (Opcional)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Fonte
                </label>
                <input
                  type="text"
                  value={formData.fonte}
                  onChange={(e) =>
                    setFormData({ ...formData, fonte: e.target.value })
                  }
                  className="input-field"
                  placeholder="Ex: Portal de Notícias XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Fonte
                </label>
                <input
                  type="url"
                  value={formData.fonte_url}
                  onChange={(e) =>
                    setFormData({ ...formData, fonte_url: e.target.value })
                  }
                  className="input-field"
                  placeholder="https://fonte.com/noticia"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tags e Categorias
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
                placeholder="Ex: tecnologia, inovação, parceria"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separe múltiplas tags com vírgula
              </p>
            </div>
          </div>

          {/* Configurações */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configurações de Publicação
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.publicada}
                  onChange={(e) =>
                    setFormData({ ...formData, publicada: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 text-primary-600 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Publicar imediatamente
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    A notícia ficará visível no site institucional
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.destaque}
                  onChange={(e) =>
                    setFormData({ ...formData, destaque: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 text-primary-600 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Marcar como destaque
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Notícias em destaque aparecem em posição de maior visibilidade
                  </p>
                </div>
              </label>
            </div>
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
              onClick={() => navigate('/admin/noticias')}
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
