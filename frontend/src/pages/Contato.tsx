import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Building2,
  MessageSquare,
  User,
  Briefcase
} from "lucide-react";

const Contato = () => {
  const [carregando, setCarregando] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    // Simular envio (aqui você integraria com sua API)
    setTimeout(() => {
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve. Obrigado!",
      });
      setCarregando(false);
    }, 1500);
  };

  const informacoesContato = [
    {
      icon: MapPin,
      title: "Endereço",
      info: "Av. Santa Rita, 57 – Sala 18/19 – Vila Aguiar",
      complemento: "CEP: 18130-675 São Roque - SP"
    },
    {
      icon: Phone,
      title: "Telefone",
      info: "(11) 4712-6979",
      complemento: "Segunda a Sexta: 8h às 17h"
    },
    {
      icon: Mail,
      title: "E-mail",
      info: "contato@aisam.com.br",
      complemento: "Resposta em até 24 horas"
    },
    {
      icon: Clock,
      title: "Horário de Funcionamento",
      info: "Segunda a Sexta: 8h às 17h",
      complemento: "Sábados: 8h às 12h"
    }
  ];

  const departamentos = [
    {
      nome: "Diretoria Geral",
      email: "diretoria@aisam.com.br",
      telefone: "(11) 4712-6979",
      responsavel: "Departamento Executivo"
    },
    {
      nome: "Consultoria Jurídica",
      email: "juridico@aisam.com.br",
      telefone: "(11) 4712-6979",
      responsavel: "Setor Jurídico"
    },
    {
      nome: "Relacionamento com Associados",
      email: "associados@aisam.com.br",
      telefone: "(11) 4712-6979",
      responsavel: "Departamento de Relacionamento"
    },
    {
      nome: "Eventos e Capacitação",
      email: "eventos@aisam.com.br",
      telefone: "(11) 4712-6979",
      responsavel: "Setor de Desenvolvimento"
    }
  ];

  return (
    <PageLayout
      title="Contato"
      description="Entre em contato conosco. Estamos prontos para atender você!"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {informacoesContato.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{item.info}</p>
                    <p className="text-muted-foreground text-xs">{item.complemento}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulário de Contato */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center">
                    <MessageSquare className="h-6 w-6 mr-3 text-primary" />
                    Envie sua Mensagem
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="nome"
                            placeholder="Seu nome completo"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="empresa"
                            placeholder="Nome da empresa"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="telefone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="associacao">Informações sobre Associação</SelectItem>
                          <SelectItem value="juridico">Consultoria Jurídica</SelectItem>
                          <SelectItem value="eventos">Eventos e Capacitação</SelectItem>
                          <SelectItem value="parcerias">Parcerias e Networking</SelectItem>
                          <SelectItem value="outros">Outros Assuntos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        placeholder="Descreva sua solicitação ou dúvida..."
                        className="min-h-[120px] resize-none"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={carregando}
                      size="lg"
                    >
                      {carregando ? (
                        "Enviando..."
                      ) : (
                        <>
                          Enviar Mensagem
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Departamentos */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                  <Briefcase className="h-6 w-6 mr-3 text-primary" />
                  Contatos por Departamento
                </h2>
                
                <div className="space-y-4">
                  {departamentos.map((departamento, index) => (
                    <motion.div
                      key={departamento.nome}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="card-shadow hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                            {departamento.nome}
                          </h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-primary" />
                              {departamento.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-primary" />
                              {departamento.telefone}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-primary" />
                              {departamento.responsavel}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mapa / Localização */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nossa Localização
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Estamos localizados no coração de São Roque, com fácil acesso 
                      para todas as cidades da região.
                    </p>
                    <div className="bg-muted/30 rounded-lg p-4 text-left">
                      <p className="text-sm text-foreground font-medium">
                        Av. Santa Rita, 57 – Sala 18/19
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Vila Aguiar, São Roque - SP
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CEP: 18130-675
                      </p>
                    </div>
                    <Button variant="outline" className="mt-4" asChild>
                      <a
                        href="https://maps.google.com/?q=Av.+Santa+Rita,+57,+São+Roque,+SP"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver no Google Maps
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contato;