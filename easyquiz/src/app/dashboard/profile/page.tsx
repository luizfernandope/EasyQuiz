'use client';

import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function ProfilePage() {
  // Mock de dados do usuário logado
  const [name, setName] = useState('Usuário Exemplo');
  const [email, setEmail] = useState('usuario@exemplo.com');

  // Estados para a mudança de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para visibilidade da senha
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para feedback ao usuário (separados por formulário)
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!name || !email) {
      setProfileMessage({ text: 'Nome e email são obrigatórios.', type: 'error' });
      return;
    }
    // Simulação de chamada de API para atualizar nome e email
    console.log('Atualizando perfil:', { name, email });
    setProfileMessage({ text: 'Informações pessoais atualizadas com sucesso!', type: 'success' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ text: 'Todos os campos de senha são obrigatórios.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'A nova senha e a confirmação não correspondem.', type: 'error' });
      return;
    }
    
    // Simulação de chamada de API para atualizar a senha
    console.log('Atualizando senha...');
    setPasswordMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
    
    // Limpar campos de senha após o sucesso
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="mx-auto  px-4">
      <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>

      {/* Formulário de Informações Pessoais */}
      <form onSubmit={handleProfileUpdate} className="bg-white p-8 shadow-md rounded-lg mb-8">
        <h2 className="text-xl font-semibold pb-4 border-b mb-6">Informações Pessoais</h2>
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
                className="w-full pl-10 p-2 border rounded-md"
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
                className="w-full pl-10 p-2 border rounded-md"
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
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Alterar Informações
          </button>
        </div>
      </form>

      {/* Formulário de Alteração de Senha */}
      <form onSubmit={handlePasswordChange} className="bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold pb-4 border-b mb-6">Alterar Senha</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700 mb-1">
              Senha Atual
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
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
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                className="w-full pl-10 p-2 border rounded-md"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Alterar Senha
          </button>
        </div>
      </form>
    </div>
  );
}