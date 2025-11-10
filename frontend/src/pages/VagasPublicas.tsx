import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import CadastroCandidato from "@/components/CadastroCandidato";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, MapPin, Building, Clock, Briefcase, Filter, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import vagasService, { type Vaga, type FiltrosVagas } from "@/services/vagas";

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

const VagasPublicas = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtros, setFiltros] = useState<FiltrosVagas>({ status: "aberta" });
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  useEffect(() => {
    carregarVagas();
  }, [filtros]);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const data = await vagasService.listar(filtros);
      setVagas(data);
    } catch (error) {
      console.error('Erro ao carregar vagas:', error);
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const vagasFiltradas = vagas.filter((vaga) =>
    vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vaga.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vaga.localidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aplicarFiltro = (campo: keyof FiltrosVagas, valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor === "todos" ? undefined : valor,
    }));
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

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Vagas Disponíveis
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encontre as melhores oportunidades de trabalho na região
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição ou localidade..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filtros:</span>
              </div>

              <Select
                value={filtros.regime || "todos"}
                onValueChange={(value) => aplicarFiltro("regime", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os regimes</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filtros.senioridade || "todos"}
                onValueChange={(value) => aplicarFiltro("senioridade", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Senioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="estagio">Estágio</SelectItem>
                  <SelectItem value="junior">Júnior</SelectItem>
                  <SelectItem value="pleno">Pleno</SelectItem>
                  <SelectItem value="senior">Sênior</SelectItem>
                  <SelectItem value="especialista">Especialista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              {vagasFiltradas.length} {vagasFiltradas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
            </p>
          </div>

          {/* Jobs Grid */}
          {vagasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Nenhuma vaga encontrada
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm || Object.keys(filtros).length > 1
                  ? "Tente refinar sua busca ou filtros"
                  : "Não há vagas disponíveis no momento"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vagasFiltradas.map((vaga, index) => (
                <motion.div
                  key={vaga.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {vaga.titulo}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0 ml-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Novo
                        </Badge>
                      </div>
                      {!vaga.empresa_anonima && vaga.associado?.razao_social && (
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4" />
                          {vaga.associado.razao_social}
                        </CardDescription>
                      )}
                      {vaga.empresa_anonima && (
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4" />
                          Empresa Confidencial
                        </CardDescription>
                      )}
                      {vaga.localidade && (
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {vaga.localidade}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {vaga.descricao}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{regimeLabels[vaga.regime]}</Badge>
                        <Badge variant="outline">{senioridadeLabels[vaga.senioridade]}</Badge>
                      </div>
                      {vaga.areas_atuacao && vaga.areas_atuacao.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {vaga.areas_atuacao.slice(0, 2).map((area, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {vaga.areas_atuacao.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{vaga.areas_atuacao.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                      <Button
                        onClick={() => setMostrarCadastro(true)}
                        className="w-full"
                      >
                        Ver Detalhes e Candidatar-se
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA for candidates */}
          {!mostrarCadastro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Primeira vez aqui?
              </h3>
              <p className="text-muted-foreground mb-6">
                Cadastre-se e tenha acesso a todas as oportunidades disponíveis
              </p>
              <Button size="lg" onClick={() => setMostrarCadastro(true)}>
                Cadastrar como Candidato
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {/* Formulário de Cadastro */}
          {mostrarCadastro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16"
              id="cadastro-candidato"
            >
              <CadastroCandidato />
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default VagasPublicas;
