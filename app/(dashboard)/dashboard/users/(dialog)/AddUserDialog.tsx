import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit2, Loader, Plus, Upload, User as UserIcon, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { User } from "@/types";
import { user_roles } from "@/types/const";
import { createUser, updateUser, resetPassword } from "@/fetcher/api-fetcher";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  afterClose: Dispatch<SetStateAction<boolean>>;
  isEdit?: boolean;
  user?: User;
};

function AddUserDialog({ afterClose, isEdit = false, user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, SetPassword] = useState(true);
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
    control,
  } = useForm<User>({
    defaultValues: {
      is_active: true,
    },
  });
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      reset(user);
      SetPassword(false);
    }
  }, []);

  const onOnpenChange = (isOpen: boolean) => {
    setIsLoading(false);
    setIsOpen(isOpen);
    if (!isOpen) reset();
  };

  const onSetPasswordChange = (value: boolean) => {
    SetPassword(value);
  };

  const onSubmint = (data: User) => {
    setIsLoading(true);
    if (isEdit) {
      updateUser(data, data.id)
        .then((result) => {
          toast({
            title: "Modification Utilisateur",
            description: "Utilisateur modifié avec succès.",
          });
          afterClose(true);
          reset();
          onOnpenChange(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Modification Utilisateur",
            description: "Oups, Errreur modification d'utilisateur.",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      createUser(data)
        .then((result) => {
          toast({
            title: "Création Utilisateur",
            description: "Utilisateur créé avec succès.",
          });
          afterClose(true);
          reset();
          onOnpenChange(false);
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Création Utilisateur",
            description: "Oups, Errreur création d'utilisateur.",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const passwordValidation = (password) => {
    if (password.length < 8) {
      return "Le mot de passe doit comporter au moins 8 caractères.";
    }

    const commonPasswords = ["123456", "password", "qwerty", "abc123"];
    if (commonPasswords.includes(password)) {
      return "Le mot de passe est trop courant.";
    }

    if (/^\d+$/.test(password)) {
      return "Le mot de passe ne peut pas être uniquement numérique.";
    }

    return true;
  };

  const handleResetPassword = async () => {
    try {
      setIsResetting(true);
      await resetPassword(user?.email as string);
      
      toast({
        title: "Réinitialisation du mot de passe",
        description: "Un email de réinitialisation a été envoyé à l'utilisateur.",
        className: cn(
          "bg-green-50 dark:bg-green-900/50",
          "border-green-200 dark:border-green-800",
          "text-green-600 dark:text-green-400"
        ),
        duration: 5000,
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation du mot de passe.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOnpenChange}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {isEdit ? (
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
              <Plus className="mr-2 h-4 w-4" /> Ajout Utilisateur
            </Button>
          )}
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[600px] backdrop-blur-sm",
          "dark:bg-gray-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
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
            {isEdit ? "Modifier Utilisateur" : "Nouvel Utilisateur"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmint)}
          autoComplete="new-form"
          className="space-y-6"
        >
          {/* Active Status Switch */}
          <div className="flex items-center justify-end mb-2 space-x-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <>
                  <Switch
                    id="is_active"
                    defaultChecked={true}
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:dark:bg-cyan-500 data-[state=checked]:bg-cyan-600"
                  />
                  <Label
                    htmlFor="is_active"
                    className="dark:text-gray-300 text-gray-600"
                  >
                    {field.value ? "Actif " : "Non Actif"}
                  </Label>
                </>
              )}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="firstName"
                className="dark:text-gray-300 text-gray-600"
              >
                Prénom
              </Label>
              <Input
                id="firstName"
                placeholder="Ex: Prenom"
                required
                autoComplete="new-firstname"
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
                {...register(`first_name`, {
                  required: "Veuillez saisir le prénom",
                })}
              />
              {errors.first_name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="lastName"
                className="dark:text-gray-300 text-gray-600"
              >
                Nom
              </Label>
              <Input
                id="lastName"
                placeholder="Ex: Sylla"
                required
                autoComplete="new-lastname"
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
                {...register(`last_name`, {
                  required: "Veuillez saisir le nom",
                })}
              />
              {errors.last_name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.last_name.message}
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
                htmlFor="phone"
                className="dark:text-gray-300 text-gray-600"
              >
                Téléphone
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="+224 123456789"
                required
                autoComplete="new-phone"
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
                {...register(`phone_number`, {
                  required: "Veuillez saisir le numéro de téléphone",
                })}
              />
              {errors.phone_number && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phone_number.message}
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
                required
                autoComplete="new-email"
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
                {...register(`email`, {
                  required: "Veuillez saisir l'email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>
          </div>

          {/* Password Section */}
          {isEdit ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id="set_password"
                defaultChecked={false}
                onCheckedChange={onSetPasswordChange}
                className={cn(
                  "border-cyan-600/20 dark:border-cyan-900/20",
                  "data-[state=checked]:bg-cyan-600 dark:data-[state=checked]:bg-cyan-500"
                )}
              />
              <Label
                className="dark:text-gray-300 text-gray-600"
                htmlFor="set_password"
              >
                Modifier le mot de passe ?
              </Label>
            </motion.div>
          ) : null}

          {password && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <Label
                htmlFor="password"
                className="dark:text-gray-300 text-gray-600"
              >
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                autoComplete="new-password"
                required
                className={cn(
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600"
                )}
                {...register(`password`, {
                  required: "Veuillez saisir le mot de passe",
                  validate: passwordValidation,
                })}
              />
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </motion.div>
          )}

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label
              htmlFor="role"
              className="dark:text-gray-300 text-gray-600"
            >
              Rôle
            </Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Veuillez sélectionner le rôle" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={cn(
                      "dark:bg-gray-800/50 bg-gray-50",
                      "dark:border-cyan-900/20 border-cyan-600/20",
                      "dark:text-gray-100 text-gray-900"
                    )}
                  >
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent
                    className={cn(
                      "dark:bg-gray-800 bg-white",
                      "dark:border-cyan-900/20 border-cyan-600/20"
                    )}
                  >
                    {user_roles().map((role, index) => (
                      <SelectItem
                        key={index}
                        value={role.value}
                        className={cn(
                          "dark:text-gray-100 text-gray-900",
                          "dark:focus:bg-cyan-500/10 focus:bg-cyan-500/10",
                          "dark:focus:text-cyan-400 focus:text-cyan-600"
                        )}
                      >
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.role.message}
              </p>
            )}
          </motion.div>

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
                {isEdit && (
                  <Button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={isResetting}
                    variant="outline"
                    className={cn(
                      "dark:border-cyan-900/20 border-cyan-600/20",
                      "dark:text-cyan-400 text-cyan-600",
                      "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                    )}
                  >
                    {isResetting ? (
                      <span className="flex items-center">
                        <Loader className="animate-spin mr-2 h-4 w-4" />
                        Réinitialisation...
                      </span>
                    ) : (
                      <>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Réinitialiser le mot de passe
                      </>
                    )}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOnpenChange(false)}
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
                  ) : isEdit ? (
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
export default AddUserDialog;
