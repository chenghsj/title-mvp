import { useEffect } from 'react';
import { useServerAction } from 'zsa-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { verifyEmailOTPAction } from './actions';
import { useEmailOTPDialog } from './hooks';

type Props = {};

export function InputOTPDialog({}: Props) {
  const { toast } = useToast();
  const { isOpen, setIsOpen, email } = useEmailOTPDialog();

  const { execute, isPending, error, reset } = useServerAction(
    verifyEmailOTPAction,
    {
      onError: ({ err }) => {
        toast({
          title: 'Something went wrong',
          description: err.message,
          variant: 'destructive',
        });
      },
      onSuccess: () => {
        setIsOpen(false);
        toast({
          title: 'Email verified',
          description: 'Redirect to dashboard',
        });
      },
    }
  );

  const handleOTPComplete = (otp: string) => {
    execute({ email, OTP: otp });
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className='w-fit justify-start rounded-md py-8 sm:p-10'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        hideCloseButton={isPending}
      >
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter the 6-digit code sent to your email address
        </DialogDescription>
        <div
          className={cn(
            'mx-auto mt-2 sm:mt-4',
            error?.message && 'animate-shake'
          )}
        >
          <InputOTP
            maxLength={6}
            onComplete={handleOTPComplete}
            disabled={isPending}
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={
                    error?.message && 'border-red-500 text-red-500 ring-red-500'
                  }
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </DialogContent>
    </Dialog>
  );
}
