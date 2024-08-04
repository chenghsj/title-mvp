'use client';

import { MouseEventHandler, RefObject, useEffect, useState } from 'react';
import { useOverflowDetector } from 'react-detectable-overflow';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArrowLeft } from 'lucide-react';
import { Role } from '@/app/_root/types';
import { AnimatedHeight } from '@/components/animated-height';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import LoginForm from './login-form';
import { RoleSwitch } from './role-switch';

type Props = {};

export function LoginPage({}: Props) {
  const { ref: isOverflowRef, overflow } = useOverflowDetector({});
  const router = useRouter();
  const [isMail, setIsMail] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get('role') as Role;

  const pathname = usePathname();
  const isSignUp = pathname === '/sign-up';

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
          <CardContent className='flex flex-col items-start gap-7 p-3 sm:p-6'>
            {isSignUp && (
              <CardTitle className='text-xl font-normal sm:text-2xl'>
                Welcome !
              </CardTitle>
            )}
            <Label htmlFor='role-switch' className='grid gap-3'>
              <h1 className='text-2xl sm:text-3xl'>
                Sign {isSignUp ? 'up' : 'in'} to
              </h1>
              <p>Choose your identity</p>
            </Label>
            <RoleSwitch />
            <div className='w-full'>
              <div className='flex gap-x-2'>
                {isMail && (
                  <Button
                    size={'icon'}
                    variant={'ghost'}
                    onClick={handleBackArrowClick}
                  >
                    <ArrowLeft strokeWidth={2.5} />
                  </Button>
                )}
                <Button
                  variant={'outline'}
                  className={cn('w-full')}
                  onClick={() => setIsMail(true)}
                  disabled={isMail}
                >
                  <FontAwesomeIcon icon={faEnvelope} className='mr-2 h-4 w-4' />
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
                className='w-full'
                name='google'
                onClick={handleOAuthClick}
              >
                <FontAwesomeIcon icon={faGoogle} className='mr-2 h-4 w-4' />
                With Google
              </Button>
            )}
          </CardContent>
        </Card>
      </AnimatedHeight>
    </div>
  );
}
