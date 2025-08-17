"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Banque } from "@/types";
import { createBanque, updateBanque } from "@/fetcher/api-fetcher";

interface AddBanqueDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  banque?: Banque;
  isEdit?: boolean;
}

export default function AddBanqueDialog({
  onSuccess,
  trigger,
  banque,
  isEdit,
}: AddBanqueDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Banque>({
    defaultValues: {
      is_active: true,
    },
  });

  const watchedIsActive = watch("is_active");

  // Set form values when banque changes or dialog opens
  useEffect(() => {
    if (banque && isOpen) {
      setValue("nom", banque.nom);
      setValue("is_active", banque.is_active);
    }
  }, [banque, isOpen, setValue]);

  const onSubmit = async (data: Banque) => {
    setIsLoading(true);
    try {
      if (isEdit && banque?.id) {
        await updateBanque(data, banque.id);
        toast({
          title: "Succès",
          description: "Banque modifiée avec succès",
        });
      } else {
        await createBanque(data);
        toast({
          title: "Succès",
          description: "Banque créée avec succès",
        });
      }
      
      setIsOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: isEdit 
          ? "Erreur lors de la modification de la banque"
          : "Erreur lors de la création de la banque",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="link" 
            className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 p-0 h-auto font-medium"
          >
            {isEdit ? "Modifier" : "Ajouter une nouvelle banque"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-cyan-700 dark:text-cyan-300">
            {isEdit ? "Modifier une banque" : "Ajouter une banque"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Nom de la banque</Label>
              <Input
                {...register("nom", {
                  required: "Le nom de la banque est requis",
                  minLength: {
                    value: 2,
                    message: "Le nom doit contenir au moins 2 caractères",
                  },
                })}
                placeholder="Ex: Banque Centrale de Guinée"
                className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              />
              {errors.nom && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.nom.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
                className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700"
              />
              <Label htmlFor="is_active" className="text-cyan-700 dark:text-cyan-300">
                Banque active
              </Label>
            </div>
          </motion.div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
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
                  {isEdit ? "Modification en cours..." : "Ajout en cours..."}
                </>
              ) : (
                isEdit ? "Modifier" : "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
