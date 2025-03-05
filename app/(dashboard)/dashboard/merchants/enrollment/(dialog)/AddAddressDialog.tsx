"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Address } from "@/types";
import { createAddress } from "@/fetcher/api-fetcher";

interface AddAddressDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}


export default function AddAddressDialog({
  onSuccess,
  trigger,
}: AddAddressDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Address>();

  const onSubmit = async (data: Address) => {
    try {
      setIsLoading(true);
      await createAddress(data);
      toast({
        title: "Succès",
        description: "L'adresse a été ajoutée avec succès.",
      });
      setIsOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'adresse.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="link" 
            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 p-0 h-auto font-medium"
          >
            Ajouter une nouvelle adresse
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-cyan-700 dark:text-cyan-300">Ajouter une ville</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Nom de l'adresse</Label>
              <Input 
                {...register("name", { required: "Le nom de l'adresse est requis" })}
                placeholder="Ex: Conakry"
                className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </motion.div>
          <DialogFooter>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
