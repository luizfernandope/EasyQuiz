// Adiciona a diretiva "use client" no topo
'use client'; 

import { useState } from 'react';

// Tipos para nossos estados (boa prática em TypeScript)
type TipoPergunta = 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
type NivelDificuldade = 'Fácil' | 'Médio' | 'Difícil';

export default function NewQuestionPage() {
  // Estado para controlar o tipo de pergunta selecionado
  const [tipoPergunta, setTipoPergunta] = useState<TipoPergunta>('Multipla Escolha');

  // --- Componentes Internos para Opções Dinâmicas ---
  // (Vamos criar os componentes para cada tipo de resposta aqui)

  // Componente para Múltipla Escolha
  const OpcoesMultiplaEscolha = () => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Opções de Resposta
        </label>
        {/* Placeholder para as opções dinâmicas */}
        <div className="flex items-center space-x-2">
          <input type="radio" name="opcao_correta" />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Opção 1" />
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" name="opcao_correta" />
          <input type="text" className="w-full p-2 border rounded-md" placeholder="Opção 2" />
        </div>
        <button type="button" className="text-sm text-blue-600 hover:underline">
          + Adicionar opção
        </button>
      </div>
    );
  };

  // Componente para Verdadeiro/Falso
  const OpcoesVerdadeiroFalso = () => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Resposta Correta
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input type="radio" name="vf_correta" className="mr-1" value="verdadeiro" />
            Verdadeiro
          </label>
          <label className="flex items-center">
            <input type="radio" name="vf_correta" className="mr-1" value="falso" />
            Falso
          </label>
        </div>
      </div>
    );
  };

  // --- Renderização Principal ---

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Criar Nova Questão</h1>
      
      <form className="bg-white p-6 shadow rounded-lg space-y-6">
        
        {/* 1. Enunciado */}
        <div>
          <label htmlFor="enunciado" className="block text-sm font-medium text-gray-700">
            Enunciado da Questão
          </label>
          <textarea
            id="enunciado"
            rows={4}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Digite o enunciado aqui..."
          />
        </div>

        {/* 2. Linha de Filtros (Disciplina e Dificuldade) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Disciplina (Placeholder - idealmente viria do DB) */}
          <div>
            <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700">
              Disciplina
            </label>
            <select id="disciplina" className="w-full mt-1 p-2 border rounded-md">
              <option>Cálculo 1</option>
              <option>Engenharia de Software</option>
              <option>Banco de Dados</option>
            </select>
          </div>

          {/* Nível de Dificuldade */}
          <div>
            <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700">
              Nível de Dificuldade
            </label>
            <select 
              id="dificuldade" 
              className="w-full mt-1 p-2 border rounded-md"
              defaultValue="Fácil"
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
        </div>

        {/* 3. Tipo de Pergunta */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Pergunta
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="tipo_pergunta" 
                value="Multipla Escolha"
                checked={tipoPergunta === 'Multipla Escolha'}
                onChange={() => setTipoPergunta('Multipla Escolha')}
              />
              <span className="ml-2">Múltipla Escolha</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="tipo_pergunta" 
                value="Dissertativa"
                checked={tipoPergunta === 'Dissertativa'}
                onChange={() => setTipoPergunta('Dissertativa')}
              />
              <span className="ml-2">Dissertativa</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="tipo_pergunta" 
                value="Verdadeiro/Falso"
                checked={tipoPergunta === 'Verdadeiro/Falso'}
                onChange={() => setTipoPergunta('Verdadeiro/Falso')}
              />
              <span className="ml-2">Verdadeiro/Falso</span>
            </label>
          </div>
        </div>

        {/* 4. Opções de Resposta (Renderização Condicional) */}
        <div className="border-t pt-4">
          {tipoPergunta === 'Multipla Escolha' && <OpcoesMultiplaEscolha />}
          {tipoPergunta === 'Verdadeiro/Falso' && <OpcoesVerdadeiroFalso />}
          {tipoPergunta === 'Dissertativa' && (
            <p className="text-gray-500 text-sm">
              Questões dissertativas não exigem opções de resposta.
            </p>
          )}
        </div>

        {/* 5. Configurações de Privacidade */}
        <div className="border-t pt-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Questão Pública (visível para todos os usuários)
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Se deixado desmarcado, esta questão será privada e visível apenas para você.
          </p>
        </div>

        {/* 6. Botão de Salvar */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Salvar Questão
          </button>
        </div>

      </form>
    </div>
  );
}