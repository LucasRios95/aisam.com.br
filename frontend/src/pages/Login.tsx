import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [emailCandidato, setEmailCandidato] = useState("");

  const { user, signInCandidato } = useAuth();
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

  return (
    <PageLayout
      title="Acesso ao Portal"
      description="Faça login para acessar os serviços exclusivos da AISAM"
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
                  <div className="flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">Login de Candidato</CardTitle>
                  <p className="text-muted-foreground">
                    Acesse sua conta para visualizar vagas e candidaturas
                  </p>
                </CardHeader>
                <CardContent>
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

                  <Separator className="my-6" />

                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ainda não tem cadastro?
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <a href="/vagas">
                        Cadastre-se na Página de Vagas
                      </a>
                    </Button>

                    <Separator className="my-4" />

                    <p className="text-sm text-muted-foreground">
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
