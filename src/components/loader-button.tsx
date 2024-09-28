import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LoaderButton({
  children,
  isLoading,
  className,
  ...props
}: ButtonProps & { isLoading: boolean }) {
  return (
    <Button
      disabled={isLoading}
      type='submit'
      {...props}
      className={cn('flex min-w-[70px] justify-center gap-2', className)}
    >
      {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
      {children}
    </Button>
  );
}
