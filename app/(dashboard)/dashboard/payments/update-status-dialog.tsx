'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MerchantPayment, PaymentStatus, Banque } from "@/types";
import { paymentStatusMap } from "@/types/const";
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { updateMerchantPayment, getBanques } from '@/fetcher/api-fetcher';

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment: MerchantPayment;
  onStatusUpdated?: () => void;
}

export default function UpdateStatusDialog({
  isOpen,
  onClose,
  payment,
  onStatusUpdated
}: UpdateStatusDialogProps) {
  const [status, setStatus] = useState<PaymentStatus>(payment.status || 'PENDING');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [banks, setBanques] = useState<Banque[]>([]);
  const [loadingBanques, setLoadingBanques] = useState(false);
  
  // Charger les banques depuis l'API
  useEffect(() => {
    const loadBanques = async () => {
      setLoadingBanques(true);
      try {
        const response = await getBanques({ is_active: true });
        setBanques(response.results);
      } catch (error) {
        console.error('Erreur lors du chargement des banques:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les banques",
          variant: "destructive",
        });
      } finally {
        setLoadingBanques(false);
      }
    };
    
    if (isOpen) {
      loadBanques();
    }
  }, [isOpen]);
  
  const handleUpdateStatus = async () => {
    if (status === payment.status) {
      onClose();
      return;
    }
    
    // Vérifier que la banque est sélectionnée si le statut est "PAID"
    if (status === 'PAID' && (!selectedBank || selectedBank.trim() === '')) {
      toast({
        title: "Banque requise",
        description: "Veuillez sélectionner une banque pour valider le paiement",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      payment.status = status;
      // Gérer l'ID de la banque selon le statut
      if (status === 'PAID' && selectedBank) {
        payment.banque_id = parseInt(selectedBank);
      } else if (status === 'PENDING') {
        payment.banque_id = null;
      }
      payment.payment_type = 'BANK'
      await updateMerchantPayment(payment, payment.id)
      toast({
        title: "Statut mis à jour",
        description: `Le statut du paiement a été modifié à '${paymentStatusMap[status]}'`,
      });
      
      onStatusUpdated?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      let statusErr = error?.response?.data?.status
      statusErr = statusErr || "Une erreur est survenue lors de la mise à jour du statut"
      toast({
        title: "Erreur",
        description: statusErr,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[450px] backdrop-blur-sm",
          "dark:bg-cyan-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "custom-scrollbar",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        )}
        hideCloseButton={true}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle
            className={cn(
              "text-xl font-bold",
              "dark:from-cyan-400 dark:to-cyan-200 from-cyan-600 to-cyan-500",
              "bg-gradient-to-r bg-clip-text text-transparent"
            )}
          >
            Modifier le statut du paiement
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Label className="text-base font-medium mb-3 block">
            Sélectionnez le nouveau statut
          </Label>
          
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as PaymentStatus)}
            className="flex flex-col space-y-3"
          >
            <div className={cn(
              "flex items-center space-x-2 rounded-md border p-3",
              "dark:bg-cyan-950/30 bg-cyan-50/50",
              "dark:border-cyan-900/50 border-cyan-200",
              status === 'PENDING' && "border-cyan-500 dark:border-cyan-500"
            )}>
              <RadioGroupItem value="PENDING" id="status-pending" />
              <Label htmlFor="status-pending" className="flex-1 cursor-pointer">
                En attente
              </Label>
            </div>
            
            <div className={cn(
              "flex items-center space-x-2 rounded-md border p-3",
              "dark:bg-cyan-950/30 bg-cyan-50/50",
              "dark:border-cyan-900/50 border-cyan-200",
              status === 'PAID' && "border-cyan-500 dark:border-cyan-500"
            )}>
              <RadioGroupItem value="PAID" id="status-paid" />
              <Label htmlFor="status-paid" className="flex-1 cursor-pointer">
                Payé
              </Label>
            </div>
          </RadioGroup>
          
          {/* Dropdown pour sélectionner la banque quand le statut est "Payé" */}
          {status === 'PAID' && (
            <div className="mt-4">
              <Label className="text-base font-medium mb-3 block">
                Sélectionnez la banque de paiement
              </Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className={cn(
                  "w-full",
                  "dark:bg-cyan-950/30 bg-cyan-50/50",
                  "dark:border-cyan-900/50 border-cyan-200",
                  "focus:border-cyan-500 dark:focus:border-cyan-500"
                )}>
                  <SelectValue placeholder="Choisir une banque..." />
                </SelectTrigger>
                <SelectContent className={cn(
                  "dark:bg-cyan-950/95 bg-white/95",
                  "dark:border-cyan-900/50 border-cyan-200"
                )}>
                  {loadingBanques ? (
                    <SelectItem value="loading" disabled>
                      Chargement des banques...
                    </SelectItem>
                  ) : (
                    banks.map((bank) => (
                      <SelectItem 
                        key={bank.id} 
                        value={bank.id.toString()}
                        className={cn(
                          "cursor-pointer",
                          "dark:hover:bg-cyan-900/50 hover:bg-cyan-100/50",
                          "dark:focus:bg-cyan-900/50 focus:bg-cyan-100/50"
                        )}
                      >
                        {bank.nom}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="dark:bg-cyan-950/50 dark:hover:bg-cyan-900"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleUpdateStatus}
            disabled={isUpdating || status === payment.status}
            className={cn(
              "bg-cyan-600 hover:bg-cyan-700",
              "dark:bg-cyan-700 dark:hover:bg-cyan-800",
              "text-white"
            )}
          >
            {isUpdating ? "Mise à jour..." : "Mettre à jour le statut"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
