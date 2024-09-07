import { redirect } from 'next/navigation';

type Props = {};

async function DashboardPage({}: Props) {
  redirect('/dashboard/profile');
}

export default DashboardPage;
