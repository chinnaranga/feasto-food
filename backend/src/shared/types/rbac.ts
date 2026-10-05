import { UserRole } from '../constants/roles.js';
import { Permission } from '../constants/permissions.js';

export type RoleType = `${UserRole}`;
export type PermissionType = `${Permission}`;

export interface RoleDefinition {
  name: UserRole;
  description: string;
  permissions: Permission[];
}
