import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Mulish,
  Raleway,
  Roboto,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const fontRaleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const fontRoboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
});

export const fontMulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish',
  display: 'swap',
});
