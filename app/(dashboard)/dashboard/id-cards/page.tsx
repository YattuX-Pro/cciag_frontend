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
import { cn } from '@/lib/utils';

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={cn(
          "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}>
          Cartes
        </h1>
        <Button className={cn(
          "transition-colors duration-200",
          "dark:bg-cyan-500 bg-cyan-600",
          "dark:hover:bg-cyan-600 hover:bg-cyan-700",
          "text-white",
          "w-full sm:w-auto"
        )}>
          <Printer className="mr-2 h-4 w-4" /> Imprimer une nouvelle carte
        </Button>
      </div>

      <Card className={cn(
        "dark:bg-gray-900/50 bg-white/50",
        "backdrop-blur-sm",
        "dark:border-cyan-900/20 border-cyan-200/20"
      )}>
        <CardHeader>
          <CardTitle className="dark:text-gray-100 text-gray-900">
            Impression de cartes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={cn(
                "w-full sm:w-[180px]",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-200/20",
                "dark:text-gray-100 text-gray-900"
              )}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className={cn(
                "dark:bg-gray-800 bg-white",
                "dark:border-cyan-900/20 border-cyan-200/20"
              )}>
                <SelectItem value="all">Statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="revoked">Revoqué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <Card key={card.id} className={cn(
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-200/20",
                "hover:border-cyan-500/50 transition-colors duration-200"
              )}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium dark:text-gray-400 text-gray-500">
                        Numéro Carte
                      </p>
                      <p className="font-semibold dark:text-gray-100 text-gray-900">
                        {card.cardNumber}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn(
                      card.status === 'active' && "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
                      card.status === 'expired' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                      card.status === 'revoked' && "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {card.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 dark:text-cyan-400 text-cyan-600" />
                      <span className="font-medium dark:text-gray-100 text-gray-900">
                        {card.merchantName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs dark:text-gray-400 text-gray-500">
                          Date Création
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 dark:text-cyan-400 text-cyan-600" />
                          <span className="text-sm dark:text-gray-300 text-gray-600">
                            {card.issuedDate}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs dark:text-gray-400 text-gray-500">
                          Date Exp
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 dark:text-cyan-400 text-cyan-600" />
                          <span className="text-sm dark:text-gray-300 text-gray-600">
                            {card.expiryDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t dark:border-cyan-900/20 border-cyan-200/20">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "dark:text-cyan-400 text-cyan-600",
                          "dark:hover:text-cyan-300 hover:text-cyan-700",
                          "dark:hover:bg-cyan-900/20 hover:bg-cyan-100/20"
                        )}
                      >
                        Voir Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "dark:text-cyan-400 text-cyan-600",
                          "dark:hover:text-cyan-300 hover:text-cyan-700",
                          "dark:hover:bg-cyan-900/20 hover:bg-cyan-100/20"
                        )}
                      >
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