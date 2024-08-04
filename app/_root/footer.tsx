import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { siteConfig } from '@/config/site';
import logo from '@/public/logo/logo_1x.webp';

export function Footer() {
  return (
    <footer className='relative max-h-[212px] w-screen bg-zinc-900 px-10 py-5 dark:bg-zinc-800 sm:py-9 md:px-[108px]'>
      <div className='border-b-gray_l1 flex items-center justify-between border-t-[0.5px] md:py-5'>
        <div>
          <div className='relative w-32 py-10 invert md:w-[200px] lg:py-11'>
            <Image
              className='object-contain'
              src={logo}
              fill
              alt='footer logo'
            />
          </div>

          <span className='text-xs italic text-zinc-100 sm:text-sm'>
            © 2024 Lorem ipsum dolor sit amet
          </span>
        </div>
        <div className='flex gap-x-3'>
          <Link href={siteConfig.links.discord} aria-label='Discord'>
            <FontAwesomeIcon icon={faLinkedin} color='white' size='lg' />
          </Link>
          <Link href={siteConfig.links.github} aria-label='Github'>
            <FontAwesomeIcon icon={faGithub} color='white' size='lg' />
          </Link>
        </div>
      </div>
    </footer>
  );
}
