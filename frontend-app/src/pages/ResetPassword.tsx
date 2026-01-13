import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import aisamLogo from '../assets/aisam-logo.webp';
import recrutadoresService from '../services/recrutadores';
import adminService from '../services/admin';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const isAdmin = searchParams.get('type') === 'admin';

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token inválido ou não fornecido');
    }
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (!token) {
      setError('Token inválido');
      return;
    }

    setLoading(true);

    try {
      if (isAdmin) {
        await adminService.resetPassword(token, senha);
      } else {
        await recrutadoresService.resetPassword(token, senha);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao redefinir senha. O token pode ter expirado.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] px-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="mb-6">
              <img src={aisamLogo} alt="AISAM" className="h-16 mx-auto mb-4" />
            </div>

            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Senha Redefinida!
            </h2>

            <p className="text-gray-600 mb-6">
              Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em alguns segundos...
            </p>

            <Link
              to="/login"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Ir para o Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] px-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="mb-6">
              <img src={aisamLogo} alt="AISAM" className="h-16 mx-auto mb-4" />
            </div>

            <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Link Inválido
            </h2>

            <p className="text-gray-600 mb-6">
              O link de recuperação de senha é inválido ou expirou. Por favor, solicite um novo link.
            </p>

            <Link
              to="/esqueci-senha"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Solicitar Novo Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-6">
            <img src={aisamLogo} alt="AISAM" className="h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Redefinir Senha</h2>
            <p className="text-gray-600 mt-2">
              Digite sua nova senha abaixo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 6 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                'Redefinindo...'
              ) : (
                <>
                  <Lock size={20} />
                  Redefinir Senha
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
