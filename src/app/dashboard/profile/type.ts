import { MouseEvent } from 'react';
import { ModeType } from '@/hooks/store';
import { FormType } from './hooks';

export type ButtonClickHandler = (
  mode: ModeType,
  formType: FormType,
  id?: number
) => (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;

export type DegreeType = 'High School' | 'Bachelor' | 'Master' | 'PhD';
export const degrees: DegreeType[] = [
  'High School',
  'Bachelor',
  'Master',
  'PhD',
];
export const degreeOrder: Record<DegreeType, number> = {
  'High School': 1,
  Bachelor: 2,
  Master: 3,
  PhD: 4,
} as const;
