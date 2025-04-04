import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { logoImageUrl } from '@/config/app';

interface VerifyIdentityEmailProps {
  validationCode?: string;
}

// const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const VerifyIdentityEmail = ({
  validationCode,
}: VerifyIdentityEmailProps) => {
  return (
    <Html>
      <Head>
        {/* https://stackoverflow.com/questions/58177703/how-to-prevent-ios-13-dark-mode-from-breaking-emails */}
        <meta name='color-scheme' content='only' />
      </Head>
      <Tailwind>
        <Body className='bg-white'>
          <Container className='mx-auto my-0 mt-5 max-w-[360px] rounded border border-solid border-[#eee] bg-white px-0 pb-[130px] pt-16 shadow-[0_5px_10px_rgba(20,50,70,.2)]'>
            <Img
              src={logoImageUrl}
              width='142'
              height='68'
              alt='logo'
              className='mx-auto my-0'
            />
            <Text className='m-2 mt-4 h-4 text-center font-[HelveticaNeue,Helvetica,Arial,sans-serif] text-xs font-bold uppercase leading-4 tracking-normal text-[#0a85ea]'>
              Verify Your Identity
            </Text>
            <Heading className='my-0 inline-block w-full text-center font-[HelveticaNeue,Helvetica,Arial,sans-serif] text-lg leading-6 text-black'>
              Enter the following code to login.
            </Heading>
            <Section className='mx-auto my-4 w-[280px] rounded bg-[rgba(0,0,0,.05)] align-middle'>
              <Text className='mx-auto my-0 inline-block w-full py-2 text-center text-3xl font-bold leading-10 tracking-wider text-black'>
                {validationCode}
              </Text>
            </Section>
            <Text className={paragraph}>Not expecting this email?</Text>
            <Text className={paragraph}>
              Contact{' '}
              <Link
                href='teamtitle80@gmail.com'
                className='text-[#444] underline'
              >
                teamtitle80@gmail.com
              </Link>{' '}
              if you did not request this code.
            </Text>
          </Container>
          <Text className='m-0 mt-5 text-center font-[HelveticaNeue,Helvetica,Arial,sans-serif] text-xs font-extrabold uppercase leading-6 tracking-normal text-black'>
            Securely powered by Title.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

const paragraph: string =
  'text-[#444] text-sm tracking-normal leading-6 m-0 py-5 px-0 text-center font-[HelveticaNeue,Helvetica,Arial,sans-serif]';
