'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Calendar,
  Search,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  listOrangeMoneyPayments, 
  checkOrangeMoneyPaymentStatus 
} from '@/fetcher/api-fetcher';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/types';

interface OrangeMoneyPayment {
  id: number;
  merchant_payment: any;
  merchant_payment_id: number;
  order_id: string;
  merchant_transaction_id: string;
  pay_token: string;
  payment_url: string;
  notif_token: string;
  currency: string;
  reference: string;
  status: string;
  status_display: string;
  initiated_at: string;
  completed_at: string | null;
  return_url: string;
  cancel_url: string;
  notif_url: string;
  orange_response: any;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export function OrangeMoneyList() {
  const [payments, setPayments] = useState<OrangeMoneyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const loadOrangeMoneyPayments = async (url?: string) => {
    setLoading(true);
    try {
      const params = url
        ? { url }
        : {
          search: searchTerm ? searchTerm : "",
        };

      const response = await listOrangeMoneyPayments(params);
      console.log(response);
      setPayments(response.results);
      setNext(response.next);
      setPrevious(response.previous);
      setCount(response.count);
    } catch (error) {
      console.error('Erreur chargement paiements Orange Money:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Fonction pour appliquer la recherche (recharge depuis le backend)
  const applySearch = () => {
    loadOrangeMoneyPayments();
  };

  const handleRefreshStatus = async (orderId: string) => {
    setRefreshingId(orderId);
    try {
      const response = await checkOrangeMoneyPaymentStatus(orderId);
      if (response.success) {
        setPayments(prev => 
          prev.map(payment => 
            payment.order_id === orderId 
              ? { ...payment, status: response.status }
              : payment
          )
        );
        
        if (response.status === 'SUCCESS' || response.status === 'PAID') {
          toast({
            title: "Paiement réussi",
            description: "Le paiement a été effectué avec succès",
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de la vérification",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur vérification statut:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la vérification du statut",
        variant: "destructive",
      });
    } finally {
      setRefreshingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'PENDING':
      case 'INITIATED':
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PENDING':
      case 'INITIATED':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const handleOpenPaymentUrl = (paymentUrl: string) => {
    window.open(paymentUrl, '_blank');
  };

  useEffect(() => {
    loadOrangeMoneyPayments();
  }, []);

  // Colonnes pour le DataTable
  const columns: Column<OrangeMoneyPayment>[] = [
    {
      header: "ID Commande",
      accessorKey: "order_id" as keyof OrangeMoneyPayment,
      cell: (payment: OrangeMoneyPayment) => (
        <span className="font-mono text-sm">{payment.order_id}</span>
      ),
    },
    {
      header: "Transaction ID",
      accessorKey: "merchant_payment" as keyof OrangeMoneyPayment,
      cell: (payment: OrangeMoneyPayment) => (
        <span className="font-medium">
          {payment.merchant_transaction_id}
        </span>
      ),
    },
    {
      header: "Montant",
      accessorKey: "merchant_payment" as keyof OrangeMoneyPayment,
      cell: (payment: OrangeMoneyPayment) => (
        <span className="font-medium">{payment.merchant_payment?.amount} {payment.currency}</span>
      ),
    },
    {
      header: "Statut",
      accessorKey: "status" as keyof OrangeMoneyPayment,
      cell: (payment: OrangeMoneyPayment) => (
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1 w-fit",
            getStatusColor(payment.status)
          )}
        >
          {getStatusIcon(payment.status)}
          {payment.status}
        </Badge>
      ),
    },
    {
      header: "Date d'initiation",
      accessorKey: "initiated_at" as keyof OrangeMoneyPayment,
      cell: (payment: OrangeMoneyPayment) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {format(new Date(payment.initiated_at), 'dd MMM yyyy HH:mm', { locale: fr })}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof OrangeMoneyPayment,
      cell: (payment: OrangeMoneyPayment) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(payment.payment_url, '_blank')}
            className="dark:border-orange-500/20 border-orange-300/20"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ouvrir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRefreshStatus(payment.order_id)}
            disabled={refreshingId === payment.order_id}
            className="dark:border-blue-500/20 border-blue-300/20"
          >
            <RefreshCw className={cn(
              "h-4 w-4",
              refreshingId === payment.order_id && "animate-spin"
            )} />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <Card className={cn(
      "backdrop-blur-sm",
      "dark:bg-gray-900/50 bg-white/50",
      "dark:border-orange-500/20 border-orange-300/20"
    )}>
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className={cn(
            "flex items-center gap-2",
            "dark:text-orange-400 text-orange-600"
          )}>
            <Smartphone className="h-5 w-5" />
            Paiements Orange Money ({count})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadOrangeMoneyPayments()}
            disabled={loading}
            className="dark:border-orange-500/20 border-orange-300/20"
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2",
              loading && "animate-spin"
            )} />
            Actualiser
          </Button>
        </div>

        {/* Recherche */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par ID Commande ou ID Transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applySearch()}
              className={cn(
                "pl-10 pr-10",
                "dark:bg-gray-800/50 bg-gray-50/50",
                "dark:border-orange-500/20 border-orange-300/20",
                "focus:dark:border-orange-400 focus:border-orange-500"
              )}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={applySearch}
              disabled={loading}
              className={cn(
                "dark:border-orange-500/20 border-orange-300/20",
                "dark:text-orange-400 text-orange-600",
                "hover:dark:bg-orange-500/10 hover:bg-orange-50"
              )}
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearSearch();
                  setTimeout(() => loadOrangeMoneyPayments(), 100);
                }}
                className={cn(
                  "dark:border-orange-500/20 border-orange-300/20",
                  "dark:text-orange-400 text-orange-600",
                  "hover:dark:bg-orange-500/10 hover:bg-orange-50"
                )}
              >
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}
          </div>
        </motion.div>
      </CardHeader>
      
      <CardContent>
        <DataTable 
          columns={columns} 
          data={payments}
          loading={loading}
          pagination={{
            count,
            next,
            previous,
            onPageChange: loadOrangeMoneyPayments,
          }}
        />
      </CardContent>
    </Card>
  );
}
