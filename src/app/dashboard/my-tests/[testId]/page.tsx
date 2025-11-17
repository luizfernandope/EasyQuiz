'use client'; // Necessário para o useState

import { useState } from 'react';
import TestQuestion from '@/components/TestQuestion';
import { Eye, EyeOff, FileDown, Edit } from 'lucide-react'; // Ícones

// 1. ADICIONE ESTAS DEFINIÇÕES DE TIPO
type OpcaoMock = {
  texto: string;
  isCorreta: boolean;
};

type QuestaoMock = {
  numero: number;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  opcoes: OpcaoMock[];
};

type ProvaMock = {
  id: string;
  titulo: string;
  questoes: QuestaoMock[];
};

// 2. APLIQUE O TIPO AO SEU OBJETO MOCK
const mockProva: ProvaMock = {
  id: 'p1',
  titulo: 'Prova 1 - Cálculo',
  questoes: [
    {
      numero: 1,
      enunciado: 'Qual é a derivada de f(x) = x²?',
      tipo: 'Multipla Escolha',
      opcoes: [
        { texto: 'x', isCorreta: false },
        { texto: '2x', isCorreta: true },
        { texto: 'x³/3', isCorreta: false },
        { texto: '2', isCorreta: false },
      ],
    },
    {
      numero: 2,
      enunciado: 'O Teorema Fundamental do Cálculo conecta diferenciação e integração.',
      tipo: 'Verdadeiro/Falso',
      opcoes: [
        { texto: 'Verdadeiro', isCorreta: true },
        { texto: 'Falso', isCorreta: false },
      ],
    },
    {
      numero: 3,
      enunciado: 'Defina o conceito de limite.',
      tipo: 'Dissertativa',
      opcoes: [], // Dissertativa não tem opções
    },
  ],
};


export default function TestViewerPage({ params }: { params: { testId: string } }) {
  // Estado para controlar a visibilidade das respostas
  const [mostrarRespostas, setMostrarRespostas] = useState(false);

  return (
    <div>
      {/* Cabeçalho da Prova */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <p className="text-sm text-gray-500">Visualizando Prova: #{params.testId}</p>
        <h1 className="text-3xl font-bold">{mockProva.titulo}</h1>
      </div>
      
      {/* Barra de Ações  */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => alert('Exportando PDF...')}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
        >
          <FileDown size={18} className="mr-2" />
          Exportar PDF
        </button>
        <button
          onClick={() => alert('Exportando PDF com Gabarito...')}
          className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-800"
        >
          <FileDown size={18} className="mr-2" />
          Exportar com Gabarito
        </button>
        <button
          onClick={() => setMostrarRespostas(!mostrarRespostas)}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
        >
          {mostrarRespostas ? (
            <EyeOff size={18} className="mr-2" />
          ) : (
            <Eye size={18} className="mr-2" />
          )}
          {mostrarRespostas ? 'Ocultar' : 'Mostrar'} Respostas
        </button>
        <button
          onClick={() => alert('Implementa a Regra [9]: Edição sobrescreve')}
          className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 ml-auto"
        >
          <Edit size={18} className="mr-2" />
          Editar Prova
        </button>
      </div>

      {/* Lista de Questões da Prova */}
      <div>
        {mockProva.questoes.map((questao) => (
          <TestQuestion
            key={questao.numero}
            numero={questao.numero}
            enunciado={questao.enunciado}
            tipo={questao.tipo}
            opcoes={questao.opcoes}
            mostrarResposta={mostrarRespostas} // Passa o estado para o componente filho
          />
        ))}
      </div>
    </div>
  );
}