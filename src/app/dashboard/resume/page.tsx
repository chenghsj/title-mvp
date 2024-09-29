import { assertAuthenticated } from '@/lib/session';
import { getDashboardProfileUseCase } from '@/use-cases/users';
import { Resume } from './resume';

type Props = {};

async function ResumePage({}: Props) {
  const user = await assertAuthenticated();
  const dashboardDetails = await getDashboardProfileUseCase(user.id);

  return <Resume dashboardDetails={dashboardDetails} />;
}

export default ResumePage;
