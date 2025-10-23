import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const CandidatoAcesso = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicToken, user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (user) {
      navigate("/dashboard");
      return;
    }

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de acesso não encontrado na URL");
      return;
    }

    // Verify the magic token
    verifyToken(token);
  }, [searchParams, user]);

  const verifyToken = async (token: string) => {
    try {
      const result = await verifyMagicToken(token);

      if (result.success) {
        setStatus("success");
        setMessage("Acesso autenticado com sucesso!");

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(result.message || "Erro ao validar token de acesso");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Erro inesperado ao processar acesso");
    }
  };

  return (
    <PageLayout>
      <section className="py-16 min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="card-shadow border-0">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    {status === "loading" && "Processando Acesso..."}
                    {status === "success" && "Acesso Autorizado!"}
                    {status === "error" && "Erro no Acesso"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-16 w-16 text-primary animate-spin" />
                      <p className="text-muted-foreground">
                        Validando seu token de acesso...
                      </p>
                    </div>
                  )}

                  {status === "success" && (
                    <div className="flex flex-col items-center gap-4">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <div>
                        <p className="text-lg font-medium text-foreground mb-2">
                          {message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Redirecionando para o dashboard...
                        </p>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex flex-col items-center gap-4">
                      <XCircle className="h-16 w-16 text-red-500" />
                      <div>
                        <p className="text-lg font-medium text-foreground mb-2">
                          {message}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          O link pode ter expirado ou já foi utilizado
                        </p>
                        <Button onClick={() => navigate("/login")}>
                          Voltar para Login
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CandidatoAcesso;
