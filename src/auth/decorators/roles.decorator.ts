import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<string>) => SetMetadata(ROLES_KEY, roles);

// Sugar decorator for READ role
export const READ = () => Roles('READ');


