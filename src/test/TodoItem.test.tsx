import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TodoItem } from '../components/TodoItem'
import type { Todo } from '../types'

const baseTodo: Todo = {
  id: 1,
  text: 'テストタスク',
  done: false,
  createdAt: new Date('2026-04-06T10:00:00').getTime(),
}

describe('TodoItem', () => {
  it('テキストが表示される', () => {
    render(
      <TodoItem
        todo={baseTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })

  it('完了済みのとき done クラスが付く', () => {
    render(
      <TodoItem
        todo={{ ...baseTodo, done: true }}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    expect(screen.getByTestId('todo-item')).toHaveClass('done')
  })

  it('チェックボタンをクリックすると onToggle が呼ばれる', async () => {
    const onToggle = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: '完了切替' }))
    expect(onToggle).toHaveBeenCalledWith(baseTodo.id)
  })

  it('削除ボタンをクリックすると onDelete が呼ばれる', async () => {
    const onDelete = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: '削除' }))
    expect(onDelete).toHaveBeenCalledWith(baseTodo.id)
  })

  it('ダブルクリックで編集モードになり、Enterで onEdit が呼ばれる', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={onEdit}
      />
    )
    await userEvent.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByRole('textbox', { name: 'タスクを編集' })
    await userEvent.clear(input)
    await userEvent.type(input, '更新されたタスク')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onEdit).toHaveBeenCalledWith(baseTodo.id, '更新されたタスク')
  })

  it('編集中に Escape を押すと編集がキャンセルされる', async () => {
    const onEdit = vi.fn()
    render(
      <TodoItem
        todo={baseTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={onEdit}
      />
    )
    await userEvent.dblClick(screen.getByText('テストタスク'))
    const input = screen.getByRole('textbox', { name: 'タスクを編集' })
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('テストタスク')).toBeInTheDocument()
  })
})
