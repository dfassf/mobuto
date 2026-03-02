import type { Quadrant } from '../models/todo'

export interface QuadrantInfo {
  id: Quadrant
  label: string
  action: string
  description: string
  colorClass: string
  bgClass: string
  borderClass: string
}

export const QUADRANT_MAP: Record<Quadrant, QuadrantInfo> = {
  1: {
    id: 1,
    label: '지금 바로!',
    action: '긴급하고 중요해요',
    description: '미루면 안 되는 일을 여기에',
    colorClass: 'text-red-500',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
  },
  2: {
    id: 2,
    label: '계획 세우기',
    action: '중요하지만 급하진 않아요',
    description: '언제 할지 정해두면 좋은 일',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
  },
  3: {
    id: 3,
    label: '간단히 처리',
    action: '급하지만 중요하진 않아요',
    description: '빨리 끝내거나 누군가에게 부탁할 일',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  4: {
    id: 4,
    label: '나중에',
    action: '급하지도 중요하지도 않아요',
    description: '안 해도 괜찮은 일',
    colorClass: 'text-slate-400',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
  },
}

export function resolveQuadrant(isUrgent: boolean, isImportant: boolean): Quadrant {
  if (isUrgent && isImportant) return 1
  if (!isUrgent && isImportant) return 2
  if (isUrgent && !isImportant) return 3
  return 4
}
