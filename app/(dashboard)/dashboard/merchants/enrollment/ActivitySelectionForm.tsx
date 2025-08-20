"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Plus, X } from "lucide-react";
import { TYPE_ACTIVITE, TYPE_COMMERCE } from "@/types/const";
import SearchableSelect from "@/components/SearchableSelect";
import { getActivities, getSubActivities } from "@/fetcher/api-fetcher";
import { Activity, ActivityData, SubActivity } from "@/types";



interface ActivitySelectionFormProps {
  onSubmit: (data: ActivityData) => void;
  onBack: () => void;
  initialData?: ActivityData | null;
}

export default function ActivitySelectionForm({ 
  onSubmit, 
  onBack, 
  initialData 
}: ActivitySelectionFormProps) {
  const [products, setProducts] = useState<string[]>(
    initialData?.produits ? initialData.produits.split(';').filter(Boolean) : ['']
  );
  const [quitusFile, setQuitusFile] = useState<File | null>(null);
  const [certificatFile, setCertificatFile] = useState<File | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subActivities, setSubActivities] = useState<SubActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingSubActivities, setLoadingSubActivities] = useState(false);

  const {
    register,
    setValue,
    trigger,
    watch,
    control,
    formState: { errors }
  } = useForm<ActivityData>({
    defaultValues: {
      type: initialData?.type || "",
      type_activite: initialData?.type_activite || "",
      type_commerce: initialData?.type_commerce || "",
      secteur_activite: initialData?.secteur_activite || "",
      sous_secteur_activite: initialData?.sous_secteur_activite || "",
      activite_principale: initialData?.activite_principale || "",
      activite_secondaire: initialData?.activite_secondaire || "",
      produits: initialData?.produits || "",
      quitus_fiscal: initialData?.quitus_fiscal || "",
      certificat_fiscal: initialData?.certificat_fiscal || ""
    }
  });

  const addProduct = () => {
    if (products.length < 6) {
      setProducts([...products, '']);
    }
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts.length ? newProducts : ['']);
    
    setValue('produits', newProducts.filter(Boolean).join(';'));
    trigger('produits');
  };

  const updateProduct = (index: number, value: string) => {
    const newProducts = [...products];
    newProducts[index] = value;
    setProducts(newProducts);
    
    setValue('produits', newProducts.filter(Boolean).join(';'));
  };

  useEffect(() => {
    const loadActivities = async () => {
      setLoadingActivities(true);
      try {
        const activitiesData = await getActivities();
        setActivities(activitiesData.results || []);
      } catch (error) {
        console.error('Erreur lors du chargement des secteurs d\'activité:', error);
      } finally {
        setLoadingActivities(false);
      }
    };

    loadActivities();
  }, []);

  useEffect(() => {
    const selectedActivity = watch('secteur_activite');
    if (selectedActivity) {
      const loadSubActivities = async () => {
        setLoadingSubActivities(true);
        try {
          const response = await getSubActivities({ activity: selectedActivity });
          if (response && response.results) {
            setSubActivities(response.results);
          } else {
            setSubActivities([]);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des sous-secteurs d\'activité:', error);
          setSubActivities([]);
        } finally {
          setLoadingSubActivities(false);
        }
      };

      loadSubActivities();
    } else {
      setSubActivities([]);
      setValue('sous_secteur_activite', '');
    }
  }, [watch('secteur_activite'), setValue]);

  const handleSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const formData = watch();
    const activityData: ActivityData = {
      ...formData,
      produits: products.filter(Boolean).join(';'),
    };

    onSubmit(activityData);
  };

  return (
    <div className="space-y-6">
      {/* Grille pour les champs (2 colonnes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Secteur d'activité */}
        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Secteur d&apos;activité <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            name="secteur_activite"
            control={control}
            rules={{ required: "Secteur d'activité est requis" }}
            label=""
            data={activities}
            valueKey="name"
            placeholder="Sélectionnez le secteur d'activité"
            currentValue={watch('secteur_activite')}
            disabled={loadingActivities}
          />
          {errors.secteur_activite && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.secteur_activite.message}
            </p>
          )}
        </div>

        {/* Sous-secteur d'activité */}
        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Sous-secteur d&apos;activité
          </Label>
          <SearchableSelect
            name="sous_secteur_activite"
            control={control}
            rules={{}}
            label=""
            data={subActivities}
            valueKey="name"
            placeholder={watch('secteur_activite') ? "Sélectionnez le sous-secteur d'activité" : "Sélectionnez d'abord un secteur d'activité"}
            currentValue={watch('sous_secteur_activite')}
            disabled={loadingSubActivities}
          />
          {errors.sous_secteur_activite && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.sous_secteur_activite.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Type d&apos;activité</Label>
          <Select 
            value={watch("type_activite") || ""}
            onValueChange={(value) => {
              setValue("type_activite", value, { shouldValidate: true });
            }}
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
          {errors.type_activite && (
            <p className="text-sm text-red-500">{errors.type_activite.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Type de commerce</Label>
          <Select 
            value={watch("type_commerce") || ""}
            onValueChange={(value) => {
              setValue("type_commerce", value, { shouldValidate: true });
            }}
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
          {errors.type_commerce && (
            <p className="text-sm text-red-500">{errors.type_commerce.message}</p>
          )}
        </div>

        {/* Activité principale */}
        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Activité principale
          </Label>
          <SearchableSelect
            name="activite_principale"
            control={control}
            rules={{}}
            label=""
            data={[]}
            valueKey="name"
            placeholder="Recherchez une activité principale"
            currentValue={watch('activite_principale')}
            disabled={loadingActivities}
          />
          {errors.activite_principale && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.activite_principale.message}
            </p>
          )}
        </div>

        {/* Activité secondaire */}
        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Activité secondaire</Label>
          <SearchableSelect
            name="activite_secondaire"
            control={control}
            label=""
            data={[]}
            valueKey="name"
            placeholder="Recherchez une activité secondaire"
            currentValue={watch('activite_secondaire')}
            disabled={loadingActivities}
          />
          {errors.activite_secondaire && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.activite_secondaire.message}
            </p>
          )}
        </div>

      </div>
      
      {/* Products Section - occupe toute la largeur */}
      <div className="space-y-2 col-span-1 md:col-span-2">
        <Label className="text-cyan-700 dark:text-cyan-300">Produits</Label>
        <div className="space-y-2">
          {products.map((product, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={product}
                onChange={(e) => updateProduct(index, e.target.value)}
                placeholder={`Produit ${index + 1}`}
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
        <input type="hidden" {...register("produits")} />
        {errors.produits && (
          <p className="text-sm text-red-500">{errors.produits.message}</p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
