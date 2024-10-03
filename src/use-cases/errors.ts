import { getTranslations } from 'next-intl/server';
import { startCase } from 'lodash';
import { Role } from '@/app/_root/types';

export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor(message?: string) {
    super(message ?? 'You must be logged in to view this content');
    this.name = 'AuthenticationError';
  }
  static async create() {
    const tPublic = await getTranslations('errorMessages.public');
    return new AuthenticationError(tPublic('AuthenticationError'));
  }
}

export class NotFoundError extends PublicError {
  constructor(message?: string) {
    super(message ?? 'Resource not found');
    this.name = 'NotFoundError';
  }
}

export class RoleError extends PublicError {
  constructor(role: Role, message?: string) {
    super(
      message ??
        `The mail address is already registered with ${startCase(role)} account.\n` +
          `If you want to change your role with current mail, please delete the existing account first.`
    );
    this.name = 'RoleError';
  }
  static async create(role: Role) {
    const tPublic = await getTranslations('errorMessages.public');
    const tLogin = await getTranslations('login');
    return new RoleError(
      role,
      tPublic.rich('RoleError', { role: tLogin(role) }) as string
    );
  }
}

export class SendEmailError extends PublicError {
  constructor(message?: string) {
    super(message ?? 'Failed to send email');
    this.name = 'SendEmailError';
  }
}

export class EmailVerificationError extends PublicError {
  constructor(message?: string) {
    super(message ?? 'Failed to verify email');
    this.name = 'EmailVerificationError';
  }
}

export class LoginError extends PublicError {
  constructor(message?: string) {
    super('Invalid email or password');
    this.name = 'LoginError';
  }
  static async create() {
    const tPublic = await getTranslations('errorMessages.public');
    return new LoginError(tPublic('LoginError'));
  }
}

// ERROR MESSAGES
export const errorMessages = {
  verifyEmail: {
    notVerified: 'Email not verified.',
    notFound: 'User not found.',
    expired: 'OTP expired.',
    invalid: 'Invalid OTP.',
  },
} as const;
