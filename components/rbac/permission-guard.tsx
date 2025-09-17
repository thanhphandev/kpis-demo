'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { hasPermission, hasAnyPermission, Permission } from '@/lib/rbac/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function PermissionGuard({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <>{fallback}</>;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(user.role, permission);
  } else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(p => hasPermission(user.role, p));
    } else {
      hasAccess = hasAnyPermission(user.role, permissions);
    }
  } else {
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}