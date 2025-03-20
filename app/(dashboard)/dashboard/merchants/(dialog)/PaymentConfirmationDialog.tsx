import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
}

export function PaymentConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  amount,
}: PaymentConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-cyan-700 dark:text-cyan-300">Confirmation de paiement</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">Voulez-vous effectuer un paiement cash de :</p>
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-2xl font-bold text-center p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300"
            >
              {amount.toLocaleString()} GNF
            </motion.p>
          </div>
        </motion.div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800 text-white"
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}