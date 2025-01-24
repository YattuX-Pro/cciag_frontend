'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Printer, Store, User, Calendar } from 'lucide-react';
import type { IDCard } from '@/types';

const mockIDCards: IDCard[] = [
  {
    id: '1',
    merchantId: '1',
    merchantName: 'Ibrahim Barry',
    cardNumber: 'ID-2024-001',
    issuedDate: '2024-03-20',
    expiryDate: '2025-03-20',
    status: 'active',
  },
  {
    id: '2',
    merchantId: '2',
    merchantName: 'Saliou Sow',
    cardNumber: 'ID-2024-002',
    issuedDate: '2024-03-21',
    expiryDate: '2025-03-21',
    status: 'active',
  },
  // Add more mock cards as needed
];

export default function IDCardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCards = mockIDCards.filter((card) => {
    const matchesSearch =
      card.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Cartes</h1>
        <Button className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto">
          <Printer className="mr-2 h-4 w-4" /> Imprimer une nouvelle carte
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impression de cartes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="revoked">Revoqué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <Card key={card.id} className="border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Numéro Carte</p>
                      <p className="font-semibold">{card.cardNumber}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        card.status === 'active'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : card.status === 'expired'
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }
                    >
                      {card.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-cyan-500" />
                      <span className="font-medium">{card.merchantName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Date Création</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-cyan-500" />
                          <span className="text-sm">{card.issuedDate}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Date Exp</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-cyan-500" />
                          <span className="text-sm">{card.expiryDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-cyan-500/10">
                      <Button variant="ghost" size="sm" className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10">
                        Voir Details
                      </Button>
                      <Button variant="ghost" size="sm" className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}