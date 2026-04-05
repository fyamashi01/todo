import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { TodoItem } from './components/TodoItem'
import { FilterTabs } from './components/FilterTabs'
import type { FilterType } from './types'

const TODAY = (() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
})()

const EMPTY_MSGS: Record<FilterType, [string, string]> = {
  all:    ['📋', 'タスクがありません'],
  active: ['✅', '未完了のタスクはありません'],
  done:   ['🌟', '完了済みタスクはありません'],
}

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearDone } = useTodos()
  const [filter, setFilter] = useState<FilterType>('all')
  const [input, setInput] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    addTodo(text)
    setInput('')
  }

  const visible = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  )
  const doneCount = todos.filter(t => t.done).length
  const activeCount = todos.length - doneCount

  return (
    <div className="app">
      <h1>
        TODO ver.2 <span className="title-date">{TODAY}</span>
      </h1>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="新しいタスクを入力..."
          autoComplete="off"
          aria-label="新しいタスク"
        />
        <button type="submit">＋</button>
      </form>

      <FilterTabs current={filter} onChange={setFilter} />

      {todos.length > 0 && (
        <p className="stats">{activeCount} 件未完了 / 全 {todos.length} 件</p>
      )}

      <div className="todo-list">
        {visible.length === 0 ? (
          <div className="empty">
            <span>{EMPTY_MSGS[filter][0]}</span>
            {EMPTY_MSGS[filter][1]}
          </div>
        ) : (
          visible.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>

      {doneCount > 0 && (
        <button
          className="clear-btn"
          onClick={() => {
            if (confirm('完了済みのタスクをすべて削除しますか？')) clearDone()
          }}
        >
          完了済みを削除
        </button>
      )}
    </div>
  )
}
