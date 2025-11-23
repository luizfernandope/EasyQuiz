import Link from 'next/link';
import { BookOpen, Layers } from 'lucide-react';

type Props = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  criador: string;
  options?: string[];
  onInclude?: (id: string) => void;
  // Adicionado suporte para função de visualizar
  onView?: (id: string) => void;
};

export default function QuestionForExame({
  id,
  enunciado,
  disciplina,
  dificuldade,
  tipo,
  criador,
  options = [],
  onInclude,
  onView,
}: Props) {
  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  const tipoNormalized = tipo?.toLowerCase() ?? '';

  const renderOptions = () => {
    if (tipoNormalized.includes('multip') || tipoNormalized.includes('múltip')) {
      const letters = ['a)', 'b)', 'c)', 'd)'];
      return (
        <ul className="flex flex-col gap-2">
          {letters.map((label, idx) => {
            const text = options[idx] ?? `Opção ${label}`;
            return (
              <li key={idx} className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">
                <span className="font-medium mr-2">{label}</span>
                <span>{text}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    if (tipoNormalized.includes('verdadeiro') || tipoNormalized.includes('falso')) {
      return (
        <ul className="flex flex-col gap-2">
          <li className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">Verdadeiro</li>
          <li className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">Falso</li>
        </ul>
      );
    }

    return null;
  };

  return (
    <div className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 flex flex-col">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-2">
        <span className="flex items-center text-sm font-semibold text-blue-600">
          <BookOpen size={16} className="mr-1.5" />
          {disciplina}
        </span>
        <span className="flex items-center text-sm font-medium text-gray-600">
          <Layers size={16} className="mr-1.5" />
          {criador}
        </span>
      </div>

      {/* Enunciado */}
      <p
        className="text-gray-800 font-semibold mb-4 flex-grow"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '4.5rem',
        }}
      >
        {enunciado}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}>
          {dificuldade}
        </span>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {tipo}
        </span>
      </div>

      {/* Opções */}
      <div className="mb-4">
        {renderOptions()}
      </div>

      {/* Rodapé */}
      <div className="flex gap-2">
        {/* Botão Ver Questão: Agora usa um button com as mesmas classes do Link original para manter design */}
        <button
          type="button"
          onClick={() => onView && onView(id)}
          className="flex-1 text-center bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Ver Questão
        </button>

        <button
          type="button"
          onClick={() => onInclude && onInclude(id)}
          className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Incluir questão na prova
        </button>
      </div>
    </div>
  );
}