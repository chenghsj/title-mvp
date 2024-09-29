import { Ellipsis } from 'lucide-react';
import { ResponsiveDropdownMenu } from '@/components/responsive-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useCreateHandleMenuButtonClick } from './hooks';

type Props = {
  displayName: string;
};

export const DisplayNameSection = ({ displayName }: Props) => {
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();
  return (
    <div className='text-md relative flex w-full items-center justify-between break-all font-bold sm:text-lg'>
      {displayName}
      <ResponsiveDropdownMenu
        trigger={
          <Button variant='ghost' size='icon' className='h-7 w-7'>
            <Ellipsis size={20} />
          </Button>
        }
        handleEditClick={handleMenuButtonClick('Edit', 'DisplayName')}
      />
    </div>
  );
};
