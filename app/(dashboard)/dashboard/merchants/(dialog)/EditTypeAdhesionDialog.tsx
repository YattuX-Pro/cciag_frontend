"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getTarifications, updateTypeAdhesion, updateMerchant } from "@/fetcher/api-fetcher";
import { ITypeAdhesion, MerchantEnrollment } from "@/types";
import { toast } from "@/hooks/use-toast";
import { TYPE_DEMANDE } from "@/types/const";

interface EditTypeAdhesionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  typeAdhesion: ITypeAdhesion;
  typeAdhesionId: string;
  merchantData: MerchantEnrollment;
  onSuccess?: () => void;
}

const EditTypeAdhesionDialog = ({
  isOpen,
  onClose,
  typeAdhesion,
  typeAdhesionId,
  merchantData,
  onSuccess,
}: EditTypeAdhesionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ITypeAdhesion>({
    type_demande: typeAdhesion?.type_demande || "",
    standard: typeAdhesion?.standard || false,
    premium: typeAdhesion?.premium || false,
    formalisee: typeAdhesion?.formalisee || false,
    non_formalisee: typeAdhesion?.non_formalisee || false,
  });

  const updateTarification = async () => {
    try {
      const { results } = await getTarifications({ limit: 2000 });
      console.log(results)
      let foundTarification;

      if (formData.formalisee) {
        const adhesionType = formData.standard ? 'STANDARD' : formData.premium ? 'PREMIUM' : null;
        const entrepriseSize = merchantData.entreprise?.taille;

        foundTarification = results.find(t =>
          t.type_adhesion === adhesionType &&
          t.type_entreprise === entrepriseSize
        );
      } else if (formData.non_formalisee) {
        const commerceType = merchantData.entreprise?.type_commerce;

        foundTarification = results.find(t =>
          t.type_adhesion === 'MEMBRE' &&
          t.type_entreprise === commerceType
        );
      }

      if (foundTarification) {
        const updatedMerchantData = {
          ...merchantData,
          tarification_adhesion_id: foundTarification.id
        };
        
        await updateMerchant(updatedMerchantData, merchantData.id);
      } else {
        toast({
          title: "Attention",
          description: "Aucune tarification trouvée pour cette configuration",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error loading tarification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la tarification",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type_demande) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un type de demande",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Vérifier la tarification avant de mettre à jour
      const tarificationValid = await updateTarification();
      if (!tarificationValid) {
        setIsSubmitting(false);
        return;
      }

      await updateTypeAdhesion(parseInt(typeAdhesionId), formData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeAdhesionChange = (checked: boolean, field: 'standard' | 'premium') => {
    if (checked) {
      setFormData({
        ...formData,
        standard: false,
        premium: false,
        [field]: true,
      });
    } else {
      setFormData({
        ...formData,
        [field]: false,
      });
    }
  };

  const handleTypeActiviteChange = (checked: boolean, field: 'formalisee' | 'non_formalisee') => {
    const newFormData = {
      ...formData,
      formalisee: false,
      non_formalisee: false,
      [field]: checked,
    };

    // Reset type d'adhésion when selecting "Non Formalisée"
    if (field === 'non_formalisee' && checked) {
      newFormData.standard = false;
      newFormData.premium = false;
    }

    setFormData(newFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[500px]",
          "dark:bg-gray-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] overflow-y-auto",
          "backdrop-blur-sm"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-gray-100">
            Modifier le type d'adhésion
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Type de demande */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type de demande <span className="text-red-500">*</span>
            </Label>
            <div className="bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <Select
                value={formData.type_demande}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    type_demande: value
                  }));
                }}
              >
                <SelectTrigger className={cn(
                  "w-full border-cyan-200 dark:border-cyan-800 focus:ring-cyan-500",
                  "bg-transparent",
                  "text-cyan-700 dark:text-cyan-300",
                  "placeholder:text-cyan-500/50 dark:placeholder:text-cyan-400/50"
                )}>
                  <SelectValue placeholder="Sélectionnez le type de demande" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-cyan-200 dark:border-cyan-800">
                  {TYPE_DEMANDE.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className={cn(
                        "text-sm font-medium",
                        "text-cyan-700 dark:text-cyan-300",
                        "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                        "focus:text-cyan-800 dark:focus:text-cyan-200"
                      )}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 2: Type d'adhésion */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type d'adhésion
            </Label>
            <div className="grid gap-4 bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="standard"
                  checked={formData.standard}
                  onCheckedChange={(checked) => handleTypeAdhesionChange(checked as boolean, 'standard')}
                  className="border-cyan-200 dark:border-cyan-800"
                  disabled={formData.non_formalisee}
                />
                <Label
                  htmlFor="standard"
                  className="text-sm font-medium leading-none text-cyan-700 dark:text-cyan-300"
                >
                  Standard
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="premium"
                  checked={formData.premium}
                  onCheckedChange={(checked) => handleTypeAdhesionChange(checked as boolean, 'premium')}
                  className="border-cyan-200 dark:border-cyan-800"
                  disabled={formData.non_formalisee}
                />
                <Label
                  htmlFor="premium"
                  className="text-sm font-medium leading-none text-cyan-700 dark:text-cyan-300"
                >
                  Premium
                </Label>
              </div>
            </div>
          </div>

          {/* Section 3: Type d'activité */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type d'activité <span className="text-red-500">*</span>
            </Label>
            <div className="grid gap-4 bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="formalisee"
                  checked={formData.formalisee}
                  onCheckedChange={(checked) => handleTypeActiviteChange(checked as boolean, 'formalisee')}
                  className="border-cyan-200 dark:border-cyan-800"
                />
                <Label
                  htmlFor="formalisee"
                  className="text-sm font-medium leading-none text-cyan-700 dark:text-cyan-300"
                >
                  Formalisée
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="nonFormalisee"
                  checked={formData.non_formalisee}
                  onCheckedChange={(checked) => handleTypeActiviteChange(checked as boolean, 'non_formalisee')}
                  className="border-cyan-200 dark:border-cyan-800"
                />
                <Label
                  htmlFor="nonFormalisee"
                  className="text-sm font-medium leading-none text-cyan-700 dark:text-cyan-300"
                >
                  Non formalisée
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-cyan-200 dark:border-cyan-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!formData.type_demande || isSubmitting}
              className="bg-cyan-600 text-white hover:bg-cyan-700"
            >
              {isSubmitting ? "Modification..." : "Modifier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTypeAdhesionDialog;
