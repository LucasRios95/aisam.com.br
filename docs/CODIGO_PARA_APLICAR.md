# Código para Aplicar Manualmente

Este documento contém o código completo das páginas que precisam ser atualizadas.

---

## 1. AdminUsers.tsx

**Arquivo:** `frontend/src/pages/AdminUsers.tsx`

**Substituir todo o conteúdo por:**

```typescript
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { usersService, User } from "@/services/users";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchUsers();
  }, [user, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const data = await usersService.listar();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      await usersService.atualizarRole(userId, newRole);
      toast.success('Papel do usuário atualizado com sucesso!');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao atualizar papel do usuário');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN_AISAM':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'RECRUTADOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANDIDATO':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleName = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN_AISAM':
        return 'Administrador';
      case 'RECRUTADOR':
        return 'Recrutador';
      case 'CANDIDATO':
        return 'Candidato';
      default:
        return role;
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

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Gerenciar Usuários
              </h1>
              <p className="text-muted-foreground">
                Administre papéis e permissões dos usuários do sistema
              </p>
            </div>
          </div>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Usuários e Permissões
              </CardTitle>
              <CardDescription>
                Gerencie os papéis dos usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Papel Atual</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userProfile) => (
                      <TableRow key={userProfile.user_id}>
                        <TableCell className="font-medium">
                          {userProfile.full_name}
                        </TableCell>
                        <TableCell>{userProfile.email}</TableCell>
                        <TableCell>{userProfile.company || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {userProfile.user_roles.map((role) => (
                              <Badge
                                key={role.id}
                                className={getRoleColor(role.role)}
                                variant="outline"
                              >
                                {getRoleName(role.role)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {userProfile.user_id !== user?.id && (
                            <Select
                              onValueChange={(value) => updateUserRole(userProfile.user_id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Alterar papel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CANDIDATO">Candidato</SelectItem>
                                <SelectItem value="RECRUTADOR">Recrutador</SelectItem>
                                <SelectItem value="ADMIN_AISAM">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    Nenhum usuário encontrado
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {users.length}
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Recrutadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.user_roles.some(r => r.role === 'RECRUTADOR')).length}
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Candidatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.user_roles.some(r => r.role === 'CANDIDATO')).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default AdminUsers;
```

---

## 2. MeuCurriculo.tsx

**Arquivo:** `frontend/src/pages/MeuCurriculo.tsx`

**Substituir todo o conteúdo por:**

```typescript
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FileText, Upload, Save, User } from "lucide-react";
import { toast } from "sonner";
import { resumesService, Resume } from "@/services/resumes";

const MeuCurriculo = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    summary: "",
    skills: ""
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchResume();
  }, [user, navigate]);

  const fetchResume = async () => {
    if (!user) return;

    try {
      const data = await resumesService.buscarMeuCurriculo();
      setResume(data);
      setFormData({
        name: data.nome || "",
        email: data.email || "",
        phone: data.telefone || "",
        city: data.cidade || "",
        state: data.estado || "",
        summary: data.resumo_curriculo || "",
        skills: data.areas_atuacao.join(", ") || ""
      });
    } catch (error: any) {
      console.error('Error fetching resume:', error);
      if (error.response?.status === 404) {
        setFormData(prev => ({
          ...prev,
          email: user.email || ""
        }));
      } else {
        toast.error('Erro ao carregar currículo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async () => {
    if (!cvFile || !user || !resume) return false;

    setUploading(true);
    try {
      await resumesService.uploadCurriculo(resume.id, cvFile);
      toast.success('Currículo enviado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao fazer upload do arquivo');
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      if (cvFile && resume) {
        const uploadSuccess = await handleFileUpload();
        if (!uploadSuccess) {
          setSaving(false);
          return;
        }
      }

      const resumeData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        cidade: formData.city,
        estado: formData.state,
        resumo_curriculo: formData.summary,
        areas_atuacao: formData.skills.split(",").map(s => s.trim()).filter(Boolean)
      };

      await resumesService.atualizar(resumeData);

      setCvFile(null);
      toast.success('Currículo salvo com sucesso!');
      fetchResume();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Erro ao salvar currículo');
    } finally {
      setSaving(false);
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

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Meu Currículo
              </h1>
              <p className="text-muted-foreground">
                Gerencie seu perfil profissional e currículo
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Dados básicos do seu perfil profissional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Resumo Profissional</CardTitle>
                <CardDescription>
                  Breve descrição sobre sua experiência e objetivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Descreva brevemente sua experiência profissional e objetivos..."
                  className="min-h-24"
                />
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Áreas de Atuação *</CardTitle>
                <CardDescription>
                  Liste suas principais áreas de interesse separadas por vírgula
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="Ex: Desenvolvimento Web, React, Node.js, TypeScript"
                  required
                />
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload do Currículo (PDF)
                </CardTitle>
                <CardDescription>
                  Anexe seu currículo em formato PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  {resume?.curriculo_url && (
                    <div className="text-sm text-muted-foreground">
                      Arquivo atual: {resume.curriculo_url.split('/').pop()}
                    </div>
                  )}
                  {cvFile && (
                    <div className="text-sm text-green-600">
                      Novo arquivo selecionado: {cvFile.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              size="lg"
              className="w-full"
            >
              {saving || uploading ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Currículo
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default MeuCurriculo;
```

---

## Instruções

1. **Abra o arquivo indicado** em cada seção
2. **Selecione todo o conteúdo** (Ctrl+A)
3. **Cole o novo código** fornecido acima
4. **Salve o arquivo** (Ctrl+S)
5. **Teste a funcionalidade** no navegador

Se houver erros de TypeScript após aplicar o código:
- Certifique-se de que os arquivos de serviço (`users.ts` e `resumes.ts`) existem
- Verifique se todas as importações estão corretas
- Execute `npm install` se necessário
