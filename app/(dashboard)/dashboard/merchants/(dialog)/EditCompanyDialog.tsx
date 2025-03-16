"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Entreprise } from "@/types";
import { CHIFFRE_AFFAIRE, NOMBRE_EMPLOYE, TAILLE_ENTREPRISE, TYPE_ACTIVITE, TYPE_COMMERCE, FORME_JURIDIQUE } from "@/types/const";
import { updateEntreprise, getAddresses } from "@/fetcher/api-fetcher";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { UploadIcon as Upload } from "lucide-react";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";

interface EditCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entreprise: Entreprise;
  onSuccess?: () => void;
}

export default function EditCompanyDialog({
  isOpen,
  onClose,
  entreprise,
  onSuccess,
}: EditCompanyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quitusFiscalRef = useRef<HTMLInputElement>(null);
  const certificatFiscalRef = useRef<HTMLInputElement>(null);
  const [quitusFiscalFile, setQuitusFiscalFile] = useState<File | null>(null);
  const [certificatFiscalFile, setCertificatFiscalFile] = useState<File | null>(null);
  const [quitusFiscalBase64, setQuitusFiscalBase64] = useState<string | null>(entreprise.quitus_fiscal || null);
  const [certificatFiscalBase64, setCertificatFiscalBase64] = useState<string | null>(entreprise.certificat_fiscal || null);

  const [products, setProducts] = useState<string[]>(
    entreprise.produits ? entreprise.produits.split(';').filter(Boolean) : ['']
  );

  const [addresses, setAddresses] = useState([]);
  const loadAddresses = async () => {
    const data = await getAddresses({ limit: 2000 });
    setAddresses(data.results);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const addProduct = () => {
    if (products.length < 6) {
      const newProducts = [...products, ''];
      setProducts(newProducts);
      setValue('produits', newProducts.filter(Boolean).join(';'));
    }
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts.length ? newProducts : ['']);
    setValue('produits', newProducts.filter(Boolean).join(';'));
  };

  const updateProduct = (index: number, value: string) => {
    const newProducts = [...products];
    newProducts[index] = value;
    setProducts(newProducts);
    setValue('produits', newProducts.filter(Boolean).join(';'));
  };

  const handleSelectChange = (field: "nombre_employe" | "chiffre_affaire" | "taille", value: string) => {
    setValue(field, value);
    if (field === "taille") {
      setValue("taille_display", TAILLE_ENTREPRISE.find(opt => opt.value === value)?.label || '');
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<Entreprise>({
    defaultValues: {
      ...entreprise,
    },
    mode: "onChange"
  });

  const handleQuitusFiscalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setQuitusFiscalFile(file);
      setQuitusFiscalBase64(null); // Clear the base64 when a new file is selected
    }
  };

  const handleCertificatFiscalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertificatFiscalFile(file);
      setCertificatFiscalBase64(null); // Clear the base64 when a new file is selected
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - (extension?.length || 0));
    return `${truncatedName}...${extension}`;
  };

  const onSubmit = async (data: Entreprise) => {
    try {

      // Ensure products are properly joined before submission
      data.produits = products.filter(Boolean).join(';');

      setIsSubmitting(true);

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key !== "quitus_fiscal" && key !== "certificat_fiscal") {
          formData.append(key, data[key as keyof Entreprise]?.toString() || "");
        }
      });

      // Only convert and append new files if they exist, otherwise use existing base64
      if (quitusFiscalFile) {
        const base64Quitus = await convertFileToBase64(quitusFiscalFile);
        formData.append("quitus_fiscal", base64Quitus);
      } else if (quitusFiscalBase64) {
        formData.append("quitus_fiscal", quitusFiscalBase64);
      }

      if (certificatFiscalFile) {
        const base64Certificat = await convertFileToBase64(certificatFiscalFile);
        formData.append("certificat_fiscal", base64Certificat);
      } else if (certificatFiscalBase64) {
        formData.append("certificat_fiscal", certificatFiscalBase64);
      }

      const response = await updateEntreprise(formData, entreprise.id);
      toast({
        title: "Succès",
        description: "Les informations de l'entreprise ont été mises à jour avec succès",
        variant: "default",
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des informations",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[600px]",
          "backdrop-blur-sm",
          "dark:bg-gray-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] overflow-y-auto"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-gray-100">
            Modifier les informations de l'entreprise
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Nom de l'entreprise */}
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-cyan-700 dark:text-cyan-300">Nom de l'entreprise</Label>
              <Input
                id="nom"
                {...register("nom", {
                  required: "Le nom de l'entreprise est requis",
                  minLength: {
                    value: 2,
                    message: "Le nom doit contenir au moins 2 caractères"
                  }
                })}
                className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
              />
              {errors.nom && (
                <p className="text-sm text-red-500">{errors.nom.message}</p>
              )}
            </div>

            {/* Type d'activité */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Type d'activité</Label>
              <Select
                onValueChange={(value) => {
                  setValue("type_activite", value, { shouldValidate: true });
                }}
                defaultValue={entreprise.type_activite}
              >
                <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                  <SelectValue placeholder="Sélectionnez le type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_ACTIVITE.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type de commerce */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Type de commerce</Label>
              <Select
                onValueChange={(value) => {
                  setValue("type_commerce", value, { shouldValidate: true });
                }}
                defaultValue={entreprise.type_commerce}
              >
                <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                  <SelectValue placeholder="Sélectionnez le type de commerce" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_COMMERCE.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forme juridique */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Forme juridique</Label>
              <Select
                onValueChange={(value) => {
                  setValue("forme_juridique", value, { shouldValidate: true });
                }}
                defaultValue={entreprise.forme_juridique}
              >
                <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                  <SelectValue placeholder="Sélectionnez la forme juridique" />
                </SelectTrigger>
                <SelectContent>
                  {FORME_JURIDIQUE.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Ville</Label>
              <SearchableSelect
                name="address_id"
                control={control}
                rules={{ required: "La ville est requise" }}
                label=""
                data={addresses}
                valueKey="name"
                placeholder="Sélectionnez la ville"
                currentValue={entreprise?.address?.id}
                disabled={false}
              />
            </div>

            {/* Taille */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Taille de l'entreprise</Label>
              <Select
                {...register("taille", {
                  required: "La taille de l'entreprise est requise"
                })}
                onValueChange={(value) => handleSelectChange("taille", value)}
                defaultValue={entreprise.taille}
              >
                <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                  <SelectValue placeholder="Sélectionnez la taille *" />
                </SelectTrigger>
                <SelectContent>
                  {TAILLE_ENTREPRISE.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.taille && (
                <p className="text-red-500 text-sm">{errors.taille.message}</p>
              )}
            </div>

            {/* Date de création */}
            <div className="space-y-2">
              <Label htmlFor="date_creation" className="text-cyan-700 dark:text-cyan-300">Date de création</Label>
              <Input
                id="date_creation"
                type="date"
                {...register("date_creation", {
                  required: "La date de création est requise"
                })}
                className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
              />
              {errors.date_creation && (
                <p className="text-sm text-red-500">{errors.date_creation.message}</p>
              )}
            </div>

            {/* Nombre d'employés */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Nombre d'employés</Label>
              <Select
                {...register("nombre_employe", {
                  required: "Le nombre d'employés est requis"
                })}
                onValueChange={(value) => handleSelectChange("nombre_employe", value)}
                defaultValue={entreprise.nombre_employe}
              >
                <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                  <SelectValue placeholder="Sélectionnez le nombre d'employés *" />
                </SelectTrigger>
                <SelectContent>
                  {NOMBRE_EMPLOYE.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nombre_employe && (
                <p className="text-sm text-red-500">{errors.nombre_employe.message}</p>
              )}
            </div>

            {/* Chiffre d'affaires */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Chiffre d'affaires</Label>
              <Select
                {...register("chiffre_affaire", {
                  required: "Le chiffre d'affaires est requis"
                })}
                onValueChange={(value) => handleSelectChange("chiffre_affaire", value)}
                defaultValue={entreprise.chiffre_affaire}
              >
                <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
                  <SelectValue placeholder="Sélectionnez le chiffre d'affaires *" />
                </SelectTrigger>
                <SelectContent>
                  {CHIFFRE_AFFAIRE.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.chiffre_affaire && (
                <p className="text-sm text-red-500">{errors.chiffre_affaire.message}</p>
              )}
            </div>

            {/* Numéro RCCM */}
            <div className="space-y-2">
              <Label htmlFor="numero_rccm" className="text-cyan-700 dark:text-cyan-300">Numéro RCCM</Label>
              <Input
                id="numero_rccm"
                {...register("numero_rccm", { 
                  required: "Le numéro RCCM est requis"
                })}
                placeholder="Numéro RCCM"
                className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
              />
              {errors.numero_rccm && (
                <p className="text-sm text-red-500">{errors.numero_rccm.message}</p>
              )}
            </div>

            {/* Numéro NIF */}
            <div className="space-y-2">
              <Label htmlFor="numero_nif" className="text-cyan-700 dark:text-cyan-300">Numéro NIF</Label>
              <Input
                id="numero_nif"
                {...register("numero_nif", { 
                  required: "Le numéro NIF est requis"
                })}
                placeholder="Numéro NIF"
                className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
              />
              {errors.numero_nif && (
                <p className="text-sm text-red-500">{errors.numero_nif.message}</p>
              )}
            </div>

            {/* Produits */}
            <div className="space-y-2">
              <Label className="text-cyan-700 dark:text-cyan-300">Produits *</Label>
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={product}
                      onChange={(e) => updateProduct(index, e.target.value)}
                      placeholder={`Produit ${index + 1} *`}
                      required
                      className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
                    />
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {products.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProduct}
                    className="mt-2 w-full border-cyan-200 dark:border-cyan-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </Button>
                )}
              </div>
            </div>

            {/* Commentaire */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="commentaire" className="text-cyan-700 dark:text-cyan-300">NB:</Label>
              <textarea
                id="commentaire"
                {...register("commentaire")}
                placeholder="Commentaires (optionnel)"
                className="w-full h-24 px-3 py-2 rounded-md bg-white dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Documents fiscaux */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-cyan-700 dark:text-cyan-300">Documents fiscaux</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Quitus Fiscal */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      className="hidden"
                      ref={quitusFiscalRef}
                      onChange={handleQuitusFiscalChange}
                      accept=".pdf"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start gap-2",
                        "dark:bg-cyan-950 bg-white",
                        "dark:hover:bg-cyan-900 hover:bg-cyan-50",
                        "border-cyan-200 dark:border-cyan-800",
                        quitusFiscalBase64 && "border-green-500"
                      )}
                      onClick={() => quitusFiscalRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      <span className="truncate">
                        {quitusFiscalFile
                          ? truncateFileName(quitusFiscalFile.name)
                          : quitusFiscalBase64
                            ? "Quitus Fiscal (Déjà chargé)"
                            : "Quitus Fiscal *"}
                      </span>
                    </Button>
                  </div>

                  {/* Certificat Fiscal */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      className="hidden"
                      ref={certificatFiscalRef}
                      onChange={handleCertificatFiscalChange}
                      accept=".pdf"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start gap-2",
                        "dark:bg-cyan-950 bg-white",
                        "dark:hover:bg-cyan-900 hover:bg-cyan-50",
                        "border-cyan-200 dark:border-cyan-800",
                        certificatFiscalBase64 && "border-green-500"
                      )}
                      onClick={() => certificatFiscalRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      <span className="truncate">
                        {certificatFiscalFile
                          ? truncateFileName(certificatFiscalFile.name)
                          : certificatFiscalBase64
                            ? "Certificat Fiscal (Déjà chargé)"
                            : "Certificat Fiscal *"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-cyan-200 dark:border-cyan-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/50"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
