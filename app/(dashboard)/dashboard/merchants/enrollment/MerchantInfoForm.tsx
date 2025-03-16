"use client";

import { useForm } from "react-hook-form";
import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";
import { MerchantEnrollment, Activity, SubActivity } from "@/types";
import { Upload, RefreshCw, Check, Loader } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { createActivity, createSubActivity, getActivities, getSubActivities, getAddresses, getActivityDetail } from "@/fetcher/api-fetcher";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AddSectorDialog from "./(dialog)/AddSectorDialog";
import AddSubSectorDialog from "./(dialog)/AddSubSectorDialog";
import AddAddressDialog from "./(dialog)/AddAddressDialog";

interface MerchantInfoFormProps {
  onSubmit: (data: MerchantEnrollment) => void;
  onBack: () => void;
  initialData?: MerchantEnrollment;
}

export default function MerchantInfoForm({ onSubmit, onBack, initialData }: MerchantInfoFormProps) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [openSectors, setOpenSectors] = useState(false);
  const [openSubSectors, setOpenSubSectors] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<Activity[]>([]);
  const [selectedSubSectors, setSelectedSubSectors] = useState<SubActivity[]>([]);
  const [sectors, setSectors] = useState<Activity[]>([]);
  const [subSectors, setSubSectors] = useState<SubActivity[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const loadSectors = async () => {
    try {
      let activities =  await getActivities({limit: 1000});
      setSectors(activities.results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erreur chargement secteurs d'activité",
      })
    }
  }

  const loadSubSectos = async () => {
    try{
      let subActivities = await getSubActivities({limit: 1000});
      setSubSectors(subActivities.results);
    }catch(error){
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erreur chargement sous-secteurs d'activité",
      })
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
    control,
    watch,
    clearErrors,
    reset,
    getValues
  } = useForm<MerchantEnrollment>({
    defaultValues: {
      user: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        id: '',
        last_login: '',
        is_superuser: false,
        username: '',
      },
      date_naissance: '',
      genre: 'HOMME',
      fonction: '',
      address: null,
      address_id: null,
      quartier: '',
      activity_ids: [],
      profile_photo: '',
      signature_photo: '',
      type_adherent: 'ADHERANT'
    }
  });

  useEffect(() => {
    loadAddresses();
    loadSectors();
    loadSubSectos();
    
    if (initialData) {
      reset(initialData);
      if (initialData.profile_photo) setProfilePreview(initialData.profile_photo);
      if (initialData.signature_photo) setSignaturePreview(initialData.signature_photo);
      if (initialData.activities) setSelectedSectors(initialData.activities);
      if (initialData.sub_activities) setSelectedSubSectors(initialData.sub_activities);
    }
  }, [reset, initialData]);

  // Save form data on change
  const formValues = watch();
  useEffect(() => {
    const saveFormData = () => {
      const dataToSave = {
        ...formValues,
        activities: selectedSectors,
        sub_activities: selectedSubSectors,
      };
    };

    // Debounce save to prevent too frequent writes
    const timeoutId = setTimeout(saveFormData, 500);
    return () => clearTimeout(timeoutId);
  }, [formValues, selectedSectors, selectedSubSectors]);

  const loadAddresses = async () => {
    try {
      const addressList = await getAddresses();
      setAddresses(addressList.results);
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
        setValue('profile_photo', reader.result as string);
        if (errors.profile_photo) {
          clearErrors('profile_photo');
        }
      };
      reader.readAsDataURL(file);
    }
  }, [setValue, errors.profile_photo, clearErrors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignaturePreview(null);
      setValue('signature_photo', null);
      setIsSignatureSaved(false);
    }
  };

  const saveSignature = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setSignaturePreview(signatureData);
      setValue('signature_photo', signatureData);
      setIsSignatureSaved(true);
      if (errors.signature_photo) {
        clearErrors('signature_photo');
      }
    }
  };

  const handleFormSubmit = async (data: MerchantEnrollment) => {
    let hasError = false;

    if (!profilePreview) {
      setError('profile_photo', {
        type: 'manual',
        message: 'La photo de profil est requise'
      });
      hasError = true;
    }

    if (!signaturePreview) {
      setError('signature_photo', {
        type: 'manual',
        message: 'La signature est requise'
      });
      hasError = true;
    }

    if (!selectedSectors.length) {
      setError('activities', {
        type: 'manual',
        message: 'Au moins un secteur d\'activité est requis'
      });
      hasError = true;
    }

    if (!selectedSubSectors.length) {
      setError('sub_activities', {
        type: 'manual',
        message: 'Au moins un sous-secteur d\'activité est requis'
      });
      hasError = true;
    }

    if (!data.quartier) {
      setError('quartier', {
        type: 'manual',
        message: 'Le quartier est requis'
      });
      hasError = true;
    }
    
    if (!data.date_naissance) {
      setError('date_naissance', {
        type: 'manual',
        message: 'La date de naissance est requise'
      });
      hasError = true;
    }

    if (!data.genre) {
      setError('genre', {
        type: 'manual',
        message: 'Le genre est requis'
      });
      hasError = true;
    }

    if (!data.user.first_name) {
      setError('user.first_name', {
        type: 'manual',
        message: 'Le prénom est requis'
      });
      hasError = true;
    }

    if (!data.user.last_name) {
      setError('user.last_name', {
        type: 'manual',
        message: 'Le nom est requis'
      });
      hasError = true;
    }

    if (!data.user.email) {
      setError('user.email', {
        type: 'manual',
        message: 'L\'email est requis'
      });
      hasError = true;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.user.email)) {
      setError('user.email', {
        type: 'manual',
        message: 'Adresse email invalide'
      });
      hasError = true;
    }

    if (!data.user.phone_number) {
      setError('user.phone_number', {
        type: 'manual',
        message: 'Le numéro de téléphone est requis'
      });
      hasError = true;
    } else if (!/^[0-9+\s-]{8,}$/.test(data.user.phone_number)) {
      setError('user.phone_number', {
        type: 'manual',
        message: 'Numéro de téléphone invalide'
      });
      hasError = true;
    }

    if (!data.type_adherent) {
      setError('type_adherent', {
        type: 'manual',
        message: 'Le type d\'adhérent est requis'
      });
      hasError = true;
    }

    if (!data.address_id) {
      setError('address_id', {
        type: 'manual',
        message: 'La ville est requise'
      });
      hasError = true;
    }

    if (hasError) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...getValues(),
      profile_photo: profilePreview,
      signature_photo: signaturePreview,
      activities: selectedSectors,
      sub_activities: selectedSubSectors
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.first_name">
              Prénom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.first_name"
              {...register("user.first_name", { required: "Le prénom est requis" })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              placeholder="Entrez votre prénom"
            />
            {errors.user?.first_name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.user.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.last_name">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.last_name"
              {...register("user.last_name", { required: "Le nom est requis" })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              placeholder="Entrez votre nom"
            />
            {errors.user?.last_name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.user.last_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.email"
              type="email"
              {...register("user.email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide"
                }
              })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              placeholder="exemple@email.com"
            />
            {errors.user?.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.user.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.phone_number">
              Téléphone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.phone_number"
              type="tel"
              {...register("user.phone_number", {
                required: "Le numéro de téléphone est requis",
                pattern: {
                  value: /^[0-9+\s-]{8,}$/,
                  message: "Numéro de téléphone invalide"
                }
              })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              placeholder="+224 000 00 00 00"
            />
            {errors.user?.phone_number && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.user.phone_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Type d'adhérent <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("type_adherent", value as 'ADHERANT' | 'MEMBRE')}
              defaultValue={watch("type_adherent")}
              required
            >
              <SelectTrigger className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500">
                <SelectValue placeholder="Sélectionnez le type d'adhérent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADHERANT">Adhérent</SelectItem>
                <SelectItem value="MEMBRE">Membre</SelectItem>
              </SelectContent>
            </Select>
            {errors.type_adherent && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.type_adherent.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Ville <span className="text-red-500">*</span>
            </Label>
            <SearchableSelect
              name="address_id"
              control={control}
              rules={{ required: "La ville est requise" }}
              label=""
              data={addresses}
              valueKey="name"
              placeholder="Sélectionnez la ville"
              currentValue={watch('address_id')}
              disabled={false}
            />
            {errors.address_id && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.address_id.message}
              </p>
            )}
            <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Ville non trouvée ?</span>
            <AddAddressDialog 
              onSuccess={() => {
                loadAddresses()
              }}
            />
          </div>
          </div>
        </div>

        {/* Photo et Signature */}
        <div className="space-y-6">
          <div className="space-y-4 w-full">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Photo de profil <span className="text-red-500">*</span>
            </Label>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/10"
                  : errors.profile_photo
                  ? "border-red-500"
                  : "border-border hover:border-primary"
              )}
            >
              <input {...getInputProps()} required />
              {profilePreview ? (
                <div className="relative w-32 h-32 mx-auto">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Glissez une image ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG jusqu'à 10MB
                  </p>
                </div>
              )}
            </div>
            {errors.profile_photo && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                La photo de profil est requise
              </p>
            )}
          </div>

          <div className="space-y-4 w-full">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Signature <span className="text-red-500">*</span>
            </Label>
            <div className="border rounded-lg p-4 space-y-4 w-full">
              <div className="border rounded bg-white w-full">
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "w-full h-[200px]",
                  }}
                />
              </div>
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Effacer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={saveSignature}
                  disabled={isSignatureSaved}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isSignatureSaved ? "Signature Sauvegardée" : "Sauvegarder"}
                </Button>
              </div>
            </div>
            {errors.signature_photo && (
              <p className="text-sm text-red-500">{errors.signature_photo.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quartier, Date de naissance et Genre */}
      <div className="col-span-2 space-y-6">
        {/* Quartier et sur la même ligne */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="space-y-2 col-span-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Quartier <span className="text-red-500">*</span>
            </Label>
            <Input 
              {...register("quartier", { required: "Le quartier est requis" })}
              placeholder="Ex: Madina"
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full"
            />
            {errors.quartier && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.quartier.message}
              </p>
            )}
          </div>
        </div>

        {/* Date de naissance et Genre sur la même ligne */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Date de naissance <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              {...register("date_naissance", { required: "La date de naissance est requise" })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full"
            />
            {errors.date_naissance && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.date_naissance.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Genre <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => setValue("genre", value as 'HOMME' | 'FEMME')}
              defaultValue={watch("genre")}
              required
            >
              <SelectTrigger className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full">
                <SelectValue placeholder="Sélectionnez votre genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOMME">Homme</SelectItem>
                <SelectItem value="FEMME">Femme</SelectItem>
              </SelectContent>
            </Select>
            {errors.genre && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.genre.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Secteurs et sous-secteurs d'activité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
        {/* Secteurs d'activité */}
        <div className="space-y-4 w-full">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Secteurs d'activité <span className="text-red-500">*</span>
          </Label>
          <Popover open={openSectors} onOpenChange={setOpenSectors}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSectors}
                className="w-full justify-between dark:bg-cyan-950 bg-white border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              >
                {selectedSectors.length > 0
                  ? `${selectedSectors.length} secteur(s) sélectionné(s)`
                  : "Sélectionner les secteurs"}
                <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un secteur..." />
                <CommandEmpty>Aucun secteur trouvé.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {sectors.map((sector) => (
                    <CommandItem
                      key={sector.id}
                      onSelect={() => {
                        setSelectedSectors((prev) => {
                          const newSectors = prev.includes(sector)
                            ? prev.filter((s) => s.id !== sector.id)
                            : [...prev, sector];
                          setValue('activity_ids', newSectors.map(s => s.id));
                          return newSectors;
                        });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSectors.some(s => s.id === sector.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {sector.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-2 w-full">
            {selectedSectors.map((sector) => (
              <Badge
                key={sector.id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedSectors((prev) => {
                    const newSectors = prev.filter((s) => s.id !== sector.id);
                    setValue('activity_ids', newSectors.map(s => s.id));
                    return newSectors;
                  });
                }}
              >
                {sector.name}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Secteur non trouvé ?</span>
            <AddSectorDialog 
              onSuccess={() => {
                loadSectors()
              }}
            />
          </div>
        </div>

        {/* Sous-secteurs d'activité */}
        <div className="space-y-4 w-full">
          <Label className="text-cyan-700 dark:text-cyan-300">
            Sous-secteurs d'activité <span className="text-red-500">*</span>
          </Label>
          <Popover open={openSubSectors} onOpenChange={setOpenSubSectors}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSubSectors}
                className="w-full justify-between dark:bg-cyan-950 bg-white border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              >
                {selectedSubSectors.length > 0
                  ? `${selectedSubSectors.length} sous-secteur(s) sélectionné(s)`
                  : "Sélectionner les sous-secteurs"}
                <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un sous-secteur..." />
                <CommandEmpty>Aucun sous-secteur trouvé.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {subSectors.map((subSector) => (
                    <CommandItem
                      key={subSector.id}
                      onSelect={() => {
                        setSelectedSubSectors(prev => {
                          const newSubSectors = prev.includes(subSector)
                            ? prev.filter((s) => s.id !== subSector.id)
                            : [...prev, subSector];
                          setValue('sub_activity_ids', newSubSectors.map(s => s.id));
                          return newSubSectors;
                        });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedSubSectors.includes(subSector) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {subSector.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex flex-wrap gap-2 w-full">
            {selectedSubSectors.map((subSector) => (
              <Badge
                key={subSector.id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedSubSectors((prev) => {
                    const newSubSectors = prev.filter((s) => s.id !== subSector.id);
                    
                    setValue('sub_activity_ids', newSubSectors.map(s => s.id));
                    return newSubSectors;
                  });
                }}
              >
                {subSector.name}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Sous-secteur non trouvé ?</span>
            <AddSubSectorDialog 
              onSuccess={() => {
                loadSubSectos()
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer avec boutons retour et suivant */}
      <div className="flex items-center justify-between pt-6 border-t border-cyan-200 dark:border-cyan-800">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-cyan-200 dark:border-cyan-800"
        >
          Retour
        </Button>
        <Button 
          onClick={handleSubmit(handleFormSubmit)}
          disabled={!profilePreview || !signaturePreview || isSubmitting || !isValid}
          className="bg-cyan-600 hover:bg-cyan-700"
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Chargement...
            </>
          ) : (
            "Suivant"
          )}
        </Button>
      </div>
    </form>
  );
}
