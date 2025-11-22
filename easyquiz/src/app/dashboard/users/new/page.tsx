'use client';

import { useState } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { API_URL, getLoggedUser } from '@/services/api';

type UserType = 'Professor' | 'Admin';

export default function NewUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // No backend o ENUM está como String uppercase: "PROFESSOR", "ADMIN"
  const [userType, setUserType] = useState<UserType>('Professor'); 
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const currentUser = getLoggedUser();
    if (!currentUser) {
        setMessage({ text: 'Você precisa estar logado como Admin.', type: 'error' });
        setLoading(false);
        return;
    }

    // Mapeando para o que o Java espera (provavelmente "ADMIN" ou "PROFESSOR")
    const typeToSend = userType.toUpperCase(); 

    const payload = {
        nome: name,
        email: email,
        tipo: typeToSend
        // senha é gerada pelo backend
    };

    try {
        // Chama o endpoint: /usuarios/cadastrar/{adminId}
        const res = await fetch(`${API_URL}/usuarios/cadastrar/${currentUser.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setMessage({ 
                text: `Usuário cadastrado com sucesso! A senha foi enviada para o email (ou console do servidor).`, 
                type: 'success' 
            });
            setName('');
            setEmail('');
        } else {
            // Tenta pegar mensagem de erro do backend ou status
            setMessage({ text: 'Erro ao cadastrar. Verifique se você é admin ou se o email já existe.', type: 'error' });
        }
    } catch (error) {
        console.error(error);
        setMessage({ text: 'Falha na conexão com o servidor.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Usuário</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        {/* Campo Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md"
              placeholder="Ex: João da Silva"
              required
            />
          </div>
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md"
              placeholder="Ex: joao.silva@email.com"
              required
            />
          </div>
        </div>

        {/* Campo Tipo de Perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Perfil</label>
          <div className="flex items-center gap-6 p-3 bg-gray-50 border rounded-md">
            <Shield className="text-gray-500" size={20} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="Professor"
                  checked={userType === 'Professor'}
                  onChange={() => setUserType('Professor')}
                  className="h-4 w-4"
                />
                Professor
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="Admin"
                  checked={userType === 'Admin'}
                  onChange={() => setUserType('Admin')}
                  className="h-4 w-4"
                />
                Admin
              </label>
            </div>
          </div>
        </div>

        {/* Feedback e Botão de Salvar */}
        <div className="text-right pt-4">
          {message && (
            <div
              className={`text-sm mb-4 text-left p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </div>
      </form>
    </div>
  );
}