export interface Category {
  id: string
  name: string
  color: string
  createdAt: number
}

export interface CreateCategoryInput {
  name: string
  color: string
}

export const CATEGORY_COLORS = [
  { name: 'emerald', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { name: 'violet', bg: 'bg-violet-100', text: 'text-violet-700', dot: 'bg-violet-500' },
  { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  { name: 'cyan', bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  { name: 'teal', bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500' },
  { name: 'rose', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
] as const

export function getCategoryColor(colorName: string) {
  return CATEGORY_COLORS.find((c) => c.name === colorName) ?? CATEGORY_COLORS[0]
}
