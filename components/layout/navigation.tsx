'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Bell, 
  Settings,
  Menu,
  X,
  Target,
  Home,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth';
import { cn } from '@/lib/utils';
import { PermissionGuard } from '@/components/rbac/permission-guard';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const allNavigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      permission: 'kpi:read' as const,
    },
    {
      name: 'KPIs',
      href: '/kpis',
      icon: Target,
      permission: 'kpi:read' as const,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      permission: 'analytics:view' as const,
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      permission: 'user:read' as const,
    },
    {
      name: 'Departments',
      href: '/departments',
      icon: Building2,
      permission: 'department:read' as const,
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      permission: 'report:read' as const,
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      permission: 'kpi:read' as const,
      badge: 3, // Mock notification count
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      permission: 'kpi:read' as const,
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation sidebar */}
      <nav className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        className
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">KPI Manager</span>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1 px-3">
              {allNavigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <PermissionGuard
                    key={item.name}
                    permission={item.permission}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </PermissionGuard>
                );
              })}
            </div>
          </div>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}