'use client'; // Usamos 'use client' para habilitar o uso de hooks do React como useState

import React, { useState } from 'react';

export default function SignInPage() {
  // 1. Gerenciamento de Estado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Função de Submissão do Formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nesta função, você faria a chamada à API para autenticar o usuário
    console.log('Dados de Login a serem enviados:', { email, password });

    // Exemplo de lógica de autenticação (simulada)
    if (email && password) {
      alert('Tentativa de Login efetuada! Verifique o console para os dados.');
      // Aqui você integraria com NextAuth, Clerk, ou sua própria API
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      
      {/* O formulário agora usa a função handleSubmit */}
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg space-y-4">
        
        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="voce@email.com"
            required
            // Captura a mudança de valor e atualiza o estado
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Sua senha"
            required
            // Captura a mudança de valor e atualiza o estado
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Botão de Submissão */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}