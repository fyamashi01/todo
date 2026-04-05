import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '../App'

beforeEach(() => {
  localStorage.clear()
})

describe('App', () => {
  it('タイトルに "TODO ver.2" が表示される', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('TODO ver.2')
  })

  it('タイトルに今日の日付が表示される', () => {
    render(<App />)
    const d = new Date()
    const expected = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(expected)
  })

  it('初期表示は空のリスト', () => {
    render(<App />)
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })

  it('タスクを追加できる', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: '新しいタスク' })
    await userEvent.type(input, '買い物')
    await userEvent.click(screen.getByRole('button', { name: /＋/ }))
    expect(screen.getByText('買い物')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('空文字ではタスクを追加できない', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /＋/ }))
    expect(screen.queryAllByTestId('todo-item')).toHaveLength(0)
  })

  it('タスクを完了にするとスタッツが更新される', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: '新しいタスク' })
    await userEvent.type(input, 'タスク1{Enter}')
    await userEvent.type(input, 'タスク2{Enter}')
    expect(screen.getByText('2 件未完了 / 全 2 件')).toBeInTheDocument()
    const items = screen.getAllByTestId('todo-item')
    await userEvent.click(within(items[0]).getByRole('button', { name: '完了切替' }))
    expect(screen.getByText('1 件未完了 / 全 2 件')).toBeInTheDocument()
  })

  it('タスクを削除できる', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: '新しいタスク' })
    await userEvent.type(input, '削除するタスク{Enter}')
    expect(screen.getByText('削除するタスク')).toBeInTheDocument()
    const item = screen.getByTestId('todo-item')
    await userEvent.click(within(item).getByRole('button', { name: '削除' }))
    expect(screen.queryByText('削除するタスク')).not.toBeInTheDocument()
  })

  it('フィルター「未完了」で完了済みが非表示になる', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: '新しいタスク' })
    await userEvent.type(input, '未完了タスク{Enter}')
    await userEvent.type(input, '完了タスク{Enter}')
    const items = screen.getAllByTestId('todo-item')
    await userEvent.click(within(items[0]).getByRole('button', { name: '完了切替' }))
    await userEvent.click(screen.getByText('未完了'))
    expect(screen.queryByText('完了タスク')).not.toBeInTheDocument()
    expect(screen.getByText('未完了タスク')).toBeInTheDocument()
  })

  it('フィルター「完了済み」で未完了が非表示になる', async () => {
    render(<App />)
    const input = screen.getByRole('textbox', { name: '新しいタスク' })
    await userEvent.type(input, '未完了タスク{Enter}')
    await userEvent.type(input, '完了タスク{Enter}')
    const items = screen.getAllByTestId('todo-item')
    await userEvent.click(within(items[0]).getByRole('button', { name: '完了切替' }))
    await userEvent.click(screen.getByText('完了済み'))
    expect(screen.getByText('完了タスク')).toBeInTheDocument()
    expect(screen.queryByText('未完了タスク')).not.toBeInTheDocument()
  })
})
