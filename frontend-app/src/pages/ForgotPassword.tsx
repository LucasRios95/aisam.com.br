import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import aisamLogo from '../assets/aisam-logo.webp';
import recrutadoresService from '../services/recrutadores';
import adminService from '../services/admin';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('type') === 'admin';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdmin) {
        await adminService.forgotPassword(email);
      } else {
        await recrutadoresService.forgotPassword(email);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar e-mail de recuperação');
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
              E-mail Enviado!
            </h2>

            <p className="text-gray-600 mb-6">
              Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá as instruções
              para redefinir sua senha em alguns minutos.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Verifique sua caixa de spam se não encontrar o e-mail.
                O link de recuperação é válido por 2 horas.
              </p>
            </div>

            <Link
              to="/login"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Voltar para o Login
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
            <h2 className="text-2xl font-bold text-gray-900">Esqueci minha senha</h2>
            <p className="text-gray-600 mt-2">
              Digite seu e-mail e enviaremos instruções para redefinir sua senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
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
                'Enviando...'
              ) : (
                <>
                  <Mail size={20} />
                  Enviar Instruções
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
