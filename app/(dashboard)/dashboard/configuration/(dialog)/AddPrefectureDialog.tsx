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
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Prefecture, Region } from "@/types";
import { createPrefecture, updatePrefecture, getRegions } from "@/fetcher/api-fetcher";
import SearchableSelect from "@/components/SearchableSelect";

interface AddPrefectureDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  prefecture?: Prefecture;
  isEdit?: boolean;
}

export default function AddPrefectureDialog({
  onSuccess,
  trigger,
  prefecture,
  isEdit,
}: AddPrefectureDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<Prefecture>();

  useEffect(() => {
    if (prefecture && isOpen) {
      setValue("name", prefecture.name);
      setValue("region_id", prefecture.region_id);
    }
  }, [prefecture, isOpen, setValue]);

  useEffect(() => {
    if (isOpen) {
      const loadRegions = async () => {
        setLoadingRegions(true);
        try {
          const response = await getRegions({limit: 1000});
          setRegions(response?.results || []);
        } catch (error) {
          console.error(error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les régions",
            variant: "destructive",
          });
        } finally {
          setLoadingRegions(false);
        }
      };
      loadRegions();
    }
  }, [isOpen]);

  const onSubmit = async (data: Prefecture) => {
    try {
      setIsLoading(true);
      if (isEdit && prefecture) {
        await updatePrefecture({
          ...data,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        }, prefecture.id);
        toast({
          title: "Succès",
          description: "La préfecture a été modifiée avec succès.",
        });
      } else {
        await createPrefecture({
          ...data,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        });
        toast({
          title: "Succès",
          description: "La préfecture a été ajoutée avec succès.",
        });
      }
      setIsOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: isEdit
          ? "Une erreur est survenue lors de la modification de la préfecture."
          : "Une erreur est survenue lors de l'ajout de la préfecture.",
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
            {isEdit ? "Modifier" : "Ajouter une nouvelle préfecture"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-cyan-700 dark:text-cyan-300">
            {isEdit ? "Modifier une préfecture" : "Ajouter une préfecture"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Nom de la préfecture</Label>
              <Input 
                {...register("name", { required: "Le nom de la préfecture est requis" })}
                placeholder="Ex: Conakry"
                className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Région</Label>
              {loadingRegions ? (
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">Chargement des régions...</span>
                </div>
              ) : (
                <SearchableSelect
                  control={control}
                  {...register("region_id", { required: "La région est requise" })}
                  name="region_id"
                  label=""
                  data={regions}
                  valueKey="name"
                  currentValue={prefecture?.region?.id}
                  placeholder="Sélectionnez une région"
                />
              )}
              {errors.region_id && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.region_id.message}
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