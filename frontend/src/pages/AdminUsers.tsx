import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { UserCheck, UserX, Shield, Users, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

interface Associado {
  id: string;
  razao_social: string;
  cnpj: string;
}

interface Recrutador {
  id: string;
  nome: string;
  email: string;
  perfil: "recrutador" | "admin";
  status: "ativo" | "inativo";
  associado_id: string;
  associado?: Associado;
  convite_aceito: boolean;
  created_at: string;
}

const AdminUsers = () => {
  const [recrutadores, setRecrutadores] = useState<Recrutador[]>([]);
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);

  // Form state
  const [nomeConvite, setNomeConvite] = useState("");
  const [emailConvite, setEmailConvite] = useState("");
  const [associadoIdConvite, setAssociadoIdConvite] = useState("");

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }
    fetchRecrutadores();
    fetchAssociados();
  }, [user, isAdmin, navigate]);

  const fetchRecrutadores = async () => {
    try {
      const response = await axios.get(`${API_URL}/recrutadores`);
      setRecrutadores(response.data);
    } catch (error: any) {
      console.error('Error fetching recrutadores:', error);
      toast.error(error.response?.data?.error || 'Erro ao carregar recrutadores');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssociados = async () => {
    try {
      const response = await axios.get(`${API_URL}/associados?ativo=true`);
      setAssociados(response.data);
    } catch (error: any) {
      console.error('Error fetching associados:', error);
    }
  };

  const handleEnviarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingInvite(true);

    try {
      await axios.post(`${API_URL}/recrutadores/convite`, {
        nome: nomeConvite,
        email: emailConvite,
        associado_id: associadoIdConvite || undefined
      });

      toast.success('Convite enviado com sucesso! O recrutador receberá um email.');
      setOpenDialog(false);
      setNomeConvite("");
      setEmailConvite("");
      setAssociadoIdConvite("");
      fetchRecrutadores();
    } catch (error: any) {
      console.error('Error sending invite:', error);
      toast.error(error.response?.data?.error || 'Erro ao enviar convite');
    } finally {
      setSendingInvite(false);
    }
  };

  const toggleRecrutadorStatus = async (recrutadorId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";

      await axios.put(`${API_URL}/recrutadores/${recrutadorId}`, {
        status: newStatus
      });

      toast.success(`Recrutador ${newStatus === "ativo" ? "ativado" : "desativado"} com sucesso!`);
      fetchRecrutadores(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating recrutador status:', error);
      toast.error(error.response?.data?.error || 'Erro ao atualizar status do recrutador');
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "ativo") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ativo
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const getPerfilBadge = (perfil: string) => {
    if (perfil === "admin") {
      return <Badge variant="default">Admin</Badge>;
    }
    return <Badge variant="outline">Recrutador</Badge>;
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
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Gerenciar Recrutadores
                </h1>
                <p className="text-muted-foreground">
                  Ative ou desative recrutadores do sistema
                </p>
              </div>
            </div>

            {/* Botão Enviar Convite */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Convite de Recrutador</DialogTitle>
                  <DialogDescription>
                    Preencha os dados abaixo para enviar um convite. O recrutador receberá um email com link para criar sua senha.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEnviarConvite} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome-convite">Nome Completo *</Label>
                    <Input
                      id="nome-convite"
                      placeholder="Nome do recrutador"
                      value={nomeConvite}
                      onChange={(e) => setNomeConvite(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-convite">Email *</Label>
                    <Input
                      id="email-convite"
                      type="email"
                      placeholder="email@example.com"
                      value={emailConvite}
                      onChange={(e) => setEmailConvite(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="associado-convite">Associado (opcional)</Label>
                    <Select value={associadoIdConvite} onValueChange={setAssociadoIdConvite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um associado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum associado</SelectItem>
                        {associados.map((associado) => (
                          <SelectItem key={associado.id} value={associado.id}>
                            {associado.razao_social}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenDialog(false)}
                      disabled={sendingInvite}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={sendingInvite}>
                      {sendingInvite ? "Enviando..." : "Enviar Convite"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Recrutadores Table */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Recrutadores Cadastrados
              </CardTitle>
              <CardDescription>
                Gerencie o status dos recrutadores vinculados aos associados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Associado</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Convite Aceito</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recrutadores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          Nenhum recrutador cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      recrutadores.map((recrutador) => (
                        <TableRow key={recrutador.id}>
                          <TableCell className="font-medium">
                            {recrutador.nome}
                          </TableCell>
                          <TableCell>{recrutador.email}</TableCell>
                          <TableCell>
                            {recrutador.associado?.razao_social || '-'}
                          </TableCell>
                          <TableCell>
                            {getPerfilBadge(recrutador.perfil)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(recrutador.status)}
                          </TableCell>
                          <TableCell>
                            {recrutador.convite_aceito ? (
                              <Badge variant="outline" className="bg-green-50">Sim</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50">Pendente</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {recrutador.status === "ativo" ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => toggleRecrutadorStatus(recrutador.id, recrutador.status)}
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Desativar
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => toggleRecrutadorStatus(recrutador.id, recrutador.status)}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Ativar
                                </Button>
                              )}
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
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default AdminUsers;
