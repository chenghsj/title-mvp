import type { Metadata, Viewport } from 'next';
import { getLocale, getMessages, getTimeZone } from 'next-intl/server';
import { ProgressBar } from '@/components/app-progress-bar';
import { Toaster } from '@/components/ui/toaster';
import {
  fontMono,
  fontMulish,
  fontRaleway,
  fontRoboto,
  fontSans,
} from '@/config/fonts';
import { validateRequest } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Navbar } from './_root/_nav/navbar';
import { Footer } from './_root/footer';
import { Providers } from './_root/providers';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  const locale = await getLocale();
  const timeZone = await getTimeZone();
  const messages = await getMessages();

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'overflow-x-hidden',
          fontSans.variable,
          fontRoboto.variable,
          fontMono.variable,
          fontMulish.variable,
          fontRaleway.variable
        )}
      >
        <Providers
          session={session}
          themeProps={{
            attribute: 'class',
            defaultTheme: 'light',
            children,
          }}
          messages={messages}
          locale={locale}
          timeZone={timeZone}
        >
          <ProgressBar />
          <Navbar />
          <main className='mx-auto flex h-fit max-w-7xl flex-col items-center justify-between px-10 xl:px-16'>
            {children}
          </main>
          <Footer />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
