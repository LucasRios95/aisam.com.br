import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { User, Lock, Mail, Calendar, Save, Eye, EyeOff } from 'lucide-react';
import adminService from '../../services/admin';
import type { AdminProfile } from '../../services/admin';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminPerfil() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [nome, setNome] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      setLoading(true);
      const data = await adminService.getProfile();
      setProfile(data);
      setNome(data.nome);
    } catch (err) {
      setError('Erro ao carregar perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (novaSenha && novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (novaSenha && !senhaAtual) {
      setError('Informe a senha atual para alterar a senha');
      return;
    }

    try {
      setSaving(true);
      const dados: { nome?: string; senha_atual?: string; nova_senha?: string } = {};

      if (nome !== profile?.nome) {
        dados.nome = nome;
      }

      if (novaSenha) {
        dados.senha_atual = senhaAtual;
        dados.nova_senha = novaSenha;
      }

      if (Object.keys(dados).length === 0) {
        setError('Nenhuma alteração detectada');
        return;
      }

      const updatedProfile = await adminService.updateProfile(dados);
      setProfile(updatedProfile);
      setSuccess('Perfil atualizado com sucesso!');

      if (dados.nome) {
        updateUser({ nome: dados.nome });
      }

      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Erro ao atualizar perfil');
      } else {
        setError('Erro ao atualizar perfil');
      }
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Meu Perfil">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Meu Perfil">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile?.nome}</h2>
              <p className="text-gray-600">Administrador AISAM</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  Email (não editável)
                </div>
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                O email de acesso não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  Nome
                </div>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Membro desde
                </div>
              </label>
              <input
                type="text"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <hr className="my-6" />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock size={20} />
                Alterar Senha
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Deixe os campos em branco se não deseja alterar a senha
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenhaAtual ? 'text' : 'password'}
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarNovaSenha ? 'text' : 'password'}
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                      placeholder="Digite a nova senha"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarConfirmarSenha ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                      placeholder="Confirme a nova senha"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
