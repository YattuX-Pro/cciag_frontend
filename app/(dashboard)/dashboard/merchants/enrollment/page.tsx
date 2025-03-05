"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import MerchantInfoForm from "./MerchantInfoForm";
import MerchantDocumentForm from "./MerchantDocumentForm";
import CompanyInfoForm from "./CompanyInfoForm";
import SubmitForm from "./SubmitForm";
import { MerchantEnrollment, DocumentItem, Entreprise } from "@/types";
// import { createMerchantEnrollment } from "@/fetcher/api-fetcher";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function EnrollmentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [merchantData, setMerchantData] = useState<MerchantEnrollment | null>(null);
  const [documentData, setDocumentData] = useState<DocumentItem[]>([]);
  const [companyData, setCompanyData] = useState<Partial<Entreprise> | null>(null);
  const [hasCompany, setHasCompany] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const steps = [
    {
      title: "1",
      description: "Commerçant"
    },
    {
      title: "2",
      description: "Pièces requises"
    },
    {
      title: "3",
      description: "Informations Entreprise"
    },
    {
      title: "4",
      description: "Finalisation"
    }
  ];

  const handleNext = () => {
    if (activeStep === 1) { // Après l'étape Documents
      if (hasCompany) {
        setActiveStep(2); // Aller à l'étape Entreprise
      } else {
        setActiveStep(3); // Sauter à l'étape Soumission
      }
    } else {
      setActiveStep((prevStep) => Math.min(prevStep + 1, 3));
    }
  };

  const handleBack = () => {
    if (activeStep === 3 && !hasCompany) { // Si on est à l'étape Soumission et pas d'entreprise
      setActiveStep(1); // Retourner à l'étape Documents
    } else {
      setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    }
  };

  const handleDocumentSubmit = (data: DocumentItem[]) => {
    setDocumentData(data);
    if (hasCompany) {
      setActiveStep(2); // Aller à l'étape Entreprise
    } else {
      setActiveStep(3); // Sauter à l'étape Soumission
    }
  };

  const handleMerchantSubmit = (data: MerchantEnrollment & { hasCompany?: boolean }) => {
    setMerchantData(data);
    setHasCompany(!!data.hasCompany);
    handleNext();
  };

  const handleCompanySubmit = async (data: Partial<Entreprise>) => {
    console.log(data)
    setCompanyData(data);
    handleNext();
  };

  const handleFinalSubmit = async () => {
    try {
      const enrollmentData = {
        merchant: merchantData,
        documents: documentData,
        company: companyData
      };

      // await createMerchantEnrollment(enrollmentData);
      
      toast({
        title: "Succès",
        description: "L'inscription a été enregistrée avec succès.",
        variant: "default"
      });

      router.push("/dashboard/merchants");
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <MerchantInfoForm 
            onSubmit={handleMerchantSubmit} 
            initialData={merchantData} 
            onBack={handleBack} 
          />
        );
      case 1:
        return (
          <MerchantDocumentForm 
            onSubmit={handleDocumentSubmit} 
            onBack={handleBack} 
            initialData={documentData} 
          />
        );
      case 2:
        return hasCompany ? (
          <CompanyInfoForm 
            onSubmit={handleCompanySubmit} 
            onBack={handleBack} 
            initialData={companyData} 
          />
        ) : null;
      case 3:
        return (
          <SubmitForm
            merchantData={merchantData!}
            documentData={documentData}
            companyData={companyData!}
            onSubmit={handleFinalSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto space-y-4 p-8">
      <Card className="p-6 bg-cyan-50/50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-cyan-700 dark:text-cyan-300">
            Inscription de Commerçant
          </h2>
          <p className="text-cyan-600 dark:text-cyan-400">
            Complétez le formulaire d'inscription en quatre étapes
          </p>
        </div>
      </Card>

      <Card className="bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800 p-6 mb-6">
        <Stepper steps={steps} currentStep={activeStep} />
      </Card>
      
      <Card className="bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800 p-6 space-y-6">
        {renderStep()}
      </Card>
    </div>
  );
}
