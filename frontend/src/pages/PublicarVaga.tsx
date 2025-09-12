import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Briefcase, Save, Building, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";

const PublicarVaga = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salaryRange: "",
    description: "",
    requirements: "",
    contactEmail: ""
  });

  const { user, hasRole, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Check if user can post jobs
    if (!hasRole('associado_aprovado') && !hasRole('recrutador') && !isAdmin()) {
      navigate("/dashboard");
      toast.error("Apenas associados aprovados podem publicar vagas");
      return;
    }
  }, [user, hasRole, isAdmin, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location || null,
        salary_range: formData.salaryRange || null,
        description: formData.description,
        requirements: formData.requirements || null,
        contact_email: formData.contactEmail,
        posted_by: user.id,
        company_id: user.id
      };

      const { error } = await supabase
        .from('jobs')
        .insert(jobData);

      if (error) throw error;

      toast.success('Vaga publicada com sucesso!');
      
      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        salaryRange: "",
        description: "",
        requirements: "",
        contactEmail: ""
      });
      
      navigate('/vagas');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Erro ao publicar vaga');
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
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Analista de Sistemas Sênior"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Empresa *
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ex: São Roque - SP"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="salaryRange" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Faixa Salarial
                  </Label>
                  <Input
                    id="salaryRange"
                    value={formData.salaryRange}
                    onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                    placeholder="Ex: R$ 5.000 - R$ 8.000"
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">E-mail para Contato *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="recrutamento@empresa.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Descrição da Vaga</CardTitle>
                <CardDescription>
                  Descreva as responsabilidades e atividades do cargo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva as principais responsabilidades, atividades do dia a dia, objetivos da posição..."
                  className="min-h-32"
                  required
                />
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Requisitos e Qualificações</CardTitle>
                <CardDescription>
                  Liste os requisitos técnicos e comportamentais necessários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Ex:&#10;- Graduação em Engenharia ou áreas relacionadas&#10;- Experiência com Python e JavaScript&#10;- Conhecimento em bancos de dados SQL&#10;- Inglês intermediário"
                  className="min-h-32"
                />
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