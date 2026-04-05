import { useState, useRef } from 'react'
import type { Todo } from '../types'

const STORAGE_KEY = 'todo-app-v1'

function load(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(load)
  const nextId = useRef(Date.now())

  function update(fn: (prev: Todo[]) => Todo[]) {
    setTodos(prev => {
      const next = fn(prev)
      save(next)
      return next
    })
  }

  function addTodo(text: string) {
    const id = nextId.current++
    const createdAt = Date.now()
    update(prev => [{ id, text, done: false, createdAt }, ...prev])
  }

  function toggleTodo(id: number) {
    update(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTodo(id: number) {
    update(prev => prev.filter(t => t.id !== id))
  }

  function editTodo(id: number, text: string) {
    update(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }

  function clearDone() {
    update(prev => prev.filter(t => !t.done))
  }

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearDone }
}
