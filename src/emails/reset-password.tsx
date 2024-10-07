import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Tailwind,
  Text,
} from '@react-email/components';
import { logoImageUrl } from '@/config/app';

interface ResetPasswordEmailProps {
  token?: string;
}

export const BASE_URL = process.env.HOST_NAME;

export const ResetPasswordEmail = ({ token }: ResetPasswordEmailProps) => {
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
              Reset your password
            </Text>
            <Heading className='my-0 inline-block w-full text-center font-[HelveticaNeue,Helvetica,Arial,sans-serif] text-lg leading-6 text-black'>
              Click the following link to reset your password
            </Heading>
            <Text className={paragraph}>
              <Link
                href={`${BASE_URL}/reset-password?token=${token}`}
                target='_blank'
                className='text-[#2754C5] underline'
              >
                Reset Password
              </Link>
            </Text>
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
