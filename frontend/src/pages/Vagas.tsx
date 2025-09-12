import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, MapPin, Building, Clock, Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Job = Database['public']['Tables']['jobs']['Row'];

const Vagas = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (jobId: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para se candidatar!");
      navigate("/login");
      return;
    }
    navigate(`/vaga/${jobId}/candidatar`);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <PageLayout
      title="Vagas Disponíveis"
      description="Encontre oportunidades de emprego exclusivas para associados AISAM"
    >
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

          {/* Search */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, empresa ou descrição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Nenhuma vaga encontrada
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "Tente refinar sua busca" : "Não há vagas disponíveis no momento"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="card-shadow h-full border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {job.title}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0 ml-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Novo
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </CardDescription>
                      {job.location && (
                        <CardDescription className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {job.description}
                      </p>
                      {job.salary_range && (
                        <div className="mb-4">
                          <Badge variant="outline">
                            {job.salary_range}
                          </Badge>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          asChild 
                          className="flex-1"
                        >
                          <Link to={`/vaga/${job.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleApply(job.id)}
                          className="shrink-0"
                        >
                          Candidatar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA for publishing jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              É uma empresa associada?
            </h3>
            <p className="text-muted-foreground mb-6">
              Publique suas vagas e encontre os melhores profissionais da região
            </p>
            <Button asChild size="lg">
              <Link to={user ? "/publicar-vaga" : "/login"}>
                Publicar Vaga
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Vagas;