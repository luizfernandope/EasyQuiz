import Link from "next/link";
import QuestionListItem from "@/components/QuestionListItem";

type MockQuestao = {
  id: string;
  enunciado: string;
  tipo: "Multipla Escolha" | "Dissertativa" | "Verdadeiro/Falso";
  dificuldade: "Fácil" | "Médio" | "Difícil";
  isPublica: boolean;
  disciplina: string;
  opcoes?: string[]; // ? indica que é opcional
  resposta?: string; // ? indica que é opcional
};

const minhasQuestoes: MockQuestao[] = [
  {
    id: "101",
    enunciado: "Qual é a capital do Brasil?",
    tipo: "Multipla Escolha",
    dificuldade: "Fácil",
    isPublica: true,
    disciplina: "Geografia",
    opcoes: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
    resposta: "Brasília"
  },
  {
    id: "102",
    enunciado: "Descreva o processo de normalização de um banco de dados.",
    tipo: "Dissertativa",
    dificuldade: "Médio",
    isPublica: false,
    disciplina: "Banco de Dados",
    opcoes: [],
    resposta: ""
  },
  {
    id: "103",
    enunciado: "O Sol gira em torno da Terra.",
    tipo: "Verdadeiro/Falso",
    dificuldade: "Fácil",
    isPublica: true,
    disciplina: "Astronomia",
    opcoes: ["Verdadeiro", "Falso"],
    resposta: "Falso"
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
            disciplina={questao.disciplina}
            opcoes={questao.opcoes}
            resposta={questao.resposta}
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
