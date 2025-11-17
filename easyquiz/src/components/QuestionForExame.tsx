import Link from 'next/link';
import { BookOpen, Layers } from 'lucide-react';

type Props = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  criador: string;
  // opções (usar apenas para múltipla escolha). Se não fornecidas, mostram-se rótulos genéricos.
  options?: string[];
  onInclude?: (id: string) => void;
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
}: Props) {
  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  const tipoNormalized = tipo?.toLowerCase() ?? '';

  const renderOptions = () => {
    // Múltipla escolha: a) b) c) d)
    if (tipoNormalized.includes('multip') || tipoNormalized.includes('múltip')) {
      const letters = ['a)', 'b)', 'c)', 'd)'];
      const rendered = letters.map((label, idx) => {
        const text = options[idx] ?? `Opção ${label}`;
        return (
          <li key={idx} className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">
            <span className="font-medium mr-2">{label}</span>
            <span>{text}</span>
          </li>
        );
      });
      return <ul className="flex flex-col gap-2">{rendered}</ul>;
    }

    // Verdadeiro/Falso
    if (tipoNormalized.includes('verdadeiro') || tipoNormalized.includes('falso') || tipoNormalized.includes('verdadeiro/falso') || tipoNormalized.includes('verdadeiro falso')) {
      return (
        <ul className="flex flex-col gap-2">
          <li className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">Verdadeiro</li>
          <li className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">Falso</li>
        </ul>
      );
    }

    // Dissertativa ou outros: não mostra opções
    return null;
  };

  const handleIncludeClick = () => {
    if (onInclude) {
      onInclude(id);
      return;
    }
    // comportamento padrão leve (sem efeitos colaterais fortes)
    console.log(`Incluir questão na prova: ${id}`);
  };

  return (
    <div className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 flex flex-col">
      {/* Cabeçalho do Card (Disciplina e Criador) */}
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

      {/* Enunciado (limitado a 3 linhas) */}
      <p
        className="text-gray-800 font-semibold mb-4 flex-grow"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '4.5rem', // 3 linhas * 1.5rem (line-height)
        }}
      >
        {enunciado}
      </p>

      {/* Tags (Dificuldade e Tipo) */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}>
          {dificuldade}
        </span>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {tipo}
        </span>
      </div>

      {/* Opções (conforme tipo) */}
      <div className="mb-4">
        {renderOptions()}
      </div>

      {/* Rodapé (Botões: Ver Questão + Incluir) */}
      <div className="flex gap-2">
        <Link
          href={`/browse/${id}`}
          className="flex-1 text-center bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Ver Questão
        </Link>

        <button
          type="button"
          onClick={handleIncludeClick}
          className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Incluir questão na prova
        </button>
      </div>
    </div>
  );
}