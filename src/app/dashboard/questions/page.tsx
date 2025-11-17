import Link from "next/link";
import QuestionListItem from "@/components/QuestionListItem";

type MockQuestao = {
  id: string;
  enunciado: string;
  tipo: "Multipla Escolha" | "Dissertativa" | "Verdadeiro/Falso";
  dificuldade: "Fácil" | "Médio" | "Difícil";
  isPublica: boolean;
};

const minhasQuestoes: MockQuestao[] = [
  {
    id: "101",
    enunciado: "Qual é a capital do Brasil?",
    tipo: "Multipla Escolha",
    dificuldade: "Fácil",
    isPublica: true,
  },
  {
    id: "102",
    enunciado: "Descreva o processo de normalização de um banco de dados.",
    tipo: "Dissertativa",
    dificuldade: "Médio",
    isPublica: false,
  },
  {
    id: "103",
    enunciado: "O Sol gira em torno da Terra.",
    tipo: "Verdadeiro/Falso",
    dificuldade: "Fácil",
    isPublica: true,
  },
];

export default function MyQuestionsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Questões</h1>
        <Link
          href="/dashboard/questions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Criar Nova Questão
        </Link>
      </div>

      {/* Filtros da Lista (placeholder) */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <p>Filtros (por tipo, dificuldade, etc.) ficarão aqui.</p>
      </div>

      {/* Lista de Questões */}
      <div className="space-y-4">
        {minhasQuestoes.map((questao) => (
          <QuestionListItem
            key={questao.id}
            id={questao.id}
            enunciado={questao.enunciado}
            tipo={questao.tipo}
            dificuldade={questao.dificuldade}
            isPublica={questao.isPublica}
          />
        ))}

        {/* Estado Vazio (se não houver questões) */}
        {minhasQuestoes.length === 0 && (
          <div className="bg-white p-6 shadow rounded-lg text-center text-gray-500">
            <p>Você ainda não criou nenhuma questão.</p>
            <Link
              href="/dashboard/questions/new"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Comece a criar agora!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
