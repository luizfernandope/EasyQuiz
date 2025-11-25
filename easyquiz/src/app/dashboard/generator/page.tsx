'use client';

import { useEffect, useState } from 'react';
import { FileText, Search, BookCheck, Trash2, X, Loader2 } from 'lucide-react';
import QuestionForExame from '../../../components/QuestionForExame'; // Ajuste o caminho se necessário
import { API_URL, getLoggedUser } from '@/services/api';

// Importações do PDFMake
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Configuração das fontes do PDFMake para evitar erros de VFS
// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

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
  // Meta da prova (Campos manuais)
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

  // Seleção (Questões escolhidas para a prova)
  const [selectedQuestions, setSelectedQuestions] = useState<QuestaoAPI[]>([]);

  // 1. Carregar Dados ao iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = getLoggedUser();
      if (!user) return;

      try {
        // Busca todas as questões disponíveis
        const resQ = await fetch(`${API_URL}/questao/browse`);
        
        // Lógica de Disciplinas: Professor vê apenas as suas, Admin vê todas
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
            // Se for professor, a resposta vem no formato { professor:..., disciplina:... }
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

  // 2. Lógica de Filtragem
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

  // Extração de valores únicos para os selects de filtro
  const criadoresUnicos = Array.from(new Set(allQuestions.map(q => q.nomeCriador).filter(Boolean)));
  const tiposUnicos = Array.from(new Set(allQuestions.map(q => q.tipo).filter(Boolean)));
  const dificuldadesUnicas = Array.from(new Set(allQuestions.map(q => q.dificuldade).filter(Boolean)));

  // 3. Ações de Seleção
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

  // --- LÓGICA DE GERAÇÃO DO PDF ---
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedQuestions.length === 0) {
      alert('Selecione pelo menos uma questão para gerar a prova.');
      return;
    }

    // 1. Lógica Inteligente para Cabeçalho:
    const pdfDisciplina = filterDisciplina !== 'Todos' 
      ? filterDisciplina 
      : (disciplinaNome || 'Diversas');

    const pdfProfessor = filterCriador !== 'Todos' 
      ? filterCriador 
      : (professor || 'Equipe Docente');

    // Curso não possui filtro, então usa o input manual
    const pdfCurso = curso || 'Geral'; 

    // 2. Construção do conteúdo das questões
    const contentQuestions = selectedQuestions.map((q, index) => {
      const elements: any[] = [];

      // Título da questão
      elements.push({ 
        text: `Questão ${index + 1} `, 
        style: 'questionHeader',
        margin: [0, 15, 0, 5] 
      });

      // Enunciado
      elements.push({
        text: q.enunciado,
        style: 'questionBody',
        margin: [0, 0, 0, 10]
      });

      // Renderização das opções baseada no tipo
      if (q.tipo === 'Multipla Escolha' && q.opcoes) {
        const letters = ['a)', 'b)', 'c)', 'd)', 'e)'];
        q.opcoes.forEach((opt, idx) => {
          elements.push({
            text: `${letters[idx] || '-'} ${opt.texto}`,
            margin: [15, 2, 0, 2],
            fontSize: 11
          });
        });
      } else if (q.tipo === 'Verdadeiro/Falso') {
        elements.push({
          text: '(   ) Verdadeiro    (   ) Falso',
          margin: [15, 5, 0, 5],
          bold: true
        });
      } else if (q.tipo === 'Dissertativa') {
        // Linhas para resposta
        elements.push({
          canvas: [
             { type: 'line', x1: 0, y1: 20, x2: 515, y2: 20, lineWidth: 0.5, lineColor: '#999' },
             { type: 'line', x1: 0, y1: 40, x2: 515, y2: 40, lineWidth: 0.5, lineColor: '#999' },
             { type: 'line', x1: 0, y1: 60, x2: 515, y2: 60, lineWidth: 0.5, lineColor: '#999' },
          ],
          margin: [0, 0, 0, 10]
        });
      }

      return elements;
    });
    const FATEC_LOGO_BASE64 = "data:image/png;base64,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";
    // 3. Definição do Documento PDF
    const docDefinition: any = {
      info: {
        title: tituloProva || 'Prova Gerada',
        author: pdfProfessor,
      },
      pageMargins: [40, 120, 40, 60], // Margem superior maior para caber o cabeçalho
      
      header: {
        margin: [40, 20, 40, 20],
        columns: [
          // Coluna da Esquerda (Logo)
          {
            image: FATEC_LOGO_BASE64,
            width: 80, 
            alignment: 'center',
            margin: [0, 0, 10, 0]
          },
          // Coluna da Direita (Dados da Instituição)
          {
            width: '*',
            stack: [
              { text: tituloProva || 'Avaliação Acadêmica', style: 'headerTitle', margin: [0, 5, 0, 0] }
            ]
          }
        ]
      },

      content: [
        // Área de Identificação do Aluno (Tabela)
       {
  style: 'studentInfoTable',
  table: {
    widths: ['*', 'auto', 'auto'],
    body: [
      [
        { text: 'Nome do Aluno:', bold: true, border: [true, true, false, true] },
        { text: 'Matrícula:       ', bold: true, border: [false, true, false, true] },
        { text: 'Data: ___/___/___', bold: true, border: [false, true, true, true] }
      ],
      [
        { text: `Professor: ${pdfProfessor}`, bold: true, border: [true, true, false, true] },
        { text: `Disciplina: ${pdfDisciplina}`, bold: true, border: [false, true, false, true] },
        { text: `Curso: ${pdfCurso}`, bold: true, border: [false, true, true, true] },
      ]
    ]
  },
  margin: [0, 0, 0, 20]
},
        
        // Instruções Gerais
       // {
        //  text: `Instruções: Prova de ${pdfDisciplina} elaborada por ${pdfProfessor}. Contém ${selectedQuestions.length} questões.`,
        //  fontSize: 10,
       //   italics: true,
       //   margin: [0, 0, 0, 20]
      //  },

        // Questões
        contentQuestions
      ],

      // Rodapé com paginação
      footer: (currentPage: number, pageCount: number) => {
        return {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: 'center',
          fontSize: 9,
          margin: [0, 20, 0, 0]
        };
      },

      // Estilos Globais
      styles: {
        headerUniv: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 2]
        },
        headerInfo: {
          fontSize: 10,
          alignment: 'left',
          margin: [5, 1, 0, 1]
        },
        headerTitle: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          decoration: 'underline'
        },
        questionHeader: {
          fontSize: 12,
          bold: true,
          color: '#333'
        },
        questionBody: {
          fontSize: 12,
          alignment: 'justify'
        }
      }
    };

    // Gerar e abrir o PDF
    pdfMake.createPdf(docDefinition).open();
  };

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)] overflow-hidden pb-2">
      
      {/* COLUNA ESQUERDA (LISTA DE QUESTÕES) */}
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

      {/* COLUNA DIREITA (CONFIGURAÇÃO DA PROVA) */}
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
                    {/* Professor: Pode ser preenchido ou sobrescrito pelo filtro */}
                    <input 
                        value={professor} 
                        onChange={(e) => setProfessor(e.target.value)} 
                        placeholder="Professor (Opcional se filtrar)" 
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <input value={curso} onChange={e => setCurso(e.target.value)} placeholder="Curso" className="p-2 border rounded-md text-sm" />
                   {/* Disciplina: Pode ser preenchido ou sobrescrito pelo filtro */}
                   <input value={disciplinaNome} onChange={e => setDisciplinaNome(e.target.value)} placeholder="Disciplina (Opcional se filtrar)" className="p-2 border rounded-md text-sm" />
                </div>
                
                <button 
                    onClick={handleGenerate}
                    disabled={selectedQuestions.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <FileText size={18} />
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