"use client";

import { useForm } from "react-hook-form";
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
import { Entreprise, TypeAdhesionData } from "@/types";
import { CHIFFRE_AFFAIRE, FORME_JURIDIQUE, NOMBRE_EMPLOYE, TAILLE_ENTREPRISE, TYPE_ACTIVITE, TYPE_COMMERCE } from "@/types/const";
import { Plus, X } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { getAddresses } from "@/fetcher/api-fetcher";
import AddAddressDialog from "./(dialog)/AddAddressDialog";

interface CompanyInfoFormProps {
  onSubmit: (data: Partial<Entreprise>) => void;
  onBack: () => void;
  initialData?: Partial<Entreprise> | null;
  typeAdhesionData: TypeAdhesionData;
}

export default function CompanyInfoForm({
  onSubmit,
  onBack,
  initialData,
  typeAdhesionData
}: CompanyInfoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isDirty },
    watch,
    trigger
  } = useForm<Partial<Entreprise>>({
    defaultValues: initialData || undefined,
    mode: "onChange"
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as any, value);
        }
      });
    }
  }, [initialData, setValue]);

  const [addresses, setAddresses] = useState([]);
  const loadAddresses = async () => {
    const data = await getAddresses({limit:2000});
    setAddresses(data.results);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // Watch all values for debugging
  const watchedValues = watch();

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
          <Label htmlFor="sigle" className="text-cyan-700 dark:text-cyan-300">Sigle de l&apos;entreprise</Label>
          <Input
            id="sigle"
            {...register("sigle")}
            placeholder="Sigle ou abréviation (optionnel)"
            className="w-full bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Utilisé si le nom de l&apos;entreprise est trop long
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Taille de l&apos;entreprise</Label>
          <Select 
            value={watch("taille") || ""}
            onValueChange={(value) => {
              setValue("taille", value as 'TPE' | 'PME' | 'GE');
              setValue("taille_display", TAILLE_ENTREPRISE.find(opt => opt.value === value)?.label || '');
              trigger("taille");
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
            value={watch("nombre_employe") || ""}
            onValueChange={(value) => {
              setValue("nombre_employe", value, { shouldValidate: true });
              trigger("nombre_employe");
            }}
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
            value={watch("chiffre_affaire") || ""}
            onValueChange={(value) => {
              setValue("chiffre_affaire", value, { shouldValidate: true });
            }}
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
          <Label className="text-cyan-700 dark:text-cyan-300">Forme juridique</Label>
          <Select 
            value={watch("forme_juridique") || ""}
            onValueChange={(value) => {
              setValue("forme_juridique", value, { shouldValidate: true });
            }}
            disabled={!typeAdhesionData.typeActivite.formalisee && typeAdhesionData.typeActivite.nonFormalisee}
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
          {errors.forme_juridique && (
            <p className="text-sm text-red-500">{errors.forme_juridique.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Siège social <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            name="address_id"
            control={control}
            rules={{ required: "Siège social est requise" }}
            label=""
            data={addresses}
            valueKey="name"
            placeholder="Sélectionnez le siège social"
            currentValue={watch('address_id')}
            disabled={false}
          />
          {errors.address_id && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.address_id.message}
            </p>
          )}
      </div>



        <div className="space-y-2 col-span-2">
          <Label htmlFor="commentaire" className="text-cyan-700 dark:text-cyan-300">NB:</Label>
          <textarea
            id="commentaire"
            {...register("commentaire")}
            placeholder="Commentaires (optionnel)"
            className="w-full h-24 px-3 py-2 rounded-md bg-white dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
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
          disabled={(!isValid && isDirty) || !watch("nombre_employe")}
          className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800"
        >
          Suivant
        </Button>
      </div>
    </form>
  );
}