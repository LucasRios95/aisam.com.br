import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import { UserPlus, Building2, Mail, Phone, MapPin } from "lucide-react";

const membershipFormSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(18, "CNPJ inválido"),
  responsibleName: z.string().min(2, "Nome do responsável deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  industry: z.string().min(2, "Setor industrial é obrigatório"),
  employees: z.string().min(1, "Número de funcionários é obrigatório"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  motivation: z.string().min(20, "Motivação deve ter pelo menos 20 caracteres"),
});

type MembershipFormData = z.infer<typeof membershipFormSchema>;

const AssocieSe = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<MembershipFormData>({
    resolver: zodResolver(membershipFormSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      responsibleName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      industry: "",
      employees: "",
      description: "",
      motivation: "",
    },
  });

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true);

    try {
      // Formatação do email
      const emailSubject = `Nova Solicitação de Associação - ${data.companyName}`;
      const emailBody = `
NOVA SOLICITAÇÃO DE ASSOCIAÇÃO AISAM

=== DADOS DA EMPRESA ===
Empresa: ${data.companyName}
CNPJ: ${data.cnpj}
Setor Industrial: ${data.industry}
Número de Funcionários: ${data.employees}

=== DADOS DE CONTATO ===
Responsável: ${data.responsibleName}
Email: ${data.email}
Telefone: ${data.phone}

=== ENDEREÇO ===
Endereço: ${data.address}
Cidade: ${data.city}

=== INFORMAÇÕES ADICIONAIS ===
Descrição da Empresa:
${data.description}

Motivação para Associação:
${data.motivation}

---
Solicitação enviada em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
      `.trim();

      // Criar link mailto formatado
      const mailtoLink = `mailto:aisam@aisam.com.br?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // Abrir cliente de email
      window.location.href = mailtoLink;

      toast({
        title: "Email preparado!",
        description: "Seu cliente de email foi aberto com os dados formatados. Revise e envie o email.",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao preparar email",
        description: "Houve um problema ao preparar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="py-16 hero-section text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Torne-se um Associado
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                Junte-se à AISAM e faça parte da maior associação industrial da região. 
                Juntos, fortalecemos o setor e defendemos nossos interesses comuns.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="card-shadow border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold text-foreground mb-4">
                    Formulário de Associação
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    Preencha os dados abaixo para solicitar sua associação à AISAM. 
                    Nossa equipe analisará sua solicitação e entrará em contato.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Company Information */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Building2 className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">Dados da Empresa</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome da Empresa *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Indústria ABC Ltda" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cnpj"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CNPJ *</FormLabel>
                                <FormControl>
                                  <Input placeholder="00.000.000/0000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Setor Industrial *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Metalúrgica, Têxtil, Química" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="employees"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Funcionários *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: 1-10, 11-50, 51-200, 200+" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Mail className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">Dados de Contato</h3>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="responsibleName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Responsável *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome completo do responsável pela empresa" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="contato@empresa.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
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
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">Endereço</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Endereço Completo *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Rua, número, bairro" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cidade *</FormLabel>
                                <FormControl>
                                  <Input placeholder="São Roque" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-foreground">Informações Adicionais</h3>
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição da Empresa *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descreva brevemente as atividades principais da sua empresa..." 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Conte-nos sobre o que sua empresa faz e seus principais produtos/serviços.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="motivation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Por que deseja se associar à AISAM? *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Explique suas motivações para se tornar associado..." 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Compartilhe suas expectativas e como a AISAM pode ajudar sua empresa.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-6 border-t border-border">
                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full md:w-auto md:px-12"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                          * Campos obrigatórios. Sua solicitação será analisada pela nossa equipe e 
                          entraremos em contato em até 5 dias úteis.
                        </p>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AssocieSe;