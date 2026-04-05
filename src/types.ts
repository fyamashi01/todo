export type FilterType = 'all' | 'active' | 'done'

export interface Todo {
  id: number
  text: string
  done: boolean
  createdAt: number
}
