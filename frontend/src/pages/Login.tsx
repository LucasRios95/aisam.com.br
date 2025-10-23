import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Shield, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  // Candidato Login state
  const [emailCandidato, setEmailCandidato] = useState("");

  // Candidato Cadastro state
  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [telefoneCadastro, setTelefoneCadastro] = useState("");
  const [cidadeCadastro, setCidadeCadastro] = useState("");
  const [estadoCadastro, setEstadoCadastro] = useState("");
  const [consentimento, setConsentimento] = useState(false);

  // Recrutador Login state
  const [emailRecrutador, setEmailRecrutador] = useState("");
  const [senhaRecrutador, setSenhaRecrutador] = useState("");

  // Admin Login state
  const [emailAdmin, setEmailAdmin] = useState("");
  const [senhaAdmin, setSenhaAdmin] = useState("");

  // Tab state
  const [candidatoTab, setCandidatoTab] = useState<"login" | "cadastro">("login");

  const {
    user,
    signInCandidato,
    signUpCandidato,
    signInRecrutador,
    signInAdmin
  } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Candidato Magic Link
  const handleLoginCandidato = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInCandidato(emailCandidato);
      if (result.success) {
        toast.success(result.message || "Link de acesso enviado!");
        setEmailCandidato("");
      } else {
        toast.error(result.message || "Erro ao enviar link");
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Candidato Cadastro
  const handleCadastroCandidato = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentimento) {
      toast.error("Você precisa aceitar o consentimento de dados");
      return;
    }

    setLoading(true);

    try {
      const result = await signUpCandidato({
        nome: nomeCadastro,
        email: emailCadastro,
        telefone: telefoneCadastro || undefined,
        cidade: cidadeCadastro || undefined,
        estado: estadoCadastro || undefined,
        consentimento_dados: consentimento
      });

      if (result.success) {
        toast.success(result.message || "Cadastro realizado!");
        // Clear form
        setNomeCadastro("");
        setEmailCadastro("");
        setTelefoneCadastro("");
        setCidadeCadastro("");
        setEstadoCadastro("");
        setConsentimento(false);
        // Switch to login tab
        setCandidatoTab("login");
      } else {
        toast.error(result.message || "Erro ao cadastrar");
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Recrutador Login
  const handleLoginRecrutador = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInRecrutador(emailRecrutador, senhaRecrutador);
      if (result.success) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Email ou senha incorretos");
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInAdmin(emailAdmin, senhaAdmin);
      if (result.success) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Email ou senha incorretos");
      }
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Acesso ao Portal"
      description="Faça login ou cadastre-se para acessar os serviços exclusivos da AISAM"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="card-shadow border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-foreground">Portal AISAM</CardTitle>
                  <p className="text-muted-foreground">
                    Acesse sua conta conforme seu perfil
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="candidato" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="candidato" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Candidato
                      </TabsTrigger>
                      <TabsTrigger value="recrutador" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Recrutador
                      </TabsTrigger>
                      <TabsTrigger value="admin" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </TabsTrigger>
                    </TabsList>

                    {/* CANDIDATO TAB */}
                    <TabsContent value="candidato">
                      <Tabs value={candidatoTab} onValueChange={(v) => setCandidatoTab(v as "login" | "cadastro")}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="login">Entrar</TabsTrigger>
                          <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
                        </TabsList>

                        {/* Login Candidato */}
                        <TabsContent value="login">
                          <form onSubmit={handleLoginCandidato} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="email-candidato">E-mail</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="email-candidato"
                                  type="email"
                                  placeholder="seu@email.com"
                                  className="pl-10"
                                  value={emailCandidato}
                                  onChange={(e) => setEmailCandidato(e.target.value)}
                                  required
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Enviaremos um link de acesso para seu email
                              </p>
                            </div>

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={loading}
                            >
                              {loading ? "Enviando..." : "Enviar Link de Acesso"}
                            </Button>
                          </form>
                        </TabsContent>

                        {/* Cadastro Candidato */}
                        <TabsContent value="cadastro">
                          <form onSubmit={handleCadastroCandidato} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="nome-cadastro">Nome Completo *</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="nome-cadastro"
                                  placeholder="Seu nome completo"
                                  className="pl-10"
                                  value={nomeCadastro}
                                  onChange={(e) => setNomeCadastro(e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email-cadastro-candidato">E-mail *</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="email-cadastro-candidato"
                                  type="email"
                                  placeholder="seu@email.com"
                                  className="pl-10"
                                  value={emailCadastro}
                                  onChange={(e) => setEmailCadastro(e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="telefone-cadastro">Telefone</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="telefone-cadastro"
                                  type="tel"
                                  placeholder="(11) 99999-9999"
                                  className="pl-10"
                                  value={telefoneCadastro}
                                  onChange={(e) => setTelefoneCadastro(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cidade-cadastro">Cidade</Label>
                                <Input
                                  id="cidade-cadastro"
                                  placeholder="São Paulo"
                                  value={cidadeCadastro}
                                  onChange={(e) => setCidadeCadastro(e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="estado-cadastro">Estado</Label>
                                <Input
                                  id="estado-cadastro"
                                  placeholder="SP"
                                  maxLength={2}
                                  value={estadoCadastro}
                                  onChange={(e) => setEstadoCadastro(e.target.value.toUpperCase())}
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="consentimento"
                                checked={consentimento}
                                onCheckedChange={(checked) => setConsentimento(checked as boolean)}
                                required
                              />
                              <Label
                                htmlFor="consentimento"
                                className="text-sm font-normal leading-tight cursor-pointer"
                              >
                                Concordo com o tratamento dos meus dados conforme LGPD *
                              </Label>
                            </div>

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={loading}
                            >
                              {loading ? "Cadastrando..." : "Cadastrar"}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                              Após o cadastro, você receberá um email com link de acesso
                            </p>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>

                    {/* RECRUTADOR TAB */}
                    <TabsContent value="recrutador">
                      <form onSubmit={handleLoginRecrutador} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-recrutador">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email-recrutador"
                              type="email"
                              placeholder="recrutador@empresa.com"
                              className="pl-10"
                              value={emailRecrutador}
                              onChange={(e) => setEmailRecrutador(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="senha-recrutador">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="senha-recrutador"
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Sua senha"
                              className="pl-10 pr-10"
                              value={senhaRecrutador}
                              onChange={(e) => setSenhaRecrutador(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                              {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? "Entrando..." : "Entrar como Recrutador"}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          Credenciais fornecidas pelo administrador AISAM
                        </p>
                      </form>
                    </TabsContent>

                    {/* ADMIN TAB */}
                    <TabsContent value="admin">
                      <form onSubmit={handleLoginAdmin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-admin">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email-admin"
                              type="email"
                              placeholder="admin@aisam.com.br"
                              className="pl-10"
                              value={emailAdmin}
                              onChange={(e) => setEmailAdmin(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="senha-admin">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="senha-admin"
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Sua senha"
                              className="pl-10 pr-10"
                              value={senhaAdmin}
                              onChange={(e) => setSenhaAdmin(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                              {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          {loading ? "Entrando..." : "Entrar como Admin"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Ainda não é associado?
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/associe-se">
                        Conheça os Benefícios de Ser Associado
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Login;
