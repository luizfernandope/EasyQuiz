// Vamos usar alguns ícones para os botões
// Lembre-se de instalar: npm install lucide-react
import { Edit, Trash2, Eye, Globe, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Definimos os tipos de dados que este componente espera
type Props = {
  id: string;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  disciplina: string;
  //opcoes de resposta com a resposta (4 para multipla escolha, 2 para VF, vazio para dissertativa)
  opcoes?: string[]; // ? indica que é opcional
  resposta?: string; // ? indica que é opcional
};

export default function QuestionListItem({ 
  id, 
  enunciado, 
  tipo, 
  dificuldade, 
  disciplina,
  opcoes,
  resposta
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
        <span className="flex items-center text-sm font-semibold text-blue-600">
          <BookOpen size={16} className="mr-1.5" />
          {disciplina}
        </span>
        <p className="text-md font-semibold text-gray-800 truncate">
          {enunciado}
        </p>

        {/*Aqui mostramos as opções e a resposta correta, se houver*/}
        {tipo === 'Multipla Escolha' && opcoes && opcoes.length > 0 ? (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Opções</div>
            <div className="grid grid-cols-2 gap-2">
              {opcoes.map((opt, i) => {
                const label = String.fromCharCode(65 + i); // A, B, C, ...
                const isCorrect = resposta !== undefined && resposta === opt;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 text-sm rounded border ${
                      isCorrect ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border'
                      }`}
                    >
                      {label}
                    </span>
                    <span className={isCorrect ? 'font-medium text-gray-800' : 'text-gray-700'}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : tipo === 'Verdadeiro/Falso' ? (
          <div className="mt-2 flex items-center gap-2">
            {['Verdadeiro', 'Falso'].map((v) => {
              const isCorrect = resposta !== undefined && resposta === v;
              return (
                <div
                  key={v}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 text-gray-700 border-gray-100'
                  }`}
                >
                  {v}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-1">Resposta esperada</div>
            <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {resposta ?? 'Nenhuma resposta cadastrada'}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 mt-2">
          <span 
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}
          >
            {dificuldade}
          </span>
          <span className="text-xs text-gray-600 px-2 py-0.5 rounded-full bg-gray-100">
            {tipo}
          </span>
          
        </div>
      </div>

      {/* Botões de Ação */}
      {/*display flex vertical centralizado*/}
      <div className=" flex flex-col items-center space-y-2">
        <Link 

          href={`/dashboard/questions/edit/${id}`}
          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
          title="Editar"
        >
          <Edit size={22} />
        </Link>
        <button
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
          title="Excluir"
          style={{ cursor: 'pointer' }}
          // Aqui ficaria a lógica de "Soft Delete" [cite: 3]
        >
          <Trash2 size={22} />
        </button>
      </div>

    </div>
  );
}