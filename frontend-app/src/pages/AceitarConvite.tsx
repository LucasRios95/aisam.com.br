import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

const AceitarConvite = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [conviteValido, setConviteValido] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");

  // Validações de senha
  const senhaMinLength = senha.length >= 8;
  const senhaHasUppercase = /[A-Z]/.test(senha);
  const senhaHasLowercase = /[a-z]/.test(senha);
  const senhaHasNumber = /[0-9]/.test(senha);
  const senhaHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  const senhasMatch = senha === confirmacaoSenha && senha.length > 0;

  const senhaValida = senhaMinLength && senhaHasUppercase && senhaHasLowercase && senhaHasNumber && senhaHasSpecial;

  useEffect(() => {
    if (!token) {
      alert("Token de convite inválido");
      navigate("/login");
      return;
    }

    setValidating(false);
    setConviteValido(true);
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaValida) {
      alert("A senha não atende aos requisitos mínimos");
      return;
    }

    if (!senhasMatch) {
      alert("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/recrutadores/aceitar-convite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          senha
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Erro ao aceitar convite');
      }

      alert("Senha criada com sucesso! Você já pode fazer login.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      alert(error.message || 'Erro ao aceitar convite');

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (!conviteValido) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Convite Inválido</h2>
          <p className="text-gray-600 mb-6">
            Este convite é inválido ou já foi utilizado.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bem-vindo!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Defina sua senha para acessar o sistema
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="pl-10 pr-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirmação de Senha */}
            <div>
              <label htmlFor="confirmacao-senha" className="block text-sm font-medium text-gray-700 mb-2">
                Confirme a Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirmacao-senha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  placeholder="Digite sua senha novamente"
                  className="pl-10 pr-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmacaoSenha}
                  onChange={(e) => setConfirmacaoSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                >
                  {mostrarConfirmacao ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Requisitos da Senha */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Requisitos da senha:
              </p>
              <div className="space-y-1">
                <RequisitoSenha valido={senhaMinLength} texto="Mínimo 8 caracteres" />
                <RequisitoSenha valido={senhaHasUppercase} texto="Pelo menos uma letra maiúscula" />
                <RequisitoSenha valido={senhaHasLowercase} texto="Pelo menos uma letra minúscula" />
                <RequisitoSenha valido={senhaHasNumber} texto="Pelo menos um número" />
                <RequisitoSenha valido={senhaHasSpecial} texto="Pelo menos um caractere especial" />
                {confirmacaoSenha.length > 0 && (
                  <RequisitoSenha valido={senhasMatch} texto="Senhas coincidem" />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !senhaValida || !senhasMatch}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                "Criar Senha e Ativar Conta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar requisitos
interface RequisitoSenhaProps {
  valido: boolean;
  texto: string;
}

const RequisitoSenha = ({ valido, texto }: RequisitoSenhaProps) => (
  <div className="flex items-center gap-2 text-sm">
    {valido ? (
      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
    )}
    <span className={valido ? "text-green-600" : "text-gray-500"}>
      {texto}
    </span>
  </div>
);

export default AceitarConvite;
