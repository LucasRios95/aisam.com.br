import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Building, Calendar, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Candidatura {
  id: string;
  status: string;
  created_at: string;
  vaga: {
    id: string;
    titulo: string;
    localidade?: string;
    regime: string;
    senioridade: string;
    associado?: {
      razao_social: string;
    };
    empresa_anonima: boolean;
  };
}

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800",
  em_analise: "bg-blue-100 text-blue-800",
  aprovada: "bg-green-100 text-green-800",
  reprovada: "bg-red-100 text-red-800",
  cancelada: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em Análise",
  aprovada: "Aprovada",
  reprovada: "Reprovada",
  cancelada: "Cancelada",
};

export default function MinhasCandidaturas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    carregarCandidaturas();
  }, []);

  async function carregarCandidaturas() {
    try {
      setLoading(true);
      const token = localStorage.getItem("@AisamAuth:token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/candidaturas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidaturas(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar candidaturas:", err);
      setError(err.response?.data?.message || "Erro ao carregar candidaturas");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar(candidaturaId: string) {
    if (!confirm("Tem certeza que deseja cancelar esta candidatura?")) return;

    try {
      const token = localStorage.getItem("@AisamAuth:token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/candidaturas/${candidaturaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Recarregar lista
      carregarCandidaturas();
    } catch (err: any) {
      console.error("Erro ao cancelar candidatura:", err);
      alert(err.response?.data?.message || "Erro ao cancelar candidatura");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Candidaturas</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o status das suas candidaturas a vagas
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {candidaturas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma candidatura ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Você ainda não se candidatou a nenhuma vaga.
              </p>
              <Button onClick={() => navigate("/vagas")}>
                Ver Vagas Disponíveis
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {candidaturas.map((candidatura) => (
            <Card key={candidatura.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {candidatura.vaga.titulo}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4">
                      {!candidatura.vaga.empresa_anonima &&
                        candidatura.vaga.associado?.razao_social && (
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {candidatura.vaga.associado.razao_social}
                          </span>
                        )}
                      {candidatura.vaga.empresa_anonima && (
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Empresa Confidencial
                        </span>
                      )}
                      {candidatura.vaga.localidade && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {candidatura.vaga.localidade}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Candidatura em{" "}
                        {new Date(candidatura.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[candidatura.status]}>
                    {statusLabels[candidatura.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{candidatura.vaga.regime}</Badge>
                  <Badge variant="outline">{candidatura.vaga.senioridade}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/vaga/${candidatura.vaga.id}`)}
                  >
                    Ver Vaga
                  </Button>
                  {candidatura.status === "pendente" ||
                  candidatura.status === "em_analise" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelar(candidatura.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar Candidatura
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
