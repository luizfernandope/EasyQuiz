'use client'; // Necessário para usar hooks do React como useState

import React, { useState } from 'react';

export default function SignUpPage() {
  // 1. Gerenciamento de Estado para TODOS os campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado para confirmação de senha
  const [telefone, setTelefone] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState('');

  // 2. Função de Submissão do Formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica:
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (!nome || !email || !password || !telefone || !tipoPerfil) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Dados prontos para serem enviados à API
    const userData = {
      nome,
      email,
      password, // Enviar apenas a senha principal
      telefone,
      tipoPerfil,
    };

    console.log('Dados de Cadastro a serem enviados:', userData);
    alert('Tentativa de Cadastro efetuada! Verifique o console para os dados.');
    
    // Aqui você faria a chamada real à API (fetch, axios, etc.)
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>
      
      {/* O formulário agora usa a função handleSubmit */}
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg space-y-4">
        
        {/* Campo Nome */}
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Seu nome completo"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/*NOVO: Campo Senha*/}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/*Campo Confirmação de Senha*/}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirmar Senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repita a senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Campo Telefone */}
        <div className="mb-4">
          <label htmlFor="telefone" className="block text-gray-700 text-sm font-bold mb-2">
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            placeholder="(XX) XXXXX-XXXX"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Campo Tipo de Perfil (Professor/Estudante) */}
        <div className="mb-6">
          <label htmlFor="tipoPerfil" className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Perfil
          </label>
          <select
            id="tipoPerfil"
            name="tipoPerfil"
            required
            value={tipoPerfil}
            onChange={(e) => setTipoPerfil(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecione...</option>
            <option value="Professor">Professor</option>
            <option value="Estudante">Estudante</option>
          </select>
        </div>

        {/* Botão de Submissão */}
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}