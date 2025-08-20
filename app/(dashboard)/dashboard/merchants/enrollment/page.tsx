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
import ActivitySelectionForm from "./ActivitySelectionForm";

export default function EnrollmentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [merchantData, setMerchantData] = useState<MerchantEnrollment | null>(null);
  const [documentData, setDocumentData] = useState<DocumentItem[]>([]);
  const [companyData, setCompanyData] = useState<Partial<Entreprise> | null>(null);
  const [typeAdhesionData, setTypeAdhesionData] = useState<TypeAdhesionData | null>(null);
  const [activityData, setActivityData] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const getSteps = () => {
    const baseSteps = [
      {
        title: "1",
        description: "Type Adhésion"
      },
      {
        title: "2",
        description: "Adhérant"
      }
    ];
    
    // Only include company step if not non-formalized activity
    if (!typeAdhesionData?.typeActivite.nonFormalisee) {
      baseSteps.push({
        title: String(baseSteps.length + 1),
        description: "Entreprise"
      });
    }
    
    // Add remaining steps with dynamic numbering
    return [
      ...baseSteps,
      {
        title: String(baseSteps.length + 1),
        description: "Activité"
      },
      {
        title: String(baseSteps.length + 2),
        description: "Pièces requises"
      },
      {
        title: String(baseSteps.length + 3),
        description: "Finalisation"
      }
    ];
  };
  
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevStep) => {
      // Calculate next step, always incrementing by 1
      // No need to skip steps as the renderStep function handles the different flows
      let nextStep = prevStep + 1;
      return Math.min(nextStep, steps.length - 1);
    });
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      // Calculate previous step, always decrementing by 1
      // No need to skip steps as the renderStep function handles the different flows
      let prevStepIndex = prevStep - 1;
      return Math.max(prevStepIndex, 0);
    });
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

  const handleActivitySubmit = (data: any) => {
    setActivityData(data);
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
        typeAdhesion: typeAdhesionData,
        activity: activityData
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
    // For non-formalized activities, we need to adjust the step rendering
    const isNonFormalized = typeAdhesionData?.typeActivite.nonFormalisee;
    
    switch (activeStep) {
      case 0: // Type Adhesion - Same for both flows
        return (
          <TypeAdhesionForm 
            onSubmit={handleTypeAdhesionSubmit} 
            initialData={typeAdhesionData} 
            onBack={handleBack} 
          />
        );
      case 1: // Merchant Info - Same for both flows
        return (
          <MerchantInfoForm 
            onSubmit={handleMerchantSubmit} 
            initialData={merchantData} 
            onBack={handleBack} 
            typeAdhesionData={typeAdhesionData!}
          />
        );
      case 2:
        if (isNonFormalized) {
          // For non-formalized, step 2 is Activity
          return (
            <ActivitySelectionForm 
              onSubmit={handleActivitySubmit}
              onBack={handleBack} 
              initialData={activityData}
            />
          );
        } else {
          // For formalized, step 2 is Company
          return (
            <CompanyInfoForm 
              onSubmit={handleCompanySubmit} 
              onBack={handleBack} 
              initialData={companyData}
              typeAdhesionData={typeAdhesionData!}
            />
          );
        }
      case 3:
        if (isNonFormalized) {
          // For non-formalized, step 3 is Documents
          return (
            <MerchantDocumentForm 
              onSubmit={handleDocumentSubmit} 
              onBack={handleBack} 
              initialData={documentData} 
            />
          );
        } else {
          // For formalized, step 3 is Activity
          return (
            <ActivitySelectionForm 
              onSubmit={handleActivitySubmit}
              onBack={handleBack} 
              initialData={activityData}
            />
          );
        }
      case 4:
        if (isNonFormalized) {
          // For non-formalized, step 4 is Finalization
          return (
            <SubmitForm
              merchantData={merchantData!}
              documentData={documentData}
              // For non-formalized activities, company data might be null/empty
              companyData={companyData || {}}
              typeAdhesionData={typeAdhesionData!}
              activityData={activityData}
              onSubmit={handleFinalSubmit}
              onBack={handleBack}
            />
          );
        } else {
          // For formalized, step 4 is Documents
          return (
            <MerchantDocumentForm 
              onSubmit={handleDocumentSubmit} 
              onBack={handleBack} 
              initialData={documentData} 
            />
          );
        }
      case 5: // Only for formalized activities - Finalization
        if (!isNonFormalized) {
          return (
            <SubmitForm
              merchantData={merchantData!}
              documentData={documentData}
              companyData={companyData!}
              typeAdhesionData={typeAdhesionData!}
              activityData={activityData}
              onSubmit={handleFinalSubmit}
              onBack={handleBack}
            />
          );
        }
        return null;
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
