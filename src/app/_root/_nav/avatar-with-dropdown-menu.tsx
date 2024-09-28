'use client';

import React from 'react';
import { IoPersonSharp } from 'react-icons/io5';
import { LuLogOut } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { AvatarWithNextImage } from '@/components/avatar-with-next-image';
import { useLocalMenuListByType } from '@/components/menu/hooks';
import { AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Profile } from '@/db/schema';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { useLogout } from '@/hooks/use-log-out';
import { cn } from '@/lib/utils';

type Props = {
  profile?: Profile;
  avatarUrl: string | null;
};

export function AvatarWithDropdownMenu({ profile, avatarUrl }: Props) {
  const tNavbar = useTranslations('navbar');
  const menuList = useLocalMenuListByType('dashboard');
  const { isMobile } = useDeviceDetect();
  const { isPending, handleLogout } = useLogout();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='flex items-center'>
        <AvatarWithNextImage
          avatarUrl={avatarUrl || profile?.image}
          avatarProps={{
            className: cn(isMobile ? 'h-8 w-8' : 'h-10 w-10'),
          }}
          avatarFallback={
            <AvatarFallback className='bg-zinc-500'>
              <IoPersonSharp className='h-full w-full translate-y-1 text-zinc-400' />
            </AvatarFallback>
          }
        />
        <ChevronDown className='ml-2 h-4 w-4 lg:hidden' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40 break-words' align='end'>
        <DropdownMenuLabel>{profile?.displayName}</DropdownMenuLabel>
        {menuList.map(({ groupLabel, menus }, index) => (
          <React.Fragment key={index}>
            <DropdownMenuSeparator />
            {groupLabel && <DropdownMenuLabel>{groupLabel}</DropdownMenuLabel>}
            <DropdownMenuGroup>
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) => (
                  <React.Fragment key={index}>
                    {submenus.length === 0 ? (
                      <DropdownMenuItem asChild>
                        <Link href={href}>
                          {Icon && (
                            <span className='mr-2 h-4 w-4'>
                              <Icon size={16} />
                            </span>
                          )}
                          <span>{label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          {Icon && (
                            <span className='mr-2 h-4 w-4'>
                              <Icon size={16} />
                            </span>
                          )}
                          <span>{label}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {submenus.map(({ href, label, active }, index) => (
                              <DropdownMenuItem asChild key={index}>
                                <Link href={href}>
                                  <span>{label}</span>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    )}
                  </React.Fragment>
                )
              )}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LuLogOut className='mr-2 h-4 w-4' />
          {tNavbar('buttons.sign-out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
