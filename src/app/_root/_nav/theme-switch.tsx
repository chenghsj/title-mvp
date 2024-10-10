'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type ThemeList = {
  value: string;
  icon: JSX.Element;
};

export function ThemeSwitch() {
  const tNavbarButtons = useTranslations('navbar.theme');
  const { theme, setTheme } = useTheme();

  const themeList: ThemeList[] = [
    {
      value: 'light',
      icon: <Sun size={18} className='mr-2' />,
    },
    {
      value: 'dark',
      icon: <Moon size={18} className='mr-2' />,
    },
    {
      value: 'system',
      icon: <Monitor size={18} className='mr-2' />,
    },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {themeList.map(({ value, icon }, index) => (
          <DropdownMenuItem key={index} onClick={() => setTheme(value)}>
            <Check
              size={18}
              className={cn(
                'mr-2',
                value === theme ? 'opacity-100' : 'opacity-0'
              )}
            />
            {icon}
            {tNavbarButtons(value as keyof IntlMessages['navbar']['theme'])}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
