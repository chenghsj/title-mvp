'use client';

import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { DashboardDetails } from '../type';
import { AvatarWithMenu } from './avatar-with-menu';
import { DisplayNameSection } from './display-name-section';

type Props = { canEdit?: boolean } & Pick<
  DashboardDetails,
  'avatarUrl' | 'profile'
>;

export const ProfileHeader = ({
  profile,
  avatarUrl,
  canEdit = true,
}: Props) => {
  const isMedium = useMediaQuery('(min-width: 640px)');

  return (
    <div className='relative flex items-center gap-4 sm:gap-6'>
      <div
        className={cn(
          'absolute top-0',
          !isMedium ? '-translate-y-[80%]' : '-translate-y-[15%]'
        )}
      >
        <AvatarWithMenu
          profile={profile}
          avatarUrl={avatarUrl}
          canEdit={canEdit}
        />
      </div>
      <div
        className={cn(
          'w-full',
          !isMedium ? 'h-16 pl-5 pt-9' : 'h-32 pl-36 pt-9'
        )}
      >
        <DisplayNameSection
          displayName={profile.displayName!}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
};
