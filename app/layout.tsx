import type { Metadata, Viewport } from 'next';
import { pathname } from 'next-extra/pathname';
import { DualDirectionCarousel } from '@/components/carousel';
import { ConditionalRender } from '@/components/conditional-render';
import { Footer } from '@/components/footer';
import { LogoLink } from '@/components/nav/logo-link';
import { Navbar } from '@/components/nav/navbar';
import { Providers } from '@/components/providers';
import { SectionExcludingNav } from '@/components/styled/styled-section';
import {
  fontMono,
  fontMulish,
  fontRaleway,
  fontRoboto,
  fontSans,
} from '@/config/fonts';
import { loginPath } from '@/config/site';
import { cn } from '@/lib/utils';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Title',
    template: `%s - Title`,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: true,
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
  home,
  auth,
}: Readonly<{
  children: React.ReactNode;
  home: React.ReactNode;
  auth: React.ReactNode;
}>) {
  const path = pathname();
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontMulish.variable,
          fontRaleway.variable,
          fontRoboto.variable
        )}
      >
        <Providers
          themeProps={{
            attribute: 'class',
            defaultTheme: 'light',
            children,
          }}
        >
          <Navbar logoLink={<LogoLink />} />
          <main className='flex h-fit flex-col items-center justify-between px-16'>
            <ConditionalRender
              pathToMatch={loginPath.concat('/')}
              defaultRender={null}
              matchedPathRender={
                <SectionExcludingNav className='grid grid-cols-2 gap-20'>
                  <ConditionalRender
                    pathToMatch={loginPath}
                    defaultRender={home}
                    matchedPathRender={auth}
                  />
                  <DualDirectionCarousel />
                </SectionExcludingNav>
              }
            />
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
