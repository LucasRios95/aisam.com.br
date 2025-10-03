import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2, Scale, TrendingUp, FileText, Shield, MessageCircle } from "lucide-react";
import { url } from "inspector";
import { Link } from "react-router-dom";

const LinksUteis = () => {
  const categorias = [
    {
      title: "Órgãos Governamentais",
      icon: Building2,
      links: [
        {
          name: "Receita Federal",
          description: "Portal oficial da Receita Federal do Brasil",
          url: "https://www.gov.br/receitafederal/pt-br"
        },
        {
          name: "Ministério da Economia",
          description: "Portal do Ministério da Economia",
          url: "https://www.gov.br/economia/pt-br"
        },
        {
          name: "ANVISA",
          description: "Agência Nacional de Vigilância Sanitária",
          url: "https://www.gov.br/anvisa/pt-br"
        },
        {
          name: "IBAMA",
          description: "Instituto Brasileiro do Meio Ambiente",
          url: "https://www.gov.br/ibama/pt-br"
        }
      ]
    },
    {
      title: "Legislação e Normas",
      icon: Scale,
      links: [
        {
          name: "Planalto - Legislação",
          description: "Portal da legislação federal brasileira",
          url: "https://www.planalto.gov.br/ccivil_03/leis/"
        },
        {
          name: "Consolidação das Leis do Trabalho",
          description: "CLT - Decreto-Lei nº 5.452/1943",
          url: "http://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm"
        },
        {
          name: "Código Tributário Nacional",
          description: "CTN - Lei nº 5.172/1966",
          url: "http://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"
        },
        {
          name: "ABNT - Normas Técnicas",
          description: "Associação Brasileira de Normas Técnicas",
          url: "https://www.abnt.org.br/"
        }
      ]
    },
    {
      title: "Entidades Setoriais",
      icon: TrendingUp,
      links: [
        {
          name: "CNI - Confederação Nacional da Indústria",
          description: "Entidade máxima de representação da indústria",
          url: "https://www.portaldaindustria.com.br/"
        },
        {
          name: "FIESP - Federação das Indústrias de SP",
          description: "Federação das Indústrias do Estado de São Paulo",
          url: "https://www.fiesp.com.br/"
        },
        {
          name: "SEBRAE",
          description: "Serviço Brasileiro de Apoio às Micro e Pequenas Empresas",
          url: "https://www.sebrae.com.br/"
        },
        {
          name: "SENAI",
          description: "Serviço Nacional de Aprendizagem Industrial",
          url: "https://www.sp.senai.br/"
        },
        {
          name: "SESI",
          description: "Serviço Social da Indústria",
          url: "https://www.sesi.org.br/"
        }
      ]
    },
    {
      title: "Consultas e Certidões",
      icon: FileText,
      links: [
        {
          name: "Consulta CNPJ",
          description: "Consulta situação cadastral CNPJ",
          url: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/consultas"
        },
        {
          name: "Consulta CPF",
          description: "Consulta situação cadastral CPF",
          url: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-cpf"
        },
        {
          name: "SERASA",
          description: "Consultas e análises de crédito",
          url: "https://www.serasa.com.br/"
        },
        {
          name: "SPC Brasil",
          description: "Serviço de Proteção ao Crédito",
          url: "https://www.spcbrasil.org.br/"
        }
      ]
    },
    {
      title: "Meio Ambiente e Licenças",
      icon: Shield,
      links: [
        {
          name: "CETESB",
          description: "Companhia Ambiental do Estado de São Paulo",
          url: "https://cetesb.sp.gov.br/"
        },
        {
          name: "Licenciamento Ambiental Federal",
          description: "Portal do licenciamento ambiental",
          url: "https://www.gov.br/ibama/pt-br/assuntos/licenciamento-ambiental"
        },
        {
          name: "Sistema Nacional de Informações sobre Meio Ambiente",
          description: "SINIMA - Portal de informações ambientais",
          url: "https://www.gov.br/mma/pt-br"
        },
        {
          name: "Cadastro Técnico Federal",
          description: "CTF - Cadastro de atividades potencialmente poluidoras",
          url: "https://servicos.ibama.gov.br/ctf/publico/"
        }
      ]
    }
  ];

  return (
    <PageLayout
      title="Links Úteis"
      description="Acesse rapidamente os principais portais e recursos para empresas industriais"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Introdução */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Compilamos os principais links e recursos que toda empresa industrial precisa ter à mão.
              Facilite o acesso às informações essenciais para o seu negócio.
            </p>
          </motion.div>

          {/* Categorias de Links */}
          <div className="space-y-12">
            {categorias.map((categoria, categoryIndex) => (
              <motion.div
                key={categoria.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <categoria.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{categoria.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {categoria.links.map((link, linkIndex) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-foreground flex items-center justify-between">
                            {link.name}
                            <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {link.description}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full group-hover:border-primary/30 transition-colors duration-300"
                          >
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              Acessar Portal
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Precisa de Mais Informações?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Nossa equipe está sempre disponível para ajudar você a encontrar os recursos
                  e informações necessários para o seu negócio. Entre em contato conosco!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/associe-se">
                      Associe-se Agora
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" asChild>
                    <a href="/contato">
                      Entre em Contato
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <a href="https://wa.me/551147126979" target="_blank" rel="noopener noreferrer">
                      WhatsApp
                      <MessageCircle className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default LinksUteis;