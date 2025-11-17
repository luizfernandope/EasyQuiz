import QuestionCard from "@/components/QuestionCard";

// 1. ADICIONE ESTA DEFINIÇÃO DE TIPO
type MockQuestaoPublica = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  avaliacaoMedia: number;
};

// 2. APLIQUE O TIPO AO SEU ARRAY DE MOCK
const mockQuestoesPublicas: MockQuestaoPublica[] = [
  {
    id: "q1",
    enunciado:
      "Qual é a complexidade de tempo de uma busca binária em um array ordenado?",
    disciplina: "Algoritmos",
    dificuldade: "Médio",
    tipo: "Multipla Escolha",
    avaliacaoMedia: 4.5,
  },
  {
    id: "q2",
    enunciado: "O que é ACID no contexto de bancos de dados?",
    disciplina: "Banco de Dados",
    dificuldade: "Médio",
    tipo: "Dissertativa",
    avaliacaoMedia: 4.8,
  },
  {
    id: "q3",
    enunciado: "HTML é uma linguagem de programação.",
    disciplina: "Desenvolvimento Web",
    dificuldade: "Fácil",
    tipo: "Verdadeiro/Falso",
    avaliacaoMedia: 3.2,
  },
  {
    id: "q4",
    enunciado:
      "Qual camada do modelo OSI é responsável pelo roteamento de pacotes?",
    disciplina: "Redes de Computadores",
    dificuldade: "Difícil",
    tipo: "Multipla Escolha",
    avaliacaoMedia: 4.6,
  },
];
export default function BrowseQuestionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Buscar Questões Públicas</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Coluna de Filtros (Esquerda) */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filtros</h2>

            {/* Filtro por Disciplina (Placeholder) */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Disciplina
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Todas</option>
                <option>Algoritmos</option>
                <option>Banco de Dados</option>
                <option>Redes</option>
              </select>
            </div>

            {/* Filtro por Dificuldade (Placeholder) */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dificuldade
              </label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" /> Fácil
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" /> Médio
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded mr-2" /> Difícil
                </label>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700">
              Aplicar Filtros
            </button>
          </div>
        </aside>

        {/* Coluna de Resultados (Direita) */}
        <main className="w-full md:w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockQuestoesPublicas.map((questao) => (
              <QuestionCard
                key={questao.id}
                id={questao.id}
                enunciado={questao.enunciado}
                disciplina={questao.disciplina}
                dificuldade={questao.dificuldade}
                tipo={questao.tipo}
                avaliacaoMedia={questao.avaliacaoMedia}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
