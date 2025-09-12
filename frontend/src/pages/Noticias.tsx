import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Newspaper } from "lucide-react";

const Noticias = () => {
  const noticias = [
    {
      id: 1,
      titulo: "Nova Lei de Incentivos Fiscais para Indústrias",
      resumo: "Governo anuncia novos incentivos fiscais para empresas industriais que investirem em tecnologia sustentável.",
      categoria: "Legislação",
      data: "2024-01-15",
      autor: "AISAM",
      destaque: true,
      imagem: "/api/placeholder/400/250"
    },
    {
      id: 2,
      titulo: "Evento de Networking Empresarial - Fevereiro 2024",
      resumo: "Participe do nosso próximo encontro de networking com empresários da região. Inscrições abertas.",
      categoria: "Eventos",
      data: "2024-01-10",
      autor: "Diretoria AISAM",
      destaque: false,
      imagem: "/api/placeholder/400/250"
    },
    {
      id: 3,
      titulo: "Programa de Capacitação em Gestão Ambiental",
      resumo: "Nova turma do programa de capacitação em gestão ambiental para empresas industriais. Vagas limitadas.",
      categoria: "Capacitação",
      data: "2024-01-08",
      autor: "Setor de Desenvolvimento",
      destaque: false,
      imagem: "/api/placeholder/400/250"
    },
    {
      id: 4,
      titulo: "Mudanças na Legislação Trabalhista 2024",
      resumo: "Resumo das principais mudanças na legislação trabalhista que afetam as empresas industriais em 2024.",
      categoria: "Legislação",
      data: "2024-01-05",
      autor: "Consultoria Jurídica",
      destaque: true,
      imagem: "/api/placeholder/400/250"
    },
    {
      id: 5,
      titulo: "Prêmio Indústria Sustentável 2024",
      resumo: "Abertas as inscrições para o Prêmio Indústria Sustentável. Reconheça as melhores práticas ambientais.",
      categoria: "Premiação",
      data: "2024-01-03",
      autor: "AISAM",
      destaque: false,
      imagem: "/api/placeholder/400/250"
    },
    {
      id: 6,
      titulo: "Workshop: Indústria 4.0 e Transformação Digital",
      resumo: "Participe do workshop sobre as tecnologias da Indústria 4.0 e como implementar a transformação digital.",
      categoria: "Capacitação",
      data: "2023-12-28",
      autor: "Setor de Desenvolvimento",
      destaque: false,
      imagem: "/api/placeholder/400/250"
    }
  ];

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

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Legislação': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Eventos': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Capacitação': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Premiação': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <PageLayout
      title="Notícias e Eventos"
      description="Fique por dentro das últimas novidades, eventos e informações importantes para o setor industrial"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Notícias em Destaque */}
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
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Newspaper className="h-16 w-16 text-primary/30" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getCategoriaColor(noticia.categoria)}>
                          {noticia.categoria}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatarData(noticia.data)}
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                        {noticia.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {noticia.resumo}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          {noticia.autor}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Todas as Notícias */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8">Todas as Notícias</h2>
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
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Newspaper className="h-8 w-8 text-primary/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <Badge className={getCategoriaColor(noticia.categoria)}>
                                  {noticia.categoria}
                                </Badge>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatarData(noticia.data)}
                                </div>
                              </div>
                              <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                {noticia.titulo}
                              </h3>
                              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                                {noticia.resumo}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <User className="h-4 w-4 mr-1" />
                                  {noticia.autor}
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