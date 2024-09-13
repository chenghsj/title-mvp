import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormType } from './hooks';
import { useCreateHandleMenuButtonClick } from './utils';

export const ProfileDropdownMenu = ({
  formType,
  id,
}: {
  formType: FormType;
  id?: number;
}) => {
  const { handleMenuButtonClick } = useCreateHandleMenuButtonClick();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className='h-7 w-7'>
          <Ellipsis size={'16'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleMenuButtonClick('Edit', formType, id)}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMenuButtonClick('Delete', formType, id)}
        >
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
