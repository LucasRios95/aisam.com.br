import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  MapPin,
  Building,
  Briefcase,
  Clock,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import vagasService, { type Vaga } from "@/services/vagas";
import candidaturasService from "@/services/candidaturas";

const regimeLabels: Record<string, string> = {
  presencial: "Presencial",
  hibrido: "Híbrido",
  remoto: "Remoto",
};

const senioridadeLabels: Record<string, string> = {
  estagio: "Estágio",
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  especialista: "Especialista",
};

const VagaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidatando, setCandidatando] = useState(false);
  const [jaCandidatou, setJaCandidatou] = useState(false);

  useEffect(() => {
    if (id) {
      carregarVaga();
      verificarCandidatura();
    }
  }, [id]);

  const carregarVaga = async () => {
    try {
      setLoading(true);
      const data = await vagasService.buscarPorId(id!);
      setVaga(data);
    } catch (error) {
      console.error('Erro ao carregar vaga:', error);
      toast.error('Erro ao carregar detalhes da vaga');
      navigate('/vagas');
    } finally {
      setLoading(false);
    }
  };

  const verificarCandidatura = async () => {
    try {
      const candidaturas = await candidaturasService.listar({ vaga_id: id });
      setJaCandidatou(candidaturas.length > 0);
    } catch (error) {
      // Usuário provavelmente não está autenticado
      console.log('Erro ao verificar candidatura:', error);
    }
  };

  const handleCandidatar = async () => {
    try {
      const token = localStorage.getItem('@AisamAuth:token');
      if (!token) {
        toast.error('Você precisa estar logado para se candidatar!');
        navigate('/login', { state: { returnTo: `/vaga/${id}` } });
        return;
      }

      setCandidatando(true);
      await candidaturasService.criar({ vaga_id: id! });
      toast.success('Candidatura realizada com sucesso!');
      setJaCandidatou(true);
    } catch (error: any) {
      console.error('Erro ao candidatar:', error);
      if (error.response?.status === 401) {
        toast.error('Você precisa estar logado como candidato!');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Erro ao realizar candidatura');
      }
    } finally {
      setCandidatando(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!vaga) {
    return null;
  }

  return (
    <PageLayout
      title={vaga.titulo}
      description="Detalhes da vaga e candidatura"
    >
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/vagas')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para vagas
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-shadow border-0">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{vaga.titulo}</CardTitle>
                    {!vaga.empresa_anonima && vaga.associado?.razao_social && (
                      <CardDescription className="flex items-center gap-2 text-lg">
                        <Building className="h-5 w-5" />
                        {vaga.associado.razao_social}
                      </CardDescription>
                    )}
                    {vaga.empresa_anonima && (
                      <CardDescription className="flex items-center gap-2 text-lg">
                        <Building className="h-5 w-5" />
                        Empresa Confidencial
                      </CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {vaga.status === 'aberta' ? 'Vaga Ativa' : 'Vaga Encerrada'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {vaga.localidade && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {vaga.localidade}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {regimeLabels[vaga.regime]}
                  </div>
                  {vaga.email_contato && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {vaga.email_contato}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm">
                    {senioridadeLabels[vaga.senioridade]}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {regimeLabels[vaga.regime]}
                  </Badge>
                </div>

                <Separator />

                {/* Descrição */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Descrição da Vaga</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {vaga.descricao}
                  </p>
                </div>

                {/* Áreas de Atuação */}
                {vaga.areas_atuacao && vaga.areas_atuacao.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Áreas de Atuação</h3>
                      <div className="flex flex-wrap gap-2">
                        {vaga.areas_atuacao.map((area, idx) => (
                          <Badge key={idx} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Botão de Candidatura */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {jaCandidatou ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950 px-4 py-3 rounded-lg flex-1">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Você já se candidatou a esta vaga</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleCandidatar}
                      disabled={candidatando || vaga.status !== 'aberta'}
                      className="flex-1"
                      size="lg"
                    >
                      {candidatando ? 'Enviando candidatura...' : 'Candidatar-se a esta vaga'}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => navigate('/vagas')}
                    size="lg"
                  >
                    Ver outras vagas
                  </Button>
                </div>

                {vaga.status !== 'aberta' && (
                  <p className="text-sm text-muted-foreground text-center">
                    Esta vaga não está mais aceitando candidaturas
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default VagaDetalhes;
