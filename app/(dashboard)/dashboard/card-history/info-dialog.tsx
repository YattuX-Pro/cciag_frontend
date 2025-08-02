'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { MerchantEnrollementHistory, UserDataForStatistic } from "@/types";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import IFramePdfDialog from "../merchants/(dialog)/IFramePdfDialog";
import { getStatusColor, paymentStatusMap, paymentType, statusMap } from "@/types/const";

interface InfoDialogProps {
  merchant: MerchantEnrollementHistory;
}

export function InfoDialog({ merchant }: InfoDialogProps) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const renderUserInfo = (user: UserDataForStatistic | null) => {
    if (!user) return "N/A";
    return `${user.first_name} ${user.last_name} (${user.phone_number})`;
  };

  const handleViewDocument = (document: string) => {
    setSelectedDoc(document);
    setIsPdfOpen(true);
  };

  useEffect(()=>{
    console.log(merchant)
  })

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
          "dark:bg-gray-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] overflow-y-auto"
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-2xl font-bold",
              "dark:from-cyan-400 dark:to-cyan-200 from-cyan-600 to-cyan-500",
              "bg-gradient-to-r bg-clip-text text-transparent"
            )}
          >
            Informations du marchand
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-600/20 border"
              )}>
                <h4 className="font-semibold mb-3 text-lg dark:text-cyan-400 text-cyan-600">Informations de base</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Numéro de carte:</span> {merchant.id_card}</p>
                  <p><span className="font-medium">Carte :</span> {merchant.is_active ? "Actif" : "Non Actif"}</p>
                  <p><span className="font-medium">Statut:</span> {
                    statusMap[merchant.status] ?  (
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full  font-medium",
                          getStatusColor(statusMap[merchant.status])
                        )}
                      >
                        {statusMap[merchant.status]}
                      </span>
                    ) : (
                      <></>
                    )
                  }</p>
                  <p><span className="font-medium">Date de création:</span> {format(new Date(merchant.created_at), "dd/MM/yyyy HH:mm")}</p>
                </div>
              </div>
              <div className={cn(
                "p-4 rounded-lg",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-600/20 border"
              )}>
                <h4 className="font-semibold mb-3 text-lg dark:text-cyan-400 text-cyan-600">Adresse</h4>
                <div className="space-y-2">
                  <p>{merchant.address.name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-600/20 border"
              )}>
                <h4 className="font-semibold mb-3 text-lg dark:text-cyan-400 text-cyan-600">Historique des actions</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Soumis par:</span> {renderUserInfo(merchant.created_by)}</p>
                  <p><span className="font-medium">Validé par:</span> {renderUserInfo(merchant.validated_by)}</p>
                  <p><span className="font-medium">Imprimé par:</span> {renderUserInfo(merchant.printed_by)}</p>
                  <p><span className="font-medium">Payé par:</span> {renderUserInfo(merchant.payed_by)}</p>
                  {merchant.suspended_by && <p><span className="font-medium">Suspendu par:</span> {renderUserInfo(merchant.suspended_by)}</p>}
                  {merchant.refused_by && <p><span className="font-medium">Refusé par:</span> {renderUserInfo(merchant.refused_by)}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-lg",
            "dark:bg-gray-800/50 bg-gray-50",
            "dark:border-cyan-900/20 border-cyan-600/20 border"
          )}>
            <h4 className="font-semibold mb-3 text-lg dark:text-cyan-400 text-cyan-600">Paiements</h4>
            <div className="space-y-2">
              {merchant.payments && merchant.payments.length > 0 ? (
                merchant.payments.map((payment, index) => (
                  <p key={index}><span className="font-medium">{index + 1} - Statut du paiement :</span> { paymentStatusMap[payment.status] || payment.status} {payment.status === paymentType.PAID ? 'le ' + new Date(payment.created_at).toLocaleDateString() : null} </p>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Aucun paiement enregistré</p>
              )}
            </div>
          </div>

          <div className={cn(
            "p-4 rounded-lg",
            "dark:bg-gray-800/50 bg-gray-50",
            "dark:border-cyan-900/20 border-cyan-600/20 border"
          )}>
            <h4 className="font-semibold mb-3 text-lg dark:text-cyan-400 text-cyan-600">Documents</h4>
            <div className="space-y-4">
              {merchant.documents && merchant.documents.length > 0 ? (
                merchant.documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      "dark:bg-gray-900/50 bg-gray-100",
                      "dark:border-cyan-900/20 border-cyan-600/20 border"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 dark:text-cyan-400 text-cyan-600" />
                      <span className="dark:text-gray-300 text-gray-600">
                        {doc.name}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewDocument(doc.document)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        "dark:bg-cyan-500/10 bg-cyan-50",
                        "dark:text-cyan-400 text-cyan-600",
                        "hover:bg-cyan-100 dark:hover:bg-cyan-500/20",
                        "transition-colors duration-200"
                      )}
                    >
                      Voir
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Aucun document disponible</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <IFramePdfDialog
        isOpen={isPdfOpen}
        onClose={() => {
          setIsPdfOpen(false);
          setSelectedDoc(null);
        }}
        base64Data={selectedDoc}
      />
    </Dialog>
  );
}
