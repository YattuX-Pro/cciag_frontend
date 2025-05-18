"use client";

import { useForm } from "react-hook-form";
import { useRef, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";
import {
  MerchantEnrollment,
  Activity,
  SubActivity,
  TypeAdhesionData,
  WorkPosition,
  Nationality,
} from "@/types";
import { Upload, RefreshCw, Check, Loader, Camera } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import {
  createActivity,
  createSubActivity,
  getActivities,
  getSubActivities,
  getAddresses,
  getActivityDetail,
  getWorkPositions,
  getNationalities,
} from "@/fetcher/api-fetcher";
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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AddSectorDialog from "./(dialog)/AddSectorDialog";
import AddSubSectorDialog from "./(dialog)/AddSubSectorDialog";
import AddAddressDialog from "./(dialog)/AddAddressDialog";
import Signature from "./(component)/Signature";
import WebcamCapture from "./(component)/WebcamCapture";

interface MerchantInfoFormProps {
  onSubmit: (data: MerchantEnrollment) => void;
  onBack: () => void;
  initialData?: MerchantEnrollment;
  typeAdhesionData: TypeAdhesionData;
}

export default function MerchantInfoForm({
  onSubmit,
  onBack,
  initialData,
  typeAdhesionData,
}: MerchantInfoFormProps) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [openSectors, setOpenSectors] = useState(false);
  const [openSubSectors, setOpenSubSectors] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<Activity[]>([]);
  const [selectedSubSectors, setSelectedSubSectors] = useState<SubActivity[]>(
    []
  );
  const [sectors, setSectors] = useState<Activity[]>([]);
  const [workPostions, setWorkPostions] = useState<WorkPosition[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [subSectors, setSubSectors] = useState<SubActivity[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const loadSectors = async () => {
    try {
      let activities = await getActivities({ limit: 1000 });
      setSectors(activities.results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erreur chargement secteurs d'activité",
      });
    }
  };

  const loadWorkPosition = async () => {
    try {
      let workPostions = await getWorkPositions({ limit: 1000 });
      setWorkPostions(workPostions.results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erreur chargement liste poste de travail",
      });
    }
  };

  const loadNationalities = async () => {
    try {
      let nationalities = await getNationalities({ limit: 1000 });
      setNationalities(nationalities.results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erreur chargement nationalités",
      });
    }
  };

  const loadSubSectos = async () => {
    try {
      let subActivities = await getSubActivities({ limit: 1000 });
      setSubSectors(subActivities.results);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Erreur chargement sous-secteurs d'activité",
      });
    }
  };

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
    getValues,
  } = useForm<MerchantEnrollment>({
    defaultValues: {
      user: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        id: null,
        last_login: "",
        is_superuser: false,
        username: "",
      },
      date_naissance: "",
      genre: "HOMME",
      fonction: "",
      address: null,
      address_id: null,
      activity_ids: [],
      profile_photo: "",
      signature_photo: "",
      type_adherent: typeAdhesionData.typeActivite?.formalisee
        ? "ADHERANT"
        : "MEMBRE",
      nationality_id: null,
      work_position_id: null,
    },
  });

  useEffect(() => {
    loadAddresses();
    loadSectors();
    loadSubSectos();
    loadNationalities();
    loadWorkPosition();

    if (initialData) {
      reset(initialData);
      if (initialData.profile_photo)
        setProfilePreview(initialData.profile_photo);
      if (initialData.signature_photo)
        setSignaturePreview(initialData.signature_photo);
      if (initialData.activities) setSelectedSectors(initialData.activities);
      if (initialData.sub_activities)
        setSelectedSubSectors(initialData.sub_activities);
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const minSizeInBytes = 5 * 1024 * 1024; // 5Mo en bytes

        if (file.size > minSizeInBytes) {
          setError("profile_photo", {
            type: "manual",
            message: `La taille de l'image doit être d'au moins 5Mo. Taille actuelle: ${(file.size / (1024 * 1024)).toFixed(2)}Mo`,
          });
          toast({
            title: "Erreur",
            description: `La taille de l'image doit être d'au moins 5Mo. Taille actuelle: ${(file.size / (1024 * 1024)).toFixed(2)}Mo`,
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePreview(reader.result as string);
          setValue("profile_photo", reader.result as string);
          if (errors.profile_photo) {
            clearErrors("profile_photo");
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [setValue, errors.profile_photo, clearErrors]
  );

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
      setValue("signature_photo", null);
      setIsSignatureSaved(false);
    }
  };

  const saveSignature = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL();
      setSignaturePreview(signatureData);
      setValue("signature_photo", signatureData);
      setIsSignatureSaved(true);
      if (errors.signature_photo) {
        clearErrors("signature_photo");
      }
    }
  };

  const handleFormSubmit = async (data: MerchantEnrollment) => {
    let hasError = false;

    if (!profilePreview) {
      setError("profile_photo", {
        type: "manual",
        message: "La photo de profil est requise",
      });
      hasError = true;
    }

    if (!isSignatureSaved) {
      setError("signature_photo", {
        type: "manual",
        message: "La signature est requise",
      });
      hasError = true;
    }

    if (!selectedSectors.length) {
      setError("activities", {
        type: "manual",
        message: "Au moins un secteur d'activité est requis",
      });
      hasError = true;
    }

    if (!selectedSubSectors.length) {
      setError("sub_activities", {
        type: "manual",
        message: "Au moins un sous-secteur d'activité est requis",
      });
      hasError = true;
    }

    if (!data.date_naissance) {
      setError("date_naissance", {
        type: "manual",
        message: "La date de naissance est requise",
      });
      hasError = true;
    }

    if (!data.genre) {
      setError("genre", {
        type: "manual",
        message: "Le genre est requis",
      });
      hasError = true;
    }

    if (!data.user.first_name) {
      setError("user.first_name", {
        type: "manual",
        message: "Le prénom est requis",
      });
      hasError = true;
    }

    if (!data.user.last_name) {
      setError("user.last_name", {
        type: "manual",
        message: "Le nom est requis",
      });
      hasError = true;
    }

    if (!data.user.email) {
      setError("user.email", {
        type: "manual",
        message: "L'email est requis",
      });
      hasError = true;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.user.email)
    ) {
      setError("user.email", {
        type: "manual",
        message: "Adresse email invalide",
      });
      hasError = true;
    }

    if (!data.user.phone_number) {
      setError("user.phone_number", {
        type: "manual",
        message: "Le numéro de téléphone est requis",
      });
      hasError = true;
    } else if (!/^[0-9+\s-]{8,}$/.test(data.user.phone_number)) {
      setError("user.phone_number", {
        type: "manual",
        message: "Numéro de téléphone invalide",
      });
      hasError = true;
    }

    if (!data.type_adherent) {
      setError("type_adherent", {
        type: "manual",
        message: "Le type d'adhérent est requis",
      });
      hasError = true;
    }

    if (!data.address_id) {
      setError("address_id", {
        type: "manual",
        message: "La ville est requise",
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
      sub_activities: selectedSubSectors,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne gauche - Informations personnelles */}
        <div className="space-y-4">
          {/* Première ligne */}
          <div className="space-y-2">
            <Label
              className="text-cyan-700 dark:text-cyan-300"
              htmlFor="user.first_name"
            >
              Prénom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.first_name"
              {...register("user.first_name", {
                required: "Le prénom est requis",
              })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              placeholder="Entrez votre prénom"
            />
            {errors.user?.first_name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.user.first_name.message}
              </p>
            )}
          </div>

          {/* Deuxième ligne */}

          <div className="space-y-2">
            <Label
              className="text-cyan-700 dark:text-cyan-300"
              htmlFor="user.last_name"
            >
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

          {/* Troisième ligne */}
          <div className="space-y-2">
            <Label
              className="text-cyan-700 dark:text-cyan-300"
              htmlFor="date_naissance"
            >
              Date De Naissance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_naissance"
              type="date"
              {...register("date_naissance", {
                required: "La date est requise",
              })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
            />
            {errors.date_naissance && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.date_naissance.message}
              </p>
            )}
          </div>

          {/* Quatrième ligne */}
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
              currentValue={watch("address_id")}
              disabled={false}
            />
            {errors.address_id && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.address_id.message}
              </p>
            )}
          </div>

          {/* Quatrième ligne */}
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Poste de traivail <span className="text-red-500">*</span>
            </Label>
            <SearchableSelect
              name="work_position_id"
              control={control}
              rules={{ required: "Le poste de travail est requis" }}
              label=""
              data={workPostions}
              valueKey="name"
              placeholder="Sélectionnez le poste de travail"
              currentValue={watch("work_position_id")}
              disabled={false}
            />
            {errors.work_position_id && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.work_position_id.message}
              </p>
            )}
          </div>

          {/* Quatrième ligne */}
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Nationalité <span className="text-red-500">*</span>
            </Label>
            <SearchableSelect
              name="nationality_id"
              control={control}
              rules={{ required: "La nationalité est requise" }}
              label=""
              data={nationalities}
              valueKey="name"
              placeholder="Sélectionnez la nationalité"
              currentValue={watch("nationality_id")}
              disabled={false}
            />
            {errors.nationality_id && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.nationality_id.message}
              </p>
            )}
          </div>

          {/* Cinquième ligne - Secteurs */}
          <div className="space-y-2">
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
                            setValue(
                              "activity_ids",
                              newSectors.map((s) => s.id)
                            );
                            return newSectors;
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSectors.some((s) => s.id === sector.id)
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
            <div className="flex flex-wrap gap-2">
              {selectedSectors.map((sector) => (
                <Badge
                  key={sector.id}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedSectors((prev) => {
                      const newSectors = prev.filter((s) => s.id !== sector.id);
                      setValue(
                        "activity_ids",
                        newSectors.map((s) => s.id)
                      );
                      return newSectors;
                    });
                  }}
                >
                  {sector.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>


        </div>

        {/* Colonne droite */}
        <div className="space-y-4">
          {/* Photo de profil en haut à droite */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-cyan-700 dark:text-cyan-300">
                Photo de profil <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowWebcam(!showWebcam)}
                className="border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/30"
              >
                {showWebcam ? (
                  <>
                    <Upload className="h-4 w-4 mr-2" /> Télécharger
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" /> Utiliser webcam
                  </>
                )}
              </Button>
            </div>

            {showWebcam ? (
              <WebcamCapture
                onCapture={(imageSrc) => {
                  setProfilePreview(imageSrc);
                  setValue("profile_photo", imageSrc);
                  if (errors.profile_photo) {
                    clearErrors("profile_photo");
                  }
                  setShowWebcam(false);
                }}
                onCancel={() => setShowWebcam(false)}
                initialImage={profilePreview}
              />
            ) : (
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
                <input {...getInputProps()} />
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
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </div>
                )}
              </div>
            )}
            {errors.profile_photo && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                La photo de profil est requise
              </p>
            )}
          </div>

          {/* Première ligne - À côté de la photo */}
          <div className="space-y-2">
            <Label
              className="text-cyan-700 dark:text-cyan-300"
              htmlFor="user.email"
            >
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.email"
              type="email"
              {...register("user.email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
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

          {/* Deuxième ligne */}
          <div className="space-y-2">
            <Label
              className="text-cyan-700 dark:text-cyan-300"
              htmlFor="user.phone_number"
            >
              Téléphone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user.phone_number"
              type="tel"
              {...register("user.phone_number", {
                required: "Le numéro de téléphone est requis",
                pattern: {
                  value: /^[0-9+\s-]{8,}$/,
                  message: "Numéro de téléphone invalide",
                },
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

          {/* Troisième ligne */}
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Genre <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("genre", value as "HOMME" | "FEMME")
              }
              defaultValue={watch("genre")}
              required
            >
              <SelectTrigger className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500">
                <SelectValue placeholder="Sélectionnez le genre" />
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

          {/* Quatrième ligne */}
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300">
              Type d'adhérent <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("type_adherent", value as "ADHERANT" | "MEMBRE")
              }
              defaultValue={watch("type_adherent")}
              required
              disabled={true}
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

          {/* Cinquième ligne - Sous-secteurs */}
          <div className="space-y-2">
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
                          setSelectedSubSectors((prev) => {
                            const newSubSectors = prev.includes(subSector)
                              ? prev.filter((s) => s.id !== subSector.id)
                              : [...prev, subSector];
                            setValue(
                              "sub_activity_ids",
                              newSubSectors.map((s) => s.id)
                            );
                            return newSubSectors;
                          });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSubSectors.includes(subSector)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {subSector.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2">
              {selectedSubSectors.map((subSector) => (
                <Badge
                  key={subSector.id}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedSubSectors((prev) => {
                      const newSubSectors = prev.filter(
                        (s) => s.id !== subSector.id
                      );
                      setValue(
                        "sub_activity_ids",
                        newSubSectors.map((s) => s.id)
                      );
                      return newSubSectors;
                    });
                  }}
                >
                  {subSector.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signature - Prend toute la largeur */}
      <div className="space-y-4 mt-6">
        <Label className="text-cyan-700 dark:text-cyan-300">
          Signature <span className="text-red-500">*</span>
        </Label>
        <div className="border rounded-lg p-4 space-y-4">
          <Signature
            onChange={(signatureData: string | null) => {
              setSignaturePreview(signatureData);
              setValue("signature_photo", signatureData);
              if (!signatureData) {
                setIsSignatureSaved(false);
              } else {
                setIsSignatureSaved(true);
                if (errors.signature_photo) {
                  clearErrors("signature_photo");
                }
              }
            }}
          />

          {errors.signature_photo && (
            <p className="text-sm text-red-500">
              {errors.signature_photo.message}
            </p>
          )}
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
          type="submit"
          disabled={
            !profilePreview || !isSignatureSaved || isSubmitting || !isValid
          }
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
