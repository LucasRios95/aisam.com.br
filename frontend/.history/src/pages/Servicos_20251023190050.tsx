import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Handshake,
  TrendingUp,
  MessageSquare,
  Calendar,
  FileText,
  Building2,
  Phone,
  Mail,
  ExternalLink,
  MessageCircle,
  Briefcase,
  Scale,
  Home,
  Gift,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";

const Servicos = () => {
  const servicos = [
    {
      icon: Briefcase,
      title: "Recursos de Suporte a RHs",
      description: "Sistema completo de gestão de vagas e currículos para facilitar o recrutamento nas empresas associadas.",
      features: [
        "Plataforma de vagas e currículos",
        "Gestão de candidaturas",
        "Suporte ao recrutamento"
      ],
      link: "/vagas"
    },
    {
      icon: Scale,
      title: "Suporte Diversos Departamentos da FIESP",
      description: "Acesso a diversos departamentos especializados da FIESP para suporte às empresas associadas.",
      features: [
        "Jurídico",
        "Inovação",
        "Tecnologias",
        "Infraestrutura",
        "Trabalhista"
      ],
      link: "/links-uteis"
    },
    {
      icon: Home,
      title: "Infraestrutura AISAM",
      description: "Espaços físicos disponíveis para realização de reuniões, treinamentos e eventos das empresas associadas.",
      features: [
        "Sala de Reunião",
        "Sala de Aulas",
        "Equipamentos disponíveis",
        "Agendamento facilitado"
      ],
      link: "/contato"
    },
    {
      icon: Gift,
      title: "Convênios e Parcerias",
      description: "Rede de convênios com diversas instituições oferecendo benefícios exclusivos aos associados.",
      features: [
        "Grupo RAS (TI e Cursos de Gestão)",
        "Centro Universitário",
        "SPC e CDL",
        "Clubes Esportivos"
      ],
      link: "/associe-se"
    },
    {
      icon: Trophy,
      title: "Qualidade de Vida",
      description: "Programas e eventos voltados para o bem-estar e integração dos colaboradores das empresas associadas.",
      features: [
        "JOGOS DA AISAM",
        "GUS (Grêmio dos Usuários)",
        "CASM",
        "SRC",
        "Eventos esportivos"
      ],
      link: "/jaisam"
    }
  ];

  const vantagens = [
    {
      number: "40+",
      label: "Empresas Associadas",
      description: "Rede sólida de empresários industriais"
    },
    {
      number: "39+",
      label: "Anos de Experiência",
      description: "Tradição em representação industrial"
    },
    {
      number: "100%",
      label: "Comprometimento",
      description: "Dedicação total aos associados"
    }
  ];

  return (
    <PageLayout
      title="Serviços"
      description="Conheça todos os serviços e benefícios oferecidos pela AISAM aos seus associados"
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
              A AISAM oferece uma gama completa de serviços desenvolvidos especialmente para
              atender às necessidades das empresas industriais, promovendo seu crescimento
              e fortalecimento no mercado.
            </p>
          </motion.div>

          {/* Grid de Serviços */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {servicos.map((servico, index) => (
              <motion.div
                key={servico.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <servico.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{servico.title}</CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {servico.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {servico.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to={servico.link}>
                        Saiba Mais
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Nossa Força em Números
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {vantagens.map((vantagem, index) => (
                <motion.div
                  key={vantagem.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {vantagem.number}
                  </div>
                  <div className="font-medium text-foreground mb-1">
                    {vantagem.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {vantagem.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <Building2 className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Pronto para Fazer Parte da AISAM?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Junte-se à maior associação industrial da região e tenha acesso a todos
                  esses serviços e benefícios exclusivos para empresas associadas.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/associe-se">
                      Associe-se Agora
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/contato">
                      Saiba Mais
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <a href="https://wa.me/551147126979" target="_blank" rel="noopener noreferrer">
                      WhatsApp
                      <MessageCircle className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 pt-6 border-t border-border/30">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>(11) 4712-6979</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>aisam@aisam.com.br</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Servicos;