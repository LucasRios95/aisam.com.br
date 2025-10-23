import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

const AceitarConviteRecrutador = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [conviteValido, setConviteValido] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  // Validações de senha
  const senhaMinLength = senha.length >= 8;
  const senhaHasUppercase = /[A-Z]/.test(senha);
  const senhaHasLowercase = /[a-z]/.test(senha);
  const senhaHasNumber = /[0-9]/.test(senha);
  const senhaHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  const senhasMatch = senha === confirmacaoSenha && senha.length > 0;

  const senhaValida = senhaMinLength && senhaHasUppercase && senhaHasLowercase && senhaHasNumber && senhaHasSpecial;

  useEffect(() => {
    if (!token) {
      toast.error("Token de convite inválido");
      navigate("/login");
      return;
    }

    // Valida se o token existe (não precisa endpoint específico, apenas tenta aceitar vazio)
    setValidating(false);
    setConviteValido(true);
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaValida) {
      toast.error("A senha não atende aos requisitos mínimos");
      return;
    }

    if (!senhasMatch) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/recrutadores/aceitar-convite`, {
        token,
        senha
      });

      toast.success("Senha criada com sucesso! Você já pode fazer login.");

      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Erro ao aceitar convite';
      toast.error(errorMessage);

      // Se o convite for inválido ou expirado, redireciona para login
      if (error.response?.status === 404 || error.response?.status === 400) {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Validando convite...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!conviteValido) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Convite Inválido</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Este convite é inválido ou já foi utilizado.
            </p>
            <Button onClick={() => navigate("/login")}>
              Ir para Login
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Aceitar Convite"
      description="Crie sua senha para acessar o sistema de recrutamento AISAM"
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
                  <CardTitle className="text-2xl text-foreground">Bem-vindo!</CardTitle>
                  <CardDescription>
                    Defina sua senha para acessar o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Senha */}
                    <div className="space-y-2">
                      <Label htmlFor="senha">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="senha"
                          type={mostrarSenha ? "text" : "password"}
                          placeholder="Digite sua senha"
                          className="pl-10 pr-10"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
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

                    {/* Confirmação de Senha */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmacao-senha">Confirme a Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmacao-senha"
                          type={mostrarConfirmacao ? "text" : "password"}
                          placeholder="Digite sua senha novamente"
                          className="pl-10 pr-10"
                          value={confirmacaoSenha}
                          onChange={(e) => setConfirmacaoSenha(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                        >
                          {mostrarConfirmacao ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Requisitos da Senha */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Requisitos da senha:
                      </p>
                      <div className="space-y-1">
                        <RequisitoSenha valido={senhaMinLength} texto="Mínimo 8 caracteres" />
                        <RequisitoSenha valido={senhaHasUppercase} texto="Pelo menos uma letra maiúscula" />
                        <RequisitoSenha valido={senhaHasLowercase} texto="Pelo menos uma letra minúscula" />
                        <RequisitoSenha valido={senhaHasNumber} texto="Pelo menos um número" />
                        <RequisitoSenha valido={senhaHasSpecial} texto="Pelo menos um caractere especial" />
                        {confirmacaoSenha.length > 0 && (
                          <RequisitoSenha valido={senhasMatch} texto="Senhas coincidem" />
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !senhaValida || !senhasMatch}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Criar Senha e Ativar Conta"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

// Componente auxiliar para mostrar requisitos
interface RequisitoSenhaProps {
  valido: boolean;
  texto: string;
}

const RequisitoSenha = ({ valido, texto }: RequisitoSenhaProps) => (
  <div className="flex items-center gap-2 text-sm">
    {valido ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-muted-foreground" />
    )}
    <span className={valido ? "text-green-600" : "text-muted-foreground"}>
      {texto}
    </span>
  </div>
);

export default AceitarConviteRecrutador;
