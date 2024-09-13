import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormType } from './hooks';
import { ProfileDropdownMenu } from './profile-dropdown-menu';
import { useCreateHandleMenuButtonClick } from './utils';

type ProfileSectionProps<T> = {
  title: string | React.ReactNode;
  items: T[];
  formType: FormType;
  renderItem: (item: T) => React.ReactNode;
};

export const ProfileSection = <
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
            <div key={item.id} className='flex justify-between'>
              {renderItem(item)}
              <ProfileDropdownMenu formType={formType} id={item.id} />
            </div>
            {/* {items.length - 1 !== index && <Separator />} */}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};
