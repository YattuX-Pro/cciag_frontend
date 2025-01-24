'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Store,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  AlignEndHorizontal
} from 'lucide-react';

const navigation = [
  
  { name: 'Dashboard', href: '/dashboard', icon: AlignEndHorizontal},
  { name: 'Utilisateurs', href: '/dashboard/users', icon: Users },
  { name: 'Enrollement', href: '/dashboard/merchants', icon: Store },
  { name: 'Dossiers', href: '/dashboard/merchants/review', icon: Store },
  { name: 'Imprimer carte', href: '/dashboard/id-cards', icon: CreditCard },
  { name: 'Historique Impression', href: '/dashboard/card-history', icon: FileText },
  // { name: 'Config', href: '/dashboard/settings', icon: Settings },
];

interface DashboardNavProps {
  collapsed?: boolean;
}

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon
              className={cn(
                'h-5 w-5',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground group-hover:text-primary',
                !collapsed && 'mr-3'
              )}
            />
            {!collapsed && item.name}
          </Link>
        );
      })}
      <button 
        className={cn(
          'w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors',
          collapsed && 'justify-center px-2'
        )}
        title={collapsed ? 'Logout' : undefined}
      >
        <LogOut className={cn('h-5 w-5', !collapsed && 'mr-3')} />
        {!collapsed && 'Logout'}
      </button>
    </nav>
  );
}