'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Search, User, Tag, BookCheck } from 'lucide-react';
import QuestionForExame from '../../../components/QuestionForExame';

const mockDisciplinas = [
  { id: '1', nome: 'Cálculo 1' },
  { id: '2', nome: 'Engenharia de Software' },
  { id: '3', nome: 'Banco de Dados' },
  { id: '4', nome: 'Redes de Computadores' },
  { id: '5', nome: 'Algoritmos' },
  { id: '6', nome: 'Física 1' },
];

const mockDificuldades = ['Fácil', 'Médio', 'Difícil'];

type Question = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: 'Múltipla' | 'Verdadeiro/Falso' | 'Dissertativa';
  criador: string;
  options?: string[];
};

function createMockQuestion(i: number): Question {
  const disciplinas = mockDisciplinas.map(d => d.nome);
  const tipos: Question['tipo'][] = ['Múltipla', 'Verdadeiro/Falso', 'Dissertativa'];
  const dificuldade = mockDificuldades[i % mockDificuldades.length] as Question['dificuldade'];
  const tipo = tipos[i % tipos.length];
  return {
    id: `${i}`,
    enunciado: `Enunciado da questão ${i}: descreva o conceito relacionado...`,
    disciplina: disciplinas[i % disciplinas.length],
    dificuldade,
    tipo,
    criador: `Usuário ${i % 7}`,
    options: tipo === 'Múltipla' ? [
      `Opção A (questão ${i})`,
      `Opção B (questão ${i})`,
      `Opção C (questão ${i})`,
      `Opção D (questão ${i})`,
    ] : undefined,
  };
}

