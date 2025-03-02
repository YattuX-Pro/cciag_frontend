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
import type { MerchantPayment, UserDataForStatistic } from "@/types";
import { format } from "date-fns";
import { useState } from "react";
import IFramePdfDialog from "../merchants/(dialog)/IFramePdfDialog";
import { getStatusColor, statusMap } from "@/types/const";

interface InfoDialogProps {
  payment: MerchantPayment;
}

export function PaymentDialog({ payment }: InfoDialogProps) {
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
            Informations du paiement
          </DialogTitle>
        </DialogHeader>

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
