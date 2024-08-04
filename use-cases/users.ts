import { Role } from '@/app/_root/types';
import { GoogleUser } from '@/app/api/login/google/callback/route';
import { createAccountViaGoogle } from '@/data-access/accounts';
import { createProfile, getProfile } from '@/data-access/profiles';
import { createUser, getUserByEmail } from '@/data-access/users';
import { NotFoundError } from './errors';
import { UserId } from './types';

export async function createGoogleUserUseCase(
  googleUser: GoogleUser,
  role: Role
) {
  let existingUser = await getUserByEmail(googleUser.email);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub, role);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new NotFoundError();
  }

  return profile;
}
