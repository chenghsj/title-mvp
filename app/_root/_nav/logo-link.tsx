import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function LogoLink() {
  return (
    <Link href='/'>
      <Image
        className='object-contain dark:invert'
        src='/logo/logo_1x.webp'
        alt='navbar logo'
        fill
      />
    </Link>
  );
}
