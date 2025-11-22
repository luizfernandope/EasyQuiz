'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import QuestionListItem from "@/components/QuestionListItem";
import { API_URL } from "@/services/api";

// Tipo vindo da API (QuestaoDTO)
type QuestaoDTO = {
  id: number;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  disciplina: string;
  opcoes: { id: number; texto: string; correta: boolean }[];
  respostaCorreta: string;
  nomeCriador: string;
};

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState<QuestaoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/questao/browse`) // Usa o endpoint que retorna o DTO formatado
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p className="text-center text-gray-500">Carregando questões...</p>}

      <div className="space-y-4">
        {!loading && questions.map((q) => (
          <QuestionListItem
            key={q.id}
            id={q.id.toString()}
            enunciado={q.enunciado}
            tipo={q.tipo}
            dificuldade={q.dificuldade}
            disciplina={q.disciplina || 'Sem disciplina'}
            // Mapeia as opções para string simples para o componente visual
            opcoes={q.opcoes?.map(o => o.texto)}
            resposta={q.respostaCorreta}
          />
        ))}

        {!loading && questions.length === 0 && (
          <div className="bg-white p-6 shadow rounded-lg text-center text-gray-500">
            <p>Nenhuma questão encontrada no banco de dados.</p>
          </div>
        )}
      </div>
    </div>
  );
}