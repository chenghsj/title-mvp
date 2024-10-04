import { redirect } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { afterCandidateLoginUrl, afterCompanyLoginUrl } from '@/config/site';
import { getAccountByUserId } from '@/data-access/accounts';
import { getCurrentUser } from '@/lib/session';
import { DualDirectionCarousel } from './_root/carousel';
import { MainHomePage } from './_root/home';

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    const account = await getAccountByUserId(user.id);
    redirect(
      account?.role === 'candidate'
        ? afterCandidateLoginUrl
        : afterCompanyLoginUrl
    );
  }

  return (
    <SectionExcludeNav className='grid gap-10 md:grid-cols-3 lg:grid-cols-2 xl:gap-20'>
      <MainHomePage />
      <DualDirectionCarousel />
      {/* <RestHomePage /> */}
    </SectionExcludeNav>
  );
}
