import { Ellipsis, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormType } from './hooks';
import { ButtonClickHandler } from './type';

export const ProfileDropdownMenu = ({
  formType,
  id,
  handleMenuItemClick,
}: {
  formType: FormType;
  id?: number;
  handleMenuItemClick: ButtonClickHandler;
}) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button variant={'ghost'} size={'icon'} className='h-7 w-7'>
        <Ellipsis size={'16'} />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem
        onClick={(e) => handleMenuItemClick('Edit', formType, id)(e)}
      >
        <Pencil className='mr-2 h-4 w-4' />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={(e) => handleMenuItemClick('Delete', formType, id)(e)}
      >
        <Trash className='mr-2 h-4 w-4' />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
