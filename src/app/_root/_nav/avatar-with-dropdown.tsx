'use client';

import React, { HTMLAttributes } from 'react';
import {
  FaCat,
  FaDog,
  FaDove,
  FaDragon,
  FaFish,
  FaKiwiBird,
  FaOtter,
} from 'react-icons/fa';
import { LuLogOut } from 'react-icons/lu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { getDashboardMenuList } from '@/config/menu-list';
import { Profile } from '@/db/schema';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { useLogout } from '@/hooks/use-log-out';
import { cn } from '@/lib/utils';

type Props = {
  profile?: Profile;
};

const avatarsFalback = [
  FaCat,
  FaDog,
  FaDove,
  FaDragon,
  FaFish,
  FaKiwiBird,
  FaOtter,
];

const RandomIcon = ({ ...props }: Props & HTMLAttributes<SVGAElement>) => {
  const randomIndex = Math.floor(Math.random() * avatarsFalback.length);
  const Icon = avatarsFalback[randomIndex];
  return <Icon {...props} />;
};

export function AvatarWithDropdown({ profile }: Props) {
  const pathname = usePathname();
  const menuList = getDashboardMenuList(pathname);
  const { isMobile } = useDeviceDetect();
  const { isPending, handleLogout } = useLogout();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='flex items-center'>
        <Avatar className={cn(isMobile ? 'h-8 w-8' : 'h-10 w-10')}>
          <AvatarImage src={profile?.image || ''} alt='profile image' />
          <AvatarFallback>
            <RandomIcon className='h-5 w-5' />
          </AvatarFallback>
        </Avatar>
        <ChevronDown className='ml-2 h-4 w-4 lg:hidden' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
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
                                  {Icon && (
                                    <span className='mr-2 h-4 w-4'>
                                      <Icon size={16} />
                                    </span>
                                  )}
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
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
