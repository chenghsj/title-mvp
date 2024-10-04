import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { afterCandidateLoginUrl } from '@/config/site';
import { getAccountByUserId } from '@/data-access/accounts';
import { assertAuthenticated } from '@/lib/session';

type Props = {
  children: ReactNode;
};

const CompanyDashboardLayout = async ({ children }: Props) => {
  const user = await assertAuthenticated();
  if (!user) redirect('/sign-in');

  const account = await getAccountByUserId(user.id);
  if (account?.role === 'candidate') {
    redirect(afterCandidateLoginUrl);
  }

  return <div>{children}</div>;
};

export default CompanyDashboardLayout;
