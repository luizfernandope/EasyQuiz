'use client';

import { useEffect, useState } from 'react';
import { FileText, Search, BookCheck } from 'lucide-react';
import QuestionForExame from '../../../components/QuestionForExame';
import { API_URL } from '@/services/api';

// Tipos para os dados da API
type Disciplina = {
  id: number;
  nome: string;
};

type QuestaoAPI = {
  id: number;
  enunciado: string;
  disciplina: string; 
  dificuldade: 'Fácil' | 'Médio' | 'Difícil'; // Tipagem mais estrita para bater com o componente filho
  tipo: string;
  nomeCriador: string;
  opcoes?: { texto: string; correta: boolean }[];
};

export default function TestGeneratorPage() {
  // Form / meta da prova
  const [tituloProva, setTituloProva] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [curso, setCurso] = useState('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [turma, setTurma] = useState('');

  // Dados REAIS do Backend
  const [allQuestions, setAllQuestions] = useState<QuestaoAPI[]>([]);
  const [disciplinasOptions, setDisciplinasOptions] = useState<Disciplina[]>([]);
  
  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // Filtros da coluna esquerda
  const [searchText, setSearchText] = useState('');
  const [filterCriador, setFilterCriador] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterDificuldade, setFilterDificuldade] = useState('Todos');
  const [filterDisciplina, setFilterDisciplina] = useState('Todos');

  // Questões selecionadas para a prova (coluna direita)
  const [selectedQuestions, setSelectedQuestions] = useState<QuestaoAPI[]>([]);

  // --- 1. BUSCAR DADOS DA API ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Busca Questões
        const resQ = await fetch(`${API_URL}/questao/browse`);
        if (resQ.ok) {
            const dataQ = await resQ.json();
            setAllQuestions(dataQ);
        }

        // Busca Disciplinas (para o filtro)
        const resD = await fetch(`${API_URL}/disciplina/listar`);
        if (resD.ok) {
            const dataD = await resD.json();
            setDisciplinasOptions(dataD);
        }

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao carregar questões. Verifique se o backend está rodando.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. LÓGICA DE FILTRAGEM ---
  const visibleQuestions = allQuestions.filter(q => {
    // Normaliza para minúsculas para busca insensível a caixa
    const searchLower = searchText.toLowerCase();
    
    // Verifica se o texto digitado está no Enunciado, Disciplina ou Criador
    const textMatch = 
        (q.enunciado || '').toLowerCase().includes(searchLower) ||
        (q.disciplina || '').toLowerCase().includes(searchLower) ||
        (q.nomeCriador || '').toLowerCase().includes(searchLower);
    
    if (searchText && !textMatch) return false;

    // Filtros de Select
    if (filterCriador !== 'Todos' && q.nomeCriador !== filterCriador) return false;
    if (filterTipo !== 'Todos' && q.tipo !== filterTipo) return false;
    if (filterDificuldade !== 'Todos' && q.dificuldade !== filterDificuldade) return false;
    if (filterDisciplina !== 'Todos' && q.disciplina !== filterDisciplina) return false;

    return true;
  });

  // Extrai listas únicas para os dropdowns
  const criadoresUnicos = Array.from(new Set(allQuestions.map(q => q.nomeCriador).filter(Boolean)));
  const tiposUnicos = Array.from(new Set(allQuestions.map(q => q.tipo)));
  const dificuldadesUnicas = Array.from(new Set(allQuestions.map(q => q.dificuldade)));

  // --- 3. AÇÕES ---
  const toggleIncludeQuestion = (idStr: string) => {
    const id = Number(idStr);
    const exists = selectedQuestions.find(s => s.id === id);
    
    if (exists) {
      setSelectedQuestions(prev => prev.filter(p => p.id !== id));
    } else {
      const q = allQuestions.find(x => x.id === id);
      if (q) {
        setSelectedQuestions(prev => [q, ...prev]);
      }
    }
  };

  const removeSelected = (id: number) => {
    setSelectedQuestions(prev => prev.filter(p => p.id !== id));
  };

  // Função para o botão "Ver Questão" (Redireciona para a página de visualização/edição)
  const handleViewQuestion = (id: string) => {
     // Opção A: Abrir um alerta com detalhes rápidos
     // const q = allQuestions.find(x => x.id === Number(id));
     // alert(`Questão #${id}\n\n${q?.enunciado}\n\nResposta: ${q?.opcoes?.find(o=>o.correta)?.texto || 'N/A'}`);
     
     // Opção B: Navegar para a página de detalhes (Recomendado se você tiver a página pronta)
     // Se não tiver a página '/browse/[id]', use a lógica de edição ou apenas um modal.
     // Vou deixar configurado para abrir em uma nova aba a edição (admin) ou visualização
     window.open(`/dashboard/questions/edit/${id}`, '_blank');
  };

  const handleGenerateTest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da Prova:", {
        tituloProva,
        universidade,
        curso,
        disciplinaNome,
        professor,
        turma,
        questoes: selectedQuestions
    });
    alert(`Prova "${tituloProva}" gerada com ${selectedQuestions.length} questões!`);
  };

  return (
    // CORREÇÃO DE LAYOUT: h-[calc(100vh-6rem)] define altura fixa descontando navbar
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-6rem)] overflow-hidden">
      
      {/* Coluna Esquerda: Lista de Questões Disponíveis */}
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Área de Filtros Fixa */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex-shrink-0">
            <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-9 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Pesquisar por enunciado..."
                    />
                </div>
                
                <button
                    type="button"
                    onClick={() => {
                        setSearchText('');
                        setFilterCriador('Todos');
                        setFilterTipo('Todos');
                        setFilterDificuldade('Todos');
                        setFilterDisciplina('Todos');
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
                >
                    Limpar
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select
                    value={filterDisciplina}
                    onChange={(e) => setFilterDisciplina(e.target.value)}
                    className="p-2 border border-gray-200 rounded-md text-sm w-full"
                >
                    <option value="Todos">Disciplinas</option>
                    {disciplinasOptions.map(d => <option key={d.id} value={d.nome}>{d.nome}</option>)}
                </select>

                <select
                    value={filterDificuldade}
                    onChange={(e) => setFilterDificuldade(e.target.value)}
                    className="p-2 border border-gray-200 rounded-md text-sm w-full"
                >
                    <option value="Todos">Dificuldade</option>
                    {dificuldadesUnicas.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="p-2 border border-gray-200 rounded-md text-sm w-full"
                >
                    <option value="Todos">Tipo</option>
                    {tiposUnicos.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select
                    value={filterCriador}
                    onChange={(e) => setFilterCriador(e.target.value)}
                    className="p-2 border border-gray-200 rounded-md text-sm w-full"
                >
                    <option value="Todos">Criador</option>
                    {criadoresUnicos.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Lista Scrollável (flex-1 permite ocupar o resto do espaço, overflow-y-auto habilita scroll interno) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-20">
            {loading && <div className="text-center py-10 text-gray-500">Carregando questões...</div>}
            
            {!loading && visibleQuestions.length === 0 && (
                <div className="text-center py-10 text-gray-500">Nenhuma questão encontrada com os filtros atuais.</div>
            )}

            {visibleQuestions.map(q => {
                const isSelected = selectedQuestions.some(s => s.id === q.id);
                return (
                    <div key={q.id} className={`transition-all ${isSelected ? 'opacity-50 grayscale' : ''}`}>
                        <QuestionForExame
                            id={q.id.toString()}
                            enunciado={q.enunciado}
                            disciplina={q.disciplina || 'Geral'}
                            dificuldade={q.dificuldade}
                            tipo={q.tipo}
                            criador={q.nomeCriador || 'Desconhecido'}
                            options={q.opcoes?.map(o => o.texto)}
                            onInclude={toggleIncludeQuestion}
                        />
                        {/* Botão Ver Questão agora é funcional via Link interno no componente ou ajustado aqui se necessário. 
                            O componente QuestionForExame já tem um Link para /browse/{id}, verifique se essa rota existe. 
                            Se não existir, altere o componente QuestionForExame para usar um onClick customizado se preferir.
                        */}
                    </div>
                );
            })}
        </div>
      </div>

      {/* Coluna Direita: Configuração da Prova */}
      <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Nova Prova</h2>
            </div>
            
            <form onSubmit={handleGenerateTest} className="space-y-3">
                <input
                    value={tituloProva}
                    onChange={e => setTituloProva(e.target.value)}
                    placeholder="Título da Prova (ex: P1 de Cálculo)"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
                <div className="grid grid-cols-2 gap-2">
                    <input value={universidade} onChange={e => setUniversidade(e.target.value)} placeholder="Universidade" className="p-2 border rounded-md text-sm" />
                    <input value={curso} onChange={e => setCurso(e.target.value)} placeholder="Curso" className="p-2 border rounded-md text-sm" />
                    <input value={disciplinaNome} onChange={e => setDisciplinaNome(e.target.value)} placeholder="Disciplina" className="p-2 border rounded-md text-sm" />
                    <input value={professor} onChange={e => setProfessor(e.target.value)} placeholder="Professor" className="p-2 border rounded-md text-sm" />
                </div>
                
                <button 
                    type="submit"
                    disabled={selectedQuestions.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    Gerar PDF ({selectedQuestions.length} questões)
                </button>
            </form>
        </div>

        {/* Lista de Selecionadas Scrollável */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold sticky top-0 bg-gray-50 py-2 z-10">
                <BookCheck size={20} />
                Questões Selecionadas
            </div>

            {selectedQuestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <p>Sua prova está vazia.</p>
                    <p className="text-sm">Selecione questões na lista ao lado.</p>
                </div>
            ) : (
                <div className="space-y-3 pb-4">
                    {selectedQuestions.map((q, index) => (
                        <div key={q.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200 flex gap-3 group items-start hover:shadow-md transition-shadow">
                            <div className="font-bold text-blue-600 bg-blue-50 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 text-xs mt-0.5">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                                    {q.disciplina} • {q.tipo}
                                </div>
                                <p className="text-sm text-gray-800 line-clamp-2 leading-snug">{q.enunciado}</p>
                            </div>
                            <button 
                                onClick={() => removeSelected(q.id)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remover da prova"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}