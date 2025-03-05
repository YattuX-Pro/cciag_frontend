"use client";

import { useForm } from "react-hook-form";
import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";
import { MerchantEnrollment } from "@/types";
import { Upload, RefreshCw, Check } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { getAddresses } from "@/fetcher/api-fetcher";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AddAddressDialog from "./(dialog)/AddAddressDialog";
import { Checkbox } from "@/components/ui/checkbox";

interface MerchantInfoFormProps {
  onSubmit: (data: MerchantEnrollment) => void;
  onBack: () => void;
  initialData?: MerchantEnrollment | null;
}

export default function MerchantInfoForm({ onSubmit, onBack, initialData }: MerchantInfoFormProps) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(initialData?.address || null);
  const [profilePreview, setProfilePreview] = useState<string | null>(initialData?.profile_photo || null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(initialData?.signature_photo || null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    control,
    watch,
    clearErrors
  } = useForm<MerchantEnrollment>({
    defaultValues: {
      ...initialData,
      hasCompany: initialData?.hasCompany || false
    }
  });

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [initialData, setValue]);

  const loadAddresses = async () => {
    try {
      const addressList = await getAddresses();
      setAddresses(addressList.results);
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
        setValue('profile_photo', reader.result as string);
        // Réinitialiser l'erreur de la photo
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
      // Réinitialiser l'erreur de la signature
      if (errors.signature_photo) {
        clearErrors('signature_photo');
      }
    }
  };

  const handleFormSubmit = (data: MerchantEnrollment) => {
    if (!data.profile_photo) {
      setError('profile_photo', {
        type: 'manual',
        message: 'La photo de profil est requise'
      });
      return;
    }

    if (!data.signature_photo) {
      setError('signature_photo', {
        type: 'manual',
        message: 'La signature est requise'
      });
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.first_name">Prénom</Label>
            <Input
              id="user.first_name"
              {...register("user.first_name", { required: "Le prénom est requis" })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full"
              placeholder="Entrez le prénom"
            />
            {errors.user?.first_name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.user.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.last_name">Nom</Label>
            <Input
              id="user.last_name"
              {...register("user.last_name", { required: "Le nom est requis" })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full"
              placeholder="Entrez le nom"
            />
            {errors.user?.last_name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.user.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.email">Email</Label>
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
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full"
              placeholder="Entrez l'email"
            />
            {errors.user?.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.user.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-700 dark:text-cyan-300" htmlFor="user.phone_number">Téléphone</Label>
            <Input
              id="user.phone_number"
              type="tel"
              {...register("user.phone_number", {
                required: "Le numéro de téléphone est requis",
                pattern: {
                  value: /^[0-9+\s-]+$/,
                  message: "Numéro de téléphone invalide"
                }
              })}
              className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500 w-full"
              placeholder="Entrez le numéro de téléphone"
            />
            {errors.user?.phone_number && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.user.phone_number.message}</p>
            )}
          </div>
          {/* Ville */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 text-cyan-600"
          >
            <SearchableSelect
              control={control}
              {...register(`address_id`, {
                required: "La ville est requise",
                onChange: (e) => {
                  const selectedAddress = addresses.find(x => x.id === e.target.value);
                  if (!selectedAddress) return;
                  setValue('address_id', selectedAddress.id);
                  setValue('address', selectedAddress);
                }
              })}
              label="Ville"
              data={addresses}
              valueKey="name"
              placeholder="Sélectionnez la ville"
            />
            {errors.address && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.address.message}
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
            
            {/* Quartier */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <Label className="text-cyan-700 dark:text-cyan-300">Quartier</Label>
              <Input 
                {...register("quartier", { required: "Le quartier est requis" })}
                placeholder="Ex: Madina"
                className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 focus-visible:ring-cyan-500"
              />
              {errors.quartier && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.quartier.message}
                </p>
              )}
            </motion.div>
          </motion.div>
          {/* Checkbox pour entreprise */}
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="hasCompany"
              checked={watch('hasCompany') || false}
              onCheckedChange={(checked) => {
                setValue('hasCompany', Boolean(checked));
              }}
            />
            <label 
              htmlFor="hasCompany" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cet adhérent possède une entreprise
            </label>
          </div>
        </div>

        {/* Photo et Signature */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-cyan-700 dark:text-cyan-300">Photo de profil</Label>
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/10"
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
                </div>
              )}
            </div>
            {errors.profile_photo && (
              <p className="text-sm text-red-500">{errors.profile_photo.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-cyan-700 dark:text-cyan-300">Signature</Label>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="border rounded bg-white">
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "w-full h-[200px]",
                  }}
                />
              </div>
              <div className="flex gap-2">
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

      <div className="flex justify-end gap-2">
        <Button type="submit" className="w-full sm:w-auto">
          Suivant
        </Button>
      </div>
    </form>
  );
}
