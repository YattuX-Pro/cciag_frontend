'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Smartphone, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  initiateOrangeMoneyPayment, 
  checkOrangeMoneyPaymentStatus,
  cancelOrangeMoneyPayment
} from "@/fetcher/api-fetcher";
import type { MerchantPayment } from "@/types";

interface OrangeMoneyDialogProps {
  merchant_payment: MerchantPayment;
  onPaymentSuccess?: () => void;
}

interface OrangeMoneyPayment {
  id: number;
  order_id: string;
  amount: number;
  status: string;
  currency: string;
  merchant_name: string;
  initiated_at: string;
  completed_at: string | null;
  payment_url: string;
}

export function OrangeMoneyDialog({ merchant_payment, onPaymentSuccess }: OrangeMoneyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const getPaymentAmount = () => {
    return merchant_payment.amount;
  };
  
  const amount = getPaymentAmount();
  const [currentPayment, setCurrentPayment] = useState<{
    order_id: string;
    payment_url: string;
    status: string;
  } | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Fonction pour reprendre un paiement échoué
  const handleRetryPayment = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Erreur",
        description: "Montant invalide pour ce type d'adhésion",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await initiateOrangeMoneyPayment({
        merchant_payment_id: merchant_payment.id,
      });

      if (response.success) {
        setCurrentPayment({
          order_id: response.order_id!,
          payment_url: response.payment_url!,
          status: 'INITIATED'
        });
        
        toast({
          title: "Paiement repris",
          description: "Nouveau paiement Orange Money initié avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de la reprise du paiement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur reprise paiement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la reprise du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'PENDING':
      case 'INITIATED':
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
      case 'COMPLETED':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'FAILED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'PENDING':
      case 'INITIATED':
      default:
        return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  const handleInitiatePayment = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "Erreur",
        description: "Montant invalide pour ce type d'adhésion",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await initiateOrangeMoneyPayment({
        merchant_payment_id: merchant_payment.id,
      });

      if (response.success) {
        setCurrentPayment({
          order_id: response.order_id!,
          payment_url: response.payment_url!,
          status: 'INITIATED'
        });
        
        toast({
          title: "Succès",
          description: "Paiement Orange Money initié avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de l'initiation du paiement",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur initiation paiement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'initiation du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!currentPayment) return;

    setIsCheckingStatus(true);
    try {
      const response = await checkOrangeMoneyPaymentStatus(currentPayment.order_id);
      
      if (response.success) {
        setCurrentPayment(prev => prev ? {
          ...prev,
          status: response.status
        } : null);

        if (response.status === 'SUCCESS' || response.status === 'PAID') {
          toast({
            title: "Paiement réussi",
            description: "Le paiement Orange Money a été effectué avec succès",
          });
          onPaymentSuccess?.();
        }
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de la vérification du statut",
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
      setIsCheckingStatus(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!currentPayment) return;

    setIsLoading(true);
    try {
      const response = await cancelOrangeMoneyPayment(currentPayment.order_id);
      
      if (response.success) {
        setCurrentPayment(prev => prev ? {
          ...prev,
          status: 'CANCELLED'
        } : null);
        
        toast({
          title: "Paiement annulé",
          description: "Le paiement Orange Money a été annulé",
        });
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Erreur lors de l'annulation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur annulation paiement:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'annulation du paiement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPaymentUrl = () => {
    if (currentPayment?.payment_url) {
      window.open(currentPayment.payment_url, '_blank');
    }
  };

  const resetDialog = () => {
    setCurrentPayment(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "transition-all duration-200",
            merchant_payment.status === 'FAILED' 
              ? "dark:border-red-500/20 border-red-300/20 dark:text-red-400 text-red-600 dark:hover:bg-red-500/10 hover:bg-red-500/10 dark:hover:border-red-400 hover:border-red-500"
              : "dark:border-orange-500/20 border-orange-300/20 dark:text-orange-400 text-orange-600 dark:hover:bg-orange-500/10 hover:bg-orange-500/10 dark:hover:border-orange-400 hover:border-orange-500"
          )}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          {merchant_payment.status === 'FAILED' ? 'Reprendre Orange Money' : 'Orange Money'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className={cn(
        "max-w-2xl w-full",
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        "dark:bg-gray-900 bg-white",
        "dark:border-orange-500/20 border-orange-300/20",
        "shadow-lg"
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "flex items-center gap-2 text-xl",
            merchant_payment.status === 'FAILED' 
              ? "dark:text-red-400 text-red-600"
              : "dark:text-orange-400 text-orange-600"
          )}>
            <Smartphone className="h-6 w-6" />
            {merchant_payment.status === 'FAILED' ? 'Reprendre le paiement Orange Money' : 'Paiement Orange Money'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Merchant Info */}
          <Card className="dark:bg-gray-800/50 bg-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium dark:text-gray-300 text-gray-700">
                Informations du marchand
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-gray-600">Nom:</span>
                <span className="font-medium dark:text-gray-200 text-gray-800">
                  {merchant_payment?.merchant?.user?.first_name} {merchant_payment?.merchant?.user?.last_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-gray-600">Téléphone:</span>
                <span className="font-medium dark:text-gray-200 text-gray-800">
                  {merchant_payment?.merchant?.user?.phone_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-gray-600">Email:</span>
                <span className="font-medium dark:text-gray-200 text-gray-800">
                  {merchant_payment?.merchant?.user?.email}
                </span>
              </div>
            </CardContent>
          </Card>

          {!currentPayment ? (
            /* Payment Initiation Form */
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300 text-gray-700">
                  Montant du Paiement
                </Label>
                <div className={cn(
                  "mt-1 p-3 rounded-md border",
                  "dark:bg-gray-800 bg-gray-50",
                  "dark:border-orange-500/20 border-orange-300/20",
                  "flex items-center justify-between"
                )}>
                  <span className="text-2xl font-bold dark:text-orange-400 text-orange-600">
                    {amount.toLocaleString()} GNF
                  </span>
                  <span className="text-sm dark:text-gray-400 text-gray-600">
                    Montant automatique
                  </span>
                </div>
                <p className="text-xs dark:text-gray-500 text-gray-500 mt-1">
                  Le montant est déterminé automatiquement selon le type d'adhésion
                </p>
              </div>

              <div className={cn(
                "p-4 rounded-lg border",
                "dark:bg-orange-500/5 bg-orange-50",
                "dark:border-orange-500/20 border-orange-300/20"
              )}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="text-sm dark:text-orange-300 text-orange-700">
                    <p className="font-medium mb-1">Instructions de paiement:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Le marchand recevra un lien de paiement Orange Money</li>
                      <li>• Il pourra effectuer le paiement directement via son mobile</li>
                      <li>• Vous pouvez suivre le statut du paiement en temps réel</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Payment Status Display */
            <div className="space-y-4">
              <Card className={cn(
                "border-2",
                getStatusColor(currentPayment.status)
              )}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getStatusIcon(currentPayment.status)}
                    Statut du paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">ID de commande:</span>
                    <span className="font-mono text-sm">{currentPayment.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Statut:</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(currentPayment.status)
                    )}>
                      {currentPayment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Montant:</span>
                    <span className="font-medium">{amount} GNF</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {!currentPayment ? (
            <>
              <DialogClose asChild>
                <Button variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button
                onClick={merchant_payment.status === 'FAILED' ? handleRetryPayment : handleInitiatePayment}
                disabled={isLoading || !amount}
                className={cn(
                  merchant_payment.status === 'FAILED' 
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700",
                  "text-white"
                )}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {merchant_payment.status === 'FAILED' ? 'Reprise...' : 'Initiation...'}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {merchant_payment.status === 'FAILED' ? 'Reprendre le paiement' : 'Initier le paiement'}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {currentPayment.payment_url && (
                <Button
                onClick={handleOpenPaymentUrl}
                className={cn(
                  "flex-1",
                  "bg-orange-600 hover:bg-orange-700",
                  "text-white"
                )}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir le lien de paiement
              </Button>
              )}
              <Button onClick={resetDialog}>
                Fermer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
