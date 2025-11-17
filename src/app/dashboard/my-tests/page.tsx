import Link from 'next/link';
// Vamos usar ícones para as ações
import { Eye, Edit, Trash2, FileText } from 'lucide-react';

// Dados Falsos (Mock Data) para simular as provas geradas
const mockProvas = [
  {
    id: 'p1',
    titulo: 'Prova 1 - Cálculo',
    dataCriacao: '20/10/2025',
    qtdQuestoes: 10,
  },
  {
    id: 'p2',
    titulo: 'Revisão de Engenharia de Software',
    dataCriacao: '18/10/2025',
    qtdQuestoes: 20,
  },
  {
    id: 'p3',
    titulo: 'Teste Rápido: Banco de Dados',
    dataCriacao: '15/10/2025',
    qtdQuestoes: 5,
  },
];

export default function MyTestsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Provas Geradas</h1>
        <Link
          href="/dashboard/generator"
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
        >
          + Gerar Nova Prova
        </Link>
      </div>

      {/* Lista de Provas */}
      <div className="bg-white shadow-lg rounded-lg">
        {/* Cabeçalho da Lista (opcional, mas bom para UI) */}
        <div className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 font-semibold text-gray-600 text-sm">
          <div className="col-span-3 flex items-center">
            <FileText size={16} className="mr-2" />
            Título da Prova
          </div>
          <div className="col-span-1">Data</div>
          <div className="col-span-1">Questões</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>

        {/* Itens da Lista */}
        <div className="divide-y divide-gray-100">
          {mockProvas.map((prova) => (
            <div key={prova.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50">
              {/* Título */}
              <div className="col-span-3">
                <Link 
                  href={`/dashboard/my-tests/${prova.id}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {prova.titulo}
                </Link>
              </div>
              
              {/* Data */}
              <div className="col-span-1 text-sm text-gray-600">
                {prova.dataCriacao}
              </div>

              {/* Quantidade */}
              <div className="col-span-1 text-sm text-gray-600">
                {prova.qtdQuestoes}
              </div>

              {/* Ações */}
              <div className="col-span-1 flex justify-end space-x-2">
                <Link
                  href={`/dashboard/my-tests/${prova.id}`}
                  className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                  title="Visualizar"
                >
                  <Eye size={18} />
                </Link>
                [cite_start]{/* A Regra de Negócio [cite: 9] diz que edição sobrescreve. 
                    Poderíamos ter um botão de "Editar Filtros" aqui. 
                    Por enquanto, vamos focar na visualização. */}
                <button
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                  title="Excluir Prova"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vazio */}
        {mockProvas.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <p>Você ainda não gerou nenhuma prova.</p>
          </div>
        )}
      </div>
    </div>
  );
}