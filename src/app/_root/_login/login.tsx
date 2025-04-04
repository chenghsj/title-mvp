'use client';

import { MouseEventHandler, useEffect, useState } from 'react';
import { FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { AnimatedHeight } from '@/components/animated-height';
import { useLoadingMask } from '@/components/loading-mask';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { googleOAuthAction } from './actions';
import { useGetRole } from './hooks';
import { InputOTPDialog } from './input-otp-dialog';
import LoginForm from './login-form';
import { RoleSwitch } from './role-switch';

type Props = {};

export function LoginPage({}: Props) {
  const tLogin = useTranslations('login');
  const [isMail, setIsMail] = useState(false);
  // This code adjusts alignment for mobile orientation but causes a scroll issue specific to iOS Safari
  // const { ref: isOverflowRef, overflow } = useOverflowDetector({});
  const { isMobile } = useDeviceDetect();
  const { role } = useGetRole();
  const pathname = usePathname();
  const isSignUp = pathname === '/sign-up';
  const { toast } = useToast();
  const { setIsLoading } = useLoadingMask();

  const { execute } = useServerAction(googleOAuthAction, {
    onSuccess: ({ data }) => {
      window.location.href = data.url;
    },
    onError: ({ err }) => {
      console.error(err);
      setIsLoading(false);
      toast({
        title: err.code,
        description: err.message,
      });
    },
  });

  const handleBackArrowClick = () => {
    setIsMail(false);
  };

  const handleOAuthClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    // router.refresh();
    // router.push(`/api/login/${e.currentTarget.name}?role=${role}`);

    // using server action to show the loading mask
    execute({ role });
    setIsLoading(true);
  };

  useEffect(() => {
    handleBackArrowClick();
  }, [pathname]);

  return (
    <div
      // ref={isOverflowRef as RefObject<HTMLDivElement>}
      className={cn(
        'flex h-full w-full items-center justify-center font-roboto'
        // overflow ? 'items-start' : 'items-center'
      )}
    >
      <AnimatedHeight className='w-4/5 min-w-80 max-w-md ease-out md:w-full'>
        <Card className={cn('p-5 sm:p-7')}>
          <CardContent className='flex flex-col items-start gap-5 p-3 sm:gap-7 sm:p-6'>
            <CardTitle className='grid gap-2'>
              <p className='text-2xl font-medium sm:text-3xl'>
                {tLogin(isSignUp ? 'signUp' : 'signIn')}
              </p>
              <p className='text-sm font-normal'>{tLogin('description')}</p>
            </CardTitle>
            <RoleSwitch />
            <div className='w-full'>
              <div className='flex gap-x-2'>
                {isMail && (
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    onClick={handleBackArrowClick}
                    className={cn(isMobile && 'h-9')}
                  >
                    <ChevronLeft size={18} />
                  </Button>
                )}
                <Button
                  variant={'outline'}
                  className={cn('w-full flex-1', isMobile && 'h-9')}
                  onClick={() => setIsMail(true)}
                  disabled={isMail}
                >
                  <FaRegEnvelope className='mr-2 h-4 w-4' />
                  {tLogin('withEmail')}
                </Button>
              </div>

              <AnimatedHeight
                className={cn(
                  'w-full ease-linear',
                  isMail ? 'mt-5 transition-none' : 'mt-0'
                )}
              >
                <div className={isMail ? 'h-fit p-1' : 'h-0'}>
                  <LoginForm isMail={isMail} isSignUp={isSignUp} />
                </div>
              </AnimatedHeight>
            </div>

            {!isMail && (
              <Button
                variant='outline'
                className={cn('w-full', isMobile && 'h-9')}
                name='google'
                onClick={handleOAuthClick}
              >
                <FaGoogle className='mr-2 h-4 w-4' />
                {tLogin('withGoogle')}
              </Button>
            )}
          </CardContent>
        </Card>
      </AnimatedHeight>
      <InputOTPDialog />
    </div>
  );
}
