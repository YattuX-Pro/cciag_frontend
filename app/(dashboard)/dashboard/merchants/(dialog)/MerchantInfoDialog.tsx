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
import { FileText, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getMerchantDocumentByMerchantId } from "@/fetcher/api-fetcher";
import { DocumentItem } from "@/types";
import IFramePdfDialog from "./IFramePdfDialog";

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
  merchantData: any;
}

export function MerchantInfoDialog({ merchantData }: MerchantInfoDialogProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  const loadDocuments = async () => {
    try {
      const docs = await getMerchantDocumentByMerchantId(merchantData.id);
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

  // const handleViewDocument = (base64Data: string) => {
  //   const base64Clean = base64Data.split(",")[1] || base64Data;

  //   const fileType =
  //     base64Data.split(";")[0]?.split(":")[1] || "application/pdf";

  //   const dataUrl = `data:${fileType};base64,${base64Clean}`;

  //   window.open(dataUrl, "_blank");
  // };

  const handleViewDocument = (base64Data: string) => {
    setSelectedDoc(base64Data);
    setIsPdfOpen(true);
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
            Informations du commerçant
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card
            className={cn(
              "overflow-hidden",
              "dark:bg-gray-800/50 bg-gray-50",
              "dark:border-cyan-900/20 border-cyan-600/20"
            )}
          >
            <CardContent className="p-6">
              <motion.div
                className="flex flex-col md:flex-row gap-6"
                variants={containerVariants}
              >
                {/* Colonne de gauche avec photo et infos principales */}
                <motion.div
                  className="flex flex-col items-center md:items-start space-y-4 md:w-1/3"
                  variants={itemVariants}
                >
                  <Avatar className="h-24 w-24 border-2 dark:border-cyan-900/20 border-cyan-600/20">
                    <AvatarImage
                      src={merchantData.profile_photo}
                      alt="Photo de profil"
                    />
                  </Avatar>
                  <div className="text-center md:text-left space-y-1.5">
                    <h3 className="text-2xl font-semibold dark:text-gray-100 text-gray-900">
                      {merchantData.user?.first_name}{" "}
                      {merchantData.user?.last_name}
                    </h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-cyan-500/10 bg-cyan-600/10">
                      <span className="text-sm font-medium dark:text-cyan-400 text-cyan-600">
                        N° {merchantData.id_card}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Séparateur vertical */}
                <div className="hidden md:block w-px dark:bg-cyan-900/20 bg-cyan-600/20" />

                {/* Colonne de droite avec les détails */}
                <motion.div
                  className="flex-1 space-y-6"
                  variants={containerVariants}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                          Email
                        </h4>
                        <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                          {merchantData.user?.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                          Téléphone
                        </h4>
                        <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                          {merchantData.user?.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                          Adresse
                        </h4>
                        <p className="text-sm font-medium dark:text-gray-100 text-gray-900">
                          {merchantData.address?.name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500">
                          Signature
                        </h4>
                        <div className="inline-flex items-center gap-2 dark:bg-gray-800/50 bg-gray-100 rounded-lg p-2">
                          <img
                            src={merchantData.signature_photo}
                            alt="Signature"
                            className="h-8 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Section Documents */}
          <Card
            className={cn(
              "overflow-hidden",
              "dark:bg-gray-800/50 bg-gray-50",
              "dark:border-cyan-900/20 border-cyan-600/20"
            )}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 text-gray-900">
                Documents
              </h3>
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

        <IFramePdfDialog
          isOpen={isPdfOpen}
          onClose={() => {
            setIsPdfOpen(false);
            setSelectedDoc(null);
          }}
          base64Data={selectedDoc}
        />

        <DialogFooter className="mt-6 flex justify-center">
          <DialogTrigger asChild>
            <div className="flex gap-4">
              <Button
                className={cn(
                  "dark:bg-cyan-500 bg-cyan-600",
                  "dark:hover:bg-cyan-600 hover:bg-cyan-700",
                  "text-white"
                )}
              >
                Fermer
              </Button>
              {documents.length > 0 ? (
                <Button
                  className={cn(
                    "dark:bg-green-500 bg-green-600",
                    "dark:hover:bg-green-600 hover:bg-green-700",
                    "text-white"
                  )}
                >
                  Soummettre le dossier
                </Button>
              ) : null}
            </div>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
