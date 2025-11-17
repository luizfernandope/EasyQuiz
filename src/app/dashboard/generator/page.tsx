'use client'; 

import { useState } from 'react';
// Ícones ajudam na clareza
import { Filter, FileText, CheckSquare, Hash } from 'lucide-react'; 

// Dados Falsos (Mock Data) para os filtros
const mockDisciplinas = [
  { id: '1', nome: 'Cálculo 1' },
  { id: '2', nome: 'Engenharia de Software' },
  { id: '3', nome: 'Banco de Dados' },
  { id: '4', nome: 'Redes de Computadores' },
  { id: '5', nome: 'Algoritmos' },
  { id: '6', nome: 'Física 1' },
];

const mockDificuldades = ['Fácil', 'Médio', 'Difícil'];

export default function TestGeneratorPage() {
  const [tituloProva, setTituloProva] = useState('');
  const [disciplinasSelecionadas, setDisciplinasSelecionadas] = useState<string[]>([]);
  const [quantidadeQuestoes, setQuantidadeQuestoes] = useState(10);

  const handleGenerateTest = (e: React.FormEvent) => {
    e.preventDefault(); 
    alert(`Gerando prova...\n(Simulação de chamada de API)`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerador de Provas</h1>
      
      <form 
        className="bg-white shadow-lg rounded-lg"
        onSubmit={handleGenerateTest}
      >
        {/* Usamos um "fieldset" para agrupar campos relacionados */}
        <fieldset className="p-6 md:p-8 space-y-6">
          <legend className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="mr-2 text-blue-600" size={24} />
            Informações Básicas
          </legend>
          
          <div>
            <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-1">
              Título da Prova
            </label>
            <input
              type="text"
              id="titulo"
              value={tituloProva}
              onChange={(e) => setTituloProva(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Prova 1 - Cálculo"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Este título aparecerá no cabeçalho da prova.
            </p>
          </div>
        </fieldset>

        {/* --- Seção de Filtros --- */}
        <fieldset className="border-t border-gray-200 p-6 md:p-8 space-y-6">
          <legend className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Filter className="mr-2 text-blue-600" size={24} />
            Filtros de Conteúdo
          </legend>

          {/* Filtro de Disciplina(s) com Colunas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Disciplinas (selecione uma ou mais)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-300 p-4 rounded-md">
              {mockDisciplinas.map((disciplina) => (
                <label key={disciplina.id} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500"
                    value={disciplina.nome}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDisciplinasSelecionadas([...disciplinasSelecionadas, disciplina.nome]);
                      } else {
                        setDisciplinasSelecionadas(
                          disciplinasSelecionadas.filter((d) => d !== disciplina.nome)
                        );
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{disciplina.nome}</span>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* --- Seção de Configuração --- */}
        <fieldset className="border-t border-gray-200 p-6 md:p-8 space-y-6">
          <legend className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CheckSquare className="mr-2 text-blue-600" size={24} />
            Configuração da Prova
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nível de Dificuldade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nível de Dificuldade
              </label>
              <div className="space-y-2">
                {mockDificuldades.map((nivel) => (
                  <label key={nivel} className="flex items-center space-x-2 p-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500" 
                      defaultChecked 
                    />
                    <span className="text-sm text-gray-700">{nivel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quantidade de Perguntas */}
            <div>
              <label htmlFor="quantidade" className="block text-sm font-semibold text-gray-700 mb-2">
                Quantidade de Questões
              </label>
              <input
                type="number"
                id="quantidade"
                value={quantidadeQuestoes}
                onChange={(e) => setQuantidadeQuestoes(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="50"
              />
            </div>
          </div>
        </fieldset>

        {/* --- Botão de Gerar --- */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 md:p-6 text-right rounded-b-lg">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Gerar Prova
          </button>
        </div>
      </form>
    </div>
  );
}