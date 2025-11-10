import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Search, Plus, Eye, Edit2, Trash2, Calendar, Globe } from 'lucide-react';
import noticiasService, { type Noticia } from '../../services/noticias';

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublicada, setFilterPublicada] = useState<string>('');
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    carregarNoticias();
  }, []);

  async function carregarNoticias() {
    try {
      setLoading(true);
      const data = await noticiasService.listar();
      setNoticias(data);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      alert('Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  }

  const noticiasFiltradas = noticias.filter((noticia) => {
    const matchSearch =
      noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.resumo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.autor?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchPublicada =
      !filterPublicada ||
      (filterPublicada === 'true' && noticia.publicada) ||
      (filterPublicada === 'false' && !noticia.publicada);

    return matchSearch && matchPublicada;
  });

  async function handleDelete(noticiaId: string) {
    if (!confirm('Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.')) return;

    try {
      await noticiasService.deletar(noticiaId);
      alert('Notícia excluída com sucesso!');
      carregarNoticias();
    } catch (error: any) {
      console.error('Erro ao excluir notícia:', error);
      alert(error.response?.data?.message || 'Erro ao excluir notícia');
    }
  }

  function handleView(noticia: Noticia) {
    setSelectedNoticia(noticia);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedNoticia(null);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <Layout title="Gerenciar Notícias">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Gerenciar Notícias">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Notícias</h2>
            <p className="text-gray-600 mt-1">
              Gerencie as notícias exibidas no site institucional
            </p>
          </div>

          <Link to="/admin/noticias/nova" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nova Notícia
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total de Notícias</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{noticias.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-sm text-green-700 font-medium">Publicadas</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {noticias.filter((n) => n.publicada).length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <p className="text-sm text-yellow-700 font-medium">Rascunhos</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">
              {noticias.filter((n) => !n.publicada).length}
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
                placeholder="Buscar por título, resumo ou autor..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <select
                className="input-field"
                value={filterPublicada}
                onChange={(e) => setFilterPublicada(e.target.value)}
              >
                <option value="">Todas as notícias</option>
                <option value="true">Publicadas</option>
                <option value="false">Rascunhos</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Exibindo {noticiasFiltradas.length} de {noticias.length} notícias
          </div>
        </div>

        {/* List */}
        {noticiasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm || filterPublicada
                ? 'Nenhuma notícia encontrada com os filtros aplicados'
                : 'Nenhuma notícia cadastrada'}
            </p>
            {!searchTerm && !filterPublicada && (
              <Link to="/admin/noticias/nova" className="btn-primary inline-flex items-center gap-2">
                <Plus size={20} />
                Criar Primeira Notícia
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {noticiasFiltradas.map((noticia) => (
              <div key={noticia.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {noticia.imagem_url && (
                    <img
                      src={noticia.imagem_url}
                      alt={noticia.titulo}
                      className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {noticia.titulo}
                        </h3>

                        {noticia.resumo && (
                          <p className="text-gray-600 mt-1 line-clamp-2">{noticia.resumo}</p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 flex-wrap">
                          {noticia.autor && (
                            <div className="flex items-center gap-1">
                              <span>Por {noticia.autor}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(noticia.data_publicacao)}
                          </div>
                          {noticia.visualizacoes > 0 && (
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              {noticia.visualizacoes} visualizações
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              noticia.publicada
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {noticia.publicada ? 'Publicada' : 'Rascunho'}
                          </span>

                          {noticia.destaque && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Destaque
                            </span>
                          )}

                          {noticia.tags?.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {noticia.tags && noticia.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              +{noticia.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleView(noticia)}
                          className="p-2 text-gray-600 hover:text-primary-600"
                          title="Visualizar"
                        >
                          <Eye size={20} />
                        </button>

                        <Link
                          to={`/admin/noticias/${noticia.id}/editar`}
                          className="p-2 text-gray-600 hover:text-primary-600"
                          title="Editar"
                        >
                          <Edit2 size={20} />
                        </Link>

                        <button
                          onClick={() => handleDelete(noticia.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      {showModal && selectedNoticia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedNoticia.titulo}</h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full text-2xl font-bold text-gray-600"
                >
                  ×
                </button>
              </div>

              {selectedNoticia.imagem_url && (
                <img
                  src={selectedNoticia.imagem_url}
                  alt={selectedNoticia.titulo}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Resumo</p>
                  <p className="text-gray-900">{selectedNoticia.resumo || 'Sem resumo'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Conteúdo</p>
                  <div className="text-gray-900 whitespace-pre-wrap">{selectedNoticia.conteudo}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Autor</p>
                    <p className="text-gray-900">{selectedNoticia.autor || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Data de Publicação</p>
                    <p className="text-gray-900">{formatDate(selectedNoticia.data_publicacao)}</p>
                  </div>
                  {selectedNoticia.fonte && (
                    <div>
                      <p className="text-gray-500">Fonte</p>
                      <p className="text-gray-900">{selectedNoticia.fonte}</p>
                    </div>
                  )}
                  {selectedNoticia.fonte_url && (
                    <div>
                      <p className="text-gray-500">URL da Fonte</p>
                      <a
                        href={selectedNoticia.fonte_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <Globe size={14} />
                        Acessar
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link
                  to={`/admin/noticias/${selectedNoticia.id}/editar`}
                  className="btn-primary"
                >
                  Editar Notícia
                </Link>
                <button onClick={closeModal} className="btn-secondary">
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
