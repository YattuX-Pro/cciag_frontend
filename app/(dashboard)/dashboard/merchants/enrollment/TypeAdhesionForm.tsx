"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TYPE_DEMANDE } from "@/types/const";
import type { TypeAdhesionData } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

interface TypeAdhesionFormProps {
  onSubmit: (data: TypeAdhesionData) => void;
  initialData?: TypeAdhesionData;
  onBack: () => void;
}

export default function TypeAdhesionForm({ onSubmit, initialData, onBack }: TypeAdhesionFormProps) {
  const [formData, setFormData] = useState<TypeAdhesionData>(initialData || {
    type_demande: 'NOUVELLE_ADHESION',
    typeAdhesion: {
      standard: false,
      premium: false,
    },
    typeActivite: {
      formalisee: false,
      nonFormalisee: false,
    },
   
  });

  const isTypeAdhesionSelected = () => {
    return formData.typeAdhesion.standard || formData.typeAdhesion.premium;
  };

  const isTypeActiviteSelected = () => {
    return formData.typeActivite.formalisee || formData.typeActivite.nonFormalisee;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type_demande) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un motif de la demande",
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

    onSubmit(formData);
  };

  const isFormValid = formData.type_demande && 
  isTypeActiviteSelected() && 
  (!formData.typeActivite.nonFormalisee ? isTypeAdhesionSelected() : true);

  const handleTypeAdhesionChange = (checked: boolean, field: keyof typeof formData.typeAdhesion) => {
    if (checked) {
      setFormData({
        ...formData,
        typeAdhesion: {
          standard: false,
          premium: false,
          [field]: true,
        },
      });
    } else {
      setFormData({
        ...formData,
        typeAdhesion: {
          ...formData.typeAdhesion,
          [field]: false,
        },
      });
    }
  };

  const handleTypeActiviteChange = (checked: boolean, field: keyof typeof formData.typeActivite) => {
    const newFormData = {
      ...formData,
      typeActivite: {
        formalisee: false,
        nonFormalisee: false,
        [field]: checked,
      },
    };

    // Réinitialiser le type d'adhésion si "Non Formalisée" est sélectionné
    if (field === 'nonFormalisee' && checked) {
      newFormData.typeAdhesion = {
        standard: false,
        premium: false,
      };
    }

    setFormData(newFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-8 dark:bg-cyan-950">
        <div className="grid gap-8">
          {/* Section 3: Type d'activité */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type d'activité <span className="text-red-500">*</span>
            </Label>
            <div className="grid gap-4 bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="formalisee"
                  checked={formData.typeActivite.formalisee}
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
                  checked={formData.typeActivite.nonFormalisee}
                  onCheckedChange={(checked) => handleTypeActiviteChange(checked as boolean, 'nonFormalisee')}
                  className="border-cyan-200 dark:border-cyan-800"
                />
                <Label
                  htmlFor="nonFormalisee"
                  className="text-sm font-medium leading-none text-cyan-700 dark:text-cyan-300"
                >
                  Non Formalisée
                </Label>
              </div>
            </div>
          </div>



          {/* Section 2: Type d'adhésion */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type d'adhésion <span className="text-red-500">*</span>
            </Label>
            <div className="grid gap-4 bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="standard"
                  checked={formData.typeAdhesion.standard}
                  onCheckedChange={(checked) => handleTypeAdhesionChange(checked as boolean, 'standard')}
                  disabled={formData.typeActivite.nonFormalisee}
                  className="border-cyan-200 dark:border-cyan-800"
                />
                <Label
                  htmlFor="standard"
                  className={cn(
                    "text-sm font-medium leading-none",
                    formData.typeActivite.nonFormalisee
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-cyan-700 dark:text-cyan-300"
                  )}
                >
                  Standard
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="premium"
                  checked={formData.typeAdhesion.premium}
                  onCheckedChange={(checked) => handleTypeAdhesionChange(checked as boolean, 'premium')}
                  disabled={formData.typeActivite.nonFormalisee}
                  className="border-cyan-200 dark:border-cyan-800"
                />
                <Label
                  htmlFor="premium"
                  className={cn(
                    "text-sm font-medium leading-none",
                    formData.typeActivite.nonFormalisee
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-cyan-700 dark:text-cyan-300"
                  )}
                >
                  Premium
                </Label>
              </div>
            </div>
          </div>

                    {/* Section 1: Motif de la demande */}
                    <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Motif de la demande <span className="text-red-500">*</span>
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
                  <SelectValue placeholder="Sélectionnez le motif de la demande" />
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

        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-cyan-200 dark:border-cyan-800">
          <Button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700"
            disabled={!isFormValid}
          >
            Suivant
          </Button>
        </div>
      </Card>
    </form>
  );
}
