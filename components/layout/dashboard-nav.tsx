'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Store,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  AlignEndHorizontal,
  FileSignatureIcon
} from 'lucide-react';
import { AuthActions } from '@/app/(auth)/utils';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { roles, urls } from '@/types/const';
import { motion } from 'framer-motion';

const navigation = [
  
  { name: 'Dashboard', href: urls.dashboard, icon: AlignEndHorizontal, role: [roles.admin, roles.operation, roles.validation, roles.impression]},
  { name: 'Utilisateurs', href: urls.users, icon: Users, role: [roles.admin]},
  { name: 'Enrollement', href: urls.merchants, icon: Store, role: [roles.operation, roles.admin]},
  { name: 'Dossiers', href: urls.merchants_review, icon: Store, role: [roles.validation, roles.admin]},
  { name: 'Imprimer carte', href: urls.id_cards, icon: CreditCard, role: [roles.impression, roles.admin]},
  { name: 'Historique Impression', href: urls.cards_history, icon: FileText, role: [roles.admin] },
  { name: 'Paiements', href: urls.merchant_payments, icon: FileSignatureIcon, role: [roles.admin] },
];

interface DashboardNavProps {
  collapsed?: boolean;
}

export function DashboardNav({ collapsed = false }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {logout, getToken} = AuthActions();
  const [isLogout, setIsLogout] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(()=>{
    setRole(getToken("userRole"))
  },[])

  const onLogout = () => {
    setIsLogout(true);
    logout()
    .then((res) =>{
      router.push(urls.home)
    })
    .catch((err)=> {
      toast({
        title: 'Error logout',
        description: 'Erreur logout inconu.'
      })
      console.log(err)
      setIsLogout(false)
    })
  }

  return (
    <motion.nav 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-1 px-2 py-4 "
    >
      {navigation.map((item, index) => {
        const isActive = pathname === item.href;
        return item.role.some((role_) => role_ === role) ? (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  'h-5 w-5',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-cyan-400',
                  !collapsed && 'mr-3'
                )}
              />
              {!collapsed && (
                <span className={cn(
                  'transition-all duration-200',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-cyan-400'
                )}>
                  {item.name}
                </span>
              )}
            </Link>
          </motion.div>
        ) : null;
      })}
      
      {isLogout ? (
        <motion.div 
          className='flex justify-center py-3'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className='w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin'/>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => onLogout()}
          className={cn(
            'w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
            'text-red-400 hover:bg-red-500/10 hover:text-red-500',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Logout' : undefined}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className={cn(
            'h-5 w-5',
            'text-red-400 group-hover:text-red-500',
            !collapsed && 'mr-3'
          )} />
          {!collapsed && (
            <span className="text-red-400 group-hover:text-red-500">
              Logout
            </span>
          )}
        </motion.button>
      )}
    </motion.nav>
  );
}