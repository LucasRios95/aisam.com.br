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
import { FileText, Upload, Save, User } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Resume = Database['public']['Tables']['resumes']['Row'];

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
    summary: "",
    experience: "",
    education: "",
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
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setResume(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          summary: data.summary || "",
          experience: data.experience || "",
          education: data.education || "",
          skills: data.skills || ""
        });
      } else {
        // Initialize with user email if no resume exists
        setFormData(prev => ({
          ...prev,
          email: user.email || ""
        }));
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Erro ao carregar currículo');
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
    if (!cvFile || !user) return null;

    setUploading(true);
    try {
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${user.id}/cv_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, cvFile);

      if (uploadError) throw uploadError;

      return fileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao fazer upload do arquivo');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      let filePath = resume?.file_path;

      // Upload new file if selected
      if (cvFile) {
        const uploadedPath = await handleFileUpload();
        if (uploadedPath) {
          filePath = uploadedPath;
        }
      }

      const resumeData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        summary: formData.summary,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        file_path: filePath
      };

      let result;
      if (resume) {
        // Update existing resume
        result = await supabase
          .from('resumes')
          .update(resumeData)
          .eq('id', resume.id)
          .select()
          .single();
      } else {
        // Create new resume
        result = await supabase
          .from('resumes')
          .insert(resumeData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setResume(result.data);
      setCvFile(null);
      toast.success('Currículo salvo com sucesso!');
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
          {/* Header */}
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
            {/* Personal Information */}
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
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
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

            {/* Experience */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Experiência Profissional *</CardTitle>
                <CardDescription>
                  Descreva sua experiência de trabalho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Ex: Analista de Sistemas na Empresa XYZ (2020-2023)&#10;- Responsabilidades e conquistas&#10;- Tecnologias utilizadas..."
                  className="min-h-32"
                  required
                />
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Formação Acadêmica</CardTitle>
                <CardDescription>
                  Sua educação formal e cursos relevantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="Ex: Bacharelado em Ciência da Computação - Universidade ABC (2016-2020)&#10;Curso de Especialização em XYZ..."
                  className="min-h-24"
                />
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Habilidades e Competências *</CardTitle>
                <CardDescription>
                  Liste suas principais habilidades técnicas e comportamentais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="Ex: JavaScript, React, Node.js, Python, Trabalho em equipe, Liderança..."
                  className="min-h-24"
                  required
                />
              </CardContent>
            </Card>

            {/* CV Upload */}
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
                  {resume?.file_path && (
                    <div className="text-sm text-muted-foreground">
                      Arquivo atual: {resume.file_path.split('/').pop()}
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

            {/* Save Button */}
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