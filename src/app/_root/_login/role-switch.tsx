'use client';

import { startCase } from 'lodash';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { RoleTypeEnum } from '@/app/_root/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePushQuery } from '@/hooks/use-push-query';
import { cn } from '@/lib/utils';

type Props = {};

export function RoleSwitch({}: Props) {
  const [role, setRole] = useQueryState(
    'role',
    parseAsStringLiteral(RoleTypeEnum).withDefault('candidate')
  );

  usePushQuery([{ name: 'role', value: role }]);

  return (
    <Tabs defaultValue={role} className='w-full'>
      <TabsList
        className={cn(
          'relative flex w-full !bg-transparent',
          'after:absolute after:left-0 after:block after:w-full after:rounded-full after:border',
          'after:h-10 md:after:h-11',
          'after:border-zinc-800 after:dark:border-zinc-300'
        )}
      >
        {RoleTypeEnum.map((role, i) => (
          <TabsTrigger
            key={i}
            className={cn(
              'z-10 w-1/2 rounded-full ring-offset-0',
              'dark:h-7 dark:scale-x-[98%] md:h-9 md:dark:h-8',
              'data-[state=active]:bg-zinc-800 data-[state=active]:dark:bg-white',
              'data-[state=active]:text-white data-[state=active]:dark:text-zinc-900 data-[state=inactive]:dark:text-zinc-500'
            )}
            value={role}
            onClick={() => setRole(role)}
          >
            {startCase(role)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export interface RoleSwitchProps
  extends React.ButtonHTMLAttributes<HTMLInputElement> {}
