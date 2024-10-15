import { redirect } from 'next/navigation';

type Props = {};

const CompanyDashboardPage = (props: Props) => {
  redirect('/company/dashboard/job-management');
};

export default CompanyDashboardPage;
