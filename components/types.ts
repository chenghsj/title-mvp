import { HTMLAttributes } from 'react';

export type StyleAttributes<T extends HTMLElement> = Pick<
  HTMLAttributes<T>,
  'className' | 'style'
>;

export const userRoles = ['job_seeker', 'company'] as const;
export type Role = (typeof userRoles)[number];
