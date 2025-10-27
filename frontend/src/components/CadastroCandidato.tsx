import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { UserPlus, CheckCircle2, X, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import candidatosService, { type CriarCandidatoDTO } from "@/services/candidatos";
import areasService, { type AreaAtuacao } from "@/services/areas";

interface CadastroCandidatoFormData extends CriarCandidatoDTO {}

const CadastroCandidato = () => {
  const [areas, setAreas] = useState<AreaAtuacao[]>([]);
  const [areasSelecionadas, setAreasSelecionadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [curriculoFile, setCurriculoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CadastroCandidatoFormData>();

  useEffect(() => {
    carregarAreas();
  }, []);

  const carregarAreas = async () => {
    try {
      const data = await areasService.listar();
      setAreas(data);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
    }
  };

  const toggleArea = (areaNome: string) => {
    setAreasSelecionadas((prev) =>
      prev.includes(areaNome)
        ? prev.filter((a) => a !== areaNome)
        : [...prev, areaNome]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são permitidos');
        e.target.value = '';
        return;
      }
      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 5MB');
        e.target.value = '';
        return;
      }
      setCurriculoFile(file);
    }
  };

  const onSubmit = async (data: CadastroCandidatoFormData) => {
    if (areasSelecionadas.length === 0) {
      toast.error('Selecione pelo menos uma área de atuação');
      return;
    }

    if (!data.consentimento_dados) {
      toast.error('Você precisa aceitar os termos de consentimento');
      return;
    }

    try {
      setLoading(true);

      // Criar o cadastro do candidato
      const candidato = await candidatosService.criar({
        ...data,
        areas_atuacao: areasSelecionadas,
        consentimento_dados: true,
      });

      // Se houver currículo, fazer upload
      if (curriculoFile) {
        try {
          await candidatosService.uploadCurriculo(candidato.id, curriculoFile);
          toast.success('Cadastro e currículo enviados com sucesso!');
        } catch (uploadError) {
          console.error('Erro ao fazer upload do currículo:', uploadError);
          toast.warning('Cadastro realizado, mas houve erro no upload do currículo');
        }
      } else {
        toast.success('Cadastro realizado com sucesso!');
      }

      setSucesso(true);
      reset();
      setAreasSelecionadas([]);
      setCurriculoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setSucesso(false);
      }, 5000);
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      toast.error(error.response?.data?.message || 'Erro ao realizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Cadastro realizado com sucesso!
        </h3>
        <p className="text-muted-foreground mb-6">
          Enviamos um link de acesso para seu e-mail. Verifique sua caixa de entrada.
          {curriculoFile && <><br />Seu currículo foi anexado ao cadastro.</>}
        </p>
        <Button onClick={() => {
          setSucesso(false);
          setCurriculoFile(null);
        }}>
          Fazer novo cadastro
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="card-shadow border-0" id="cadastro-candidato">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Cadastro de Candidato</CardTitle>
        </div>
        <CardDescription>
          Preencha seus dados para ter acesso às vagas disponíveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Pessoais</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  {...register("nome", { required: "Nome é obrigatório" })}
                  placeholder="Seu nome completo"
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "E-mail é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "E-mail inválido",
                    },
                  })}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  {...register("telefone", { required: "Telefone é obrigatório" })}
                  placeholder="(00) 00000-0000"
                />
                {errors.telefone && (
                  <p className="text-sm text-destructive">{errors.telefone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  {...register("cidade", { required: "Cidade é obrigatória" })}
                  placeholder="Sua cidade"
                />
                {errors.cidade && (
                  <p className="text-sm text-destructive">{errors.cidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  {...register("estado", {
                    required: "Estado é obrigatório",
                    pattern: {
                      value: /^[A-Za-z]{2}$/,
                      message: "Estado deve ter 2 letras (ex: SP)"
                    }
                  })}
                  placeholder="UF"
                  maxLength={2}
                  style={{ textTransform: 'uppercase' }}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {errors.estado && (
                  <p className="text-sm text-destructive">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Áreas de Atuação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Áreas de Atuação *</h3>
            <p className="text-sm text-muted-foreground">
              Selecione as áreas em que você tem interesse ou experiência
            </p>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <Badge
                  key={area.id}
                  variant={areasSelecionadas.includes(area.nome) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => toggleArea(area.nome)}
                >
                  {area.nome}
                  {areasSelecionadas.includes(area.nome) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            {areasSelecionadas.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma área selecionada
              </p>
            )}
          </div>

          {/* Resumo/Experiência */}
          <div className="space-y-2">
            <Label htmlFor="resumo_curriculo">Resumo do Currículo *</Label>
            <Textarea
              id="resumo_curriculo"
              {...register("resumo_curriculo", {
                required: "Resumo do currículo é obrigatório",
                minLength: {
                  value: 50,
                  message: "O resumo deve ter pelo menos 50 caracteres",
                },
              })}
              placeholder="Descreva brevemente sua experiência profissional, habilidades e objetivos..."
              rows={6}
            />
            {errors.resumo_curriculo && (
              <p className="text-sm text-destructive">
                {errors.resumo_curriculo.message}
              </p>
            )}
          </div>

          {/* Upload de Currículo em PDF */}
          <div className="space-y-2">
            <Label htmlFor="curriculo">Currículo em PDF (Opcional)</Label>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Input
                  ref={fileInputRef}
                  id="curriculo"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {curriculoFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {curriculoFile.name}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {(curriculoFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurriculoFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Upload className="h-3 w-3" />
                Formato: PDF | Tamanho máximo: 5MB
              </p>
            </div>
          </div>

          {/* Consentimento LGPD */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consentimento_dados"
                {...register("consentimento_dados", {
                  required: "Você precisa aceitar os termos",
                })}
              />
              <Label
                htmlFor="consentimento_dados"
                className="text-sm leading-relaxed cursor-pointer"
              >
                Concordo com o armazenamento dos meus dados por 30 dias para fins de
                recrutamento e seleção, conforme a LGPD. Após este período, meus dados
                serão automaticamente removidos do sistema. *
              </Label>
            </div>
            {errors.consentimento_dados && (
              <p className="text-sm text-destructive">
                {errors.consentimento_dados.message}
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Importante:</strong> Após o cadastro, você receberá um link de
              acesso por e-mail válido por 24 horas. Seu acesso total à plataforma será
              válido por 30 dias.
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar e Receber Link de Acesso"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CadastroCandidato;
