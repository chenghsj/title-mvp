'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Ellipsis, Trash, Upload } from 'lucide-react';
import { ResponsiveDropdownMenu } from '@/components/responsive-dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateHandleMenuButtonClick } from './hooks';

type Props = {
  coverUrl: string | null;
  canEdit?: boolean;
};

export const CoverSection = ({ coverUrl, canEdit = true }: Props) => {
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();
  const tProfileImageButtons = useTranslations('profile.image.buttons');

  const handleEditClick = handleMenuButtonClick('Edit', 'Cover');
  const handleDeleteClick = handleMenuButtonClick('Delete', 'Cover');

  const dropdownMenuContent = (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={handleEditClick}>
        <Upload size={18} className='mr-2 h-4 w-4' />
        {tProfileImageButtons('upload')}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleDeleteClick} disabled={!coverUrl}>
        <Trash size={18} className='mr-2 h-4 w-4' />
        {tProfileImageButtons('remove')}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div className='relative'>
      <div className='aspect-[16/6] w-full sm:aspect-[16/5]'>
        {coverUrl ? (
          <Image
            className='h-full w-full rounded-md object-contain'
            src={coverUrl}
            fill
            alt='profile cover image'
          />
        ) : (
          <Skeleton className='h-full w-full rounded-md' />
        )}
      </div>
      {canEdit && (
        <ResponsiveDropdownMenu
          trigger={
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-5 top-5 ml-2 h-7 w-7'
            >
              <Ellipsis size={20} />
            </Button>
          }
          editButton={{
            text: tProfileImageButtons('upload'),
          }}
          deleteButton={{
            text: tProfileImageButtons('remove'),
            buttonProps: {
              disabled: !coverUrl,
            },
          }}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          renderDropdownMenuContent={dropdownMenuContent}
        />
      )}
    </div>
  );
};
