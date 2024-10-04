import { assertAuthenticated } from '@/lib/session';
import { getDashboardProfileUseCase } from '@/use-cases/users';
import { Profile } from './profile';

type Props = {};

async function ProfilePage({}: Props) {
  const user = await assertAuthenticated();
  const dashboardDetails = await getDashboardProfileUseCase(user.id);

  return <Profile dashboardDetails={dashboardDetails} />;
}

export default ProfilePage;
