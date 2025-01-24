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

const mockCardHistory: CardHistory[] = [
  {
    id: '1',
    cardId: 'ID-2024-001',
    merchantName: 'Ibrahim barry',
    action: 'printed',
    actionDate: '2024-03-20',
    performedBy: 'Admin User',
  },
  // Add more mock history entries as needed
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique Des Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Actions</SelectItem>
                <SelectItem value="printed">Imprimé</SelectItem>
                <SelectItem value="revoked">Revoqué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro Carte</TableHead>
                  <TableHead>Commerçant</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fait par</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{history.cardId}</TableCell>
                    <TableCell>{history.merchantName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          history.action === 'printed'
                            ? 'bg-blue-100 text-blue-800'
                            : history.action === 'renewed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {history.action}
                      </span>
                    </TableCell>
                    <TableCell>{history.actionDate}</TableCell>
                    <TableCell>{history.performedBy}</TableCell>
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