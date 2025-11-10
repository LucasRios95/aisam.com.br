import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Shield, Clock, Phone, Mail, Award } from "lucide-react";
import martinhoLogo from "@/assets/martinho-advocacia.jfif";
import logoEGS from "@/assets/EGS2.png";

const ConsultoriaJuridica = () => {
  const servicos = [
    {
      title: "Consultoria Trabalhista",
      description: "Orientação completa sobre legislação trabalhista, contratos e relações de trabalho.",
      details: [
        "Elaboração e revisão de contratos de trabalho",
        "Orientação sobre cumprimento da CLT",
        "Assessoria em processos trabalhistas",
        "Consultoria em convenções coletivas"
      ]
    },
    {
      title: "Consultoria Empresarial",
      description: "Assessoria jurídica completa para constituição e gestão empresarial.",
      details: [
        "Constituição de empresas",
        "Alterações contratuais",
        "Assessoria em fusões e aquisições",
        "Consultoria em compliance empresarial"
      ]
    },
    {
      title: "Consultoria Ambiental",
      description: "Orientação sobre legislação ambiental e licenciamento industrial.",
      details: [
        "Licenciamento ambiental",
        "Consultoria em gestão de resíduos",
        "Assessoria em auditorias ambientais",
        "Orientação sobre legislação ambiental"
      ]
    }
  ];

  const beneficios = [
    {
      icon: Scale,
      title: "Expertise Jurídica",
      description: "Profissionais especializados em direito empresarial e industrial"
    },
    {
      icon: Shield,
      title: "Proteção Legal",
      description: "Assessoria preventiva para evitar problemas jurídicos"
    },
    {
      icon: Clock,
      title: "Atendimento Ágil",
      description: "Resposta rápida para questões urgentes e emergenciais"
    },
    {
      icon: FileText,
      title: "Documentação Completa",
      description: "Elaboração de contratos e documentos juridicamente seguros"
    }
  ];

  return (
    <PageLayout
      title="Consultoria Jurídica"
      description="Assessoria jurídica especializada para empresas industriais associadas à AISAM"
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
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8">
              A AISAM oferece consultoria jurídica especializada para suas empresas associadas,
              proporcionando segurança jurídica e orientação estratégica para o desenvolvimento
              dos negócios industriais.
            </p>
          </motion.div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={beneficio.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <beneficio.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{beneficio.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {beneficio.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Serviços - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Nossos Serviços
            </h2>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {servicos.map((servico, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-border/50 rounded-lg px-6 hover:border-primary/30 transition-colors duration-300"
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {servico.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {servico.description}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="pt-4 border-t border-border/30">
                        <h4 className="font-medium text-foreground mb-3">Serviços inclusos:</h4>
                        <ul className="space-y-2">
                          {servico.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                              <span className="text-muted-foreground text-sm">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>

          {/* Consultores */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nossos Consultores
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Profissionais experientes e especializados para atender às necessidades jurídicas das empresas industriais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-full max-w-[200px] mx-auto mb-6 rounded-xl bg-white flex items-center justify-center p-4">
                      <img src={martinhoLogo} alt="Ergesse Martinho e Guimarães - Sociedade de Advogados" className="w-full h-auto object-contain" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Ergesse Martinho e Guimarães</h3>
                    <p className="text-primary font-medium mb-4">Sociedade de Advogados</p>
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Direito Ambiental e Empresarial</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      Consultoria especializada em questões ambientais e licenciamento industrial,
                      com foco em compliance e gestão de riscos jurídicos.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">(11) 99495-5059</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">ana@emgsa.com.br</span>
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <a href="tel:+5511994955059">
                        Agendar Consulta
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="w-full max-w-[250px] mx-auto mb-6 rounded-xl bg-slate-700 flex items-center justify-center p-8 overflow-hidden">
                      <img src={logoEGS} alt="EGS Advogados" className="w-full h-auto object-contain scale-125" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">EGS Advogados</h3>
                    <p className="text-primary font-medium mb-4">Escritório Especializado</p>
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Direito Empresarial, Tributário, Trabalhista e Ambiental</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      Escritório especializado em consultoria empresarial e licenciamento industrial,
                      com foco em compliance e gestão de riscos jurídicos.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">(11) 3371-2890</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">contato@egsadvogados.com.br</span>
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <a href="tel:+551133712890">
                        Agendar Consulta
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ConsultoriaJuridica;