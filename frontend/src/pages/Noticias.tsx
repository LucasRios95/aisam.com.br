import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Newspaper, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import noticiasService, { Noticia } from "@/services/noticias";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Noticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarNoticias = async () => {
      try {
        setLoading(true);
        setError(null);
        const dados = await noticiasService.listar();
        // Ordenar por data de publicação (mais recentes primeiro)
        const ordenadas = dados.sort((a, b) =>
          new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime()
        );
        setNoticias(ordenadas);
      } catch (err: any) {
        console.error('Erro ao carregar notícias:', err);
        setError(err.response?.data?.message || 'Erro ao carregar notícias. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarNoticias();
  }, []);

  const eventos = [
    {
      titulo: "Reunião Mensal da Diretoria",
      data: "2024-02-15",
      hora: "14:00",
      local: "Sede AISAM"
    },
    {
      titulo: "Palestra: Compliance Industrial",
      data: "2024-02-22",
      hora: "19:00",
      local: "Auditório São Roque"
    },
    {
      titulo: "Networking Empresarial",
      data: "2024-03-05",
      hora: "18:30",
      local: "Centro de Convenções"
    }
  ];

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTagColor = (tag: string, index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    ];
    return colors[index % colors.length];
  };

  // Estado de loading
  if (loading) {
    return (
      <PageLayout
        title="Notícias e Eventos"
        description="Fique por dentro das últimas novidades, eventos e informações importantes para o setor industrial"
      >
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando notícias...</p>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <PageLayout
        title="Notícias e Eventos"
        description="Fique por dentro das últimas novidades, eventos e informações importantes para o setor industrial"
      >
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Notícias e Eventos"
      description="Fique por dentro das últimas novidades, eventos e informações importantes para o setor industrial"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Notícias em Destaque */}
          {noticias.filter(noticia => noticia.destaque).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-foreground mb-8">Notícias em Destaque</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {noticias.filter(noticia => noticia.destaque).map((noticia, index) => (
                  <motion.div
                    key={noticia.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="card-shadow hover:scale-105 transition-all duration-300 group cursor-pointer border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm overflow-hidden">
                      {noticia.imagem_url ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={noticia.imagem_url}
                            alt={noticia.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Newspaper className="h-16 w-16 text-primary/30" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {noticia.tags && noticia.tags.length > 0 ? (
                              noticia.tags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} className={getTagColor(tag, idx)}>
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                Notícia
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatarData(noticia.data_publicacao)}
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                          {noticia.titulo}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                          {noticia.resumo || noticia.conteudo.substring(0, 150) + '...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" />
                            {noticia.autor || 'AISAM'}
                          </div>
                          <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                            Ler mais
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Todas as Notícias */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {noticias.length > 0 ? 'Todas as Notícias' : 'Nenhuma notícia disponível'}
                </h2>
                {noticias.length > 0 ? (
                  <div className="space-y-6">
                    {noticias.map((noticia, index) => (
                      <motion.div
                        key={noticia.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <Card className="card-shadow hover:scale-105 transition-all duration-300 group cursor-pointer border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              {noticia.imagem_url ? (
                                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={noticia.imagem_url}
                                    alt={noticia.titulo}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                              ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <Newspaper className="h-8 w-8 text-primary/50" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                                  {noticia.tags && noticia.tags.length > 0 ? (
                                    noticia.tags.slice(0, 3).map((tag, idx) => (
                                      <Badge key={idx} className={getTagColor(tag, idx)}>
                                        {tag}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                      Notícia
                                    </Badge>
                                  )}
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatarData(noticia.data_publicacao)}
                                  </div>
                                </div>
                                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                  {noticia.titulo}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                                  {noticia.resumo || noticia.conteudo.substring(0, 120) + '...'}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <User className="h-4 w-4 mr-1" />
                                    {noticia.autor || 'AISAM'}
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    Ler mais
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="card-shadow border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        Nenhuma notícia publicada no momento. Volte em breve para conferir as novidades!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Sidebar - Próximos Eventos */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow border-0 bg-gradient-to-br from-primary/5 to-accent/5 sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Próximos Eventos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {eventos.map((evento, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="p-4 bg-card/50 rounded-lg border border-border/30 hover:border-primary/30 transition-colors duration-300"
                      >
                        <h4 className="font-semibold text-foreground mb-2">{evento.titulo}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            {formatarData(evento.data)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            {evento.hora}
                          </div>
                          <div className="flex items-center">
                            <Newspaper className="h-4 w-4 mr-2 text-primary" />
                            {evento.local}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Newspaper className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Fique Sempre Atualizado
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Receba em primeira mão as notícias mais importantes do setor industrial, 
                  eventos exclusivos e oportunidades de negócio.
                </p>
                <Button size="lg" asChild>
                  <a href="/associe-se">
                    Quero me Manter Informado
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Noticias;