'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Search, CreditCard, Smartphone, CheckCircle, Clock, XCircle, CreditCard as CreditCardIcon } from 'lucide-react';
import type { CardHistory, MerchantEnrollementHistory, MerchantPayment, Column } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { format } from "date-fns";
import { getMerchantEnrollementHistory, getMerchantPayments, getPaymentStatistics } from '@/fetcher/api-fetcher';
import { motion } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { fr } from 'date-fns/locale';
import { DataTable } from '@/components/DataTable';
import { paymentStatusMap, statusMap } from '@/types/const';
import { columns } from './columns';
import { PaymentDialog } from './payment-dialog';
import { OrangeMoneyList } from './orange-money-list';
import { OrangeMoneyDialog } from './orange-money-dialog';

export default function MerchantPaymentPage() {
  const [data, setData] = useState<MerchantPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState<Date>();
  const [paymentStatistics, setPaymentStatistics] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('payments');

  const loadPaymentStatistics = async () => {
    try {
      const response = await getPaymentStatistics();
      setPaymentStatistics(response);
    } catch (err) {
      console.error('Erreur chargement statistiques paiements:', err);
    }
  };

  const loadCardPaymentPage = async (url?: string) => {
    setLoading(true);
    try {
      const params = url
        ? { url }
        : {
            search: searchTerm ? searchTerm : "",
            status: status ? status : "",
          };

      const response = await getMerchantPayments(params);
      setData(response.results);
      console.log(response.results);
      setNext(response.next);
      setPrevious(response.previous);
      setCount(response.count);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCardPaymentPage();
    loadPaymentStatistics();
  }, [searchTerm, status]);

  const actionsColumn: Column<MerchantPayment> = {
    header: "Actions", 
    accessorKey: (payment: MerchantPayment) => payment.id,
    cell: (payment: MerchantPayment) => (
      <div className="text-right flex gap-2">
        <PaymentDialog payment={payment} />
        {payment.merchant && (payment.status === 'PENDING' || payment.status === 'FAILED') && (
          <OrangeMoneyDialog 
            merchant_payment={payment} 
            onPaymentSuccess={() => {
              loadCardPaymentPage();
              loadPaymentStatistics();
            }}
          />
        )}
      </div>
    ),
  }

  const columnsWithActions = [...columns, actionsColumn];

  const paymentStatusCounts = [
    {
      title: "En attente",
      count: paymentStatistics.PENDING || 0,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      description: "Paiements en attente"
    },
    {
      title: "Total valide",
      count: paymentStatistics.total_paid || 0,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      description: "Total des paiements validés"
    },
    {
      title: "Validé par vous",
      count: paymentStatistics.PAID || 0,
      icon: CreditCardIcon,
      gradient: "from-blue-500 to-indigo-500",
      description: "Paiements que vous avez validés"
    },
    {
      title: "Échoué",
      count: paymentStatistics.FAILED || 0,
      icon: XCircle,
      gradient: "from-red-500 to-rose-500",
      description: "Paiements échoués"
    }
  ];

  return (   <div className="space-y-6">
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

    {/* Page Title */}
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
        Paiements
      </motion.h1>
    </div>

    {/* Payment Status Cards */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {paymentStatusCounts.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 100 }}
          >
            <Card className={cn(
              "relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-105",
              "dark:bg-gray-900/50 bg-white/50",
              "dark:border-gray-800/50 border-gray-200/50",
              "hover:shadow-xl"
            )}>
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-10",
                item.gradient
              )} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {item.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {item.count.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-full bg-gradient-to-br",
                    item.gradient
                  )}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
    {/* Tabs for different payment types */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        // Recharger la liste selon l'onglet sélectionné
        if (value === 'payments') {
          loadCardPaymentPage();
          loadPaymentStatistics();
        }
        // Pour l'onglet orange-money, le composant OrangeMoneyList se charge automatiquement
      }} className="space-y-6">
        <TabsList className={cn(
          "grid w-full grid-cols-2",
          "dark:bg-gray-900/50 bg-white/50",
          "dark:border-cyan-900/20 border-cyan-200/20"
        )}>
          <TabsTrigger 
            value="payments" 
            className={cn(
              "flex items-center gap-2",
              "data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            )}
          >
            <CreditCard className="h-4 w-4" />
            Paiements Standards
          </TabsTrigger>
          <TabsTrigger 
            value="orange-money" 
            className={cn(
              "flex items-center gap-2",
              "data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            )}
          >
            <Smartphone className="h-4 w-4" />
            Orange Money
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6">
          <Card className={cn(
            "backdrop-blur-sm",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20"
          )}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search
                    className={cn(
                      "absolute left-3 top-3 h-4 w-4",
                      "dark:text-cyan-400 text-cyan-600"
                    )}
                  />
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

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger 
                    className={cn(
                      "w-[200px] transition-colors duration-200",
                      "dark:bg-gray-800/50 bg-gray-50",
                      "dark:border-cyan-900/20 border-cyan-200/20",
                      "dark:focus:border-cyan-500 focus:border-cyan-600",
                      "dark:text-gray-100 text-gray-900"
                    )}
                  >
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(paymentStatusMap).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(status || searchTerm) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStatus('');
                      setDate(undefined);
                      setSearchTerm('');
                    }}
                    className={cn(
                      "transition-colors duration-200",
                      "dark:text-cyan-400 text-cyan-600",
                      "dark:hover:text-cyan-300 hover:text-cyan-500",
                      "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                    )}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>

              <DataTable 
                columns={columnsWithActions} 
                data={data}
                loading={loading}
                pagination={{
                  count,
                  next,
                  previous,
                  onPageChange: loadCardPaymentPage,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orange-money" className="space-y-6">
          <OrangeMoneyList />
        </TabsContent>
      </Tabs>
    </motion.div>
  </div>)
}