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
    type_adhesion: "ORDINAIRE_ADHERENT",
    type_adhesion_display: "Ordinaire Adhérent - 1.500.000 GNF",
    typeActivite: {
      formalisee: false,
      nonFormalisee: false,
    },
  });

  const isTypeAdhesionSelected = () => {
    return !!formData.type_adhesion;
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
  isTypeAdhesionSelected();

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

  const selectTypeActivite = (field: keyof typeof formData.typeActivite) => {
    const newState: TypeAdhesionData = {
      ...formData,
      typeActivite: {
        formalisee: field === 'formalisee',
        nonFormalisee: field === 'nonFormalisee'
      },
      type_adhesion: '',
      type_adhesion_display: ''
    };
    
    if (field === 'nonFormalisee') {
      newState.type_adhesion = 'ORDINAIRE_AUTO';
      newState.type_adhesion_display = 'Ordinaire Auto-entreprenant - 100.000 GNF';
    } else {
      newState.type_adhesion = 'ORDINAIRE_ADHERENT';
      newState.type_adhesion_display = 'Ordinaire Adhérent - 1.500.000 GNF';
    }
    setFormData(newState);
  };

  const handleTypeActiviteChange = (checked: boolean, field: keyof typeof formData.typeActivite) => {
    if (!checked) return;
    selectTypeActivite(field);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-8 dark:bg-cyan-950">
        <div className="grid gap-8">
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
                      checked={formData.typeActivite.formalisee}
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
                      checked={formData.typeActivite.nonFormalisee}
                      onCheckedChange={(checked) => selectTypeActivite('nonFormalisee')}
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

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-cyan-700 dark:text-cyan-300">
              Type d'adhésion <span className="text-red-500">*</span>
            </Label>
            <div className="bg-white dark:bg-cyan-900/30 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
              {formData.typeActivite.formalisee ? (
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
              ) : formData.typeActivite.nonFormalisee ? (
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
