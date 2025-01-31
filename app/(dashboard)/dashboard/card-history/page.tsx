'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search } from 'lucide-react';
import type { CardHistory } from '@/types';
import { cn } from '@/lib/utils';

const mockCardHistory: CardHistory[] = [
  {
    id: '1',
    cardId: 'ID-2024-001',
    merchantName: 'Ibrahim barry',
    action: 'printed',
    actionDate: '2024-03-20',
    performedBy: 'Admin User',
  },
];

export default function CardHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredHistory = mockCardHistory.filter((history) => {
    const matchesSearch =
      history.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || history.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
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

      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}>
          Historique
        </h1>
      </div>

      <Card className={cn(
        "dark:bg-gray-900/50 bg-white/50",
        "backdrop-blur-sm",
        "dark:border-cyan-900/20 border-cyan-200/20"
      )}>
        <CardHeader>
          <CardTitle className="dark:text-gray-100 text-gray-900">
            Historique Des Activités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 dark:text-gray-400 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-9",
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-200/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder-gray-500 placeholder-gray-400"
                )}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className={cn(
                "w-[180px]",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-200/20",
                "dark:text-gray-100 text-gray-900"
              )}>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent className={cn(
                "dark:bg-gray-800 bg-white",
                "dark:border-cyan-900/20 border-cyan-200/20"
              )}>
                <SelectItem value="all">Actions</SelectItem>
                <SelectItem value="printed">Imprimé</SelectItem>
                <SelectItem value="revoked">Revoqué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={cn(
            "rounded-md",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "border"
          )}>
            <Table>
              <TableHeader>
                <TableRow className="dark:hover:bg-gray-800/50 hover:bg-gray-50">
                  <TableHead className="dark:text-gray-400 text-gray-500">Numéro Carte</TableHead>
                  <TableHead className="dark:text-gray-400 text-gray-500">Commerçant</TableHead>
                  <TableHead className="dark:text-gray-400 text-gray-500">Action</TableHead>
                  <TableHead className="dark:text-gray-400 text-gray-500">Date</TableHead>
                  <TableHead className="dark:text-gray-400 text-gray-500">Fait par</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((history) => (
                  <TableRow 
                    key={history.id}
                    className="dark:hover:bg-gray-800/50 hover:bg-gray-50"
                  >
                    <TableCell className="dark:text-gray-300 text-gray-700 font-medium">
                      {history.cardId}
                    </TableCell>
                    <TableCell className="dark:text-gray-300 text-gray-700">
                      {history.merchantName}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        history.action === 'printed' && "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
                        history.action === 'renewed' && "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20",
                        history.action === 'revoked' && "bg-red-500/10 text-red-500 border border-red-500/20"
                      )}>
                        {history.action}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-gray-300 text-gray-700">
                      {history.actionDate}
                    </TableCell>
                    <TableCell className="dark:text-gray-300 text-gray-700">
                      {history.performedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}