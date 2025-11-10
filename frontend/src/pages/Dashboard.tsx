import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  FileText,
  Settings,
  UserCheck,
  PlusCircle,
  Eye,
  LogOut,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

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

  if (!user) return null;

  const roleLabels = {
    CANDIDATO: 'Candidato',
    RECRUTADOR: 'Recrutador',
    ADMIN_AISAM: 'Administrador'
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo, {user.nome || user.email}
              </p>
              {user.razao_social && (
                <p className="text-sm text-muted-foreground">
                  {user.razao_social}
                </p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  {roleLabels[user.role]}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>

          {/* Admin Dashboard */}
          {isAdmin() && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Painel Administrativo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="card-shadow hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Gerenciar Usuários
                    </CardTitle>
                    <CardDescription>
                      Aprovar associados e gerenciar permissões
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/admin/users">
                        <UserCheck className="mr-2 h-4 w-4" />
                        Gerenciar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-shadow hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Gerenciar Vagas
                    </CardTitle>
                    <CardDescription>
                      Visualizar e moderar vagas publicadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/vagas">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-shadow hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Banco de Currículos
                    </CardTitle>
                    <CardDescription>
                      Acessar currículos cadastrados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/meu-curriculo">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* User Dashboard */}
          <h2 className="text-2xl font-semibold mb-4">Área do Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vagas */}
            <Card className="card-shadow hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Vagas Disponíveis
                </CardTitle>
                <CardDescription>
                  Explore oportunidades de emprego
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/vagas">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Vagas
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Meu Currículo - Apenas para candidatos */}
            {user.role === 'CANDIDATO' && (
              <Card className="card-shadow hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Meu Currículo
                  </CardTitle>
                  <CardDescription>
                    Gerencie seu perfil profissional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to="/meu-curriculo">
                      <Settings className="mr-2 h-4 w-4" />
                      Gerenciar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Publicar Vaga - Para recrutadores e admins */}
            {(user.role === 'RECRUTADOR' || isAdmin()) && (
              <>
                <Card className="card-shadow hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusCircle className="h-5 w-5 text-primary" />
                      Publicar Vaga
                    </CardTitle>
                    <CardDescription>
                      Publique novas oportunidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/publicar-vaga">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Publicar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-shadow hover:scale-105 transition-transform">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Relatórios
                    </CardTitle>
                    <CardDescription>
                      Visualize estatísticas e relatórios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/relatorios">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Ver Relatórios
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Minhas Candidaturas - Apenas para candidatos */}
            {user.role === 'CANDIDATO' && (
              <Card className="card-shadow hover:scale-105 transition-transform">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    Minhas Candidaturas
                  </CardTitle>
                  <CardDescription>
                    Acompanhe suas aplicações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to="/minhas-candidaturas">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Status
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
