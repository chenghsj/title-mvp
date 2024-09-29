import React from 'react';
import { Ellipsis, Plus } from 'lucide-react';
import { ResponsiveDropdownMenu } from '@/components/responsive-dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormType, useCreateHandleMenuButtonClick } from './hooks';

type ProfileSectionProps<T> = {
  title: string | React.ReactNode;
  items: T[];
  formType: FormType;
  renderItem: (item: T) => React.ReactNode;
};

export const ProfileSectionCard = <
  T extends { id: number; startDate: string | null; endDate?: string | null },
>({
  title,
  items,
  formType,
  renderItem,
}: ProfileSectionProps<T>) => {
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();

  return (
    <Card className='flex flex-col gap-3 p-4'>
      <div className='flex w-full items-center justify-between text-base font-bold'>
        {title}
        <Button
          variant={'ghost'}
          size={'icon'}
          className='h-7 w-7'
          onClick={handleMenuButtonClick('Add', formType)}
        >
          <Plus size={20} />
        </Button>
      </div>
      <div className='flex flex-col gap-8'>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className='flex justify-between'>
              {renderItem(item)}
              <ResponsiveDropdownMenu
                trigger={
                  <Button variant='ghost' size='icon' className='h-7 w-7'>
                    <Ellipsis size={20} />
                  </Button>
                }
                handleEditClick={handleMenuButtonClick(
                  'Edit',
                  formType,
                  item.id
                )}
                handleDeleteClick={handleMenuButtonClick(
                  'Delete',
                  formType,
                  item.id
                )}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};
