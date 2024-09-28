import { SectionExcludeNav } from '@/components/section-exclude-nav';
import { NotFoundPage } from './_not-found/page';

type Props = {};

export default function NotFound() {
  return (
    <SectionExcludeNav className='flex flex-col items-center justify-center gap-20'>
      <NotFoundPage />
    </SectionExcludeNav>
  );
}
