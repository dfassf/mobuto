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
    label: '지금 하기',
    action: 'DO',
    description: '긴급하고 중요한 일',
    colorClass: 'text-red-500',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-200',
  },
  2: {
    id: 2,
    label: '일정 잡기',
    action: 'SCHEDULE',
    description: '중요하지만 긴급하지 않은 일',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
  },
  3: {
    id: 3,
    label: '맡기기',
    action: 'DELEGATE',
    description: '긴급하지만 중요하지 않은 일',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  4: {
    id: 4,
    label: '버리기',
    action: 'DELETE',
    description: '긴급하지도 중요하지도 않은 일',
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
