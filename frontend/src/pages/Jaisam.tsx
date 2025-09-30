import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import jaisamLogo from '@/assets/logo-jaisam.jpg';
import jaisam1 from '@/assets/JAISAM/534379038_1225849149588925_8712389801415842592_n.jpg';
import jaisam2 from '@/assets/JAISAM/534812424_1225849362922237_7145968157662925769_n.jpg';
import jaisam3 from '@/assets/JAISAM/535266332_1225849472922226_5202549110786027285_n.jpg';
import jaisam4 from '@/assets/JAISAM/535333890_1225849256255581_8998785420240318382_n.jpg';
import jaisam5 from '@/assets/JAISAM/535399870_1225849536255553_7166607555487120665_n.jpg';
import {
  Trophy,
  Users,
  Calendar,
  Mail,
  Phone,
  Heart,
  Smile,
  Target
} from "lucide-react";

const inscricaoFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  empresa: z.string().min(2, "Nome da empresa é obrigatório"),
  modalidades: z.string().min(10, "Por favor, informe as modalidades de interesse"),
});

type InscricaoFormData = z.infer<typeof inscricaoFormSchema>;

const Jaisam = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      modalidades: "",
    },
  });

  const beneficios = [
    {
      icon: Heart,
      title: "Confraternização",
      description: "Momentos de integração e descontração entre colaboradores das indústrias associadas"
    },
    {
      icon: Trophy,
      title: "Competições Esportivas",
      description: "Diversas modalidades esportivas para todos os participantes"
    },
    {
      icon: Users,
      title: "Integração",
      description: "Fortalecimento dos laços entre empresas e colaboradores da região"
    },
    {
      icon: Smile,
      title: "Espírito de Equipe",
      description: "Incentivo ao trabalho em equipe e união entre os participantes"
    }
  ];

  const modalidades = [
    {
      icon: Trophy,
      title: "Futebol",
      description: "Campeonato de futebol society entre as empresas associadas"
    },
    {
      icon: Trophy,
      title: "Vôlei",
      description: "Torneio de vôlei com equipes mistas"
    },
    {
      icon: Trophy,
      title: "Tênis de Mesa",
      description: "Competições individuais e em duplas de tênis de mesa"
    },
    {
      icon: Trophy,
      title: "Outras Modalidades",
      description: "Basquete, xadrez e outras atividades esportivas"
    }
  ];

  const onSubmit = async (data: InscricaoFormData) => {
    setIsSubmitting(true);

    try {
      const emailSubject = `Nova Inscrição JAISAM - ${data.nome}`;
      const emailBody = `
NOVA INSCRIÇÃO JAISAM (Jogos da AISAM)

=== DADOS DO PARTICIPANTE ===
Nome: ${data.nome}
Email: ${data.email}
Telefone: ${data.telefone}
Empresa: ${data.empresa}

=== MODALIDADES DE INTERESSE ===
${data.modalidades}

---
Inscrição enviada em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
      `.trim();

      const mailtoLink = `mailto:aisam@aisam.com.br?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;

      toast({
        title: "Inscrição enviada!",
        description: "Seu cliente de email foi aberto. Revise e envie para completar sua inscrição.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar inscrição",
        description: "Houve um problema. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      {/* Hero Section with Logo and Visual Design */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-40 -z-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo with special styling */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200/30 blur-3xl rounded-full"></div>
                <img
                  src={jaisamLogo}
                  alt="Logo JAISAM"
                  className="relative h-40 md:h-48 w-auto object-contain rounded-3xl shadow-xl border-4 border-white backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Title and subtitle */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-4 text-slate-800 drop-shadow-sm"
            >
              JAISAM 2025
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl md:text-3xl mb-8 text-slate-600 font-semibold"
            >
              Jogos da AISAM
            </motion.p>

            {/* Call to action cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12"
            >
              <Card className="bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Competições</h3>
                  <p className="text-slate-600">Diversas modalidades esportivas</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Integração</h3>
                  <p className="text-slate-600">Confraternização entre empresas</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Celebração</h3>
                  <p className="text-slate-600">Momentos inesquecíveis</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* JAISAM 2025 Event Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[jaisam1, jaisam2, jaisam3, jaisam4, jaisam5].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <img
                  src={img}
                  alt={`JAISAM 2025 - Foto ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="card-shadow border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-4">Informações do Evento</h3>
                <p className="text-muted-foreground mb-4">
                  Fique atento às próximas novidades sobre o JAISAM 2025!
                  Em breve divulgaremos a data, local e todas as modalidades disponíveis.
                </p>
                <p className="text-primary font-semibold">
                  Não perca a oportunidade de fazer parte desta grande celebração esportiva!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Por Que Participar?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              O JAISAM promove integração, saúde e momentos inesquecíveis entre os colaboradores das indústrias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => {
              const Icon = beneficio.icon;
              return (
                <motion.div
                  key={beneficio.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-shadow hover:scale-105 transition-all duration-300 h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <h3 className="font-bold text-foreground mb-3">{beneficio.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {beneficio.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sports Modalities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Modalidades Esportivas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Diversas opções de esportes para você e sua equipe participarem e se divertirem
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modalidades.map((modalidade, index) => {
              const Icon = modalidade.icon;
              return (
                <motion.div
                  key={modalidade.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                    <CardContent className="p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <Icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-3">{modalidade.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {modalidade.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Faça Sua Inscrição
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Participe do JAISAM e celebre o esporte junto com os colaboradores das indústrias da região
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="card-shadow border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold text-foreground mb-4">
                  Inscrição JAISAM 2025
                </CardTitle>
                <p className="text-muted-foreground">
                  Preencha seus dados e informe as modalidades esportivas que deseja participar
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="empresa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="modalidades"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modalidades de Interesse *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Informe as modalidades esportivas que gostaria de participar (Futebol, Vôlei, Tênis de Mesa, etc.)..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-6 border-t border-border text-center">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full md:w-auto md:px-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4">
                        * Campos obrigatórios. Entraremos em contato com mais informações sobre as datas e local do evento.
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 hero-section text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Fale Conosco
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Tem dúvidas sobre os Jogos da AISAM? Entre em contato conosco!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6" />
                <span className="text-lg">(11) 4712-6979</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <span className="text-lg">aisam@aisam.com.br</span>
              </div>
            </div>
            <Button size="lg" variant="secondary" asChild>
              <a href="https://wa.me/5511947126979" target="_blank" rel="noopener noreferrer">
                WhatsApp AISAM
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Jaisam;