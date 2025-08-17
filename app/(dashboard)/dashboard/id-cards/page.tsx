'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Store, Mail, Phone, MapPin, CheckCircle2, XCircle, Eye, Printer, Calendar, User } from 'lucide-react';
import { Status, type Merchant, type MerchantEnrollment } from '@/types';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { getMerchants, updateMerchant } from '@/fetcher/api-fetcher';
import { toast } from '@/hooks/use-toast';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { AuthActions } from '@/app/(auth)/utils';
import { MerchantCardSkeleton } from '@/components/merchant/merchant-card-skeleton';
import BadgeCardDialog from './(dialog)/BadgeCardDialog';

const statusMap = {
  A_VALIDER: 'A Valider',
  VALIDE: 'Accepté',
  REFUSE: 'Reffusé',
  SUSPENDU: 'SUSPENDU'
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'VALIDE':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
    case 'REFUSE':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'SUSPENDU':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  }
};

export default function MerchantReviewPage() {
  const [data, setData] = useState<MerchantEnrollment[]>([]);
  const { getUserIdFromToken } = AuthActions();
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const { showConfirmation } = useConfirmationDialog();

  const loadMerchants = async (url?: string) => {
    setLoading(true);
    try {
      const params = url
        ? { url }
        : {
          search: searchTerm ? searchTerm : "",
          status: "VALIDE",
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
        description: "Impossible de charger les adhérents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, [searchTerm]);


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

      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}>
          Cartes
        </h1>
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
          {/* Search and Filter */}
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
          </div>

          {/* Merchant Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Afficher 6 skeletons pendant le chargement
              [...Array(6)].map((_, index) => (
                <MerchantCardSkeleton key={index} />
              ))
            ) : data.length === 0 ? (
              // Message quand il n'y a pas de commerçants
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Store className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  Aucun dossier trouvé
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucun dossier ne correspond à vos critères de recherche.
                </p>
              </div>
            ) : (
              // Afficher les cartes des commerçants
              data.map((merchant) => (
                <Card key={merchant.id} className={cn(
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
                          {merchant.id_card}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn(
                        merchant.is_active && "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
                        !merchant.is_active && "bg-red-500/10 text-red-500 border-red-500/20",
                      )}>
                        {merchant.is_active ? 'Active' : 'Non Active'}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 dark:text-cyan-400 text-cyan-600" />
                        <span className="font-medium dark:text-gray-100 text-gray-900">
                          {merchant?.user.first_name} {merchant?.user.last_name}
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
                              {new Date(merchant.created_at).toLocaleDateString()}
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
                              {new Date(merchant?.expired_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-center items-center border-t dark:border-cyan-900/20 border-cyan-200/20">
                        <BadgeCardDialog merchant={merchant} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      {(previous || next || count > 0) && (
        <Card className={cn(
          "mt-4",
          "dark:bg-gray-900/50 bg-white/50",
          "backdrop-blur-sm",
          "dark:border-cyan-900/20 border-cyan-200/20"
        )}>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-7 items-center justify-center rounded px-3 text-xs",
                  count === 0 ? "bg-gray-500/10 text-gray-500" : "bg-cyan-500/10 text-cyan-500"
                )}>
                  {count} résultats
                </div>
                {count > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Page {next ? Math.ceil(count / 10) - (next ? 1 : 0) : Math.ceil(count / 10)} sur {Math.ceil(count / 10)}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => previous && loadMerchants(previous)}
                  disabled={!previous || loading}
                  className={cn(
                    "hover:bg-cyan-500/10 hover:text-cyan-500",
                    "disabled:opacity-50"
                  )}
                >
                  {'<<'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => next && loadMerchants(next)}
                  disabled={!next || loading}
                  className={cn(
                    "hover:bg-cyan-500/10 hover:text-cyan-500",
                    "disabled:opacity-50"
                  )}
                >
                  {'>>'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
