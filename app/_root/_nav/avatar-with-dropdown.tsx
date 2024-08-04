'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import {
  faCat,
  faDog,
  faDove,
  faDragon,
  faFish,
  faKiwiBird,
  faOtter,
  faShrimp,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Profile } from '@/db/schema';
import { cn } from '@/lib/utils';
import { signOutAction } from './actions';

type Props = {
  profile?: Profile;
  isMobile?: boolean;
};

const avatarsFalback = [
  faCat,
  faDog,
  faDove,
  faDragon,
  faFish,
  faKiwiBird,
  faOtter,
  faShrimp,
];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatarsFalback.length);
  return avatarsFalback[randomIndex];
};

export function AvatarWithDropdown({ profile, isMobile }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(() => {
      signOutAction();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className={cn(isMobile ? 'h-8 w-8' : 'h-10 w-10')}>
          <AvatarImage src={profile?.image || ''} alt='profile image' />
          <AvatarFallback>
            <FontAwesomeIcon icon={getRandomAvatar()} size='lg' />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DropdownMenuItem
          className='flex w-full cursor-pointer items-center justify-between px-4'
          asChild
        >
          <Link href={'/dashboard'}>
            <FontAwesomeIcon icon={faTableColumns} size='lg' />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex w-full cursor-pointer items-center justify-between px-4'
          onClick={handleLogout}
        >
          <LogOut className='h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
