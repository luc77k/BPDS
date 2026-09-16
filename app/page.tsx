'use client';

import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletedTodos, setDeletedTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showTrash, setShowTrash] = useState(false);

  // CREATE: escribir + Enter (sin boton)
  function handleAddTodo(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && newTodoText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    }
  }

  // UPDATE (tachar): click en el chulito, NO borra
  function toggleComplete(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  // UPDATE (editar): autoguardado al salir del campo
  function saveEdit(id: number) {
    if (editingText.trim() !== '') {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editingText.trim() } : todo
        )
      );
    }
    setEditingId(null);
    setEditingText('');
  }

  // DELETE: ahora primero pasa a la papelera, luego se quita de la lista activa
  function deleteTodo(id: number) {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (todoToDelete) {
      setDeletedTodos([...deletedTodos, todoToDelete]);
    }
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // Vaciar la papelera por completo (opcional, buena practica de UX)
  function emptyTrash() {
    setDeletedTodos([]);
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-slate-800">
            Mis tareas
          </h1>
          <button
            onClick={() => setShowTrash(!showTrash)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            🗑 Papelera
            {deletedTodos.length > 0 && (
              <span className="bg-slate-200 text-slate-700 rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                {deletedTodos.length}
              </span>
            )}
          </button>
        </div>

        {!showTrash ? (
          <>
            {/* CREATE */}
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={handleAddTodo}
              placeholder="Escribe una tarea y presiona Enter..."
              className="w-full border border-dashed border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 mb-4"
            />

            {/* READ */}
            <ul className="flex flex-col gap-2">
              {todos.length === 0 && (
                <li className="text-sm text-slate-400 text-center py-6">
                  No hay tareas todavia. Escribe una arriba.
                </li>
              )}

              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="group flex items-center gap-3 border border-slate-100 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 text-transparent'
                    }`}
                    aria-label="Marcar como completada"
                  >
                    ✓
                  </button>

                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      autoFocus
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                      }}
                      className="flex-1 text-sm border border-emerald-300 rounded px-2 py-1 focus:outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => startEditing(todo)}
                      className={`flex-1 text-sm cursor-text select-none ${
                        todo.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-700'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                    aria-label="Eliminar tarea"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            {/* PAPELERA: tareas eliminadas */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">
                Tareas eliminadas ({deletedTodos.length})
              </p>
              {deletedTodos.length > 0 && (
                <button
                  onClick={emptyTrash}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Vaciar papelera
                </button>
              )}
            </div>

            <ul className="flex flex-col gap-2">
              {deletedTodos.length === 0 && (
                <li className="text-sm text-slate-400 text-center py-6">
                  La papelera esta vacia.
                </li>
              )}

              {deletedTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 border border-slate-100 rounded-lg px-3 py-2.5 bg-slate-50"
                >
                  <span className="flex-1 text-sm text-slate-400 line-through">
                    {todo.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowTrash(false)}
              className="mt-4 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              ← Volver a mis tareas
            </button>
          </>
        )}
      </div>
    </main>
  );
}