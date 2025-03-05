"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentItem, Entreprise, MerchantEnrollment, MerchantEnrollmentSubmission } from "@/types";
import { CHIFFRE_AFFAIRE, NOMBRE_EMPLOYE } from "@/types/const";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { createEnrollement } from "@/fetcher/api-fetcher";
import { useRouter } from "next/navigation";

interface SubmitFormProps {
  merchantData: MerchantEnrollment;
  documentData: DocumentItem[];
  companyData: Partial<Entreprise>;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export default function SubmitForm({
  merchantData,
  documentData,
  companyData,
  onSubmit,
  onBack
}: SubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const submissionData: MerchantEnrollmentSubmission = {
      merchantData,
      documentData,
      companyData
    };

    try {
      console.log(submissionData)
      await createEnrollement(submissionData);
      toast({
        title: "Succès",
        description: "L'inscription a été enregistrée avec succès.",
        variant: "default"
      });
      router.push("/dashboard/merchants");
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-white dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800">
        <CardHeader>
          <CardTitle className="text-cyan-700 dark:text-cyan-300">Résumé de l'inscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-cyan-600 dark:text-cyan-400">Informations du marchand</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nom:</span>
                <span className="ml-2">{merchantData.user.first_name} {merchantData.user.last_name}</span>
              </div>
              <div>
                <span className="text-gray-500">Téléphone:</span>
                <span className="ml-2">{merchantData.user.phone_number}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2">{merchantData.user.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Ville:</span>
                <span className="ml-2">{merchantData.address?.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Quartier:</span>
                <span className="ml-2">{merchantData.quartier}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-cyan-600 dark:text-cyan-400">Documents</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {documentData.map((doc) => (
                <li key={doc.name}>{doc.name}</li>
              ))}
            </ul>
          </div>

          {merchantData.hasCompany && (
            <div className="space-y-2">
              <h3 className="font-medium text-cyan-600 dark:text-cyan-400">Informations de l'entreprise</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nom de l'entreprise:</span>
                  <span className="ml-2">{companyData?.nom}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date de création:</span>
                  <span className="ml-2">{companyData?.date_creation}</span>
                </div>
                <div>
                  <span className="text-gray-500">Nombre d'employés:</span>
                  <span className="ml-2">
                    {NOMBRE_EMPLOYE.find(opt => opt.value === companyData.nombre_employe?.toString())?.label || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Chiffre d'affaires:</span>
                  <span className="ml-2">
                    {CHIFFRE_AFFAIRE.find(opt => opt.value === companyData.chiffre_affaire?.toString())?.label || '-'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Produits:</span>
                  <span className="ml-2">{companyData.produits?.split(';').join(', ')}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Retour
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Soumission en cours...
              </>
            ) : (
              'Soumettre'
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
