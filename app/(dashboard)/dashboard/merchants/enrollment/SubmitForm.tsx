"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityData, DocumentItem, Entreprise, ITypeAdhesion, MerchantEnrollment, MerchantEnrollmentSubmission, MerchantPayment, Tarification, TypeAdhesionData } from "@/types";
import { CHIFFRE_AFFAIRE, NOMBRE_EMPLOYE } from "@/types/const";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { createEnrollement, createMerchantPayment, getAddresses, getTarifications } from "@/fetcher/api-fetcher";
import { useRouter } from "next/navigation";

interface SubmitFormProps {
  merchantData: MerchantEnrollment;
  documentData: DocumentItem[];
  companyData: Partial<Entreprise>;
  typeAdhesionData: TypeAdhesionData;
  activityData?: ActivityData;
  onSubmit: () => Promise<void>;
  onBack: () => void;
}

export default function SubmitForm({
  merchantData,
  documentData,
  companyData,
  typeAdhesionData,
  activityData,
  onSubmit,
  onBack
}: SubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [tarifications, setTarifications] = useState<Tarification[]>([]);
  const [selectedTarification, setSelectedTarification] = useState<Tarification | null>(null);
  const [isLoadingTarification, setIsLoadingTarification] = useState(true);
  const router = useRouter();

  const loadAddresses = async () => {
    try {
      const data = await getAddresses({ limit: 2000 });
      setAddresses(data.results);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadTarificationAdhesion = async () => {
    setIsLoadingTarification(true);
    try {
      const { results } = await getTarifications({ limit: 2000 });
      setTarifications(results);
      let foundTarification: Tarification | undefined;

      foundTarification = results.find(t => t.type_adhesion === typeAdhesionData.type_adhesion);
      
      if (foundTarification) {
        merchantData.tarification_adhesion_id = foundTarification.id;
        setSelectedTarification(foundTarification);
      } else {
        toast({
          title: "Attention",
          description: "Aucune tarification trouvée pour ce type d'adhésion",
        });
      }
    } catch (error) {
      console.error('Error loading tarification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la tarification",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTarification(false);
    }
  };

  useEffect(() => {
    loadAddresses();
    loadTarificationAdhesion();
  }, []);
    
  const handleSubmit = async () => {
    setIsSubmitting(true);
    let typeAdhesion: ITypeAdhesion = {
      type_demande: typeAdhesionData.type_demande,
      formalisee: typeAdhesionData.typeActivite.formalisee,
      non_formalisee: typeAdhesionData.typeActivite.nonFormalisee,
      type_adhesion: typeAdhesionData.type_adhesion,
    }

    const submissionData: MerchantEnrollmentSubmission = {
      merchantData,
      documentData,
      typeAdhesion,
      activityData,
      companyData: {
        ...companyData,
        forme_juridique: typeAdhesion.non_formalisee ? null : companyData.forme_juridique,
        numero_rccm: typeAdhesion.non_formalisee ? null : companyData.numero_rccm,
        numero_nif: typeAdhesion.non_formalisee ? null : companyData.numero_nif
      }
    };

    try {
      const response = await createEnrollement(submissionData);
      const merchant = response.merchantData;
      toast({
        title: "Succès",
        description: "L'inscription a été enregistrée avec succès.",
        variant: "default"
      });
      router.push("/dashboard/merchants");
    } catch (error: any) {
      console.error('Erreur:', error);

      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.";
      const errorType = error.response?.data?.error_type;

      let title = "Erreur";
      let description = errorMessage;

      if (errorType === 'email_exists') {
        title = "Email déjà utilisé";
      } else if (errorType === 'phone_exists') {
        title = "Numéro de téléphone déjà utilisé";
      }else if ( errorType === 'rccm_exists'){
        title = "RCCM déjà utilisé"
      }

      toast({
        title: title,
        description: description,
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
                <span className="ml-2">{addresses.find(addr => addr.id === merchantData.address_id)?.name || '-'}</span>
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
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-cyan-600 dark:text-cyan-400">Activité</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {activityData && (
                <>
                  <div>
                    <span className="text-gray-500">Secteur d'activité:</span>
                    <span className="ml-2">{activityData.secteur_activite}</span>
                  </div>
                  {activityData.sous_secteur_activite && (
                    <div>
                      <span className="text-gray-500">Sous-secteur d'activité:</span>
                      <span className="ml-2">{activityData.sous_secteur_activite}</span>
                    </div>
                  )}
                  {activityData.type_activite && (
                    <div>
                      <span className="text-gray-500">Type d'activité:</span>
                      <span className="ml-2">{activityData.type_activite}</span>
                    </div>
                  )}
                  {activityData.type_commerce && (
                    <div>
                      <span className="text-gray-500">Type de commerce:</span>
                      <span className="ml-2">{activityData.type_commerce}</span>
                    </div>
                  )}
                  {activityData.activite_principale && (
                    <div>
                      <span className="text-gray-500">Activité principale:</span>
                      <span className="ml-2">{activityData.activite_principale}</span>
                    </div>
                  )}
                  {activityData.activite_secondaire && (
                    <div>
                      <span className="text-gray-500">Activité secondaire:</span>
                      <span className="ml-2">{activityData.activite_secondaire}</span>
                    </div>
                  )}
                  {activityData.produits && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Produits:</span>
                      <span className="ml-2">{activityData.produits.split(';').join(', ')}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-cyan-600 dark:text-cyan-400">Tarification</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Type d'adhésion:</span>
                <span className="ml-2">{selectedTarification?.type_adhesion_display || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Prix:</span>
                <span className="ml-2 font-semibold text-cyan-600">{selectedTarification ? `${selectedTarification.montant.toLocaleString()} GNF` : '-'}</span>
              </div>
            </div>
          </div>
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
            disabled={isSubmitting || isLoadingTarification || !selectedTarification}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Soumission en cours...
              </>
            ) : isLoadingTarification ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Chargement des tarifications...
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