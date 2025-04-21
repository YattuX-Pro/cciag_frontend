"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Trash2, FileText, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DocumentItem } from "@/types";
import { Input } from "@/components/ui/input";

interface MerchantDocumentFormProps {
  onSubmit: (data: DocumentItem[]) => void;
  onBack: () => void;
  initialData?: DocumentItem[];
  merchantId?: number;
}

// Maximum file size in bytes
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
// Maximum length for displayed filenames
const MAX_FILENAME_LENGTH = 20;

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
    watch,
  } = useForm({
    defaultValues: {
      documents: initialData.length > 0 ? initialData : [{ name: "", document: "", document_number: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const documents = watch("documents");

  // Add state to store selected file names
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: string }>({});

  // Helper function to truncate filename if too long
  const truncateFilename = (filename: string): string => {
    if (filename.length <= MAX_FILENAME_LENGTH) return filename;
    
    // Get file extension
    const lastDotIndex = filename.lastIndexOf('.');
    const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';
    const name = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename;
    
    // Calculate how many characters we can keep from the name
    const maxNameLength = MAX_FILENAME_LENGTH - extension.length - 3; // 3 for "..."
    
    if (maxNameLength <= 0) {
      // If extension is too long, truncate everything
      return filename.slice(0, MAX_FILENAME_LENGTH - 3) + '...';
    }
    
    // Return truncated name + "..." + extension
    return name.slice(0, maxNameLength) + '...' + extension;
  };

  // Initialize selectedFiles from initialData
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const initialFiles: { [key: number]: string } = {};
      
      initialData.forEach((doc, index) => {
        if (doc.document) {
          // Pour les documents existants, utiliser le type de document comme nom de fichier
          const docType = doc.name || "Document";
          initialFiles[index] = `${docType}.pdf`;
        }
      });
      
      setSelectedFiles(initialFiles);
    }
  }, [initialData]);

  const handleFileChange = async (
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
        setSelectedFiles(prev => ({ ...prev, [index]: "" }));
        return;
      }

      try {
        // Store the file name in state for display
        setSelectedFiles(prev => ({ ...prev, [index]: file.name }));

        // Convert file to base64 string
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          setValue(`documents.${index}.document`, base64String);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la lecture du fichier",
          variant: "destructive",
        });
      }
    }
  };

  const triggerFileInput = (index: number) => {
    // Find the hidden file input by its id and trigger a click
    const fileInput = document.getElementById(`file-input-${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const onFormSubmit = (data: { documents: DocumentItem[] }) => {
    console.log("Form data:", data); // Pour déboguer
    // Validate that all documents have both name and file
    const hasEmptyFields = data.documents.some(doc => !doc.name || !doc.document || !doc.document_number);
    if (hasEmptyFields) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires pour chaque document",
        variant: "destructive",
      });
      return;
    }

    onSubmit(data.documents);
  };

  // Get display filename for a document
  const getDisplayFilename = (index: number) => {
    if (selectedFiles[index]) {
      return truncateFilename(selectedFiles[index]);
    }
    if (documents[index]?.name) {
      return truncateFilename(`${documents[index].name}.pdf`);
    }
    return "Document";
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="p-6 border border-cyan-200 dark:border-cyan-800 rounded-lg space-y-4 bg-cyan-50/50 dark:bg-cyan-900/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-cyan-700 dark:text-cyan-300">Nom du document</Label>
                <Select 
                  value={documents[index]?.name || ""}
                  onValueChange={(value) => setValue(`documents.${index}.name`, value)}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                    <SelectValue placeholder="Sélectionner un document" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNI">CNI</SelectItem>
                    <SelectItem value="PASSPORT">Passport</SelectItem>
                    <SelectItem value="EXTRAIT DE NAISSANCE">Extrait de naissance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.documents?.[index]?.name && (
                  <p className="text-sm text-red-500">{errors.documents[index]?.name?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-cyan-700 dark:text-cyan-300">Numéro du document</Label>
                <Input
                  {...register(`documents.${index}.document_number`, { required: "Le numéro du document est requis" })}
                  placeholder="Numéro du document"
                  className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
                />
                {errors.documents?.[index]?.document_number && (
                  <p className="text-sm text-red-500">{errors.documents[index]?.document_number?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-cyan-700 dark:text-cyan-300">Document</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    {/* Champ caché pour stocker la valeur base64 du document */}
                    <input
                      type="hidden"
                      {...register(`documents.${index}.document`)}
                    />
                    
                    {/* Input file caché */}
                    <input
                      id={`file-input-${index}`}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                    />
                    
                    {documents[index]?.document ? (
                      <div className="flex items-center w-full h-10 px-3 py-2 rounded-md border border-cyan-200 dark:border-cyan-800 bg-white dark:bg-cyan-950">
                        <div className="flex items-center flex-1 overflow-hidden">
                          <FileText className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-cyan-700 dark:text-cyan-300">
                            {getDisplayFilename(index)}
                          </span>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={() => triggerFileInput(index)}
                          className="ml-2 p-1 text-xs text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-800 rounded-md flex items-center"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Remplacer
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => triggerFileInput(index)}
                        className="flex items-center justify-center w-full h-10 px-3 py-2 rounded-md border border-cyan-200 dark:border-cyan-800 bg-white dark:bg-cyan-950 hover:bg-cyan-50 dark:hover:bg-cyan-900"
                      >
                        <Upload className="h-4 w-4 mr-2 text-cyan-500" />
                        <span className="text-cyan-600 dark:text-cyan-400">Choisir un fichier</span>
                      </button>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
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
          onClick={() => append({ name: "", document: "", document_number: "" })}
          className="w-full border-dashed border-cyan-200 dark:border-cyan-800 hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
          disabled={documents.length >= 3}
        >
          <Plus className="w-4 h-4 mr-2 text-cyan-500" />
          <span className="text-cyan-600 dark:text-cyan-400">
            {documents.length >= 3 ? "Maximum de documents atteint" : "Ajouter un document"}
          </span>
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