import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Shield, Clock, Phone, Mail } from "lucide-react";

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
      title: "Consultoria Tributária",
      description: "Suporte especializado em questões fiscais e tributárias para empresas industriais.",
      details: [
        "Planejamento tributário estratégico",
        "Orientação sobre ICMS e IPI",
        "Consultoria em benefícios fiscais",
        "Assessoria em auditorias fiscais"
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

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground mb-4">
                  Precisa de Consultoria Jurídica?
                </CardTitle>
                <p className="text-muted-foreground">
                  Entre em contato conosco para agendar uma consulta com nossos especialistas
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center space-x-3 text-muted-foreground">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>(11)99848-0708</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-muted-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>contato@emgsa.com.br</span>
                  </div>
                </div>
                <Button size="lg" className="mt-6">
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ConsultoriaJuridica;