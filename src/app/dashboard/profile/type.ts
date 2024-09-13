import { MouseEvent } from 'react';
import { ModeType } from '@/hooks/store';
import { FormType } from './hooks';

export type ButtonClickHandler = (
  mode: ModeType,
  formType: FormType,
  id?: number
) => (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;

export const degrees = ['High School', 'Bachelor', 'Master', 'PhD'] as const;

export type DegreeType = (typeof degrees)[number];

export const degreeOrder: Record<DegreeType, number> = {
  'High School': 1,
  Bachelor: 2,
  Master: 3,
  PhD: 4,
} as const;

export const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
] as const;

export type EmploymentType = (typeof employmentTypes)[number];
