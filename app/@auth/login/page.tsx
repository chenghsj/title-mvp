'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RoleSwitch } from './role-switch';

type Props = {};

function LoginPage({}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isSignUp = pathname === '/sign-up';

  return (
    <div className='flex h-full w-full items-center justify-center font-roboto'>
      <Card className='grid h-fit w-fit gap-12 p-9'>
        <CardContent className='flex flex-col items-start gap-12'>
          {isSignUp && (
            <CardTitle className='text-2xl font-normal'>Welcome !</CardTitle>
          )}
          <Label htmlFor='role-switch' className='grid gap-3'>
            <h1 className='text-3xl'>Sign {isSignUp ? 'up' : 'in'} to</h1>
            <p>Choose your identity</p>
          </Label>
          <RoleSwitch />
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
