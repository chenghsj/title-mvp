'use client';

import { FaCamera } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { useTranslations } from 'next-intl';
import { Trash, Upload } from 'lucide-react';
import { AvatarWithNextImage } from '@/components/avatar-with-next-image';
import { ResponsiveDropdownMenu } from '@/components/responsive-dropdown-menu';
import { AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Profile } from '@/db/schema';
import { cn } from '@/lib/utils';
import { useCreateHandleMenuButtonClick } from './hooks';

type Props = {
  profile: Profile;
  avatarUrl: string | null;
  canEdit?: boolean;
};

export const AvatarWithMenu = ({
  profile,
  avatarUrl,
  canEdit = true,
}: Props) => {
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();
  const tProfileImageButtons = useTranslations('profile.image.buttons');

  const trigger = (
    <div>
      <AvatarWithNextImage
        avatarUrl={avatarUrl || profile?.image}
        avatarProps={{
          className: cn(
            'ring-3 box-content cursor-pointer border-4 border-white bg-zinc-500 dark:border-zinc-900',
            'h-28 w-28'
          ),
        }}
        avatarFallback={
          <AvatarFallback className='bg-zinc-500'>
            <IoPersonSharp className='h-full w-full translate-y-3 text-zinc-400' />
            <FaCamera className='absolute text-white' size={30} />
          </AvatarFallback>
        }
      />
    </div>
  );

  const dropdownMenuContent = (
    <DropdownMenuContent
      className='flex w-fit min-w-0 rounded-full p-1'
      side='right'
      align='end'
    >
      <DropdownMenuItem
        className='rounded-full'
        onClick={handleMenuButtonClick('Edit', 'Avatar')}
      >
        <Upload size={18} />
      </DropdownMenuItem>
      <DropdownMenuItem
        className='rounded-full'
        onClick={handleMenuButtonClick('Delete', 'Avatar')}
        disabled={!avatarUrl}
      >
        <Trash size={18} />
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return canEdit ? (
    <ResponsiveDropdownMenu
      trigger={trigger}
      editButton={{
        text: tProfileImageButtons('upload'),
      }}
      deleteButton={{
        text: tProfileImageButtons('remove'),
        buttonProps: {
          disabled: !avatarUrl,
        },
      }}
      handleEditClick={handleMenuButtonClick('Edit', 'Avatar')}
      handleDeleteClick={handleMenuButtonClick('Delete', 'Avatar')}
      renderDropdownMenuContent={dropdownMenuContent}
    />
  ) : (
    <>{trigger}</>
  );
};
