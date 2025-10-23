import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Briefcase, Save, MapPin, Mail, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface AreaAtuacao {
  id: string;
  nome: string;
  slug: string;
  ativo: boolean;
}

const PublicarVaga = () => {
  const [loading, setLoading] = useState(false);
  const [areasAtuacao, setAreasAtuacao] = useState<AreaAtuacao[]>([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    senioridade: "",
    areas_atuacao: [] as string[],
    regime: "",
    localidade: "",
    email_contato: "",
    empresa_anonima: false
  });

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user can post jobs (RECRUTADOR or ADMIN)
    if (user.role !== 'RECRUTADOR' && !isAdmin()) {
      navigate("/dashboard");
      toast.error("Apenas recrutadores e administradores podem publicar vagas");
      return;
    }

    carregarAreasAtuacao();
  }, [user, isAdmin, navigate]);

  async function carregarAreasAtuacao() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/areas-atuacao`
      );
      setAreasAtuacao(response.data.filter((area: AreaAtuacao) => area.ativo));
    } catch (err) {
      console.error("Erro ao carregar áreas de atuação:", err);
      toast.error("Erro ao carregar áreas de atuação");
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAreaAtuacao = (areaId: string) => {
    setFormData(prev => ({
      ...prev,
      areas_atuacao: prev.areas_atuacao.includes(areaId)
        ? prev.areas_atuacao.filter(id => id !== areaId)
        : [...prev.areas_atuacao, areaId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validações
    if (formData.areas_atuacao.length === 0) {
      toast.error("Selecione pelo menos uma área de atuação");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("@AisamAuth:token");

      if (!token) {
        toast.error("Você precisa estar autenticado");
        navigate("/login");
        return;
      }

      // Prepare data for backend
      const vagaData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        senioridade: formData.senioridade,
        areas_atuacao: formData.areas_atuacao,
        regime: formData.regime,
        localidade: formData.localidade || undefined,
        email_contato: formData.email_contato,
        empresa_anonima: formData.empresa_anonima,
        recrutador_id: user.id,
        associado_id: user.id // Assuming same user for now
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/vagas`,
        vagaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success('Vaga publicada com sucesso!');

      // Reset form
      setFormData({
        titulo: "",
        descricao: "",
        senioridade: "",
        areas_atuacao: [],
        regime: "",
        localidade: "",
        email_contato: "",
        empresa_anonima: false
      });

      navigate('/vagas');
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || 'Erro ao publicar vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Publicar Nova Vaga
              </h1>
              <p className="text-muted-foreground">
                Encontre os melhores profissionais para sua empresa
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Basic Info */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Informações Básicas da Vaga
                </CardTitle>
                <CardDescription>
                  Dados essenciais sobre a oportunidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título da Vaga *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    placeholder="Ex: Analista de Sistemas Sênior"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senioridade">Senioridade *</Label>
                    <Select
                      value={formData.senioridade}
                      onValueChange={(value) => handleInputChange('senioridade', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a senioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estagio">Estágio</SelectItem>
                        <SelectItem value="junior">Júnior</SelectItem>
                        <SelectItem value="pleno">Pleno</SelectItem>
                        <SelectItem value="senior">Sênior</SelectItem>
                        <SelectItem value="especialista">Especialista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="regime">Regime de Trabalho *</Label>
                    <Select
                      value={formData.regime}
                      onValueChange={(value) => handleInputChange('regime', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o regime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                        <SelectItem value="remoto">Remoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="localidade" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização
                  </Label>
                  <Input
                    id="localidade"
                    value={formData.localidade}
                    onChange={(e) => handleInputChange('localidade', e.target.value)}
                    placeholder="Ex: São Roque - SP"
                  />
                </div>

                <div>
                  <Label htmlFor="email_contato" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mail para Contato *
                  </Label>
                  <Input
                    id="email_contato"
                    type="email"
                    value={formData.email_contato}
                    onChange={(e) => handleInputChange('email_contato', e.target.value)}
                    placeholder="recrutamento@empresa.com"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="empresa_anonima"
                    checked={formData.empresa_anonima}
                    onCheckedChange={(checked) =>
                      handleInputChange('empresa_anonima', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="empresa_anonima"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    <EyeOff className="h-4 w-4" />
                    Empresa Confidencial (ocultar nome da empresa)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Areas de Atuação */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Áreas de Atuação *</CardTitle>
                <CardDescription>
                  Selecione uma ou mais áreas relacionadas à vaga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {areasAtuacao.map((area) => (
                    <div key={area.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`area-${area.id}`}
                        checked={formData.areas_atuacao.includes(area.id)}
                        onCheckedChange={() => toggleAreaAtuacao(area.id)}
                      />
                      <Label
                        htmlFor={`area-${area.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {area.nome}
                      </Label>
                    </div>
                  ))}
                </div>
                {areasAtuacao.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Carregando áreas de atuação...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Descrição da Vaga *</CardTitle>
                <CardDescription>
                  Descreva as responsabilidades, atividades e informações importantes sobre a vaga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva as principais responsabilidades, atividades do dia a dia, requisitos, benefícios, etc."
                  className="min-h-48"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Dica: Inclua responsabilidades, requisitos obrigatórios, requisitos desejáveis, benefícios e outras informações relevantes.
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                "Publicando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Publicar Vaga
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default PublicarVaga;
