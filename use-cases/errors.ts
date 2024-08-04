import { startCase } from 'lodash';
import { Role } from '@/app/_root/types';

export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super('You must be logged in to view this content');
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super('Resource not found');
    this.name = 'NotFoundError';
  }
}

export class RoleError extends PublicError {
  constructor(role: Role) {
    super(
      `The mail address is already registered with ${startCase(role)} account.\n` +
        `If you want to change your role with current mail, please delete the existing account first.`
    );
    this.name = 'RoleError';
  }
}
