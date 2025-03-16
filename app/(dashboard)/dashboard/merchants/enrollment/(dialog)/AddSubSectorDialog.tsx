"use client";

import { SubActivity } from "@/types";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { createSubActivity } from "@/fetcher/api-fetcher";
import { motion } from "framer-motion";

interface AddSubSectorDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function AddSubSectorDialog({
  onSuccess,
  trigger,
}: AddSubSectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubActivity>();

  const onSubmit = async (data: SubActivity) => {
    try {
      setIsLoading(true);
      await createSubActivity({
        ...data,
        name: data.name.toUpperCase()
      });
      toast({
        title: "Succès",
        description: "Le sous-secteur d'activité a été ajouté avec succès",
      });
      setIsOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du sous-secteur",
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
            Ajouter un sous-secteur
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-cyan-700 dark:text-cyan-300">Ajouter un sous-secteur d'activité</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Nom du sous-secteur</Label>
              <Input 
                {...register("name", { required: "Le nom du sous-secteur est requis" })}
                placeholder="Ex: Vente au détail"
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
