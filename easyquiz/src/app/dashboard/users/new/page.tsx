'use client';

import { useState } from 'react';
import { User, Mail, Shield } from 'lucide-react';

type UserType = 'Professor' | 'Admin';

export default function NewUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('Professor');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim()) {
      setMessage({ text: 'Nome e email são obrigatórios.', type: 'error' });
      return;
    }

    // Simulação de chamada de API para criar o usuário
    // A senha seria geralmente definida por um link enviado ao email do usuário
    console.log('Novo usuário a ser cadastrado:', {
      name,
      email,
      type: userType,
    });

    setMessage({ text: `Usuário '${name}' cadastrado com sucesso como ${userType}!`, type: 'success' });

    // Limpar o formulário
    setName('');
    setEmail('');
    setUserType('Professor');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Usuário</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        {/* Campo Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
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
              placeholder="Ex: joao.silva@email.com"
              required
            />
          </div>
        </div>

        {/* Campo Tipo de Perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Perfil
          </label>
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cadastrar Usuário
          </button>
        </div>
      </form>
    </div>
  );
}