import { redirect } from 'next/navigation';
import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { getCurrentUser } from '@/lib/session';
import { DualDirectionCarousel } from './_root/carousel';
import { MainHomePage } from './_root/home';

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <SectionExcludeNav className='grid gap-10 md:grid-cols-3 lg:grid-cols-2 xl:gap-20'>
      <MainHomePage />
      <DualDirectionCarousel />
      {/* <RestHomePage /> */}
    </SectionExcludeNav>
  );
}
