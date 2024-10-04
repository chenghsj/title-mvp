import { Separator } from '@/components/ui/separator';
import { getUserUseCase } from '@/use-cases/users';
import { DeleteAccount } from './delete-account';

type Props = {};

async function AccountPage({}: Props) {
  const user = await getUserUseCase();

  return (
    <div className='flex max-w-3xl flex-col gap-10'>
      <div className='space-y-3'>
        <div className='text-2xl font-medium'>Email</div>
        <Separator />
        <div>{user?.email}</div>
      </div>
      <DeleteAccount />
    </div>
  );
}

export default AccountPage;
