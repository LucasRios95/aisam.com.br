import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { UserCheck, UserX, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface UserWithRoles extends Profile {
  user_roles: UserRole[];
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
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
      // First get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', profile.user_id);
          
          return {
            ...profile,
            user_roles: roles || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Remove existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole as any,
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Papel do usuário atualizado com sucesso!');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Erro ao atualizar papel do usuário');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'associado_aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'associado_pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'recrutador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'associado_aprovado':
        return 'Associado Aprovado';
      case 'associado_pendente':
        return 'Associado Pendente';
      case 'recrutador':
        return 'Recrutador';
      case 'candidato':
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
          {/* Header */}
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

          {/* Users Table */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Usuários e Permissões
              </CardTitle>
              <CardDescription>
                Gerencie os papéis dos usuários e aprove solicitações de associação
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
                          {new Date(userProfile.created_at).toLocaleDateString()}
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
                                <SelectItem value="candidato">Candidato</SelectItem>
                                <SelectItem value="associado_pendente">Associado Pendente</SelectItem>
                                <SelectItem value="associado_aprovado">Associado Aprovado</SelectItem>
                                <SelectItem value="recrutador">Recrutador</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
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

          {/* Stats Cards */}
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
                  Associados Aprovados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.user_roles.some(r => r.role === 'associado_aprovado')).length}
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendentes de Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {users.filter(u => u.user_roles.some(r => r.role === 'associado_pendente')).length}
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