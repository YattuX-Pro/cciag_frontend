import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FileText, Info, Loader, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { createMerchantPayment, getMerchantDocumentByMerchantId, updateMerchant } from "@/fetcher/api-fetcher";
import { ITypeAdhesion, MerchantEnrollment, Status, DocumentItem, MerchantPayment } from "@/types";
import IFramePdfDialog from "./IFramePdfDialog";
import { AuthActions } from "@/app/(auth)/utils";
import { getStatusColor, statusMap, TYPE_DEMANDE_MAP } from "@/types/const";
import { toast, useToast } from "@/hooks/use-toast";
import EditCompanyDialog from './EditCompanyDialog';
import AddMerchantDialog from "./AddMerchantDialog";
import AddMerchantDocumentDialog from "./AddMerchantDocumentDialog";
import EditTypeAdhesionDialog from './EditTypeAdhesionDialog';
import { useConfirmationDialog } from "@/hooks/use-confirmation-dialog";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

interface MerchantInfoDialogProps {
  merchantData: MerchantEnrollment;
  onSuccess?: () => void;
}

export function MerchantInfoDialog({ merchantData, onSuccess }: MerchantInfoDialogProps) {
  const { getUserIdFromToken } = AuthActions();
  const { showConfirmation } = useConfirmationDialog();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [isEditTypeAdhesionOpen, setIsEditTypeAdhesionOpen] = useState(false);

  const loadDocuments = async () => {
    try {
      const docs = await getMerchantDocumentByMerchantId(merchantData.id);
      console.log(docs)
      setDocuments(docs);
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (isOpen) {
        try {
          await loadDocuments();
        } catch (error) {
          console.error("Error loading documents:", error);
        }
      }
    };

    fetchDocuments();
  }, [isOpen]);

  const handleViewDocument = (base64Data: string) => {
    const formattedData = base64Data.startsWith('data:')
      ? base64Data
      : `data:application/pdf;base64,${base64Data}`;
    setSelectedDoc(formattedData);
    setIsPdfOpen(true);
  };

  const handleSubmitDocument = async () => {
    setIsLoading(true)
    try {
      const user_id = getUserIdFromToken();
      const updatedMerchant = { ...merchantData, submited_by_id: Number(user_id), status: Status.A_VALIDER };
      const result = await updateMerchant(updatedMerchant, merchantData.id)
      toast({
        title: "Succes",
        description: "Le dossier a été soumis avec succès",
        variant: "default",
        className: cn(
          "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800",
          "text-green-600 dark:text-green-400"
        ),
        duration: 3000,
      });
      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.log(error)
      toast({
        title: "Erreur",
        description: "Erreur de soumission de dossier",
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidate = async () => {
    try {
      setIsLoading(true);
      const updatedMerchant = { ...merchantData, status: Status.VALIDE };
      await updateMerchant(updatedMerchant, merchantData.id);
      toast({
        title: "Succès",
        description: "Le dossier a été validé avec succès",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation du dossier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminate = async () => {
    try {
      setIsLoading(true);
      const updatedMerchant = { ...merchantData, status: Status.IMPRIME };
      await updateMerchant(updatedMerchant, merchantData.id);
      toast({
        title: "Succès",
        description: "Le dossier a été terminé avec succès",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la terminaison du dossier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClick = () => {
    showConfirmation({
      title: "Confirmation de paiement",
      description: "Voulez-vous effectuer un paiement cash de :",
      actionType: "approve",
      onConfirm: handlePaymentConfirm,
      amount: merchantData.tarification_adhesion.montant,
    });
  };

  const handlePaymentConfirm = async () => {
    try {
      setIsLoading(true)
      const payment : MerchantPayment = {
        merchant_id: merchantData.id,
        amount: merchantData.tarification_adhesion.montant,
        payment_type: 'CASH'
      }
      await createMerchantPayment(payment)
      toast({
        title: "Succès",
        description: "Le paiement a été effectué avec succès",
      })
      onSuccess?.()
    } catch (error) {
      let err = error?.response?.data?.merchant
      toast({
        title: "Erreur",
        description: err,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "transition-colors duration-200",
            "dark:text-cyan-400 text-cyan-600",
            "dark:hover:text-cyan-300 hover:text-cyan-500",
            "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
          )}
        >
          <Info className="h-4 w-4 mr-2" />
          Info
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "sm:max-w-[700px] backdrop-blur-sm",
          "dark:bg-gray-900/95 bg-white/95",
          "dark:border-cyan-900/20 border-cyan-600/20",
          "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] overflow-y-auto",
          "custom-scrollbar"
        )}
      >
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl font-semibold dark:text-gray-100">
                Informations du marchand
              </DialogTitle>
              {(merchantData.status === 'A_PAYER' || merchantData.status === 'REFUSE' || merchantData.status === 'PAYE') && (
                <AddMerchantDialog
                  merchant={merchantData}
                  onSuccess={() => {
                    setIsOpen(false);
                    onSuccess?.();
                  }}
                  trigger={
                    <Button
                      variant="outline"
                      className="gap-2 dark:border-cyan-800 border-cyan-200 dark:hover:bg-cyan-900/50 hover:bg-cyan-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Modifier
                    </Button>
                  }
                />
              )}
            </div>
            <motion.div
              className="flex flex-col md:flex-row gap-6"
              variants={containerVariants}
            >
              {/* Colonne de gauche avec photo et infos principales */}
              <motion.div
                className="flex flex-col items-center md:items-start space-y-4 md:w-1/3"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={merchantData.profile_photo}
                      alt={`${merchantData.user?.first_name} ${merchantData.user?.last_name}`}
                    />
                  </Avatar>
                </div>
                <div className="text-center md:text-left space-y-1.5">
                  <h3 className="text-2xl font-semibold dark:text-gray-100 text-gray-900">
                    {merchantData.user?.first_name}{" "}
                    {merchantData.user?.last_name}
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-cyan-500/10 bg-cyan-600/10">
                      <span className="text-sm font-medium dark:text-cyan-400 text-cyan-600">
                        {merchantData.type_adherent}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-cyan-500/10 bg-cyan-600/10">
                      <span className="text-sm font-medium dark:text-cyan-400 text-cyan-600">
                        N° {merchantData.id_card}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 italic space-y-2 dark:bg-gray-800/50 bg-gray-50 p-6 rounded-lg border border-gray-200 dark:border-none">
                  <p className="text-sm">
                    <span className="dark:text-gray-400 text-gray-500">Genre: </span>
                    <span className="dark:text-gray-100 text-gray-900">{merchantData.genre}</span>
                  </p>
                  <p className="text-sm">
                    <span className="dark:text-gray-400 text-gray-500">Date de naissance: </span>
                    <span className="dark:text-gray-100 text-gray-900">
                      {new Date(merchantData.date_naissance).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="dark:text-gray-400 text-gray-500">Téléphone: </span>
                    <span className="dark:text-gray-100 text-gray-900">{merchantData.user?.phone_number}</span>
                  </p>
                  <p className="text-sm">
                    <span className="dark:text-gray-400 text-gray-500">Email: </span>
                    <span className="dark:text-gray-100 text-gray-900">{merchantData.user?.email}</span>
                  </p>
                  <p className="text-sm">
                    <span className="dark:text-gray-400 text-gray-500">Ville: </span>
                    <span className="dark:text-gray-100 text-gray-900">{merchantData.address?.name}</span>
                  </p>
                </div>
              </motion.div>

              {/* Séparateur vertical */}
              <div className="hidden md:block w-px dark:bg-cyan-900/20 bg-cyan-600/20" />

              {/* Colonne de droite avec les détails */}
              <motion.div
                className="md:w-2/3 space-y-6"
                variants={containerVariants}
              >
                {/* Secteurs d'activité */}
                <Card className="dark:bg-gray-800/50 bg-gray-50 border-none">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-gray-200">Secteurs d'activité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {merchantData.activities?.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full dark:bg-cyan-400 bg-cyan-600" />
                          <span className="text-sm dark:text-gray-300">{activity.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sous-secteurs d'activité */}
                <Card className="dark:bg-gray-800/50 bg-gray-50 border-none">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-gray-200">Sous-secteurs d'activité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {merchantData.sub_activities?.map((subActivity) => (
                        <div key={subActivity.id} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full dark:bg-cyan-400 bg-cyan-600" />
                          <span className="text-sm dark:text-gray-300">{subActivity.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Statut */}
                <Card className="dark:bg-gray-800/50 bg-gray-50 border-none">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-gray-200">Statut du dossier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getStatusColor(merchantData.status)
                      )}>
                        {statusMap[merchantData.status]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section Type d'adhésion */}
          <Card
            className={cn(
              "overflow-hidden",
              "dark:bg-gray-800/50 bg-gray-50",
              "dark:border-cyan-900/20 border-cyan-600/20"
            )}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center mt-6">
                <h3 className="text-lg font-semibold dark:text-gray-100 text-gray-900">
                  Type d'adhésion
                </h3>
                {(merchantData.status === 'A_PAYER' || merchantData.status === 'REFUSE' || merchantData.status === 'PAYE') && (
                  <Button
                    onClick={() => setIsEditTypeAdhesionOpen(true)}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "transition-colors duration-200",
                      "dark:text-cyan-400 text-cyan-600",
                      "dark:hover:text-cyan-300 hover:text-cyan-500",
                      "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                    )}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                    Motif de la demande
                  </h4>
                  <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                    {[
                      TYPE_DEMANDE_MAP[merchantData.type_adhesion?.type_demande && merchantData.type_adhesion?.type_demande ],
                    ].filter(Boolean).join(" • ")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                    Type d'adhésion
                  </h4>
                  <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                    {[
                      merchantData.type_adhesion?.standard && "Standard",
                      merchantData.type_adhesion?.premium && "Premium",
                      merchantData.type_adhesion?.formalisee ? "Formalisée" : "Non formalisée",
                    ].filter(Boolean).join(" • ")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                    Type d'entreprise
                  </h4>
                  <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                    {merchantData.tarification_adhesion?.type_entreprise_display || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                    Montant
                  </h4>
                  <p className="text-sm font-medium dark:text-cyan-600 dark:text-cyan-400">
                    {merchantData.tarification_adhesion ? `${merchantData.tarification_adhesion.montant.toLocaleString()} GNF` : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Entreprise */}
          {merchantData.entreprise && (
            <Card
              className={cn(
                "overflow-hidden",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-600/20"
              )}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold dark:text-gray-100 text-gray-900">
                    Informations de l'entreprise
                  </h3>
                  {(merchantData.status === 'A_PAYER' || merchantData.status === 'REFUSE' || merchantData.status === 'PAYE') && (
                    <Button
                      onClick={() => setIsEditCompanyOpen(true)}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "transition-colors duration-200",
                        "dark:text-cyan-400 text-cyan-600",
                        "dark:hover:text-cyan-300 hover:text-cyan-500",
                        "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                      )}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Nom de l'entreprise
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.nom}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Forme juridique
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.forme_juridique || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      RCCM
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.numero_rccm || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      NIF
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.numero_nif || "-"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Date de création
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {new Date(merchantData.entreprise?.date_creation).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Taille
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.taille_display}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Nombre d'employés
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.nombre_employe_display}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Chiffre d'affaires
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.chiffre_affaire_display}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Type d'activité
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.type_activite}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Type de commerce
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.type_commerce}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Produits
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.produits}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                      Ville
                    </h4>
                    <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                      {merchantData.entreprise?.address?.name}
                    </p>
                  </div>
                </div>

                {/* Documents de l'entreprise */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-4 dark:text-gray-100 text-gray-900">
                    Documents de l'entreprise
                  </h4>
                  <div className="space-y-3">
                    {/* Quitus Fiscal */}
                    {merchantData.entreprise.quitus_fiscal && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          "dark:bg-gray-900/50 bg-white/50",
                          "dark:border-cyan-900/20 border-cyan-600/20 border"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 dark:text-cyan-400 text-cyan-600" />
                          <span className="dark:text-gray-300 text-gray-600">
                            Quitus Fiscal
                          </span>
                        </div>
                        <Button
                          onClick={() => handleViewDocument(merchantData.entreprise.quitus_fiscal)}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm",
                            "dark:bg-cyan-500/10 bg-cyan-50",
                            "dark:text-cyan-400 text-cyan-600",
                            "hover:bg-cyan-100 dark:hover:bg-cyan-500/20",
                            "transition-colors duration-200"
                          )}
                        >
                          Voir
                        </Button>
                      </motion.div>
                    )}

                    {/* Certificat Fiscal */}
                    {merchantData.entreprise.certificat_fiscal && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          "dark:bg-gray-900/50 bg-white/50",
                          "dark:border-cyan-900/20 border-cyan-600/20 border"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 dark:text-cyan-400 text-cyan-600" />
                          <span className="dark:text-gray-300 text-gray-600">
                            Certificat Fiscal
                          </span>
                        </div>
                        <Button
                          onClick={() => handleViewDocument(merchantData.entreprise.certificat_fiscal)}
                          className={cn(
                            "px-3 py-1 rounded-full text-sm",
                            "dark:bg-cyan-500/10 bg-cyan-50",
                            "dark:text-cyan-400 text-cyan-600",
                            "hover:bg-cyan-100 dark:hover:bg-cyan-500/20",
                            "transition-colors duration-200"
                          )}
                        >
                          Voir
                        </Button>
                      </motion.div>
                    )}

                    {/* Message si aucun document */}
                    {!merchantData.entreprise.quitus_fiscal && !merchantData.entreprise.certificat_fiscal && (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        Aucun document d'entreprise disponible
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section Documents */}
          <Card
            className={cn(
              "overflow-hidden",
              "dark:bg-gray-800/50 bg-gray-50",
              "dark:border-cyan-900/20 border-cyan-600/20"
            )}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold dark:text-gray-100">
                  Documents
                </CardTitle>
                {(merchantData.status === 'A_PAYER' || merchantData.status === 'REFUSE' || merchantData.status === 'PAYE') && (
                  <AddMerchantDocumentDialog
                    merchantId={merchantData.id}
                    merchantStatus={merchantData.status}
                    onSuccess={() => {
                      loadDocuments();
                      onSuccess?.();
                    }}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      "dark:bg-gray-900/50 bg-white/50",
                      "dark:border-cyan-900/20 border-cyan-600/20 border"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 dark:text-cyan-400 text-cyan-600" />
                      <span className="dark:text-gray-300 text-gray-600">
                        {doc.name}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleViewDocument(doc.document)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        "dark:bg-cyan-500/10 bg-cyan-50",
                        "dark:text-cyan-400 text-cyan-600",
                        "hover:bg-cyan-100 dark:hover:bg-cyan-500/20",
                        "transition-colors duration-200"
                      )}
                    >
                      Voir
                    </Button>
                  </motion.div>
                ))}

                {documents.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    Aucun document disponible
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div>
           {/* Section Historique de refus */}
           {merchantData.refusal_list && merchantData.refusal_list.length > 0 && (
            <Card
              className={cn(
                "overflow-hidden",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-600/20"
              )}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold dark:text-gray-100">
                  Historique de refus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {merchantData.refusal_list.map((refusal, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "p-4 rounded-lg",
                        "dark:bg-gray-900/50 bg-white/50",
                        "dark:border-cyan-900/20 border-cyan-600/20 border"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                            Motif du refus
                          </h4>
                          <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                            {refusal.reason}
                          </p>
                        </div>
                        {refusal.created_at && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                              Date du refus
                            </h4>
                            <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                              {new Date(refusal.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {refusal.refused_by && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                              Refusé par
                            </h4>
                            <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                              {refusal.refused_by.first_name} {refusal.refused_by.last_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {isPdfOpen && (
          <IFramePdfDialog
            isOpen={isPdfOpen}
            onClose={() => setIsPdfOpen(false)}
            base64Data={selectedDoc}
          />
        )}
        {isEditCompanyOpen && merchantData.entreprise && (
          <EditCompanyDialog
            isOpen={isEditCompanyOpen}
            onClose={() => setIsEditCompanyOpen(false)}
            entreprise={merchantData.entreprise}
            onSuccess={() => {
              onSuccess?.();
              setIsEditCompanyOpen(false);
            }}
          />
        )}
        {isEditTypeAdhesionOpen && (
          <EditTypeAdhesionDialog
            isOpen={isEditTypeAdhesionOpen}
            onClose={() => setIsEditTypeAdhesionOpen(false)}
            typeAdhesion={merchantData.type_adhesion}
            typeAdhesionId={merchantData.type_adhesion.id.toString()}
            merchantData={merchantData}
            onSuccess={onSuccess}
          />
        )}
      <DialogFooter className="mt-6 flex justify-center">
        <div className="flex gap-4 justify-center w-full">
          {merchantData.status === Status.A_PAYER && ( 
            isLoading ? (
              <span className="flex items-center">
                <Loader className="animate-spin mr-2" />
                Traitement...
              </span>
            ) : (
            <Button
              type="button"
              onClick={handlePaymentClick}
              disabled={true}
              className={cn(
                "dark:bg-cyan-500/10 bg-cyan-50",
                "dark:text-cyan-400 text-cyan-600",
                "hover:bg-cyan-100 dark:hover:bg-cyan-500/20",
                "transition-colors duration-200"
              )}
            >
              Paiement en attente...
            </Button>)
          )}
          {merchantData.status === Status.PAYE || merchantData.status === Status.REFUSE
            ? (isLoading ? (
              <span className="flex items-center">
                <Loader className="animate-spin mr-2" />
                Traitement...
              </span>

            ) : <Button
              type="button"
              onClick={handleSubmitDocument}
              className={cn(
                "dark:bg-green-500 bg-green-600",
                "dark:hover:bg-green-600 hover:bg-green-700",
                "text-white"
              )}
            >
              Soummettre le dossier
            </Button>)
            : null}
          {merchantData.status === Status.A_VALIDER && (
            <Button
              type="button"
              onClick={handleValidate}
              disabled={isLoading}
              className={cn(
                "dark:bg-cyan-500 bg-cyan-600",
                "dark:hover:bg-cyan-600 hover:bg-cyan-700",
                "text-white"
              )}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader className="animate-spin mr-2" />
                  Validation...
                </span>
              ) : (
                "Valider"
              )}
            </Button>
          )}
        </div>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
         
