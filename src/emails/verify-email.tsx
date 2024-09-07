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
              src={dataURL}
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
            <Text style={paragraph}>Not expecting this email?</Text>
            <Text style={paragraph}>
              Contact{' '}
              <Link href='teamtitle80@gmail.com' style={link}>
                teamtitle80@gmail.com
              </Link>{' '}
              if you did not request this code.
            </Text>
          </Container>
          <Text style={footer}>Securely powered by Title.</Text>
        </Body>
      </Tailwind>
    </Html>
  );
};

const main = {
  background: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
  marginTop: '20px',
  maxWidth: '360px',
  margin: '0 auto',
  padding: '68px 0 130px',
};

const logo = {
  margin: '0 auto',
};

const tertiary = {
  color: '#0a85ea',
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  height: '16px',
  letterSpacing: '0',
  lineHeight: '16px',
  margin: '16px 8px 8px 8px',
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
};

const secondary = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
  marginBottom: '0',
  marginTop: '0',
  textAlign: 'center' as const,
  width: '100%',
};

const codeContainer = {
  background: 'rgba(0,0,0,.05)',
  borderRadius: '4px',
  margin: '16px auto 14px',
  verticalAlign: 'middle',
  width: '280px',
};

const code = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Bold',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '6px',
  lineHeight: '40px',
  paddingBottom: '8px',
  paddingTop: '8px',
  margin: '0 auto',
  width: '100%',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#444',
  fontSize: '15px',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  letterSpacing: '0',
  lineHeight: '23px',
  padding: '0 40px',
  margin: '0',
  textAlign: 'center' as const,
};

const link = {
  color: '#444',
  textDecoration: 'underline',
};

const footer = {
  color: '#000',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0',
  lineHeight: '23px',
  margin: '0',
  marginTop: '20px',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  textAlign: 'center' as const,
  textTransform: 'uppercase' as const,
};

const dataURL =
  'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAI4AAABECAYAAABXjg3aAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARfSURBVHgB7Zu/TxRBFMefhgAmkBCxQBPjlTb2aGNM1Njb0GlpaWFh4x9gYW9oTfTfwIaOxk4bqYRoIiKIyE/ncbPZd8ft7nvvdpdd7vtJJrxws7M7M2/fvO/MHREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgDPlwoD/LYQyGcpEKA8IVMVuKH+i/SGUpYL6PCcL0Z4O5S7Vw89QjkPZCuVF8s+xvkr8cDejfTWUOwSqYpNSx1lU1J8LpRPtG1TP3ByFsh7tFfnBxb6Kc8KeJVAlB8LeUtSfFPYVqod9Yfc8Y57jTBOokr34lyfki6J+R9h1vdTSuXMjzoyw6/LqUYSXgONoa5yGOYuXWjpOz3PmRZzLBKoicwnIQS5VZxFxehxnUHL8i7qK6jtlIyOTxfuTB9mmwQM2bLvM2oDPL1G3T8y4sJvQ7oqiPs9L8lJbnIaj2mG0s8Y8jx+UKqqea/sd562wX1M2L6nbGR6sp6RjPz4Is0RC2gmeUTpAT0g/EbKD9wZ8/iiU+Wg/pN58IY8NSqPDfTo98POxbeZ2KLdIR+abnIFcCaZID0v+jWgvkk69qbhIdiYpDZsW79cMVjJAlreXJ7YoX/DmB4nTnHrjIt6csC5FZXVQNR7H8U5CUSe8WwFHBe162943tmvJCfcUbUs6wraMjbzPNyqRYR2nzE7MONs9KGi3aRGyTkWlealceBzHG56LOuEdnF1Du5b8oCqH3C9olzLuRUPcq1SnYYaNOOOkp6gTsl3vHlKR41jaLVpOvJHXmnd4FZVH8qsZIzsyPHvyhaxOyEjmyRc0CWyZuVNVuV7efSwRk58/WT55jLRnW3xdMl+8BTEwKlodp435QpMVlWap8iqqCUrH8XEsGvjgdTPab6h7cn8K61LlXaaKNry8Yd+qfEZJUXlRRcRhHOca6ZGDVeZyAkVVPpU4TtMUlWVvaNQUlZeinPGEupYqqai2Ctotc2fU6+htV1Re1BHR6zhtUVRV7UY3XVF50eR2J1hUFRRVStMV1U4of6O9SLoTeIafLzlNX8uraHGcNioqT35wHhQVO82/aC+T3nHUWJaqNioqT35gOTQduTOqBIvjQFF1adsZVenHDYw34rRBUXnzA8uh6cidUSV4HadMRSUnuExF1RG2V8q2UVFV9uUtidZxRklRWQ5Nm6iorPdxoVVVVXk/tztsvlC2orI4pGXJ5miaSN13ivr9X4TXMhWvZV6F8lx/6YmM3472e8o44GQ8juPdgc1KNBPaqKgsbfPv9JPxvk7VIe8zQ70Rsgj5s+TcfRztUtW277Q0TVG1BfUyp3WcqnZgO8Jum6KyLB9tQb1B6XGcMndg26yoLJugbcC0QalxHCiqlPP823rTBqUmOebBWo02D+wy6eDzkp1or2S0ux7tWUO73MHf0V7KqMM/Y16N9mfScRivY/LeuNX491MoX+n8wGdbiaL6SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAms1/aXVwxEzKyiEAAAAASUVORK5CYII=';
