"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, Loader, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { changePassword } from "@/fetcher/api-fetcher";

interface ChangePasswordFormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ChangePasswordDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch("new_password");

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (data.new_password !== data.confirm_password) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (data.new_password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès",
      });

      setIsOpen(false);
      reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.response?.data?.old_password?.[0]
        || error.response?.data?.new_password?.[0]
        || error.response?.data?.confirm_password?.[0]
        || "Impossible de modifier le mot de passe";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className={cn(
              "gap-2",
              "dark:border-cyan-900/20 border-cyan-600/20",
              "dark:text-cyan-400 text-cyan-600",
              "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10",
              "dark:hover:text-cyan-300 hover:text-cyan-700"
            )}
          >
            <KeyRound className="h-4 w-4" />
            Changer mon mot de passe
          </Button>
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
            Modifier mon mot de passe
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400 text-gray-600">
            Saisissez votre mot de passe actuel et choisissez un nouveau mot de passe sécurisé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label 
              htmlFor="old_password"
              className="dark:text-gray-300 text-gray-600"
            >
              Mot de passe actuel *
            </Label>
            <div className="relative">
              <Input
                id="old_password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe actuel"
                {...register("old_password", {
                  required: "Le mot de passe actuel est requis",
                })}
                className={cn(
                  "pr-10 transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                  errors.old_password && "border-red-500 dark:border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.old_password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.old_password.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label 
              htmlFor="new_password"
              className="dark:text-gray-300 text-gray-600"
            >
              Nouveau mot de passe *
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Entrez votre nouveau mot de passe"
                {...register("new_password", {
                  required: "Le nouveau mot de passe est requis",
                  minLength: {
                    value: 8,
                    message: "Le mot de passe doit contenir au moins 8 caractères",
                  },
                })}
                className={cn(
                  "pr-10 transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                  errors.new_password && "border-red-500 dark:border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.new_password.message}
              </p>
            )}
            <p className="text-xs dark:text-gray-400 text-gray-500">
              Minimum 8 caractères, incluez des lettres, chiffres et symboles
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label 
              htmlFor="confirm_password"
              className="dark:text-gray-300 text-gray-600"
            >
              Confirmer le mot de passe *
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre nouveau mot de passe"
                {...register("confirm_password", {
                  required: "La confirmation du mot de passe est requise",
                  validate: (value) =>
                    value === newPassword || "Les mots de passe ne correspondent pas",
                })}
                className={cn(
                  "pr-10 transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-600/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder:text-gray-500 placeholder:text-gray-400",
                  "dark:focus:border-cyan-500 focus:border-cyan-600",
                  "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                  errors.confirm_password && "border-red-500 dark:border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </motion.div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
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
              disabled={isLoading}
              className={cn(
                "dark:bg-cyan-500 bg-cyan-600",
                "dark:hover:bg-cyan-600 hover:bg-cyan-700",
                "text-white"
              )}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Modification en cours...
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Modifier le mot de passe
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
