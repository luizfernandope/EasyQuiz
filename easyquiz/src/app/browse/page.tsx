'use client';

import { useState } from 'react';
import QuestionCard from "@/components/QuestionCard";

type MockQuestaoPublica = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  opcoes?: string[];
  resposta?: string;
  criadorId?: string;
  nomeCriador?: string;
};

const mockQuestoesPublicas: MockQuestaoPublica[] = [
  {
    id: "q1",
    enunciado:
      "Qual é a complexidade de tempo de uma busca binária em um array ordenado?",
    disciplina: "Algoritmos",
    dificuldade: "Médio",
    tipo: "Multipla Escolha",
    opcoes: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    resposta: "O(log n)",
    criadorId: "1",
    nomeCriador: "Jadir"
  },
  {
    id: "q2",
    enunciado: "O que é ACID no contexto de bancos de dados?",
    disciplina: "Banco de Dados",
    dificuldade: "Médio",
    tipo: "Dissertativa",
    opcoes: [],
    resposta: "",
    criadorId: "2",
    nomeCriador: "Maria"
  },
  {
    id: "q3",
    enunciado: "HTML é uma linguagem de programação.",
    disciplina: "Desenvolvimento Web",
    dificuldade: "Fácil",
    tipo: "Verdadeiro/Falso",
    opcoes: ["Verdadeiro", "Falso"],
    resposta: "Falso",
    criadorId: "3",
    nomeCriador: "Carlos"
  },
  {
    id: "q4",
    enunciado:
      "Qual camada do modelo OSI é responsável pelo roteamento de pacotes?",
    disciplina: "Redes de Computadores",
    dificuldade: "Difícil",
    tipo: "Multipla Escolha",
    opcoes: ["Camada de Enlace", "Camada de Rede", "Camada de Transporte", "Camada Física"],
    resposta: "Camada de Rede",
    criadorId: "4",
    nomeCriador: "Ana"
  },
];

export default function BrowseQuestionsPage() {
  // Estados para os filtros selecionados
  const [filterDisciplina, setFilterDisciplina] = useState('Todas');
  const [filterDificuldades, setFilterDificuldades] = useState<string[]>([]);
  const [filterTipos, setFilterTipos] = useState<string[]>([]);
  const [filterCriador, setFilterCriador] = useState('Todos');

  // Estado para as questões que serão exibidas
  const [displayedQuestoes, setDisplayedQuestoes] = useState(mockQuestoesPublicas);

  // Extrai opções únicas para os filtros a partir dos dados
  const disciplinas = [...new Set(mockQuestoesPublicas.map(q => q.disciplina))];
  const criadores = [...new Set(mockQuestoesPublicas.map(q => q.nomeCriador).filter(Boolean))] as string[];
  const dificuldades = ['Fácil', 'Médio', 'Difícil'];
  const tipos = ['Multipla Escolha', 'Verdadeiro/Falso', 'Dissertativa'];

  const handleCheckboxChange = (
    filterList: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (filterList.includes(value)) {
      setter(filterList.filter(item => item !== value));
    } else {
      setter([...filterList, value]);
    }
  };

  const handleApplyFilters = () => {
    let filtered = mockQuestoesPublicas;

    if (filterDisciplina !== 'Todas') {
      filtered = filtered.filter(q => q.disciplina === filterDisciplina);
    }
    if (filterCriador !== 'Todos') {
      filtered = filtered.filter(q => q.nomeCriador === filterCriador);
    }
    if (filterDificuldades.length > 0) {
      filtered = filtered.filter(q => filterDificuldades.includes(q.dificuldade));
    }
    if (filterTipos.length > 0) {
      filtered = filtered.filter(q => filterTipos.includes(q.tipo));
    }

    setDisplayedQuestoes(filtered);
  };
  const handleClearFilters = () => {
    setFilterDisciplina('Todas');
    setFilterCriador('Todos');
    setFilterDificuldades([]);
    setFilterTipos([]);
    setDisplayedQuestoes(mockQuestoesPublicas);
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna de Filtros (Esquerda) */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>

            {/* Filtro por Disciplina */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Disciplina</label>
              <select value={filterDisciplina} onChange={e => setFilterDisciplina(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                <option>Todas</option>
                {disciplinas.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Filtro por Criador */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Criador</label>
              <select value={filterCriador} onChange={e => setFilterCriador(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                <option>Todos</option>
                {criadores.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Filtro por Dificuldade */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dificuldade</label>
              <div className="space-y-1">
                {dificuldades.map(d => (
                  <label key={d} className="flex items-center">
                    <input type="checkbox" checked={filterDificuldades.includes(d)} onChange={() => handleCheckboxChange(filterDificuldades, setFilterDificuldades, d)} className="rounded mr-2" /> {d}
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
              <div className="space-y-1">
                {tipos.map(t => (
                  <label key={t} className="flex items-center">
                    <input type="checkbox" checked={filterTipos.includes(t)} onChange={() => handleCheckboxChange(filterTipos, setFilterTipos, t)} className="rounded mr-2" /> {t}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleApplyFilters} className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700">
              Aplicar Filtros
            </button>
            <button onClick={handleClearFilters} className="w-full bg-gray-200 text-gray-700 mt-4 py-2 rounded-md font-semibold hover:bg-gray-300">
              Limpar Filtros
            </button>
            
          </div>
        </aside>

        {/* Coluna de Resultados (Direita) */}
        <main className="w-full md:w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {displayedQuestoes.length > 0 ? (
              displayedQuestoes.map((questao) => (
                <QuestionCard
                  key={questao.id}
                  id={questao.id}
                  enunciado={questao.enunciado}
                  disciplina={questao.disciplina}
                  dificuldade={questao.dificuldade}
                  tipo={questao.tipo}
                  opcoes={questao.opcoes}
                  resposta={questao.resposta}
                  criadorId={questao.criadorId}
                  nomeCriador={questao.nomeCriador}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full mt-10">
                Nenhuma questão encontrada com os filtros aplicados.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
