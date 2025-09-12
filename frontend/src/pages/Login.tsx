import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(false);
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  
  // Login state
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");
  
  // Cadastro state
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregandoLogin(true);
    
    try {
      const result = await signIn(emailLogin, senhaLogin);
      if (!result.error) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        console.error("Auth error:", result.error);
        toast.error(
          result.error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : result.error.message
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setCarregandoLogin(false);
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregandoCadastro(true);
    
    const fullName = `${nome} ${sobrenome}`.trim();
    
    if (!fullName) {
      toast.error("Nome completo é obrigatório!");
      setCarregandoCadastro(false);
      return;
    }
    
    try {
      const result = await signUp(emailCadastro, senhaCadastro, fullName);
      if (!result.error) {
        toast.success("Cadastro realizado! Verifique seu email para confirmar.");
        // Clear form
        setNome("");
        setSobrenome("");
        setEmailCadastro("");
        setEmpresa("");
        setTelefone("");
        setSenhaCadastro("");
      } else {
        console.error("Auth error:", result.error);
        toast.error(result.error.message || "Erro ao criar conta");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setCarregandoCadastro(false);
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
                    Acesse sua conta ou cadastre-se para usufruir dos benefícios exclusivos
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Entrar</TabsTrigger>
                      <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
                    </TabsList>
                    
                    {/* Tab de Login */}
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email-login">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email-login"
                              type="email"
                              placeholder="seu@email.com"
                              className="pl-10"
                              value={emailLogin}
                              onChange={(e) => setEmailLogin(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="senha-login">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="senha-login"
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Sua senha"
                              className="pl-10 pr-10"
                              value={senhaLogin}
                              onChange={(e) => setSenhaLogin(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                              {mostrarSenha ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={carregandoLogin}
                        >
                          {carregandoLogin ? "Entrando..." : "Entrar"}
                        </Button>
                        
                        <div className="text-center">
                          <Button variant="link" size="sm">
                            Esqueceu sua senha?
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    {/* Tab de Cadastro */}
                    <TabsContent value="cadastro">
                      <form onSubmit={handleCadastro} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="nome"
                                placeholder="Nome"
                                className="pl-10"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="sobrenome">Sobrenome</Label>
                            <Input
                              id="sobrenome"
                              placeholder="Sobrenome"
                              value={sobrenome}
                              onChange={(e) => setSobrenome(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email-cadastro">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email-cadastro"
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
                          <Label htmlFor="empresa">Empresa</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="empresa"
                              placeholder="Nome da empresa"
                              className="pl-10"
                              value={empresa}
                              onChange={(e) => setEmpresa(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="telefone">Telefone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="telefone"
                              type="tel"
                              placeholder="(11) 99999-9999"
                              className="pl-10"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="senha-cadastro">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="senha-cadastro"
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Crie uma senha"
                              className="pl-10 pr-10"
                              value={senhaCadastro}
                              onChange={(e) => setSenhaCadastro(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                              {mostrarSenha ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={carregandoCadastro}
                        >
                          {carregandoCadastro ? "Cadastrando..." : "Cadastrar"}
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