export default function TestGeneratorPage() {
  // Form / meta da prova
  const [tituloProva, setTituloProva] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [curso, setCurso] = useState('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [turma, setTurma] = useState('');

  // Lista disponível (infinite scroll)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10; 
  const totalAvailable = 200; 
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Filtros da coluna esquerda
  const [searchText, setSearchText] = useState('');
  const [filterCriador, setFilterCriador] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterDificuldade, setFilterDificuldade] = useState('Todos');
  const [filterDisciplina, setFilterDisciplina] = useState('Todos');

  // Questões selecionadas para a prova (coluna direita)
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [weightMap, setWeightMap] = useState<Record<string, string>>({}); // ex: { "12": "1,0" }

  // carrega página de mock
  const loadMore = () => {
    if (loading) return;
    const alreadyLoaded = page * pageSize;
    if (alreadyLoaded >= totalAvailable) return;
    setLoading(true);
    setTimeout(() => {
      const start = page * pageSize + 1;
      const items: Question[] = Array.from({ length: pageSize }, (_, idx) => createMockQuestion(start + idx));
      setQuestions(prev => [...prev, ...items]);
      setPage(p => p + 1);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (questions.length === 0) loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // infinite scroll on left list
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      if (loading) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
        if (questions.length < totalAvailable) loadMore();
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [loading, questions]);

  // filtros aplicados sobre a lista carregada
  const visibleQuestions = questions.filter(q => {
    if (searchText && !`${q.enunciado} ${q.disciplina} ${q.criador}`.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (filterCriador !== 'Todos' && q.criador !== filterCriador) return false;
    if (filterTipo !== 'Todos' && q.tipo !== filterTipo) return false;
    if (filterDificuldade !== 'Todos' && q.dificuldade !== filterDificuldade) return false;
    if (filterDisciplina !== 'Todos' && q.disciplina !== filterDisciplina) return false;
    return true;
  });

  // extrai lista de criadores conhecidos para filtro
  const criadores = Array.from(new Set(questions.map(q => q.criador))).slice(0, 20);
  const disciplinasNomes = mockDisciplinas.map(d => d.nome);

  const toggleIncludeQuestion = (id: string) => {
    const exists = selectedQuestions.find(s => s.id === id);
    if (exists) {
      setSelectedQuestions(prev => prev.filter(p => p.id !== id));
      setWeightMap(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const q = questions.find(x => x.id === id);
    if (q) {
      setSelectedQuestions(prev => [q, ...prev]);
      setWeightMap(prev => ({ ...prev, [id]: prev[id] ?? '1,0' }));
    }
  };

  const removeSelected = (id: string) => {
    setSelectedQuestions(prev => prev.filter(p => p.id !== id));
    setWeightMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleViewQuestion = (q: Question) => {
    alert(`Questão ${q.id}\n\nDisciplina: ${q.disciplina}\nTipo: ${q.tipo}\nDificuldade: ${q.dificuldade}\nCriador: ${q.criador}\n\n${q.enunciado}
      ${q.options ? '\nOpções:\n' + q.options.map((opt, i) => `  ${String.fromCharCode(97 + i)}) ${opt}`).join('\n') : ''}`);
  };

  const handleWeightChange = (id: string, value: string) => {
    // aceita vírgula ou ponto — manter como string para exibição com vírgula
    setWeightMap(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerateTest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Gerando prova...\n(Simulação de chamada de API)\n\n` +
      `Universidade: ${universidade}\n` +
      `Curso: ${curso}\n` +
      `Disciplina: ${disciplinaNome}\n` +
      `Professor: ${professor}\n` +
      `Turma: ${turma}\n` +
      `Título da Prova: ${tituloProva}\n` +
      `Questões escolhidas: ${selectedQuestions.length}`
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Coluna esquerda: Pesquisa e escolha de questões */}
      <div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        
        <div className="flex gap-2">
        <div className="w-1/2">
          <label className="text-sm text-gray-600 mb-1 block">Buscar</label>
          <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 p-2 border border-gray-200 rounded-md"
            placeholder="Pesquisar enunciado, disciplina ou criador..."
          />
          </div>
        </div>

        <div className="w-1/2">
          <label className="text-sm text-gray-600 mb-1 block">Criador</label>
          <select
          value={filterCriador}
          onChange={(e) => setFilterCriador(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md"
          >
          <option>Todos</option>
          {criadores.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        </div>

        <div className="flex items-end mt-3">
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div>
          <label className="text-sm text-gray-600 mb-1 block">Disciplina</label>
          <select
            value={filterDisciplina}
            onChange={(e) => setFilterDisciplina(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option>Todos</option>
            {disciplinasNomes.map(d => <option key={d}>{d}</option>)}
          </select>
          </div>

          <div>
          <label className="text-sm text-gray-600 mb-1 block">Tipo</label>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option>Todos</option>
            <option>Múltipla</option>
            <option>Verdadeiro/Falso</option>
            <option>Dissertativa</option>
          </select>
          </div>

          <div>
          <label className="text-sm text-gray-600 mb-1 block">Dificuldade</label>
          <select
            value={filterDificuldade}
            onChange={(e) => setFilterDificuldade(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
          >
            <option>Todos</option>
            {mockDificuldades.map(d => <option key={d}>{d}</option>)}
          </select>
          </div>
        </div>

        <div className="ml-4">
          <button
          type="button"
          onClick={() => {
            setSearchText('');
            setFilterCriador('Todos');
            setFilterTipo('Todos');
            setFilterDificuldade('Todos');
            setFilterDisciplina('Todos');
          }}
          className="px-3 py-2 bg-gray-100 rounded-md text-sm"
          >
          Reset
          </button>
        </div>
        </div>
      </div>

        {/* Lista com infinite scroll */}
        <div ref={listRef} className="max-h-[720px] overflow-auto space-y-4">
          {visibleQuestions.length === 0 && !loading && (
            <div className="text-sm text-gray-500">Nenhuma questão encontrada.</div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {visibleQuestions.map(q => (
              <QuestionForExame
                key={q.id}
                id={q.id}
                enunciado={q.enunciado}
                disciplina={q.disciplina}
                dificuldade={q.dificuldade}
                tipo={q.tipo}
                criador={q.criador}
                options={q.options}
                onInclude={toggleIncludeQuestion}
              />
            ))}
          </div>

          {loading && <div className="text-center text-sm text-gray-500">Carregando...</div>}
          {!loading && questions.length >= totalAvailable && (
            <div className="text-center text-sm text-gray-500">Todas as questões carregadas.</div>
          )}
        </div>
      </div>

      {/* Coluna direita: Informações Básicas + Questões escolhidas */}
      <div>
        <form className="bg-white shadow-lg rounded-lg p-6" onSubmit={handleGenerateTest}>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-blue-600" />
            <h2 className="text-xl font-semibold">Informações da prova</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Título da Prova</label>
              <input
                value={tituloProva}
                onChange={(e) => setTituloProva(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ex: Prova 1 - Cálculo"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Universidade</label>
                <input value={universidade} onChange={(e) => setUniversidade(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Curso</label>
                <input value={curso} onChange={(e) => setCurso(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Disciplina</label>
                <input value={disciplinaNome} onChange={(e) => setDisciplinaNome(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Professor</label>
                <input value={professor} onChange={(e) => setProfessor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Turma</label>
                <input value={turma} onChange={(e) => setTurma(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Gerar Prova</button>
            </div>

            
          </div>
        </form>

        {/* Questões escolhidas */}
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookCheck size={22} className="text-gray-600" />
              <h3 className="font-semibold">Questões escolhidas ({selectedQuestions.length})</h3>
            </div>
            <div className="text-sm text-gray-500">{selectedQuestions.length} selecionadas</div>
          </div>

          {selectedQuestions.length === 0 && <div className="text-sm text-gray-500">Nenhuma questão adicionada ainda.</div>}

          <div className="space-y-3 max-h-[360px] overflow-auto">
            {selectedQuestions.map(q => (
              <div key={q.id} className="border border-gray-200 rounded-md p-3 flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800">{q.disciplina} — {q.tipo}</div>
                  <div className="text-sm text-gray-600 line-clamp-2 ">{q.enunciado}</div>
                  <div className="text-xs text-gray-500 mt-2">{q.criador} • {q.dificuldade}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => handleViewQuestion(q)} className="text-sm text-blue-600">Ver questão</button>
                  <button onClick={() => removeSelected(q.id)} className="text-sm text-red-600">Remover</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
