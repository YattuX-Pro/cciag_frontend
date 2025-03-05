"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Edit2, Loader, Plus, Upload, RefreshCw, Check, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  createMerchant,
  getAddresses,
  updateMerchant,
} from "@/fetcher/api-fetcher";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Address, MerchantEnrollment } from "@/types";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";

import SearchableSelect from "@/components/SearchableSelect";

interface AddMerchantDialogProps {
  merchant?: MerchantEnrollment;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function AddMerchantDialog({
  merchant,
  onSuccess,
  trigger,
}: AddMerchantDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [selectedAddress, setSelectedAddress] = useState(
    merchant?.address?.id || ""
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    merchant?.profile_photo || null
  );
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    merchant?.signature_photo || null
  );
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<MerchantEnrollment>({
    defaultValues: merchant ? {
      ...merchant,
      user: {
        ...merchant?.user,
        phone_number: merchant?.user?.phone_number?.toString() || ''
      }
    } : undefined
  });

  const onOpenChange = (open: boolean) => {
    setIsLoading(false);
    setIsOpen(open);
    if (!open) {
      reset();
      setProfilePreview(merchant?.profile_photo || null);
      setSignaturePreview(merchant?.signature_photo || null);
      setIsSignatureSaved(false);
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }
    } else {
      if (merchant) {
        reset({
          ...merchant,
          user: {
            ...merchant?.user,
            phone_number: merchant?.user?.phone_number?.toString() || ''
          }
        });
      } else {
        reset();
      }
    }
  };

  const onSubmit = async (data: MerchantEnrollment) => {
    try {
      setIsLoading(true);
      
      if (!data.profile_photo) {
        setError('profile_photo', {
          type: 'manual',
          message: 'La photo de profil est requise'
        });
        setIsLoading(false);
        return;
      }

      if (!data.signature_photo) {
        setError('signature_photo', {
          type: 'manual',
          message: 'La signature est requise'
        });
        setIsLoading(false);
        return;
      }

      let response;
      if (merchant) {
        response = await updateMerchant(data, merchant.id);
      } else {
        response = await createMerchant(data);
      }
      if (response?.status === "success") {
        const { status, message } = response;
        toast({
          title: merchant ? "Modification Commerçant" : "Création Commerçant",
          description: message || "Opération effectuée avec succès",
          variant: status === "error" ? "destructive" : "default",
          className: cn(
            status === "success" && "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800",
            "text-green-600 dark:text-green-400"
          ),
          duration: 3000,
        });

        onSuccess?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      
      if (error.response?.data) {
        const { message, field } = error.response.data;
        
        const title = field 
          ? `Erreur - ${field.charAt(0).toUpperCase() + field.slice(1)}` 
          : "Erreur";

        toast({
          title: title,
          description: message,
          variant: "destructive",
          duration: 5000,
        });

        handleSubmit(onSubmit);
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue est survenue.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
        setValue('profile_photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

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
      setValue('signature_photo', signatureData as string);
      setIsSignatureSaved(true);
    }
  };

  const loadAddresses = async () => {
    try {
      const addresses = await getAddresses({limit: 0});
      console.log(addresses);
      setAddresses(addresses.results);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {merchant ? (
            <Button
              variant="ghost"
              size="sm"
              className="dark:text-cyan-400 text-cyan-600 dark:hover:text-cyan-300 hover:text-cyan-700 dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button className="bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-700 dark:hover:bg-cyan-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Nouvel Enrollement
            </Button>
          )}
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
            {merchant ? "Modifier Enrollement" : "Nouvel Enrollement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('profile_photo')} />
          <input type="hidden" {...register('signature_photo')} />
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="first_name"
                className="dark:text-gray-300 text-gray-600"
              >
                Prénom
              </Label>
              <Input
                id="first_name"
                placeholder="Ex: Prenom"
                {...register("user.first_name", {
                  required: "Veuillez saisir le prénom",
                })}
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
              />
              {errors.user?.first_name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.user?.first_name.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="last_name"
                className="dark:text-gray-300 text-gray-600"
              >
                Nom
              </Label>
              <Input
                id="last_name"
                placeholder="Ex: Nom"
                {...register("user.last_name", {
                  required: "Veuillez saisir le nom",
                })}
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
              />
              {errors.user?.last_name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.user?.last_name.message}
                </p>
              )}
            </motion.div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="phone_number"
                className="dark:text-gray-300 text-gray-600"
              >
                Téléphone
              </Label>
              <Input
                id="phone_number"
                type="number"
                placeholder="123456789"
                {...register("user.phone_number", {
                  required: "Le numéro de téléphone est requis",
                  validate: {
                    maxLength: (value) => 
                      value.toString().length <= 9 || "Le numéro doit contenir maximum 9 chiffres",
                    isNumber: (value) => 
                      !isNaN(Number(value)) || "Le numéro doit contenir uniquement des chiffres"
                  },
                  setValueAs: (value) => value ? Number(value) : value
                })}
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
              />
              {errors.user?.phone_number && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.user?.phone_number.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="email"
                className="dark:text-gray-300 text-gray-600"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("user.email", {
                  required: "Veuillez saisir l'email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide",
                  },
                })}
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
              />
              {errors.user?.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.user?.email.message}
                </p>
              )}
            </motion.div>
          </div>

          {/* Adresse */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <SearchableSelect
              control={control}
              {...register(`address_id`, {
                required: "L'adresse est requis",
              })}
              label="Adresse"
              data={addresses}
              valueKey="name"
              placeholder="Sélectionnez l'adresse"
              currentValue={merchant?.address?.id}
            />
            {errors.address?.name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.address.name.message}
              </p>
            )}
          </motion.div>

          {/* Photos et Signature */}
          <div className="grid grid-cols-2 gap-2">
            {/* Photo de profil avec Drag & Drop */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <Label className="dark:text-gray-300 text-gray-600">
                Photo de profil
              </Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "hover:border-cyan-500",
                  "dark:bg-gray-800/50 bg-gray-50",
                  isDragActive && "border-cyan-500",
                  "h-[140px] flex flex-col items-center justify-center" // Hauteur réduite
                )}
              >
                <input  {...getInputProps()} />
                {profilePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      
                      src={profilePreview}
                      alt="Profile Preview"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                    <p className="text-sm text-gray-500">
                      Cliquez ou déposez pour changer
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {isDragActive
                        ? "Déposez l'image ici"
                        : "Cliquez ou déposez une image ici"}
                    </p>
                  </div>
                )}
              </div>
              {errors.profile_photo && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.profile_photo.message}
                </p>
              )}
            </motion.div>

            {/* Signature électronique */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <Label className="dark:text-gray-300 text-gray-600">
                Signature
              </Label>
              <div
                className={cn(
                  "border rounded-lg p-2",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:bg-cyan-950 bg-white"
                )}
              >
                <SignatureCanvas
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "signature-canvas",
                    width: 250,
                    height: 80, // Hauteur réduite
                  }}
                  backgroundColor="white"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className={cn(
                      "dark:border-cyan-900/20 border-cyan-600/20",
                      "dark:text-gray-300 text-gray-600"
                    )}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Effacer
                  </Button>
                  
                  {isSignatureSaved ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveSignature}
                      className={cn(
                        "bg-cyan-600 dark:bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-700",
                        "text-white",
                        "transition-all duration-200"
                      )}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  )}
                </div>
              </div>
              {errors.signature_photo && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.signature_photo.message}
                </p>
              )}
            </motion.div>
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="gap-2">
            {isLoading ? (
              <div className="w-20 flex justify-center items-center">
                <div
                  className={cn(
                    "w-6 h-6 border-2 rounded-full animate-spin",
                    "dark:border-cyan-500 border-cyan-600",
                    "dark:border-t-transparent border-t-transparent"
                  )}
                />
              </div>
            ) : (
              <>
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
                  Annuler
                </Button>
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
                  ) : merchant ? (
                    "Modifier"
                  ) : (
                    "Ajouter"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
