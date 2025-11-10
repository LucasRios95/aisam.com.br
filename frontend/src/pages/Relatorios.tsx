import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Users,
  TrendingUp,
  FileText,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

interface Vaga {
  id: string;
  titulo: string;
  status: string;
  created_at: string;
  _count?: {
    candidaturas: number;
  };
}

interface Candidatura {
  id: string;
  status: string;
  created_at: string;
  vaga: {
    titulo: string;
  };
  candidato: {
    nome: string;
    email: string;
  };
}

interface Stats {
  totalVagas: number;
  vagasAbertas: number;
  totalCandidaturas: number;
  candidaturasEmAnalise: number;
  candidaturasFinalizadas: number;
}

const Relatorios = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalVagas: 0,
    vagasAbertas: 0,
    totalCandidaturas: 0,
    candidaturasEmAnalise: 0,
    candidaturasFinalizadas: 0
  });
  const [loading, setLoading] = useState(true);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== 'RECRUTADOR' && !isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    try {
      const [vagasRes, candidaturasRes] = await Promise.all([
        axios.get(`${API_URL}/vagas`),
        axios.get(`${API_URL}/candidaturas`)
      ]);

      const vagasData = vagasRes.data;
      const candidaturasData = candidaturasRes.data;

      setVagas(vagasData);
      setCandidaturas(candidaturasData);

      // Calculate stats
      const totalVagas = vagasData.length;
      const vagasAbertas = vagasData.filter((v: Vaga) => v.status === 'aberta').length;
      const totalCandidaturas = candidaturasData.length;
      const candidaturasEmAnalise = candidaturasData.filter(
        (c: Candidatura) => c.status === 'em_analise' || c.status === 'interessado'
      ).length;
      const candidaturasFinalizadas = candidaturasData.filter(
        (c: Candidatura) => c.status === 'finalizado'
      ).length;

      setStats({
        totalVagas,
        vagasAbertas,
        totalCandidaturas,
        candidaturasEmAnalise,
        candidaturasFinalizadas
      });
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; variant: string; icon: any } } = {
      aberta: { label: 'Aberta', variant: 'default', icon: CheckCircle },
      pausada: { label: 'Pausada', variant: 'secondary', icon: Clock },
      fechada: { label: 'Fechada', variant: 'destructive', icon: XCircle },
      arquivada: { label: 'Arquivada', variant: 'outline', icon: FileText },
      interessado: { label: 'Interessado', variant: 'default', icon: CheckCircle },
      em_analise: { label: 'Em Análise', variant: 'default', icon: Clock },
      contatado: { label: 'Contatado', variant: 'default', icon: CheckCircle },
      finalizado: { label: 'Finalizado', variant: 'secondary', icon: CheckCircle }
    };

    const config = statusMap[status] || { label: status, variant: 'outline', icon: FileText };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error('Não há dados para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Relatório exportado com sucesso!');
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
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Relatórios e Estatísticas
                </h1>
                <p className="text-muted-foreground">
                  Acompanhe o desempenho das suas vagas e candidaturas
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Total de Vagas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVagas}</div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Vagas Abertas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.vagasAbertas}</div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Candidaturas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCandidaturas}</div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Em Análise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.candidaturasEmAnalise}</div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Finalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.candidaturasFinalizadas}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="vagas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="vagas">Vagas</TabsTrigger>
              <TabsTrigger value="candidaturas">Candidaturas</TabsTrigger>
            </TabsList>

            {/* Vagas Tab */}
            <TabsContent value="vagas" className="space-y-4">
              <Card className="card-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Relatório de Vagas
                    </CardTitle>
                    <CardDescription>
                      Visualize todas as vagas publicadas e seus status
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(
                      vagas.map(v => ({
                        Titulo: v.titulo,
                        Status: v.status,
                        Candidaturas: v._count?.candidaturas || 0,
                        'Data de Criação': formatDate(v.created_at)
                      })),
                      'vagas'
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Candidaturas</TableHead>
                          <TableHead>Data de Criação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vagas.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nenhuma vaga encontrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          vagas.map((vaga) => (
                            <TableRow key={vaga.id}>
                              <TableCell className="font-medium">{vaga.titulo}</TableCell>
                              <TableCell>{getStatusBadge(vaga.status)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {vaga._count?.candidaturas || 0} candidatura(s)
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(vaga.created_at)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Candidaturas Tab */}
            <TabsContent value="candidaturas" className="space-y-4">
              <Card className="card-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Relatório de Candidaturas
                    </CardTitle>
                    <CardDescription>
                      Acompanhe todas as candidaturas recebidas
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(
                      candidaturas.map(c => ({
                        Vaga: c.vaga.titulo,
                        Candidato: c.candidato.nome,
                        Email: c.candidato.email,
                        Status: c.status,
                        'Data da Candidatura': formatDate(c.created_at)
                      })),
                      'candidaturas'
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vaga</TableHead>
                          <TableHead>Candidato</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {candidaturas.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              Nenhuma candidatura encontrada
                            </TableCell>
                          </TableRow>
                        ) : (
                          candidaturas.map((candidatura) => (
                            <TableRow key={candidatura.id}>
                              <TableCell className="font-medium">{candidatura.vaga.titulo}</TableCell>
                              <TableCell>{candidatura.candidato.nome}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {candidatura.candidato.email}
                              </TableCell>
                              <TableCell>{getStatusBadge(candidatura.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(candidatura.created_at)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Relatorios;
