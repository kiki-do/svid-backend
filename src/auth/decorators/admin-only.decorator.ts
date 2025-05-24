// auth/decorators/admin-only.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const AdminOnly = () => SetMetadata(ROLES_KEY, ['admin']);
