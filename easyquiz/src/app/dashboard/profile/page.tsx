'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { API_URL, getLoggedUser } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  // Dados do formulário de perfil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Dados do formulário de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Controle de visibilidade
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mensagens de feedback
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 1. Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const user = getLoggedUser();
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    setUserId(user.id);

    // Busca dados frescos do banco
    fetch(`${API_URL}/usuarios/${user.id}`)
      .then(async (res) => {
        if (res.ok) return res.json();
        throw new Error('Falha ao carregar dados');
      })
      .then((data) => {
        setName(data.nome);
        setEmail(data.email);
      })
      .catch((err) => {
        console.error(err);
        // Fallback para o localStorage se a API falhar momentaneamente
        setName(user.nome);
        setEmail(user.email);
      })
      .finally(() => setLoadingData(false));
  }, [router]);

  // 2. Atualizar Informações Pessoais
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    if (!userId) return;

    if (!name.trim() || !email.trim()) {
      setProfileMessage({ text: 'Nome e email são obrigatórios.', type: 'error' });
      return;
    }

    setSavingProfile(true);

    try {
      // O endpoint de update espera um objeto Usuario no corpo
      const response = await fetch(`${API_URL}/usuarios/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, email: email })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfileMessage({ text: 'Informações atualizadas com sucesso!', type: 'success' });
        
        // Atualiza o localStorage para manter a sessão consistente
        // Mantemos o token ou outros dados antigos, atualizando apenas nome/email
        const oldLocal = getLoggedUser();
        if (oldLocal) {
            localStorage.setItem('easyquiz_user', JSON.stringify({ ...oldLocal, nome: updatedUser.nome, email: updatedUser.email }));
        }
      } else {
        setProfileMessage({ text: 'Erro ao atualizar perfil.', type: 'error' });
      }
    } catch (error) {
      setProfileMessage({ text: 'Erro de conexão.', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  // 3. Alterar Senha
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!userId) return;

    if (!newPassword || !confirmPassword) {
      setPasswordMessage({ text: 'Preencha a nova senha.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'A nova senha e a confirmação não coincidem.', type: 'error' });
      return;
    }
    
    setSavingPassword(true);

    try {
      // Nota: O endpoint do backend espera apenas a string da nova senha no corpo (Raw String),
      // ou você pode ajustar o backend para receber um JSON. 
      // Vou enviar como string crua baseado na assinatura do Controller Java: @RequestBody String novaSenha
      const response = await fetch(`${API_URL}/usuarios/mudarSenha/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // Ou text/plain dependendo do seu backend config
        body: newPassword // Envia a string direta
      });

      if (response.ok) {
        setPasswordMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ text: 'Erro ao alterar senha.', type: 'error' });
      }
    } catch (error) {
      setPasswordMessage({ text: 'Erro de conexão.', type: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingData) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );
  }

  return (
    <div className="mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>

      {/* Formulário de Informações Pessoais */}
      <form onSubmit={handleProfileUpdate} className="bg-white p-8 shadow-md rounded-lg mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold pb-4 border-b mb-6 text-gray-800">Informações Pessoais</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
           {profileMessage && (
            <div className={`text-sm mb-4 text-left p-3 rounded-md ${ profileMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {profileMessage.text}
            </div>
          )}
          <button 
            type="submit" 
            disabled={savingProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 ml-auto"
          >
            {savingProfile && <Loader2 className="animate-spin" size={16} />}
            Salvar Informações
          </button>
        </div>
      </form>

      {/* Formulário de Alteração de Senha */}
      <form onSubmit={handlePasswordChange} className="bg-white p-8 shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold pb-4 border-b mb-6 text-gray-800">Alterar Senha</h2>
        
        <div className="space-y-4">
          {/* Senha Atual (Opcional visualmente, mas útil se o backend exigisse validação) */}
          {/* Para simplificar com seu backend atual que não pede senha antiga no endpoint, focamos na nova */}
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          {passwordMessage && (
            <div className={`text-sm mb-4 text-left p-3 rounded-md ${ passwordMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {passwordMessage.text}
            </div>
          )}
          <button 
            type="submit" 
            disabled={savingPassword}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 ml-auto"
          >
            {savingPassword && <Loader2 className="animate-spin" size={16} />}
            Alterar Senha
          </button>
        </div>
      </form>
    </div>
  );
}