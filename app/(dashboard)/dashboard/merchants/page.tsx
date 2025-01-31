'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Upload, Camera, CreditCard, CheckCircle2 } from 'lucide-react';
import type { Merchant } from '@/types';
import AddMerchantDialog from './(dialog)/AddMerchantDialog';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const mockMerchants: Merchant[] = [
  {
    id: '1',
    businessName: 'Acme Corp',
    ownerName: 'Saliou Sow',
    email: 'saliou@test.com',
    phone: '+1234567890',
    address: '123 Conakry St, City',
    status: 'active',
    createdAt: '2024-03-20',
    signature: '',
    photo: ''
  },
];


export default function MerchantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMerchants = mockMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={cn(
          "absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob",
          "dark:bg-cyan-800/30 bg-cyan-600/30"
        )} />
        <div className={cn(
          "absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000",
          "dark:bg-cyan-700/30 bg-cyan-500/30"
        )} />
      </div>

      {/* Page Title and Add Merchant Button */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            "dark:from-cyan-400 dark:to-cyan-200",
            "from-cyan-600 to-cyan-400"
          )}
        >
          Commerçants
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AddMerchantDialog />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={cn(
          "backdrop-blur-sm",
          "dark:bg-gray-900/50 bg-white/50",
          "dark:border-cyan-900/20 border-cyan-200/20"
        )}>
          <CardHeader>
            <CardTitle className={cn(
              "text-lg font-medium",
              "dark:text-gray-300 text-gray-600"
            )}>
              Enrôlement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className={cn(
                  "absolute left-3 top-3 h-4 w-4",
                  "dark:text-cyan-400 text-cyan-600"
                )} />
                <Input
                  placeholder="Rechercher des commerçants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "pl-9 transition-colors duration-200",
                    "dark:bg-gray-800/50 bg-gray-50",
                    "dark:border-cyan-900/20 border-cyan-200/20",
                    "dark:focus:border-cyan-500 focus:border-cyan-600",
                    "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                    "dark:placeholder-gray-400 placeholder:text-gray-500",
                    "dark:text-gray-100 text-gray-900"
                  )}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className={cn(
                  "w-[180px]",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-200/20",
                  "dark:text-gray-100 text-gray-900"
                )}>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "dark:bg-gray-800 bg-white",
                  "dark:border-cyan-900/20 border-cyan-200/20"
                )}>
                  <SelectItem value="all" className="dark:text-gray-100 text-gray-900">
                    Tous les statuts
                  </SelectItem>
                  <SelectItem value="active" className="dark:text-gray-100 text-gray-900">
                    Actif
                  </SelectItem>
                  <SelectItem value="suspended" className="dark:text-gray-100 text-gray-900">
                    Suspendu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={cn(
              "rounded-md border overflow-hidden",
              "dark:border-cyan-900/20 border-cyan-200/20"
            )}>
              <Table>
                <TableHeader>
                  <TableRow className={cn(
                    "transition-colors duration-200",
                    "dark:bg-gray-800/50 bg-gray-50/80",
                    "dark:hover:bg-gray-800/70 hover:bg-gray-100/80",
                    "dark:border-b dark:border-cyan-900/20 border-b border-cyan-200/20"
                  )}>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Nom
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Adresse
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Contact
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Statut
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium">
                      Date Création
                    </TableHead>
                    <TableHead className="dark:text-gray-300 text-gray-600 font-medium text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredMerchants.map((merchant, index) => (
                      <motion.tr
                        key={merchant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "transition-colors duration-200",
                          "dark:bg-gray-900/50 bg-white/50",
                          "dark:hover:bg-gray-800/70 hover:bg-gray-50/70",
                          "dark:border-b dark:border-cyan-900/20 border-b border-cyan-200/20"
                        )}
                      >
                        <TableCell className="dark:text-gray-100 text-gray-900 font-medium">
                          {merchant.businessName}
                        </TableCell>
                        <TableCell className="dark:text-gray-100 text-gray-900">
                          {merchant.ownerName}
                        </TableCell>
                        <TableCell>
                          <div className="dark:text-gray-100 text-gray-900">
                            {merchant.email}
                          </div>
                          <div className="text-sm dark:text-gray-400 text-gray-500">
                            {merchant.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            merchant.status === 'active' && "dark:bg-emerald-500/10 bg-emerald-500/20 dark:text-emerald-400 text-emerald-600",
                            merchant.status === 'suspended' && "dark:bg-red-500/10 bg-red-500/20 dark:text-red-400 text-red-600"
                          )}>
                            {merchant.status}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-gray-100 text-gray-900">
                          {merchant.createdAt}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "transition-colors duration-200",
                              "dark:text-cyan-400 text-cyan-600",
                              "dark:hover:text-cyan-300 hover:text-cyan-500",
                              "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                            )}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "transition-colors duration-200",
                              "dark:text-cyan-400 text-cyan-600",
                              "dark:hover:text-cyan-300 hover:text-cyan-500",
                              "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                            )}
                          >
                            Generate ID
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}