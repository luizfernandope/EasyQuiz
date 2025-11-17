// Vamos usar alguns ícones para os botões
// Lembre-se de instalar: npm install lucide-react
import { Edit, Trash2, Eye, Globe } from 'lucide-react';
import Link from 'next/link';

// Definimos os tipos de dados que este componente espera
type Props = {
  id: string;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  isPublica: boolean;
};

export default function QuestionListItem({ 
  id, 
  enunciado, 
  tipo, 
  dificuldade, 
  isPublica 
}: Props) {
  
  // Define a cor da "tag" de dificuldade
  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between space-x-4">
      
      {/* Informações da Questão */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">#{id}</p>
        <p className="text-md font-semibold text-gray-800 truncate">
          {enunciado}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span 
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}
          >
            {dificuldade}
          </span>
          <span className="text-xs text-gray-600 px-2 py-0.5 rounded-full bg-gray-100">
            {tipo}
          </span>
          {isPublica ? (
            <span className="flex items-center text-xs text-blue-600">
              <Globe size={14} className="mr-1" /> Pública
            </span>
          ) : (
            <span className="flex items-center text-xs text-gray-500">
              <Eye size={14} className="mr-1" /> Privada
            </span>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex-shrink-0 flex space-x-2">
        <Link 
          href={`/dashboard/questions/edit/${id}`}
          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
          title="Editar"
        >
          <Edit size={18} />
        </Link>
        <button
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
          title="Excluir"
          // Aqui ficaria a lógica de "Soft Delete" [cite: 3]
        >
          <Trash2 size={18} />
        </button>
      </div>

    </div>
  );
}