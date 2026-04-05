import { useState, useRef, useEffect } from 'react'
import type { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commit() {
    const val = draft.trim()
    if (val) onEdit(todo.id, val)
    setEditing(false)
  }

  const dateStr = new Date(todo.createdAt).toLocaleDateString('ja-JP', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={`todo-item${todo.done ? ' done' : ''}`} data-testid="todo-item">
      <button
        className="check-btn"
        onClick={() => onToggle(todo.id)}
        aria-label="完了切替"
      >
        {todo.done ? '✓' : ''}
      </button>

      <div className="todo-text-wrap">
        {editing ? (
          <input
            ref={inputRef}
            className="todo-edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); commit() }
              if (e.key === 'Escape') { setDraft(todo.text); setEditing(false) }
            }}
            aria-label="タスクを編集"
          />
        ) : (
          <div
            className="todo-text"
            onDoubleClick={() => { setDraft(todo.text); setEditing(true) }}
            title="ダブルクリックで編集"
          >
            {todo.text}
          </div>
        )}
        <div className="todo-date">{dateStr}</div>
      </div>

      <button
        className="del-btn"
        onClick={() => onDelete(todo.id)}
        aria-label="削除"
      >
        ✕
      </button>
    </div>
  )
}
