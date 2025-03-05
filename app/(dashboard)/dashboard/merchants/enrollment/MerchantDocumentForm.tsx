"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Trash2, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DocumentItem } from "@/types";

interface MerchantDocumentFormProps {
  onSubmit: (data: DocumentItem[]) => void;
  onBack: () => void;
  initialData?: DocumentItem[];
  merchantId?: number;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function MerchantDocumentForm({
  onSubmit,
  onBack,
  initialData = [],
  merchantId,
}: MerchantDocumentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      documents: initialData.length > 0 ? initialData : [{ name: "", document: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Erreur",
          description: "Le fichier est trop volumineux. La taille maximum est de 2MB",
          variant: "destructive",
        });
        event.target.value = "";
        setValue(`documents.${index}.document`, "");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue(`documents.${index}.document`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data: { documents: DocumentItem[] }) => {
    // Validate that at least one document is uploaded
    if (data.documents.some(doc => !doc.name || !doc.document)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs de document",
        variant: "destructive",
      });
      return;
    }
    onSubmit(data.documents);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-6 border border-cyan-200 dark:border-cyan-800 rounded-lg space-y-4 bg-cyan-50/50 dark:bg-cyan-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cyan-700 dark:text-cyan-300">Nom du document</Label>
                <Input
                  {...register(`documents.${index}.name`)}
                  placeholder="Nom du document"
                  className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-cyan-700 dark:text-cyan-300">Document</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(index, e)}
                      className="w-full cursor-pointer bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FileText className="h-4 w-4 text-cyan-500" />
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", document: "" })}
          className="w-full border-dashed border-cyan-200 dark:border-cyan-800 hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
        >
          <Plus className="w-4 h-4 mr-2 text-cyan-500" />
          <span className="text-cyan-600 dark:text-cyan-400">Ajouter un document</span>
        </Button>
      </div>

      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
        >
          Retour
        </Button>
        <Button 
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800"
        >
          Suivant
        </Button>
      </div>
    </form>
  );
}
