import Link from 'next/link';
import { Star, CheckCircle, BookOpen, Layers } from 'lucide-react';

type Props = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  // Média de 0 a 5 (Regra: Avaliação Comunitária)
  avaliacaoMedia: number; 
};

export default function QuestionCard({ 
  id, 
  enunciado, 
  disciplina, 
  dificuldade, 
  tipo, 
  avaliacaoMedia 
}: Props) {
  
  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 flex flex-col">
      {/* Cabeçalho do Card (Disciplina e Avaliação) */}
      <div className="flex justify-between items-center mb-2">
        <span className="flex items-center text-sm font-semibold text-blue-600">
          <BookOpen size={16} className="mr-1.5" />
          {disciplina}
        </span>
        <span className="flex items-center text-sm font-semibold text-yellow-500">
          {avaliacaoMedia.toFixed(1)}
          <Star size={16} className="ml-1 fill-current" />
        </span>
      </div>

      {/* Enunciado (limitado a 3 linhas) */}
      <p className="text-gray-800 font-semibold mb-4 flex-grow" 
         style={{
           display: '-webkit-box',
           WebkitLineClamp: 3,
           WebkitBoxOrient: 'vertical',
           overflow: 'hidden',
           textOverflow: 'ellipsis',
           minHeight: '4.5rem' // 3 linhas * 1.5rem (line-height)
         }}
      >
        {enunciado}
      </p>

      {/* Tags (Dificuldade e Tipo) */}
      <div className="flex items-center gap-2 mb-4">
        <span 
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}
        >
          {dificuldade}
        </span>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {tipo}
        </span>
      </div>

      {/* Rodapé (Botão de Ver) */}
      <Link 
        href={`/browse/${id}`}
        className="block w-full text-center bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Ver Questão
      </Link>
    </div>
  );
}