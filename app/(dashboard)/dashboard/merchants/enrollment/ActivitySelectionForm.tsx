"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import SearchableSelect from "@/components/SearchableSelect";
import MultiSelectInput from "@/components/MultiSelectInput";
import { getActivities, getSubActivities } from "@/fetcher/api-fetcher";
import { Activity, ActivityData, SubActivity } from "@/types";
import { Button } from "@/components/ui/button";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subActivities, setSubActivities] = useState<SubActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingSubActivities, setLoadingSubActivities] = useState(false);

  const {
    setValue,
    trigger,
    watch,
    control,
    formState: { errors }
  } = useForm<ActivityData>({
    defaultValues: {
      secteur_activite: initialData?.secteur_activite || "",
      sous_secteur_activite: initialData?.sous_secteur_activite || "[]",
      activite_principale: initialData?.activite_principale || "",
      activite_secondaire: initialData?.activite_secondaire || "[]"
    }
  });


  useEffect(() => {
      const loadSubActivities = async () => {
        setLoadingSubActivities(true);
        try {
          const response = await getSubActivities({limit: 1000});
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
  }, []);

  const handleSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    const formData = watch();
    const activityData: ActivityData = {
      ...formData
    };

    onSubmit(activityData);
  };

  return (
    <div className="space-y-6">
      {/* Activité principale (sur une ligne complète) */}
      <div className="space-y-2">
        <Label className="text-cyan-700 dark:text-cyan-300">
          Activité principale
        </Label>
        <SearchableSelect
          name="activite_principale"
          control={control}
          rules={{}}
          label=""
          data={[
            { id: "commerce", name: "Commerce" },
            { id: "agriculture", name: "Agriculture" },
            { id: "artisanat", name: "Artisanat" },
            { id: "industrie", name: "Industrie" },
            { id: "services", name: "Services" },
            { id: "transport", name: "Transport" },
            { id: "construction", name: "Construction" },
            { id: "tourisme", name: "Tourisme" }
          ]}
          valueKey="name"
          placeholder="Recherchez une activité principale"
          currentValue={watch('activite_principale')}
          disabled={loadingActivities}
          className="border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950"
        />
        {errors.activite_principale && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-1">
            {errors.activite_principale.message}
          </p>
        )}
      </div>
      
      {/* Sous-secteurs et activités secondaires (sur la même ligne) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sous-secteur d'activité (sélection multiple) */}
        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Sous-secteurs d&apos;activité
          </Label>
          <MultiSelectInput
            name="sous_secteur_activite"
            control={control}
            rules={{}}
            label=""
            data={subActivities.map(item => ({
              id: item.id || item.name,
              name: item.name || '',
            }))}
            valueKey="name"
            placeholder={watch('secteur_activite') ? "Sélectionnez les sous-secteurs d'activité" : "Sélectionnez d'abord un secteur d'activité"}
            currentValue={watch('sous_secteur_activite')}
            disabled={loadingSubActivities}
            className="border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950"
          />
          {errors.sous_secteur_activite && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.sous_secteur_activite.message}
            </p>
          )}
        </div>

        {/* Activité secondaire (sélection multiple) */}
        <div className="space-y-2">
          <Label className="text-cyan-700 dark:text-cyan-300">Activités secondaires</Label>
          <MultiSelectInput
            name="activite_secondaire"
            control={control}
            label=""
            data={[
              { id: "commerce", name: "Commerce" },
              { id: "agriculture", name: "Agriculture" },
              { id: "artisanat", name: "Artisanat" },
              { id: "industrie", name: "Industrie" },
              { id: "services", name: "Services" },
              { id: "transport", name: "Transport" },
              { id: "construction", name: "Construction" },
              { id: "tourisme", name: "Tourisme" }
            ]}
            valueKey="name"
            placeholder="Recherchez des activités secondaires"
            currentValue={watch('activite_secondaire')}
            disabled={loadingActivities}
            className="border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950"
          />
          {errors.activite_secondaire && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-1">
              {errors.activite_secondaire.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-cyan-200 dark:border-cyan-800"
        >
          Retour
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
