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
import { Search, Store, Mail, Phone, MapPin, CheckCircle2, XCircle, Eye, Building2, Calendar, Users, Briefcase, FileText } from 'lucide-react';
import { MerchantRefusal, Status, type Merchant, type MerchantEnrollment } from '@/types';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { createMerchantRefusal, getMerchants, updateMerchant } from '@/fetcher/api-fetcher';
import { toast } from '@/hooks/use-toast';
import { useConfirmationDialog } from '@/hooks/use-confirmation-dialog';
import { MerchantInfoDialog } from '../merchants/(dialog)/MerchantInfoDialog';
import { AuthActions } from '@/app/(auth)/utils';
import { MerchantCardSkeleton } from '@/components/merchant/merchant-card-skeleton';
import { MerchantRejectDialog } from './(Dialog)/MerchantRejectDialog';

const statusMap = {
  A_VALIDER: 'A Valider',
  VALIDE: 'Accepté',
  REFUSE: 'Reffusé',
  SUSPENDU: 'Suspendu'
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
  const [status, setStatus] = useState('A_VALIDER');
  const [date, setDate] = useState<Date>();

  const { showConfirmation } = useConfirmationDialog();

  const loadMerchants = async (url?: string) => {
    setLoading(true);
    try {
      const params = url
        ? { url }
        : {
          search: searchTerm ? searchTerm : "",
          status: status ? status : "",
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

  const handleApprove = async (merchant: MerchantEnrollment) => {
    showConfirmation({
      title: "Approuver le commerçant",
      description: `Êtes-vous sûr de vouloir approuver le commerçant ${merchant.id_card} ?`,
      actionType: 'approve',
      onConfirm: async () => {
        try {
          const user_id = getUserIdFromToken();
          merchant.status = Status.VALIDE;
          merchant.is_active = true;
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 2);
          const year = expirationDate.getFullYear();
          const month = String(expirationDate.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
          const day = String(expirationDate.getDate()).padStart(2, '0');
          merchant.expired_at = `${year}-${month}-${day}`;
          merchant.validated_by_id = Number(user_id);
          await updateMerchant(merchant, merchant.id);
          toast({
            title: "Succès",
            description: "Le commerçant a été approuvé avec succès",
            variant: "default",
          });
          loadMerchants();
        } catch (err) {
          console.error(err);
          toast({
            title: "Erreur",
            description: "Impossible d'approuver le commerçant",
            variant: "destructive",
          });
        }
      },
    });
  };

  const [denyDialogOpen, setDenyDialogOpen] = useState(false);

  const handleDeny = async (merchant: MerchantEnrollment, reason: string) => {
    try {
      await createMerchantRefusal({
        reason: reason,
        merchant_enrollment_id: merchant.id
      });

      toast({
        title: "Succès",
        description: "Le commerçant a été refusé",
        variant: "default",
      });
      loadMerchants();
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur",
        description: "Impossible de refuser le commerçant",
        variant: "destructive",
      });
    }
  };

  const handleSuspended = (merchant: MerchantEnrollment) => {
    showConfirmation({
      title: "Supendre le commerçant",
      description: `Êtes-vous sûr de vouloir supendre le commerçant ${merchant.id_card} ?`,
      actionType: 'deny',
      onConfirm: async () => {
        try {
          const user_id = getUserIdFromToken();
          merchant.status = Status.SUSPENDU;
          merchant.suspended_by_id = Number(user_id);
          await updateMerchant(merchant, merchant.id);
          toast({
            title: "Succès",
            description: "Le commerçant a été suspendu",
            variant: "default",
          });
          loadMerchants();
        } catch (err) {
          console.error(err);
          toast({
            title: "Erreur",
            description: "Impossible de suspendre le commerçant",
            variant: "destructive",
          });
        }
      },
    });
  }

  const handleReactivate = (merchant: MerchantEnrollment) => {
    showConfirmation({
      title: "Réactiver le commerçant",
      description: `Êtes-vous sûr de vouloir réativer le commerçant ${merchant.id_card} ?`,
      actionType: 'deny',
      onConfirm: async () => {
        try {
          const user_id = getUserIdFromToken();
          merchant.status = Status.VALIDE;
          merchant.suspended_by_id = Number(user_id);
          await updateMerchant(merchant, merchant.id);
          toast({
            title: "Succès",
            description: "Le commerçant a été réactivé",
            variant: "default",
          });
          loadMerchants();
        } catch (err) {
          console.error(err);
          toast({
            title: "Erreur",
            description: "Impossible de suspendre le commerçant",
            variant: "destructive",
          });
        }
      },
    });
  }

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
          Dossier des Commerçants
        </h1>
      </div>

      <Card className={cn(
        "dark:bg-gray-900/50 bg-white/50",
        "backdrop-blur-sm",
        "dark:border-cyan-900/20 border-cyan-200/20"
      )}>
        <CardHeader>
          <CardTitle className="dark:text-gray-100 text-gray-900">
            Validation Dossier
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
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className={cn(
                "w-[180px]",
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
                <SelectItem value="A_VALIDER">A Valider</SelectItem>
                <SelectItem value="VALIDE">Validé</SelectItem>
                <SelectItem value="REFUSE">Reffusé</SelectItem>
                <SelectItem value="SUSPENDU">Suspendu</SelectItem>
              </SelectContent>
            </Select>
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
                  {status === 'A_VALIDER'
                    ? "Il n'y a aucun dossier en attente de validation."
                    : "Aucun dossier ne correspond à vos critères de recherche."}
                </p>
              </div>
            ) : (
              // Afficher les cartes des commerçants
              data.map((merchant) => (
                <Card key={merchant.id} className={cn(
                  "dark:bg-gray-800/50 bg-white",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:border-cyan-500/50 transition-all duration-200",
                  "overflow-hidden"
                )}>
                  <CardContent className="p-0">
                    {/* En-tête avec photo et infos principales */}
                    <div className="relative h-24 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-800/80 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700/50">
                      {/* Photo de profil */}
                      <div className="absolute -bottom-10 left-4 z-10">
                        <div className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-md">
                          <img
                            src={merchant.profile_photo}
                            alt={merchant.id_card}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>

                      {/* Badge de statut */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className={cn(
                          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm",
                          "border-gray-200 dark:border-gray-700",
                          getStatusColor(merchant.status)
                        )}>
                          {statusMap[merchant.status] || merchant.status}
                        </Badge>
                      </div>

                      {/* Motif de fond subtil */}
                      <div className="absolute inset-0 opacity-5 dark:opacity-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1V1zm4 0h2v2H5V1zm4 0h2v2H9V1zm4 0h2v2h-2V1zm4 0h2v2h-2V1zm-16 4h2v2H1V5zm4 0h2v2H5V5zm4 0h2v2H9V5zm4 0h2v2h-2V5zm4 0h2v2h-2V5zm-16 4h2v2H1V9zm4 0h2v2H5V9zm4 0h2v2H9V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9zm-16 4h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z' fill='%23000000' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                          backgroundSize: '20px 20px'
                        }}
                      ></div>
                    </div>

                    {/* Contenu principal */}
                    <div className="px-4 pt-12 pb-4">
                      <div className="space-y-1 mb-4">
                        <h3 className="font-semibold text-lg dark:text-gray-100 text-gray-900">
                          {merchant.id_card}
                        </h3>
                        <p className="text-sm dark:text-gray-400 text-gray-500">
                          {merchant?.user?.last_name} {merchant?.user?.first_name}
                        </p>
                      </div>

                     {/* Informations de l'entreprise */}
                     <div className="mt-5 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Informations entreprise</h4>
                        
                        {merchant.entreprise && (
                          <>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <Building2 className="h-4 w-4 text-cyan-500" />
                              <span>{merchant.entreprise.nom}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <Calendar className="h-4 w-4 text-cyan-500" />
                              <span>Créée le {new Date(merchant.entreprise.date_creation).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <Users className="h-4 w-4 text-cyan-500" />
                              <span>{merchant.entreprise.nombre_employe_display}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <Briefcase className="h-4 w-4 text-cyan-500" />
                              <span>{merchant.entreprise.type_commerce}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <FileText className="h-4 w-4 text-cyan-500" />
                              <span>Nom: {merchant.entreprise.nom}</span>
                            </div>
                          </>
                        )}
                      </div>


                      {/* Signature */}
                      <div className="mt-4 flex justify-start">
                        <div className="h-20 w-20 bg-white rounded-md">
                          <img
                            src={merchant.signature_photo}
                            alt="Signature"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <MerchantInfoDialog merchantData={merchant} onSuccess={() => loadMerchants()} />
                      <div className="flex gap-2">
                        {merchant.status === Status.A_VALIDER && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              onClick={() => setDenyDialogOpen(true)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <MerchantRejectDialog
                              isOpen={denyDialogOpen}
                              onClose={() => setDenyDialogOpen(false)}
                              onConfirm={(reason) => handleDeny(merchant, reason)}
                              merchant={merchant}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10"
                              onClick={() => handleApprove(merchant)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {merchant.status === Status.VALIDE && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
                            onClick={() => handleSuspended(merchant)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                          </Button>
                        )}
                        {merchant.status === Status.SUSPENDU && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                            onClick={() => handleReactivate(merchant)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                          </Button>
                        )}
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