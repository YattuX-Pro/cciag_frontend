"use client";

import { useForm, useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Entreprise } from "@/types";
import { CHIFFRE_AFFAIRE, NOMBRE_EMPLOYE, TAILLE_ENTREPRISE } from "@/types/const";
import { Plus, X } from "lucide-react";

interface CompanyInfoFormProps {
  onSubmit: (data: Partial<Entreprise>) => void;
  onBack: () => void;
  initialData?: Partial<Entreprise> | null;
}

export default function CompanyInfoForm({
  onSubmit,
  onBack,
  initialData,
}: CompanyInfoFormProps) {
  const [products, setProducts] = useState<string[]>(
    initialData?.produits ? initialData.produits.split(';').filter(Boolean) : ['']
  );

  const [quitusFile, setQuitusFile] = useState<File | null>(null);
  const [certificatFile, setCertificatFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Partial<Entreprise>>({
    defaultValues: initialData || undefined
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [initialData, setValue]);

  const addProduct = () => {
    if (products.length < 6) {
      setProducts([...products, '']);
    }
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts.length ? newProducts : ['']);
  };

  const updateProduct = (index: number, value: string) => {
    const newProducts = [...products];
    newProducts[index] = value;
    setProducts(newProducts);
    setValue('produits', newProducts.filter(Boolean).join(';'));
  };

  const handleSelectChange = (field: "nombre_employe" | "chiffre_affaire", value: string) => {
    setValue(field, value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nom" className="text-cyan-700 dark:text-cyan-300">Nom de l&apos;entreprise</Label>
          <Input
            id="nom"
            {...register("nom", { required: "Le nom de l'entreprise est requis" })}
            placeholder="Nom de l'entreprise"
            className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
          />
          {errors.nom && (
            <p className="text-sm text-red-500">{errors.nom.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Taille de l&apos;entreprise</Label>
          <Select 
            {...register("taille", {
              required: "La taille de l'entreprise est requise"
            })}
            onValueChange={(value) => {
              setValue("taille", value as 'TPE' | 'PME' | 'GE');
              setValue("taille_display", TAILLE_ENTREPRISE.find(opt => opt.value === value)?.label || '');
            }}
          >
            <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
              <SelectValue placeholder="Sélectionnez la taille" />
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

        <div className="space-y-2">
          <Label htmlFor="date_creation" className="text-cyan-700 dark:text-cyan-300">Date de création</Label>
          <Input
            id="date_creation"
            type="date"
            {...register("date_creation", { required: "La date de création est requise" })}
            className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
          />
          {errors.date_creation && (
            <p className="text-sm text-red-500">{errors.date_creation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Nombre d&apos;employés</Label>
          <Select 
            {...register("nombre_employe", { required: "Le nombre d'employés est requis" })}
            onValueChange={(value) => handleSelectChange("nombre_employe", value)}
          >
            <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
              <SelectValue placeholder="Sélectionnez le nombre d'employés" />
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

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Chiffre d&apos;affaires</Label>
          <Select 
            {...register("chiffre_affaire", { required: "Le chiffre d'affaires est requis" })}
            onValueChange={(value) => handleSelectChange("chiffre_affaire", value)}
          >
            <SelectTrigger className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
              <SelectValue placeholder="Sélectionnez le chiffre d'affaires" />
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

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Produits</Label>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={product}
                  onChange={(e) => updateProduct(index, e.target.value)}
                  placeholder={`Produit ${index + 1}`}
                  required={index === 0}
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
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            )}
          </div>
          <input type="hidden" {...register("produits", { required: "Les produits sont requis" })} />
          {errors.produits && (
            <p className="text-sm text-red-500">{errors.produits.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="quitus_fiscal" className="text-cyan-700 dark:text-cyan-300">Quitus fiscal</Label>
          <Input
            id="quitus_fiscal"
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setQuitusFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setValue("quitus_fiscal", reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {quitusFile && (
            <p className="text-sm text-green-600 mt-1">
              Fichier sélectionné: {quitusFile.name}
            </p>
          )}
          {errors.quitus_fiscal && (
            <p className="text-red-500 text-sm">{errors.quitus_fiscal.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="certificat_fiscal" className="text-cyan-700 dark:text-cyan-300">Certificat fiscal</Label>
          <Input
            id="certificat_fiscal"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCertificatFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setValue("certificat_fiscal", reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {certificatFile && (
            <p className="text-sm text-green-600 mt-1">
              Fichier sélectionné: {certificatFile.name}
            </p>
          )}
          {errors.certificat_fiscal && (
            <p className="text-red-500 text-sm">{errors.certificat_fiscal.message}</p>
          )}
        </div>
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
          Terminer
        </Button>
      </div>
    </form>
  );
}
