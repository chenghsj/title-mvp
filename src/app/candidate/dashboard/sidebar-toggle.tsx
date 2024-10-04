import { PanelLeft } from 'lucide-react';
import { useDashboardMenu } from '@/components/menu/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {}

export function SidebarToggle({}: SidebarToggleProps) {
  const { isOpen, setIsOpen } = useDashboardMenu();

  return (
    <div
      className={cn(
        'invisible absolute z-20 flex w-full justify-start px-2 lg:visible'
      )}
    >
      <Button
        onClick={setIsOpen}
        className='h-10 rounded-md'
        variant='ghost'
        size='icon'
      >
        <PanelLeft
          className={cn(
            'h-5 w-5 transition-transform duration-300 ease-in-out'
          )}
        />
      </Button>
    </div>
  );
}
