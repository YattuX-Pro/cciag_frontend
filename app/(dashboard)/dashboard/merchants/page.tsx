'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import AddMerchantDocumentDialog from './(dialog)/AddMerchantDocumentDialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { columns } from './columns';
import { getMerchants } from '@/fetcher/api-fetcher';
import { DataTable } from '@/components/DataTable';
import { toast } from '@/hooks/use-toast';
import { MerchantEnrollment } from '@/types';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { statusMap } from '@/types/const';
import { MerchantInfoDialog } from './(dialog)/MerchantInfoDialog';

export default function MerchantsPage() {
  const [data, setData] = useState<MerchantEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState<Date>();

  const loadMerchants = async (url?: string) => {
    setLoading(true);
    try {
      const params = url
        ? { url }
        : {
            search: searchTerm ? searchTerm : ""  ,
            status: status ? status : "",
            exact_date: date ? format(date, "yyyy-MM-dd") : "",
          };

      const response = await getMerchants(params);
      setData(response.results);
      setNext(response.next);
      setPrevious(response.previous);
      setCount(response.count);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commerçants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, [searchTerm, status, date]);

  const actionsColumn = {
    header: "Actions", 
    cell: (merchant) => (
      <div className="text-right flex gap-2">
        <MerchantInfoDialog merchantData={merchant} onSuccess={() => loadMerchants()} />
      </div>
    ),
    accessorKey: "id",
  }

  const columnsWithActions = [...columns, actionsColumn];

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
          Enrollements
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='flex gap-2'
        >
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard/merchants/enrollment'}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Commencer l&apos;enrollment
          </Button>
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
                  {Object.entries(statusMap).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal transition-colors duration-200",
                      "dark:bg-gray-800/50 bg-gray-50",
                      "dark:border-cyan-900/20 border-cyan-200/20",
                      "dark:focus:border-cyan-500 focus:border-cyan-600",
                      "dark:text-gray-100 text-gray-900",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "Filtrer par date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={fr}
                    formatters={{
                      formatCaption: (date, options) => format(date, "MMMM yyyy", { locale: fr }),
                      formatDay: (date) => format(date, "d")
                    }}
                  />
                </PopoverContent>
              </Popover>

              {(status || date || searchTerm) && (
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
                onPageChange: loadMerchants,
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}