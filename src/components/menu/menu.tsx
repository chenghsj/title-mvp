'use client';

import { FaEllipsis } from 'react-icons/fa6';
import { LuLogOut } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLogout } from '@/hooks/use-log-out';
import { cn } from '@/lib/utils';
import { CollapseMenuButton } from './collapse-menu-button';
import { useLocalMenuListByType, useMenu } from './hooks';
import { MenuProps } from './types';

export function Menu({ type }: MenuProps) {
  const tNavbarButtons = useTranslations('navbar.buttons');
  const menuList = useLocalMenuListByType(type);
  const { handleLogout } = useLogout();
  const { isOpen, setIsOpen } = useMenu(type);

  const handleItemClick = () => {
    if (type === 'nav') {
      setIsOpen();
    }
  };

  return (
    <ScrollArea className='h-full [&>div>div[style]]:!block [&>div>div[style]]:!h-full'>
      <nav className='h-full w-full'>
        <ul
          className={cn(
            'flex h-full flex-col items-start space-y-1 px-2',
            type === 'nav' ? 'pt-5' : 'pt-9'
          )}
        >
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className='max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground'>
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className='w-full'>
                      <div className='flex w-full items-center justify-center'>
                        <FaEllipsis className='h-5 w-5' />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <></>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <div className='w-full' key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? 'secondary' : 'ghost'}
                              className={cn(
                                'mb-1 h-10 w-full justify-start px-3'
                              )}
                              asChild
                              onClick={handleItemClick}
                            >
                              <Link href={href}>
                                {Icon && (
                                  <span
                                    className={cn(
                                      isOpen === false ? '' : 'mr-4'
                                    )}
                                  >
                                    <Icon size={18} />
                                  </span>
                                )}
                                <p
                                  className={cn(
                                    'max-w-[200px] truncate',
                                    isOpen === false
                                      ? '-translate-x-96 opacity-0'
                                      : 'translate-x-0 opacity-100'
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side='right'>
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className='w-full' key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        type={type}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          {type === 'dashboard' && (
            <li className='flex w-full grow items-end'>
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleLogout}
                      variant='outline'
                      className='mt-5 h-10 w-full justify-center'
                    >
                      <span className={cn(isOpen === false ? '' : 'mr-4')}>
                        <LuLogOut size={18} />
                      </span>
                      <p
                        className={cn(
                          'whitespace-nowrap',
                          isOpen === false ? 'hidden opacity-0' : 'opacity-100'
                        )}
                      >
                        {tNavbarButtons('sign-out')}
                      </p>
                    </Button>
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent side='right'>
                      {tNavbarButtons('sign-out')}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          )}
        </ul>
      </nav>
    </ScrollArea>
  );
}
