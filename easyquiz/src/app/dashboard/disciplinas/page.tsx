'use client';

import { useState } from 'react';
import { Book, Plus, Edit, Trash2, Save, X } from 'lucide-react';

// Mock de dados inicial
const initialDisciplinas = [
  { id: '1', nome: 'Cálculo 1' },
  { id: '2', nome: 'Engenharia de Software' },
  { id: '3', nome: 'Banco de Dados' },
  { id: '4', nome: 'Redes de Computadores' },
];

type Disciplina = {
  id: string;
  nome: string;
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(initialDisciplinas);
  const [newDisciplinaName, setNewDisciplinaName] = useState('');
  
  // Estados para controlar a edição inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleAddDisciplina = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisciplinaName.trim()) {
      setError('O nome da disciplina não pode ser vazio.');
      return;
    }
    if (disciplinas.some(d => d.nome.toLowerCase() === newDisciplinaName.trim().toLowerCase())) {
      setError('Esta disciplina já existe.');
      return;
    }

    const newDisciplina: Disciplina = {
      id: Date.now().toString(), // Usando timestamp como ID para o mock
      nome: newDisciplinaName.trim(),
    };

    setDisciplinas([newDisciplina, ...disciplinas]);
    setNewDisciplinaName('');
    setError(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      setDisciplinas(disciplinas.filter(d => d.id !== id));
    }
  };

  const handleStartEditing = (disciplina: Disciplina) => {
    setEditingId(disciplina.id);
    setEditingName(disciplina.nome);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEditing = () => {
    if (!editingName.trim()) {
      alert('O nome não pode ser vazio.');
      return;
    }
    setDisciplinas(
      disciplinas.map(d => (d.id === editingId ? { ...d, nome: editingName.trim() } : d))
    );
    handleCancelEditing();
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Disciplinas</h1>

      {/* Formulário para adicionar nova disciplina */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Nova Disciplina</h2>
        <form onSubmit={handleAddDisciplina} className="flex items-start gap-4">
          <div className="flex-grow">
            <label htmlFor="disciplina-name" className="sr-only">
              Nome da Disciplina
            </label>
            <input
              id="disciplina-name"
              type="text"
              value={newDisciplinaName}
              onChange={(e) => {
                setNewDisciplinaName(e.target.value);
                setError(null);
              }}
              className="w-full p-2 border rounded-md"
              placeholder="Ex: Programação Orientada a Objetos"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Cadastrar
          </button>
        </form>
      </div>

      {/* Lista de disciplinas cadastradas */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold pb-4 border-b mb-4">Disciplinas Cadastradas</h2>
        <div className="space-y-3">
          {disciplinas.length === 0 ? (
            <p className="text-gray-500">Nenhuma disciplina cadastrada ainda.</p>
          ) : (
            disciplinas.map(disciplina => (
              <div
                key={disciplina.id}
                className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
              >
                {editingId === disciplina.id ? (
                  // --- MODO DE EDIÇÃO ---
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-grow p-1 border rounded-md mr-4"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEditing}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                        title="Salvar"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
                        title="Cancelar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  // --- MODO DE VISUALIZAÇÃO ---
                  <>
                    <div className="flex items-center gap-3">
                      <Book size={18} className="text-gray-600" />
                      <span className="font-medium">{disciplina.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEditing(disciplina)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(disciplina.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}