"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Loader, Plus, Upload, Trash2, Save, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DocumentItem, MerchantDocument } from "@/types";
import {
  createMerchantDocument,
  deleteMerchantDocument,
  getMerchantDocumentByMerchantId,
  getMerchantDocuments,
} from "@/fetcher/api-fetcher";

interface AddMerchantDocumentDialogProps {
  merchantId: number;
  merchantStatus?: string;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en bytes

export default function AddMerchantDocumentDialog({
  merchantId,
  merchantStatus = "pending",
  onSuccess,
}: AddMerchantDocumentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isValidated = merchantStatus === "validated";
  const [merchantDocuments, setMerchantDocuments] = useState<DocumentItem[]>(
    []
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeletingAll, setIsDeletingAll] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      merchant_id: merchantId,
      documents: [{ name: "", document: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const loadExistingDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await getMerchantDocumentByMerchantId(merchantId);
      setMerchantDocuments(docs);
      if (docs.length > 0) {
        reset({
          merchant_id: merchantId,
          documents: Array.isArray(docs)
            ? [...docs].map((doc) => ({
                id: doc.id,
                name: doc.name,
                type: doc.document,
              }))
            : [],
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents existants",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExistingDocuments();
    }
  }, [isOpen, merchantId]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset({
        merchant_id: merchantId,
        documents: [{ name: "", document: "" }],
      });
    }
  };

  const onSubmit = async (data: MerchantDocument) => {
    try {
      setIsLoading(true);
      await createMerchantDocument(data);
      await loadExistingDocuments(); // Refresh the documents list
      toast({
        title: "Documents ajoutés",
        description: "Les documents ont été ajoutés avec succès",
        variant: "default",
        className: cn(
          "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800",
          "text-green-600 dark:text-green-400"
        ),
        duration: 3000,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout des documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Erreur",
          description:
            "Le fichier est trop volumineux. La taille maximum est de 2MB",
          variant: "destructive",
        });
        event.target.value = ""; // Reset input
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

  const handleDeleteDocument = async (documentId: number) => {
    try {
      setIsDeleting(true);
      await deleteMerchantDocument(merchantId, documentId);
      loadExistingDocuments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAllDocuments = async () => {
    try {
      setIsDeletingAll(true);
      await Promise.all(
        merchantDocuments.map((doc) =>
          deleteMerchantDocument(merchantId, doc.id)
        )
      );
      loadExistingDocuments();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer tous les documents",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <motion.div
          whileHover={{ scale: isValidated ? 1 : 1.02 }}
          whileTap={{ scale: isValidated ? 1 : 0.98 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "transition-colors duration-200",
              "dark:text-cyan-400 text-cyan-600",
              "dark:hover:text-cyan-300 hover:text-cyan-500",
              "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10",
              isValidated && "opacity-50 cursor-not-allowed"
            )}
            disabled={isValidated}
          >
            <FileText className="h-4 w-4 mr-2" />
            Document
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "sm:max-w-[600px] backdrop-blur-sm",
          "dark:bg-gray-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] overflow-y-auto"
        )}
      >
        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-2xl font-bold",
              "dark:from-cyan-400 dark:to-cyan-200 from-cyan-600 to-cyan-500",
              "bg-gradient-to-r bg-clip-text text-transparent"
            )}
          >
            {merchantDocuments
              ? "Documents existants"
              : "Ajouter des documents"}
          </DialogTitle>
        </DialogHeader>

        {merchantDocuments.length > 0 ? (
          <div className="space-y-4">
            {merchantDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20 border"
                )}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 dark:text-cyan-400 text-cyan-600" />
                  <span className="dark:text-gray-300 text-gray-600">
                    {doc.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className={cn(
                    "text-red-500 hover:text-red-700",
                    "dark:text-red-400 dark:hover:text-red-300"
                  )}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            ))}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={cn(
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-300 text-gray-600",
                  "dark:hover:bg-gray-800/50 hover:bg-gray-50"
                )}
              >
                Fermer
              </Button>
              <Button
                onClick={handleDeleteAllDocuments}
                className={cn(
                  "dark:bg-red-500 bg-red-600",
                  "dark:hover:bg-red-600 hover:bg-red-700",
                  "text-white"
                )}
              >
                {isDeletingAll ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}{" "}
                Tout supprimer
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("merchant_id")} />

            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-[2fr,3fr,auto] gap-4 items-center"
              >
                <div>
                  <Label className="dark:text-gray-300 text-gray-600">
                    Nom du document
                  </Label>
                  <Input
                    {...register(`documents.${index}.name`, {
                      required: "Le nom du document est requis",
                    })}
                    placeholder="Ex: Carte d'identité"
                    disabled={isValidated}
                    className={cn(
                      "transition-colors duration-200",
                      "dark:bg-gray-800/50 bg-gray-50",
                      "dark:border-cyan-900/20 border-cyan-600/20",
                      "dark:text-gray-100 text-gray-900",
                      "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                      "dark:focus:border-cyan-500 focus:border-cyan-600",
                      "h-12",
                      isValidated && "opacity-50 cursor-not-allowed"
                    )}
                  />
                  {errors.documents?.[index]?.name && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.documents[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="dark:text-gray-300 text-gray-600">
                    Fichier (Max: 2MB)
                  </Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(index, e)}
                    disabled={isValidated}
                    className={cn(
                      "transition-colors duration-200",
                      "dark:bg-gray-800/50 bg-gray-50",
                      "dark:border-cyan-900/20 border-cyan-600/20",
                      "dark:text-gray-100 text-gray-900",
                      "file:mr-4",
                      "file:rounded-full file:border-0",
                      "file:text-sm file:font-semibold",
                      "file:bg-cyan-50 file:text-cyan-700",
                      "hover:file:bg-cyan-100",
                      "dark:file:bg-cyan-900/20 dark:file:text-cyan-400",
                      "h-12",
                      "px-4 py-2",
                      "flex items-center",
                      "file:h-full",
                      "file:px-4 file:h-8",
                      isValidated && "opacity-50 cursor-not-allowed"
                    )}
                  />
                  <input
                    type="hidden"
                    {...register(`documents.${index}.document`, {
                      required: "Le fichier est requis",
                      validate: {
                        maxSize: (value) => {
                          if (!value) return true;
                          const sizeInBytes = value.length * 0.75;
                          return (
                            sizeInBytes <= MAX_FILE_SIZE ||
                            "Le fichier est trop volumineux (max: 2MB)"
                          );
                        },
                      },
                    })}
                  />
                  {errors.documents?.[index]?.document && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.documents[index]?.document?.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className={cn(
                    "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
                    "mt-6"
                  )}
                  disabled={isValidated}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}

            {!isValidated && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ name: "", document: "" } as DocumentItem)
                }
                className={cn(
                  "w-full",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-cyan-400 text-cyan-600",
                  "hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                )}
              >
                <Plus className="mr-2 h-4 w-4" /> Ajouter un document
              </Button>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={cn(
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-300 text-gray-600",
                  "dark:hover:bg-gray-800/50 hover:bg-gray-50"
                )}
              >
                {isValidated ? "Fermer" : "Annuler"}
              </Button>
              {!isValidated && (
                <Button
                  type="submit"
                  className={cn(
                    "dark:bg-cyan-500 bg-cyan-600",
                    "dark:hover:bg-cyan-600 hover:bg-cyan-700",
                    "text-white"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader className="animate-spin mr-2" />
                      Traitement...
                    </span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Enregistrer
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
