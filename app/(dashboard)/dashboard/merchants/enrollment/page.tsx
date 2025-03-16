"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import MerchantInfoForm from "./MerchantInfoForm";
import MerchantDocumentForm from "./MerchantDocumentForm";
import CompanyInfoForm from "./CompanyInfoForm";
import SubmitForm from "./SubmitForm";
import TypeAdhesionForm from "./TypeAdhesionForm";
import { MerchantEnrollment, DocumentItem, Entreprise, TypeAdhesionData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function EnrollmentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [merchantData, setMerchantData] = useState<MerchantEnrollment | null>(null);
  const [documentData, setDocumentData] = useState<DocumentItem[]>([]);
  const [companyData, setCompanyData] = useState<Partial<Entreprise> | null>(null);
  const [typeAdhesionData, setTypeAdhesionData] = useState<TypeAdhesionData | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const steps = [
    {
      title: "1",
      description: "Type Adhésion"
    },
    {
      title: "2",
      description: "Commerçant"
    },
    {
      title: "3",
      description: "Pièces requises"
    },
    {
      title: "4",
      description: "Informations Entreprise"
    },
    {
      title: "5",
      description: "Finalisation"
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, 4));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleDocumentSubmit = (data: DocumentItem[]) => {
    setDocumentData(data);
    handleNext();
  };

  const handleMerchantSubmit = (data: MerchantEnrollment) => {
    setMerchantData(data);
    handleNext();
  };

  const handleTypeAdhesionSubmit = (data: TypeAdhesionData) => {
    setTypeAdhesionData(data);
    handleNext();
  };

  const handleCompanySubmit = async (data: Partial<Entreprise>) => {
    setCompanyData(data);
    handleNext();
  };

  const handleFinalSubmit = async () => {
    try {
      const enrollmentData = {
        merchant: merchantData,
        documents: documentData,
        company: companyData,
        typeAdhesion: typeAdhesionData
      };

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
          <TypeAdhesionForm 
            onSubmit={handleTypeAdhesionSubmit} 
            initialData={typeAdhesionData} 
            onBack={handleBack} 
          />
        );
      case 1:
        return (
          <MerchantInfoForm 
            onSubmit={handleMerchantSubmit} 
            initialData={merchantData} 
            onBack={handleBack} 
          />
        );
      case 2:
        return (
          <MerchantDocumentForm 
            onSubmit={handleDocumentSubmit} 
            onBack={handleBack} 
            initialData={documentData} 
          />
        );
      case 3:
        return (
          <CompanyInfoForm 
            onSubmit={handleCompanySubmit} 
            onBack={handleBack} 
            initialData={companyData}
            typeAdhesionData={typeAdhesionData!}
          />
        );
      case 4:
        return (
          <SubmitForm
            merchantData={merchantData!}
            documentData={documentData}
            companyData={companyData!}
            typeAdhesionData={typeAdhesionData!}
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
            Complétez le formulaire d'inscription en cinq étapes
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
