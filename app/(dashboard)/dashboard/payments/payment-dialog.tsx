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
import { cn } from "@/lib/utils";
import { FileText, Info, X, Printer, Edit } from "lucide-react";
import { motion } from "framer-motion";
import type { MerchantPayment } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import IFramePdfDialog from "../merchants/(dialog)/IFramePdfDialog";
import {
  getPaymentStatusColor,
  getPaymentTypeColor,
  paymentStatusMap,
  paymentTypeMap
} from "@/types/const";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import UpdateStatusDialog from "./update-status-dialog";

interface InfoDialogProps {
  payment: MerchantPayment;
}

export function PaymentDialog({ payment }: InfoDialogProps) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const renderUserInfo = (user: any | null) => {
    if (!user) return "N/A";
    return `${user.first_name} ${user.last_name} (${user.phone_number})`;
  };

  const handleViewDocument = (document: string) => {
    setSelectedDoc(document);
    setIsPdfOpen(true);
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const invoice = document.getElementById('invoice');
      if (!invoice) return;

      const doc = new jsPDF({
        unit: 'mm',
        format: [268, 240],
        orientation: 'portrait'
      });

      const canvasOptions = {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      };

      const canvas = await html2canvas(invoice, {
        ...canvasOptions,
        onclone: (clonedDoc) => {
          const invoiceClone = clonedDoc.getElementById('invoice');
          if (invoiceClone) {
            invoiceClone.style.transform = 'none';
            invoiceClone.style.visibility = 'visible';
            invoiceClone.style.position = 'static';
            invoiceClone.style.left = '0';
            const wrapper = invoiceClone.querySelector('div');
            if (wrapper) {
              wrapper.style.minHeight = '240mm';
              wrapper.style.maxWidth = '248mm';
              wrapper.style.width = '248mm';
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, '', 'FAST');

      doc.save(`facture-${payment.transaction_id || payment.id}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleStatusUpdate = () => {
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "transition-colors duration-200",
              "dark:text-cyan-400 text-cyan-600",
              "dark:hover:text-cyan-300 hover:text-cyan-500",
              "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
            )}
          >
            <Info className="h-4 w-4 mr-2" />
            Info
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] backdrop-blur-sm",
          "dark:bg-cyan-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] overflow-y-auto",
          "not-italic",
          "custom-scrollbar"
        )}
        hideCloseButton={true}
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle
            className={cn(
              "text-2xl font-bold not-italic",
              "dark:from-cyan-400 dark:to-cyan-200 from-cyan-600 to-cyan-500",
              "bg-gradient-to-r bg-clip-text text-transparent"
            )}
          >
            Informations du paiement
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-8 w-8 p-0",
                "hover:bg-cyan-100 dark:hover:bg-cyan-900/40",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2",
                "disabled:pointer-events-none"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Section de facture à imprimer */}
        <div id="invoice" className="absolute left-[-9999px]">
          <div className="bg-white p-8 text-black min-h-[240mm] max-w-[248mm] relative">
            {/* Éléments décoratifs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-50 rounded-tr-full opacity-40"></div>

            {/* En-tête avec design élégant */}
            <div className="relative z-10 border-b-4 border-cyan-600 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-gray-800">FACTURE</h1>
                  </div>
                  <div className="mt-2">
                    <p className="text-base text-gray-700">N° <span className="font-semibold text-cyan-700">{payment.transaction_id || payment.id}</span></p>
                    <p className="text-sm text-gray-600">
                      Émise le: {new Date(payment.created_at || '').toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-600 mb-1">CCIAG</div>
                  <div className="text-base font-bold mb-0.5 text-gray-800">CHAMBRE DE COMMERCE</div>
                  <div className="text-sm font-medium text-gray-700 mb-0.5">D'INDUSTRIE ET D'ARTISANAT</div>
                  <div className="text-sm font-medium text-gray-700">DE GUINÉE</div>
                  <div className="mt-2 text-xs text-gray-600 flex flex-col items-end">
                    <p className="flex items-center"><span className="inline-block w-3 h-3 bg-cyan-600 rounded-full mr-1"></span>Conakry, Guinée</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations client et paiement */}
            <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
              <div className="bg-gradient-to-br from-white to-cyan-50 p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-600"></div>
                <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-cyan-600 mr-2">◆</span> Facturé à
                </h2>
                <div className="space-y-1.5 pl-1">
                  <p className="text-base font-semibold text-gray-800">
                    {payment.merchant?.user?.first_name} {payment.merchant?.user?.last_name}
                  </p>
                  {payment.merchant?.entreprise && (
                    <>
                      <p className="font-semibold text-cyan-700 text-sm">{payment.merchant.entreprise.nom}</p>
                      <p className="text-xs text-gray-600">{payment.merchant.entreprise.adresse}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 flex items-center mb-1">
                          <span className="w-4 h-4 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 mr-2 text-xs font-bold">R</span>
                          RCCM: <span className="font-medium ml-1">{payment.merchant.entreprise.numero_rccm || '-'}</span>
                        </p>
                        <p className="text-xs text-gray-600 flex items-center">
                          <span className="w-4 h-4 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 mr-2 text-xs font-bold">N</span>
                          NIF: <span className="font-medium ml-1">{payment.merchant.entreprise.numero_nif || '-'}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-cyan-50 p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-600"></div>
                <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-cyan-600 mr-2">◆</span> Détails du paiement
                </h2>
                <div className="space-y-2 pl-1">
                  <p className="flex justify-between items-center pb-1 border-b border-gray-100 text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full text-xs">{paymentTypeMap[payment.payment_type]}</span>
                  </p>
                  <p className="flex justify-between items-center pb-1 border-b border-gray-100 text-sm">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-medium text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full text-xs">{paymentStatusMap[payment.status || 'PENDING']}</span>
                  </p>
                  <p className="flex justify-between items-center pb-1 border-b border-gray-100 text-sm">
                    <span className="text-gray-600">Agent:</span>
                    <span className="font-medium text-xs">
                      {payment.paid_by?.first_name} {payment.paid_by?.last_name}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Table des montants */}
            <div className="mb-6 relative z-10">
              <div className="bg-cyan-600 p-3 rounded-t-lg">
                <div className="grid grid-cols-2 font-bold text-white">
                  <span className="text-sm">Description</span>
                  <span className="text-right text-sm">Montant</span>
                </div>
              </div>
              <div className="p-4 bg-white border-2 border-t-0 border-cyan-600 rounded-b-lg shadow-sm">
                <div className="grid grid-cols-2 items-center border-b border-gray-100 pb-3 mb-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Paiement - Adhésion CCIAG</p>
                    <p className="text-xs text-gray-600 mt-1">Frais d'adhésion à la Chambre de Commerce</p>
                  </div>
                  <p className="text-right font-semibold text-sm">{payment.amount.toLocaleString('fr-FR')} GNF</p>
                </div>

                <div className="grid grid-cols-2 items-center text-sm">
                  <p className="font-bold text-gray-700">Sous-total</p>
                  <p className="text-right font-semibold">{payment.amount.toLocaleString('fr-FR')} GNF</p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="relative z-10 bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 rounded-lg shadow mb-6 text-white">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold">Montant Total</span>
                <span className="text-xl font-bold">{payment.amount.toLocaleString('fr-FR')} GNF</span>
              </div>
            </div>

            {/* Notes et conditions */}
            <div className="relative z-10 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-24">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Notes</h3>
              <p className="text-xs text-gray-600">
                Ce document confirme le paiement des frais d'adhésion à la CCIAG.
                Veuillez conserver cette facture comme preuve de paiement.
              </p>
            </div>

            {/* Pied de page */}
            <div className="absolute bottom-0 left-8 right-8 z-10">
              <div className="text-center border-t-2 border-cyan-600 pt-4">
                <p className="text-base font-medium text-cyan-700 mb-2">Merci pour votre confiance!</p>
                <p className="text-xs font-medium mb-2">CHAMBRE DE COMMERCE, D'INDUSTRIE ET D'ARTISANAT DE GUINÉE (CCIAG)</p>
                <div className="text-center text-xs text-gray-600 mt-2">
                  <p>
                    <span className="inline-block w-3 h-3 bg-cyan-600 rounded-full mr-1"></span>
                    Conakry, Guinée
                    <span className="mx-2">|</span>
                    +224 XXX XXX XXX
                    <span className="mx-2">|</span>
                    contact@cciag.gov.gn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu normal du dialog */}
        <div className="grid gap-6 py-6">
          <Card className="dark:bg-cyan-950/30 bg-cyan-50/50 border-cyan-200 dark:border-cyan-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Détails de la transaction</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {payment.transaction_id && (
                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground">Numéro de transaction</Label>
                  <span className="font-medium">{payment.transaction_id}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground">Type de paiement</Label>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit",
                    `${getPaymentTypeColor(payment.payment_type)}`
                  )}>
                    {paymentTypeMap[payment.payment_type]}
                  </span>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground">Statut</Label>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit",
                    `${getPaymentStatusColor(payment.status || 'PENDING')}`
                  )}>
                    {paymentStatusMap[payment.status] || 'En attente'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="text-muted-foreground">Montant</Label>
                <span className="font-medium text-lg">{payment.amount.toLocaleString('fr-FR')} GNF</span>
              </div>
            </CardContent>
          </Card>

          {payment.merchant && (
            <Card className="dark:bg-cyan-950/30 bg-cyan-50/50 border-cyan-200 dark:border-cyan-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Informations du commerçant</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground">Nom complet</Label>
                  <span className="font-medium">
                    {payment.merchant?.user?.first_name} {payment.merchant?.user?.last_name}
                  </span>
                </div>
                {payment.merchant?.user?.phone_number && (
                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">Téléphone</Label>
                    <span className="font-medium">{payment.merchant?.user?.phone_number}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {payment.merchant?.entreprise && (
            <Card className="dark:bg-cyan-950/30 bg-cyan-50/50 border-cyan-200 dark:border-cyan-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Informations de l'entreprise</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">Nom de l'entreprise</Label>
                    <span className="font-medium">{payment.merchant.entreprise.nom}</span>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">Taille</Label>
                    <span className="font-medium">{payment.merchant.entreprise.taille_display}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">Type d'activité</Label>
                    <span className="font-medium">{payment.merchant.entreprise.type_activite}</span>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">Type de commerce</Label>
                    <span className="font-medium">{payment.merchant.entreprise.type_commerce}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">RCCM</Label>
                    <span className="font-medium">{payment.merchant.entreprise.numero_rccm || '-'}</span>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">NIF</Label>
                    <span className="font-medium">{payment.merchant.entreprise.numero_nif || '-'}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground">Adresse</Label>
                  <span className="font-medium">{payment.merchant.entreprise.adresse}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="dark:bg-cyan-950/30 bg-cyan-50/50 border-cyan-200 dark:border-cyan-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Date</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-col space-y-2">
                <Label className="text-muted-foreground">Date de paiement</Label>
                <span className="font-medium">
                  {new Date(payment.created_at || '').toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {payment.paid_by && (
            <Card className="dark:bg-cyan-950/30 bg-cyan-50/50 border-cyan-200 dark:border-cyan-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Agent</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex flex-col space-y-2">
                  <Label className="text-muted-foreground">Nom complet</Label>
                  <span className="font-medium">
                    {payment.paid_by?.first_name} {payment.paid_by?.last_name}
                  </span>
                </div>
                {payment.paid_by?.phone_number && (
                  <div className="flex flex-col space-y-2">
                    <Label className="text-muted-foreground">Téléphone</Label>
                    <span className="font-medium">{payment.paid_by?.phone_number}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          {payment.status === 'PAID'
            ? (
              <Button
                variant="default"
                onClick={handlePrint}
                disabled={isPrinting}
                className={cn(
                  "bg-cyan-600 hover:bg-cyan-700",
                  "dark:bg-cyan-700 dark:hover:bg-cyan-800",
                  "text-white",
                  "flex items-center gap-2"
                )}
              >
                <Printer className="h-4 w-4" />
                {isPrinting ? "Impression..." : "Imprimer la facture"}
              </Button>
            ) : null}

          {payment.status === 'PENDING' || payment.status === 'FAILED'
            ? (
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(true)}
                className={cn(
                  "dark:bg-cyan-950/50 dark:hover:bg-cyan-900/70",
                  "border-cyan-500 dark:border-cyan-700/50",
                  "flex items-center gap-2"
                )}
              >
                <Edit className="h-4 w-4" />
                Modifier le statut
              </Button>
            ) : null}
        </DialogFooter>
      </DialogContent>

      <IFramePdfDialog
        isOpen={isPdfOpen}
        onClose={() => {
          setIsPdfOpen(false);
          setSelectedDoc(null);
        }}
        base64Data={selectedDoc}
      />
      <UpdateStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        payment={payment}
        onStatusUpdated={handleStatusUpdate}
      />
    </Dialog>
  );
}
