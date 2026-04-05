import type { FilterType } from '../types'

interface Props {
  current: FilterType
  onChange: (f: FilterType) => void
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'done', label: '完了済み' },
]

export function FilterTabs({ current, onChange }: Props) {
  return (
    <div className="filters">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={current === f.value ? 'active' : ''}
          onClick={() => onChange(f.value)}
          aria-pressed={current === f.value}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
