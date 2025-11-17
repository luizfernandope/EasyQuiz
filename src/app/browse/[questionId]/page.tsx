'use client'; // Para o StarRating

import StarRating from '@/components/StarRating';
import { Star } from 'lucide-react';

// Dados Falsos (Mock Data) para a questão
const mockQuestao = {
  id: 'q1',
  enunciado: 'Qual é a complexidade de tempo de uma busca binária em um array ordenado?',
  disciplina: 'Algoritmos',
  dificuldade: 'Médio',
  tipo: 'Multipla Escolha',
  opcoes: [
    { texto: 'O(n)', isCorreta: false },
    { texto: 'O(log n)', isCorreta: true },
    { texto: 'O(n²)', isCorreta: false },
    { texto: 'O(1)', isCorreta: false },
  ],
  avaliacaoMedia: 4.5,
  totalAvaliacoes: 120,
};

// Componente interno para mostrar as opções
const OpcoesQuestao = () => {
  if (mockQuestao.tipo !== 'Multipla Escolha') {
    return null; // Simplificando, mostraremos apenas múltipla escolha aqui
  }
  
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 mb-6">
      <h2 className="text-xl font-semibold mb-4">Opções</h2>
      <ul className="space-y-3">
        {mockQuestao.opcoes.map((opcao, index) => (
          <li
            key={index}
            className="border border-gray-200 p-3 rounded-md bg-gray-50 text-gray-700"
          >
            <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
            {opcao.texto}
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-4 italic">
        (As respostas corretas não são exibidas nesta visualização pública)
      </p>
    </div>
  );
};


export default function QuestionDetailPage({ params }: { params: { questionId: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      
      {/* Informações da Questão */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {mockQuestao.disciplina}
          </span>
          <span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {mockQuestao.dificuldade}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {mockQuestao.enunciado}
        </h1>

        <div className="flex items-center text-gray-500 text-sm">
          <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
          <span>
            <strong>{mockQuestao.avaliacaoMedia.toFixed(1)}</strong>
            {' / 5'}
            <span className="ml-2">({mockQuestao.totalAvaliacoes} avaliações)</span>
          </span>
        </div>
      </div>

      {/* Opções (se houver) */}
      <OpcoesQuestao />

      {/* Avaliação Comunitária  */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-4">
          Avalie esta Questão
        </h2>
        <p className="text-center text-gray-600 mb-5">
          Sua avaliação ajuda a comunidade a encontrar as melhores questões. 
        </p>
        <StarRating />
        
        {/* Campo de Comentário (opcional) */}
        <textarea
          rows={3}
          className="w-full mt-4 p-2 border border-gray-300 rounded-md"
          placeholder="Deixe um comentário (opcional)..."
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 mt-3">
          Enviar Avaliação
        </button>
      </div>
    </div>
  );
}