import React from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { Github, LinkedinIcon } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className='max-h-[212px] w-full bg-zinc-900 px-10 py-5 dark:bg-zinc-800 sm:py-9 md:px-[108px]'>
      <div className='border-b-gray_l1 flex items-center justify-between border-t-[0.5px] md:py-5'>
        <div>
          <div className='relative w-32 py-10 invert md:w-[200px] lg:py-11'>
            <Image
              src='/logo/logo_1x.webp'
              layout='fill'
              objectFit='contain'
              alt='footer logo'
            />
          </div>

          <span className='text-xs italic text-zinc-100 sm:text-sm'>
            © 2024 Lorem ipsum dolor sit amet
          </span>
        </div>
        <div className='flex gap-x-3'>
          <Link href={siteConfig.links.discord} aria-label='Discord'>
            <LinkedinIcon fill='white' />
          </Link>
          <Link href={siteConfig.links.github} aria-label='Github'>
            <Github fill='white' />
          </Link>
        </div>
      </div>
    </footer>
  );
}
