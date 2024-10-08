'use client';

import { MouseEvent, useEffect, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { useLoadingMask } from '@/components/loading-mask';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Locale, locales } from '@/i18n/config';
import { setUserLocale } from '@/lib/locale';

export default function LocaleSwitcher() {
  const tNavbarLanguage = useTranslations('navbar.language');
  const [isPending, startTransition] = useTransition();
  const { setLoading } = useLoadingMask();

  const onChange = (value: string) => (e: MouseEvent<HTMLDivElement>) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Globe size={18} />
          <span className='sr-only'>Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} onClick={onChange(locale)}>
            {tNavbarLanguage(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
