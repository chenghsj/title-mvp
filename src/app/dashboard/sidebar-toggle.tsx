import { LuChevronLeft } from 'react-icons/lu';
import { useDashboardMenu } from '@/components/menu/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {}

export function SidebarToggle({}: SidebarToggleProps) {
  const { isOpen, setIsOpen } = useDashboardMenu();

  return (
    <div
      className={cn(
        'invisible absolute z-20 flex w-full justify-center px-2 lg:visible'
      )}
    >
      <Button
        onClick={setIsOpen}
        className='h-10 w-full rounded-md'
        variant='ghost'
        size='icon'
      >
        <LuChevronLeft
          className={cn(
            'h-4 w-4 transition-transform duration-300 ease-in-out',
            isOpen === false ? 'rotate-180' : 'rotate-0'
          )}
        />
      </Button>
    </div>
  );
}
