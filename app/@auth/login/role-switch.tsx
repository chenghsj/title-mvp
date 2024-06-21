'use client';

import React from 'react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { Role, userRoles } from '@/components/types';
import { cn } from '@/lib/utils';

export const initialRole: Role = 'job_seeker';

type Props = {};

export function RoleSwitch({}: Props) {
  const [role, setRole] = useQueryState(
    'role',
    parseAsStringLiteral(userRoles)
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.checked ? 'company' : 'job_seeker');
  };

  return (
    <label className='relative block h-[52px] min-w-[414px] cursor-pointer font-roboto'>
      <input
        id='role-switch'
        type='checkbox'
        className='peer box-content h-full w-full appearance-none rounded-[30px] border border-zinc-900 bg-white outline-none transition-all'
        onChange={onInputChange}
        checked={role === 'company'}
      />
      <div
        className={cn(
          'absolute left-[5px] top-[53%] h-11 w-1/2 -translate-y-[50%] rounded-[28px] bg-zinc-900 transition-all',
          'peer-checked:left-[-5px] peer-checked:translate-x-full'
        )}
      />
      <div
        className={cn(
          'absolute top-0 flex h-full w-full select-none items-center justify-around font-bold',
          '[&>div:nth-child(1)]:text-white [&>div:nth-child(2)]:text-zinc-900',
          'peer-checked:[&>div:nth-child(1)]:text-zinc-900 peer-checked:[&>div:nth-child(2)]:text-white'
        )}
      >
        <div className='w-1/2 text-center transition-all duration-200'>
          Job Seeker
        </div>
        <div className='w-1/2 text-center transition-all duration-200'>
          Company
        </div>
      </div>
    </label>
  );
}

export interface RoleSwitchProps
  extends React.ButtonHTMLAttributes<HTMLInputElement> {}
