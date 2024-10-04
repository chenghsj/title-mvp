import { redirect } from 'next/navigation';

type Props = {};

async function CandidateDashboardPage({}: Props) {
  redirect('/candidate/dashboard/profile');
}

export default CandidateDashboardPage;
