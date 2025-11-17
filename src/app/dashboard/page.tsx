import Link from 'next/link';
// Vamos usar ícones para os atalhos e estatísticas
import { Plus, FileText, CheckSquare, BarChart2 } from 'lucide-react';

// Dados Falsos (Mock Data) para as estatísticas
const stats = [
  {
    nome: 'Minhas Questões',
    valor: '42', // Viria do DB
    icone: <CheckSquare size={24} className="text-blue-600" />,
  },
  {
    nome: 'Provas Geradas',
    valor: '8', // Viria do DB
    icone: <FileText size={24} className="text-green-600" />,
  },
  {
    nome: 'Questões Públicas',
    valor: '312', // Viria do DB
    icone: <BarChart2 size={24} className="text-yellow-600" />,
  },
];

// Atalhos para as principais ações
const atalhos = [
  {
    nome: 'Criar Nova Questão',
    href: '/dashboard/questions/new',
    icone: <Plus size={20} className="mr-2" />,
    descricao: 'Adicionar uma nova questão ao seu banco pessoal.',
  },
  {
    nome: 'Gerar Nova Prova',
    href: '/dashboard/generator',
    icone: <FileText size={20} className="mr-2" />,
    descricao: 'Criar uma prova customizada usando filtros.',
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* 1. Cabeçalho de Boas-Vindas */}
      <h1 className="text-3xl font-bold mb-2">Bem-vindo ao seu Painel</h1>
      <p className="text-lg text-gray-600 mb-8">
        Aqui você gerencia suas questões e provas de forma rápida.
      </p>

      {/* 2. Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.nome} 
            className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 flex items-center"
          >
            <div className="mr-4 p-3 bg-gray-100 rounded-full">
              {stat.icone}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">{stat.valor}</p>
              <p className="text-sm font-semibold text-gray-500">{stat.nome}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Atalhos Rápidos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {atalhos.map((atalho) => (
            <Link 
              key={atalho.nome}
              href={atalho.href}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all"
            >
              <div className="flex items-center text-xl font-semibold text-blue-600 mb-2">
                {atalho.icone}
                {atalho.nome}
              </div>
              <p className="text-gray-600">{atalho.descricao}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}