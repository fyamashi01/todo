import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTodos } from '../hooks/useTodos'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useTodos', () => {
  it('初期状態はTodoが空', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toHaveLength(0)
  })

  it('addTodo: タスクを追加できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('買い物'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('買い物')
    expect(result.current.todos[0].done).toBe(false)
  })

  it('addTodo: 複数追加すると最新が先頭になる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('タスクA')
      result.current.addTodo('タスクB')
    })
    expect(result.current.todos[0].text).toBe('タスクB')
    expect(result.current.todos[1].text).toBe('タスクA')
  })

  it('toggleTodo: doneフラグを切り替えられる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('タスク'))
    const id = result.current.todos[0].id
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].done).toBe(true)
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].done).toBe(false)
  })

  it('deleteTodo: 指定したタスクを削除できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('タスクA')
      result.current.addTodo('タスクB')
    })
    const idA = result.current.todos[1].id
    act(() => result.current.deleteTodo(idA))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('タスクB')
  })

  it('editTodo: テキストを更新できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('旧テキスト'))
    const id = result.current.todos[0].id
    act(() => result.current.editTodo(id, '新テキスト'))
    expect(result.current.todos[0].text).toBe('新テキスト')
  })

  it('clearDone: 完了済みタスクをすべて削除できる', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('タスクA')
      result.current.addTodo('タスクB')
      result.current.addTodo('タスクC')
    })
    const idA = result.current.todos[2].id
    const idC = result.current.todos[0].id
    act(() => {
      result.current.toggleTodo(idA)
      result.current.toggleTodo(idC)
    })
    act(() => result.current.clearDone())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('タスクB')
  })

  it('localStorageに保存・復元できる', () => {
    const { result: r1 } = renderHook(() => useTodos())
    act(() => r1.current.addTodo('永続タスク'))
    const { result: r2 } = renderHook(() => useTodos())
    expect(r2.current.todos[0].text).toBe('永続タスク')
  })
})
