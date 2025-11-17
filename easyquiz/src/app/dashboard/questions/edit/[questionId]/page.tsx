'use client';

import { useState, useEffect } from 'react';

// --- Type Definitions ---
type TipoPergunta = 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
type NivelDificuldade = 'Fácil' | 'Médio' | 'Difícil';

type QuestionData = {
  id: string;
  enunciado: string;
  tipo: TipoPergunta;
  dificuldade: NivelDificuldade;
  disciplina: string;
  opcoes?: string[];
  respostaCorreta?: number | string | null;
};

// --- Mock Data Fetching Function ---
// In a real app, this would be an API call.
const fetchQuestionById = async (id: string): Promise<QuestionData | null> => {
  console.log(`Fetching data for question #${id}...`);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - replace with your actual data source
  const mockDatabase: { [key: string]: QuestionData } = {
    '101': {
      id: '101',
      enunciado: 'Qual é a capital do Brasil?',
      tipo: 'Multipla Escolha',
      dificuldade: 'Fácil',
      disciplina: 'Geografia',
      opcoes: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'],
      respostaCorreta: 0, // index of 'Brasília'
    },
    '102': {
      id: '102',
      enunciado: 'Descreva o processo de normalização de um banco de dados.',
      tipo: 'Dissertativa',
      dificuldade: 'Médio',
      disciplina: 'Banco de Dados',
      // No 'opcoes' or 'respostaCorreta' for Dissertativa
    },
    '103': {
      id: '103',
      enunciado: 'O Sol gira em torno da Terra.',
      tipo: 'Verdadeiro/Falso',
      dificuldade: 'Fácil',
      disciplina: 'Astronomia',
      respostaCorreta: 'Falso',
    },
  };

  return mockDatabase[id] || null;
};

// --- Page Component ---
export default function EditQuestionPage({ params }: { params: { questionId: string } }) {
  const { questionId } = params;

  const [formData, setFormData] = useState<Partial<QuestionData>>({});
  const [originalData, setOriginalData] = useState<Partial<QuestionData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestionData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchQuestionById(questionId);
        if (data) {
          // Ensure 'opcoes' is an array of 4 for multiple choice
          if (data.tipo === 'Multipla Escolha' && (!data.opcoes || data.opcoes.length < 4)) {
            const existingOpcoes = data.opcoes || [];
            data.opcoes = [...existingOpcoes, ...Array(4 - existingOpcoes.length).fill('')];
          }
          setFormData(data);
          setOriginalData(data);
        } else {
          setError(`Questão com ID "${questionId}" não encontrada.`);
        }
      } catch (err) {
        setError('Falha ao carregar os dados da questão.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestionData();
  }, [questionId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpcaoChange = (index: number, value: string) => {
    const novasOpcoes = [...(formData.opcoes || [])];
    novasOpcoes[index] = value;
    setFormData((prev) => ({ ...prev, opcoes: novasOpcoes }));
  };

  const handleRadioChange = (name: keyof QuestionData, value: any) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };

      // Se o tipo for alterado para Múltipla Escolha, garanta que o array de opções exista.
      if (name === 'tipo' && value === 'Multipla Escolha') {
        // Se não houver opções ou se houver menos de 4, crie um novo array.
        if (!newState.opcoes || newState.opcoes.length < 4) {
          const existingOpcoes = newState.opcoes || [];
          newState.opcoes = [...existingOpcoes, ...Array(4 - existingOpcoes.length).fill('')];
        }
        // Limpa a resposta correta anterior para evitar inconsistências
        newState.respostaCorreta = null;
      }

      return newState;
    });
  };

  const handleRevert = () => {
    setFormData(originalData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up data before submitting
    const submissionData = {
      ...formData,
      opcoes: formData.tipo === 'Multipla Escolha' ? formData.opcoes : undefined,
      respostaCorreta: formData.tipo !== 'Dissertativa' ? formData.respostaCorreta : null,
    };
    console.log('Salvando alterações:', submissionData);
    // Here you would make an API call to save the data
    alert('Alterações salvas com sucesso! (Verifique o console)');
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editando Questão: #{questionId}</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg space-y-6">
        {/* Enunciado */}
        <div>
          <label htmlFor="enunciado" className="block text-sm font-medium text-gray-700">
            Enunciado da Questão
          </label>
          <textarea
            id="enunciado"
            name="enunciado"
            rows={4}
            value={formData.enunciado || ''}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Disciplina e Dificuldade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700">
              Disciplina
            </label>
            <select
              id="disciplina"
              name="disciplina"
              value={formData.disciplina || ''}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option>Redes de Computadores</option>
              <option>Cálculo 1</option>
              <option>Engenharia de Software</option>
              <option>Banco de Dados</option>
            </select>
          </div>
          <div>
            <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700">
              Nível de Dificuldade
            </label>
            <select
              id="dificuldade"
              name="dificuldade"
              value={formData.dificuldade || 'Fácil'}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
        </div>

        {/* Tipo de Pergunta */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Pergunta</label>
          <div className="flex space-x-4 mt-2">
            {(['Multipla Escolha', 'Dissertativa', 'Verdadeiro/Falso'] as TipoPergunta[]).map((t) => (
              <label key={t} className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value={t}
                  checked={formData.tipo === t}
                  onChange={() => handleRadioChange('tipo', t)}
                />
                <span className="ml-2">{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Opções de Resposta (Condicional) */}
        <div className="border-t pt-4">
          {formData.tipo === 'Multipla Escolha' && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-2">
              <h3 className="text-sm font-semibold">Opções de Resposta</h3>
              {(formData.opcoes || []).map((opcao, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="respostaCorreta"
                    checked={formData.respostaCorreta === index}
                    onChange={() => handleRadioChange('respostaCorreta', index)}
                  />
                  <input
                    type="text"
                    value={opcao}
                    onChange={(e) => handleOpcaoChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder={`Opção ${index + 1}`}
                  />
                </label>
              ))}
            </div>
          )}
          {formData.tipo === 'Verdadeiro/Falso' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Resposta Correta</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="respostaCorreta"
                    value="Verdadeiro"
                    checked={formData.respostaCorreta === 'Verdadeiro'}
                    onChange={() => handleRadioChange('respostaCorreta', 'Verdadeiro')}
                  />
                  <span className="ml-2">Verdadeiro</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="respostaCorreta"
                    value="Falso"
                    checked={formData.respostaCorreta === 'Falso'}
                    onChange={() => handleRadioChange('respostaCorreta', 'Falso')}
                  />
                  <span className="ml-2">Falso</span>
                </label>
              </div>
            </div>
          )}
          {formData.tipo === 'Dissertativa' && (
            <p className="text-gray-500 text-sm">Questões dissertativas não exigem opções de resposta.</p>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleRevert}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Reverter Alterações
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}