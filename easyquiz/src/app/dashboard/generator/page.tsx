'use client';

import { useEffect, useState } from 'react';
import { FileText, Search, BookCheck, Trash2, X, Loader2 } from 'lucide-react';
import QuestionForExame from '../../../components/QuestionForExame';
import { API_URL, getLoggedUser } from '@/services/api';

// Tipos
type Disciplina = {
  id: number;
  nome: string;
};

type QuestaoAPI = {
  id: number;
  enunciado: string;
  disciplina: string; 
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  nomeCriador: string;
  opcoes?: { texto: string; correta: boolean }[];
};

export default function TestGeneratorPage() {
  // Meta da prova
  const [tituloProva, setTituloProva] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [curso, setCurso] = useState('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [professor, setProfessor] = useState('');

  // Dados
  const [allQuestions, setAllQuestions] = useState<QuestaoAPI[]>([]);
  const [disciplinasOptions, setDisciplinasOptions] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchText, setSearchText] = useState('');
  const [filterCriador, setFilterCriador] = useState('Todos');
  const [filterDisciplina, setFilterDisciplina] = useState('Todos');
  const [filterDificuldade, setFilterDificuldade] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');

  // Seleção
  const [selectedQuestions, setSelectedQuestions] = useState<QuestaoAPI[]>([]);

  // 1. Carregar Dados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = getLoggedUser();
      if (!user) return;

      try {
        const resQ = await fetch(`${API_URL}/questao/browse`);
        
        // Lógica de Disciplinas
        let urlDisc = `${API_URL}/disciplina/listar`;
        if (user.tipo === 'PROFESSOR') {
             urlDisc = `${API_URL}/professordisciplina/listarPorIDProfessor/${user.id}`;
        }

        const [resDataQ, resDataD] = await Promise.all([
            resQ.json(),
            fetch(urlDisc).then(r => r.json())
        ]);

        setAllQuestions(resDataQ);

        if (user.tipo === 'PROFESSOR') {
            setDisciplinasOptions(resDataD.map((pd: any) => pd.disciplina));
        } else {
            setDisciplinasOptions(resDataD);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Filtragem
  const visibleQuestions = allQuestions.filter(q => {
    const term = searchText.toLowerCase().trim();
    let matchesSearch = true;

    if (term) {
        const inEnunciado = q.enunciado ? q.enunciado.toLowerCase().includes(term) : false;
        const inDisciplina = q.disciplina ? q.disciplina.toLowerCase().includes(term) : false;
        const inCriador = q.nomeCriador ? q.nomeCriador.toLowerCase().includes(term) : false;
        matchesSearch = inEnunciado || inDisciplina || inCriador;
    }

    const matchesDisciplina = filterDisciplina === 'Todos' || q.disciplina === filterDisciplina;
    const matchesDificuldade = filterDificuldade === 'Todos' || q.dificuldade === filterDificuldade;
    const matchesTipo = filterTipo === 'Todos' || q.tipo === filterTipo;
    const matchesCriador = filterCriador === 'Todos' || q.nomeCriador === filterCriador;

    return matchesSearch && matchesDisciplina && matchesDificuldade && matchesTipo && matchesCriador;
  });

  const criadoresUnicos = Array.from(new Set(allQuestions.map(q => q.nomeCriador).filter(Boolean)));
  const tiposUnicos = Array.from(new Set(allQuestions.map(q => q.tipo).filter(Boolean)));
  const dificuldadesUnicas = Array.from(new Set(allQuestions.map(q => q.dificuldade).filter(Boolean)));

  // 3. Ações
  const toggleQuestion = (idStr: string) => {
    const id = Number(idStr);
    const exists = selectedQuestions.find(s => s.id === id);
    if (exists) {
      setSelectedQuestions(prev => prev.filter(p => p.id !== id));
    } else {
      const q = allQuestions.find(x => x.id === id);
      if (q) setSelectedQuestions(prev => [...prev, q!]);
    }
  };

  const removeSelected = (id: number) => {
    setSelectedQuestions(prev => prev.filter(p => p.id !== id));
  };

  const handleViewQuestion = (idStr: string) => {
    window.open(`/dashboard/questions/edit/${idStr}`, '_blank');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Simulação: Prova "${tituloProva}" gerada com ${selectedQuestions.length} questões!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)] overflow-hidden pb-2">
      
      {/* COLUNA ESQUERDA (LISTA) */}
      <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
        
        {/* Barra de Filtros */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex gap-3 mb-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-10 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Buscar por enunciado, disciplina..."
                    />
                    {searchText && (
                        <button 
                            onClick={() => setSearchText('')} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    )}
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
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors whitespace-nowrap font-medium text-gray-700"
                >
                    Limpar Filtros
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <select 
                    value={filterDisciplina}
                    onChange={(e) => setFilterDisciplina(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                    <option value="Todos">Todas as Disciplinas</option>
                    {disciplinasOptions.map(d => <option key={d.id} value={d.nome}>{d.nome}</option>)}
                </select>
                <select 
                    value={filterDificuldade}
                    onChange={(e) => setFilterDificuldade(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                    <option value="Todos">Todas Dificuldades</option>
                    {dificuldadesUnicas.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                 <select 
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                    <option value="Todos">Todos Tipos</option>
                    {tiposUnicos.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                 <select 
                    value={filterCriador}
                    onChange={(e) => setFilterCriador(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                    <option value="Todos">Todos Criadores</option>
                    {criadoresUnicos.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* Área de Scroll das Questões */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {loading && (
                <div className="flex justify-center items-center py-10 text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Carregando banco de questões...
                </div>
            )}
            
            {!loading && visibleQuestions.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-white rounded border border-dashed border-gray-300">
                    <p>Nenhuma questão encontrada.</p>
                    <p className="text-sm text-gray-400">Tente buscar por outro termo ou limpar os filtros.</p>
                </div>
            )}

            {visibleQuestions.map(q => {
                const isSelected = selectedQuestions.some(s => s.id === q.id);
                return (
                    <div key={q.id} className={`transition-opacity duration-200 ${isSelected ? 'opacity-60' : 'opacity-100'}`}>
                        <QuestionForExame
                            id={q.id.toString()}
                            enunciado={q.enunciado}
                            disciplina={q.disciplina || 'Geral'}
                            dificuldade={q.dificuldade as any}
                            tipo={q.tipo}
                            criador={q.nomeCriador || 'Unknown'}
                            options={q.opcoes?.map(o => o.texto)}
                            onInclude={toggleQuestion}
                            onView={handleViewQuestion}
                        />
                    </div>
                );
            })}
        </div>
      </div>

      {/* COLUNA DIREITA (PROVA) */}
      <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Cabeçalho da Prova */}
        <div className="p-5 border-b border-gray-200 bg-white z-10">
            <div className="flex items-center gap-2 mb-4 text-blue-700">
                <FileText size={24} />
                <h2 className="text-xl font-bold">Configurar Prova</h2>
            </div>
            <div className="space-y-3">
                <input
                    value={tituloProva}
                    onChange={(e) => setTituloProva(e.target.value)}
                    placeholder="Título da Prova (Ex: P1 - Algoritmos)"
                    className="w-full p-2 border border-gray-300 rounded-md font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                    <input 
                        value={universidade} 
                        onChange={(e) => setUniversidade(e.target.value)} 
                        placeholder="Instituição" 
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm" 
                    />
                    <input 
                        value={professor} 
                        onChange={(e) => setProfessor(e.target.value)} 
                        placeholder="Professor" 
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <input value={curso} onChange={e => setCurso(e.target.value)} placeholder="Curso" className="p-2 border rounded-md text-sm" />
                   <input value={disciplinaNome} onChange={e => setDisciplinaNome(e.target.value)} placeholder="Disciplina" className="p-2 border rounded-md text-sm" />
                </div>
                
                <button 
                    onClick={handleGenerate}
                    disabled={selectedQuestions.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Gerar PDF ({selectedQuestions.length})
                </button>
            </div>
        </div>

        {/* Lista de Selecionadas */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3 text-gray-600">
                <span className="flex items-center gap-2 font-semibold text-sm"><BookCheck size={18}/> Questões Selecionadas</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{selectedQuestions.length}</span>
            </div>

            {selectedQuestions.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                    <p className="text-sm">Sua prova está vazia.</p>
                    <p className="text-xs mt-1">Adicione questões da lista ao lado.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {selectedQuestions.map((q, index) => (
                        <div key={q.id} className="group bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors shadow-sm flex gap-3">
                            <span className="font-bold text-blue-600 text-sm mt-0.5">#{index + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">{q.disciplina} • {q.dificuldade}</p>
                                <p className="text-sm text-gray-800 line-clamp-2 leading-tight">{q.enunciado}</p>
                            </div>
                            <button 
                                onClick={() => removeSelected(q.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="Remover"
                            >
                                <Trash2 size={18} />
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