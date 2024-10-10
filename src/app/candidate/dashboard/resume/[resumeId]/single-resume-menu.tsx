'use client';

import React from 'react';
import { Ellipsis } from 'lucide-react';
import { ResponsiveDropdownMenu } from '@/components/responsive-dropdown-menu';
import { Button } from '@/components/ui/button';
import { Resume } from '@/db/schema/candidate';
import { useCreateHandleMenuButtonClick } from '../hooks';

type Props = {
  resume: Resume;
};

export const SingleResumeMenu = ({ resume }: Props) => {
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();

  return (
    <ResponsiveDropdownMenu
      trigger={
        <Button variant={'ghost'} size={'icon'} className='h-7 w-7'>
          <Ellipsis size={16} />
        </Button>
      }
      handleEditClick={handleMenuButtonClick('Edit', resume.id)}
      handleDeleteClick={handleMenuButtonClick(
        'Delete',
        resume.id,
        resume.title
      )}
    />
  );
};
