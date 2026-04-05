import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { FilterTabs } from '../components/FilterTabs'

describe('FilterTabs', () => {
  it('3つのタブが表示される', () => {
    render(<FilterTabs current="all" onChange={vi.fn()} />)
    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('未完了')).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('current に対応するボタンが active クラスを持つ', () => {
    render(<FilterTabs current="active" onChange={vi.fn()} />)
    expect(screen.getByText('未完了')).toHaveClass('active')
    expect(screen.getByText('すべて')).not.toHaveClass('active')
  })

  it('タブをクリックすると onChange が呼ばれる', async () => {
    const onChange = vi.fn()
    render(<FilterTabs current="all" onChange={onChange} />)
    await userEvent.click(screen.getByText('完了済み'))
    expect(onChange).toHaveBeenCalledWith('done')
  })
})
