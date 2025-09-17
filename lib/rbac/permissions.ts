// Role-Based Access Control (RBAC) System
export type Permission = 
  | 'kpi:create'
  | 'kpi:read'
  | 'kpi:update'
  | 'kpi:delete'
  | 'kpi:assign'
  | 'user:create'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  | 'user:invite'
  | 'department:create'
  | 'department:read'
  | 'department:update'
  | 'department:delete'
  | 'report:create'
  | 'report:read'
  | 'report:export'
  | 'report:schedule'
  | 'analytics:view'
  | 'analytics:export'
  | 'notification:manage'
  | 'system:admin';

export type Role = 'Admin' | 'Manager' | 'Staff';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  Admin: [
    'kpi:create',
    'kpi:read',
    'kpi:update',
    'kpi:delete',
    'kpi:assign',
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'user:invite',
    'department:create',
    'department:read',
    'department:update',
    'department:delete',
    'report:create',
    'report:read',
    'report:export',
    'report:schedule',
    'analytics:view',
    'analytics:export',
    'notification:manage',
    'system:admin',
  ],
  Manager: [
    'kpi:create',
    'kpi:read',
    'kpi:update',
    'kpi:assign',
    'user:read',
    'user:update',
    'user:invite',
    'department:read',
    'report:create',
    'report:read',
    'report:export',
    'analytics:view',
    'analytics:export',
  ],
  Staff: [
    'kpi:read',
    'kpi:update',
    'report:read',
  ],
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function getUserPermissions(userRole: Role): Permission[] {
  return ROLE_PERMISSIONS[userRole];
}

// Permission middleware for API routes
export function requirePermission(permission: Permission) {
  return (user: any) => {
    if (!user || !hasPermission(user.role, permission)) {
      return { authorized: false, error: `Permission denied: ${permission}` };
    }
    return { authorized: true, error: null };
  };
}

// Multiple permissions check
export function requireAnyPermission(permissions: Permission[]) {
  return (user: any) => {
    if (!user || !hasAnyPermission(user.role, permissions)) {
      return { authorized: false, error: `Permission denied: requires one of ${permissions.join(', ')}` };
    }
    return { authorized: true, error: null };
  };
}