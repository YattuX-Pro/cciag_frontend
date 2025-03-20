'use client'
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { ConfirmationDialogContent } from "./confirmation-dialog-content";
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";
import { useState } from "react";

export interface ConfirmationDialogProps {
  title: string;
  description?: string;
  actionType: 'approve' | 'deny';
  onConfirm: () => void;
  amount?: number;
}

export function GlobalConfirmationDialog() {
  const { isOpen, title, description, actionType, onConfirm, onOpenChange, amount } = useConfirmationDialog();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;
    
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        "dark:bg-cyan-950 bg-white",
        "border-cyan-200 dark:border-cyan-800",
        "max-w-md w-full"
      )}>
        <AlertDialogHeader>
          <ConfirmationDialogContent
            title={title}
            description={description}
            amount={amount}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={loading}
            className="border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              actionType === 'approve' 
                ? 'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800' 
                : 'bg-red-500 hover:bg-red-600',
              'text-white'
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>En cours...</span>
              </div>
            ) : (
              <span>Confirmer</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
