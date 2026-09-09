'use client';

import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

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

  // Empezar a editar: click sobre el texto del item
  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  // UPDATE (editar): autoguardado al salir del campo (onBlur), sin boton editar
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

  // DELETE: boton aparte que si elimina por completo
  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-5">
          Mis tareas
        </h1>

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
              {/* UPDATE: chulito, tacha sin borrar */}
              <button
                onClick={() => toggleComplete(todo.id)}
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 text-transparent'
                }`}
                aria-label="Marcar como completada"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* UPDATE: texto editable, autoguarda con onBlur */}
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

              {/* DELETE: elimina por completo */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                aria-label="Eliminar tarea"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.808a2.75 2.75 0 002.741-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}