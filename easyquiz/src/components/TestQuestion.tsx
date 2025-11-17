'use client'; // Necessário se tivermos interatividade *aqui*, mas vamos controlar pelo pai

// Tipos de dados (simplificado)
type Opcao = {
  texto: string;
  isCorreta: boolean;
};

type Props = {
  numero: number;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  opcoes: Opcao[];
  mostrarResposta: boolean; // Estado controlado pela página pai
};

export default function TestQuestion({ 
  numero, 
  enunciado, 
  tipo, 
  opcoes, 
  mostrarResposta 
}: Props) {
  
  // Função para renderizar as opções
  const renderOpcoes = () => {
    // Para Dissertativa, não há opções
    if (tipo === 'Dissertativa') {
      return (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border">
          <p className="font-semibold text-gray-700">Resposta Esperada:</p>
          {mostrarResposta ? (
            <p className="text-sm italic"> (Critérios de correção para a resposta dissertativa...) </p>
          ) : (
            <p className="text-sm text-gray-400 italic">(Oculto)</p>
          )}
        </div>
      );
    }
    
    // Para Múltipla Escolha ou V/F
    return (
      <ul className="mt-4 space-y-2">
        {opcoes.map((opcao, index) => {
          // Determina o estilo se a resposta estiver sendo mostrada
          let style = "border p-3 rounded-md";
          if (mostrarResposta) {
            if (opcao.isCorreta) {
              style += " bg-green-50 border-green-300 text-green-800 font-semibold";
            } else {
              style += " bg-gray-50 text-gray-600";
            }
          }
          
          return (
            <li key={index} className={style}>
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span> 
              {opcao.texto}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg mb-6">
      {/* Cabeçalho da Questão */}
      <h3 className="text-lg font-semibold text-gray-800">
        Questão {numero}
      </h3>
      
      {/* Enunciado */}
      <p className="text-gray-700 mt-2">{enunciado}</p>
      
      {/* Opções */}
      {renderOpcoes()}
    </div>
  );
}