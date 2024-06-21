import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function LogoLink() {
  return (
    <Link href='/'>
      <Image
        className='dark:invert'
        src='/logo/logo_1x.webp'
        layout='fill'
        objectFit='contain'
        alt='navbar logo'
      />
    </Link>
  );
}
