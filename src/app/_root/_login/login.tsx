'use client';

import { MouseEventHandler, RefObject, useEffect, useState } from 'react';
import { useOverflowDetector } from 'react-detectable-overflow';
import { FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { LuArrowLeft } from 'react-icons/lu';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedHeight } from '@/components/animated-height';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useDeviceDetect } from '@/hooks/use-device-detect';
import { cn } from '@/lib/utils';
import { useGetRole } from './hooks';
import { InputOTPDialog } from './input-otp-dialog';
import LoginForm from './login-form';
import { RoleSwitch } from './role-switch';

type Props = {};

export function LoginPage({}: Props) {
  const [isMail, setIsMail] = useState(false);
  const router = useRouter();
  const { ref: isOverflowRef, overflow } = useOverflowDetector({});
  const { isMobile } = useDeviceDetect();
  const { role } = useGetRole();

  const pathname = usePathname();
  const isSignUp = pathname === '/sign-up';
  console.log(isSignUp);
  const handleBackArrowClick = () => {
    setIsMail(false);
  };

  const handleOAuthClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    router.push(`/api/login/${e.currentTarget.name}?role=${role}`);
  };

  useEffect(() => {
    handleBackArrowClick();
  }, [pathname]);

  return (
    <div
      ref={isOverflowRef as RefObject<HTMLDivElement>}
      className={cn(
        'flex h-full w-full justify-center font-roboto',
        overflow ? 'items-start' : 'items-center'
      )}
    >
      <AnimatedHeight className='w-4/5 min-w-80 ease-out md:w-full'>
        <Card className={cn('p-5 sm:p-9')}>
          <CardContent className='flex flex-col items-start gap-5 p-3 sm:gap-7 sm:p-6'>
            <CardTitle className='grid gap-2'>
              <p className='text-2xl font-medium sm:text-3xl'>
                Sign {isSignUp ? 'up' : 'in'}
              </p>
              <p className='text-sm font-normal'>Choose your identity</p>
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
                    <LuArrowLeft strokeWidth={2.5} size={20} />
                  </Button>
                )}
                <Button
                  variant={'outline'}
                  className={cn('w-full flex-1', isMobile && 'h-9')}
                  onClick={() => setIsMail(true)}
                  disabled={isMail}
                >
                  <FaRegEnvelope className='mr-2 h-4 w-4' />
                  With Email
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
                With Google
              </Button>
            )}
          </CardContent>
        </Card>
      </AnimatedHeight>
      <InputOTPDialog />
    </div>
  );
}
