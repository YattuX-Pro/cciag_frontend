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
    type_adhesion: typeAdhesion?.type_adhesion || "ORDINAIRE_ADHERENT",
    type_adhesion_display: typeAdhesion?.type_adhesion_display || "",
    formalisee: typeAdhesion?.formalisee || false,
    non_formalisee: typeAdhesion?.non_formalisee || false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type_demande: typeAdhesion?.type_demande || "NOUVELLE_ADHESION",
        type_adhesion: typeAdhesion?.type_adhesion || "ORDINAIRE_ADHERENT",
        type_adhesion_display: typeAdhesion?.type_adhesion_display || "Ordinaire Adhérent - 1.500.000 GNF",
        formalisee: typeAdhesion?.formalisee || false,
        non_formalisee: typeAdhesion?.non_formalisee || false,
      });
    }
  }, [isOpen, typeAdhesion]);

  const updateTarification = async () => {
    try {
      const { results } = await getTarifications({ limit: 2000 });
      let foundTarification;
      
      foundTarification = results.find(t => t.type_adhesion === formData.type_adhesion);

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

  const isTypeActiviteSelected = () => {
    return formData.formalisee || formData.non_formalisee;
  };

  const isTypeAdhesionSelected = () => {
    return !!formData.type_adhesion;
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

    if (!isTypeActiviteSelected()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un type d'activité",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
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

  const handleTypeAdhesionChange = (value: string) => {
    const typeAdhesionMap: Record<string, string> = {
      'DIAMOND': 'Diamond - 10.000.000 GNF',
      'GOLD': 'Gold - 7.000.000 GNF',
      'ARGENT': 'Argent - 5.000.000 GNF',
      'BRONZE_ADHERENT': 'Bronze Adhérent - 3.000.000 GNF',
      'ORDINAIRE_ADHERENT': 'Ordinaire Adhérent - 1.500.000 GNF',
      'BRONZE_AUTO': 'Bronze Auto-entreprenant - 500.000 GNF',
      'ORDINAIRE_AUTO': 'Ordinaire Auto-entreprenant - 100.000 GNF',
    };
    
    setFormData({
      ...formData,
      type_adhesion: value,
      type_adhesion_display: typeAdhesionMap[value] || '',
    });
  };

  const selectTypeActivite = (field: 'formalisee' | 'non_formalisee') => {
    const newFormData = {
      ...formData,
      formalisee: field === 'formalisee',
      non_formalisee: field === 'non_formalisee',
    };
    
    if (field === 'non_formalisee') {
      newFormData.type_adhesion = 'ORDINAIRE_AUTO';
      newFormData.type_adhesion_display = 'Ordinaire Auto-entreprenant - 100.000 GNF';
    } else {
      newFormData.type_adhesion = 'ORDINAIRE_ADHERENT';
      newFormData.type_adhesion_display = 'Ordinaire Adhérent - 1.500.000 GNF';
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
              Type d'adhésion <span className="text-red-500">*</span>
            </Label>
            <div className="bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              {formData.formalisee ? (
                <Select
                  value={formData.type_adhesion}
                  onValueChange={handleTypeAdhesionChange}
                  key="formalisee-select"
                >
                  <SelectTrigger className={cn(
                    "w-full border-cyan-200 dark:border-cyan-800 focus:ring-cyan-500",
                    "bg-transparent",
                    "text-cyan-700 dark:text-cyan-300",
                    "placeholder:text-cyan-500/50 dark:placeholder:text-cyan-400/50"
                  )}>
                    <SelectValue placeholder="Choisir un type d'adhésion" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-cyan-200 dark:border-cyan-800">
                    <SelectItem value="DIAMOND" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Diamond - 10.000.000 GNF</SelectItem>
                    <SelectItem value="GOLD" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Gold - 7.000.000 GNF</SelectItem>
                    <SelectItem value="ARGENT" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Argent - 5.000.000 GNF</SelectItem>
                    <SelectItem value="BRONZE_ADHERENT" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Bronze Adhérent - 3.000.000 GNF</SelectItem>
                    <SelectItem value="ORDINAIRE_ADHERENT" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Ordinaire Adhérent - 1.500.000 GNF</SelectItem>
                  </SelectContent>
                </Select>
              ) : formData.non_formalisee ? (
                <Select
                  value={formData.type_adhesion}
                  onValueChange={handleTypeAdhesionChange}
                  key="nonformalisee-select"
                >
                  <SelectTrigger className={cn(
                    "w-full border-cyan-200 dark:border-cyan-800 focus:ring-cyan-500",
                    "bg-transparent",
                    "text-cyan-700 dark:text-cyan-300",
                    "placeholder:text-cyan-500/50 dark:placeholder:text-cyan-400/50"
                  )}>
                    <SelectValue placeholder="Choisir un type d'adhésion" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-cyan-200 dark:border-cyan-800">
                    <SelectItem value="BRONZE_AUTO" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Bronze Auto-entreprenant - 500.000 GNF</SelectItem>
                    <SelectItem value="ORDINAIRE_AUTO" className={cn(
                      "text-sm font-medium",
                      "text-cyan-700 dark:text-cyan-300",
                      "focus:bg-cyan-50 dark:focus:bg-cyan-900/50",
                      "focus:text-cyan-800 dark:focus:text-cyan-200"
                    )}>Ordinaire Auto-entreprenant - 100.000 GNF</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select disabled>
                  <SelectTrigger className={cn(
                    "w-full border-cyan-200 dark:border-cyan-800 focus:ring-cyan-500",
                    "bg-transparent",
                    "text-cyan-700 dark:text-cyan-300",
                    "placeholder:text-cyan-500/50 dark:placeholder:text-cyan-400/50"
                  )}>
                    <SelectValue placeholder="Sélectionnez d'abord un type d'activité" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-cyan-200 dark:border-cyan-800">
                    <SelectItem value="disabled" className={cn(
                      "text-sm font-medium",
                      "text-gray-400 dark:text-gray-500",
                      "cursor-not-allowed"
                    )}>Sélectionnez d'abord un type d'activité</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Section 3: Type d'activité */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type d'activité <span className="text-red-500">*</span>
            </Label>
            <div className="bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center">
                    <Checkbox
                      id="formalisee"
                      checked={formData.formalisee}
                      onCheckedChange={(checked) => selectTypeActivite('formalisee')}
                      className={cn(
                        "h-5 w-5 rounded-sm border",
                        "border-cyan-200 dark:border-cyan-800",
                        "data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white",
                        "focus:ring-cyan-500 focus:ring-offset-1",
                        "focus:ring-offset-white dark:focus:ring-offset-gray-900"
                      )}
                    />
                    <Label
                      htmlFor="formalisee"
                      className={cn(
                        "ml-2 text-sm font-medium",
                        "text-cyan-700 dark:text-cyan-300"
                      )}
                    >
                      Formalisée
                    </Label>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center">
                    <Checkbox
                      id="nonFormalisee"
                      checked={formData.non_formalisee}
                      onCheckedChange={(checked) => selectTypeActivite('non_formalisee')}
                      className={cn(
                        "h-5 w-5 rounded-sm border",
                        "border-cyan-200 dark:border-cyan-800",
                        "data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white",
                        "focus:ring-cyan-500 focus:ring-offset-1",
                        "focus:ring-offset-white dark:focus:ring-offset-gray-900"
                      )}
                    />
                    <Label
                      htmlFor="nonFormalisee"
                      className={cn(
                        "ml-2 text-sm font-medium",
                        "text-cyan-700 dark:text-cyan-300"
                      )}
                    >
                      Non Formalisée
                    </Label>
                  </div>
                </div>
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
              disabled={!formData.type_demande || !isTypeActiviteSelected() || !isTypeAdhesionSelected() || isSubmitting}
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
