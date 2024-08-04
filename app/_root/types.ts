import { HTMLAttributes } from 'react';

export type StyleAttributes<T extends HTMLElement> = Pick<
  HTMLAttributes<T>,
  'className' | 'style'
>;

export const RoleTypeEnum = ['candidate', 'company'] as const;
export type Role = (typeof RoleTypeEnum)[number];

export const initialRole: Role = 'candidate';
