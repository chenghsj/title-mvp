import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
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
import { afterLoginUrl } from '@/config/site';
import { cn } from '@/lib/utils';
import { verifyEmailOTPAction } from './actions';
import { useEmailOTPDialog } from './hooks';

type Props = {};

const useGetTranslations = () => {
  const tErrorMessages = useTranslations('errorMessages');
  const tComponentsToast = useTranslations('components.toast');
  const tLoginInputOTP = useTranslations('login.inputOTP');

  return {
    tErrorMessages,
    tComponentsToast,
    tLoginInputOTP,
  };
};

export function InputOTPDialog({}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, setIsOpen, email } = useEmailOTPDialog();
  const { tErrorMessages, tComponentsToast, tLoginInputOTP } =
    useGetTranslations();

  const { execute, isPending, error, reset } = useServerAction(
    verifyEmailOTPAction,
    {
      onError: ({ err }) => {
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      },
      onSuccess: ({ data }) => {
        setIsOpen(false);
        toast({
          title: data.message.title,
          description: data.message.description,
        });
        router.push(afterLoginUrl);
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
          <DialogTitle>{tLoginInputOTP('title')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{tLoginInputOTP('description')}</DialogDescription>
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
