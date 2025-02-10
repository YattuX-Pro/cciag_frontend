import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function PaymentStatus() {
  // À connecter avec votre API
  const dossierStatus = {
    isCreated: true,
    currentStep: "en_attente_soumission", // en_attente_soumission, soumis, validé, refusé, imprimé
    paymentStatus: "pending" // pending, completed
  };

  const paymentMethods = [
    {
      id: "pc",
      title: "Pay Card",
      description: "Paiement sécurisé par Pay Card",
      bgClass: "bg-black/90 dark:bg-black hover:bg-black/80 dark:hover:bg-black/90",
      borderClass: "border-zinc-800 dark:border-zinc-700",
      iconClass: "text-white dark:text-white",
      textClass: "text-white dark:text-white",
      descriptionClass: "text-zinc-400 dark:text-zinc-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      )
    },
    {
      id: "om",
      title: "Orange Money",
      description: "Paiement par Orange Money",
      bgClass: "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30",
      borderClass: "border-orange-200 dark:border-orange-800",
      iconClass: "text-orange-600 dark:text-orange-400",
      textClass: "text-foreground dark:text-foreground",
      descriptionClass: "text-muted-foreground",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M2 17h20M2 12h20M2 7h20" />
        </svg>
      )
    },
    {
      id: "carte",
      title: "Carte Bancaire",
      description: "Paiement par carte bancaire",
      bgClass: "bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
      borderClass: "border-emerald-200 dark:border-emerald-800",

      iconClass: "text-emerald-600 dark:text-emerald-400",
      textClass: "text-foreground dark:text-foreground",
      descriptionClass: "text-muted-foreground",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
          <path d="M2 8h20" />
        </svg>
      )
    }
  ];

  const getStepProgress = () => {
    const steps = {
      "en_attente_soumission": 20,
      "soumis": 40,
      "validé": 80,
      "imprimé": 100,
      "refusé": 0
    };
    return steps[dossierStatus.currentStep] || 0;
  };

  const getStepLabel = () => {
    const labels = {
      "en_attente_soumission": "En attente de soumission",
      "soumis": "Dossier soumis",
      "validé": "Dossier validé",
      "refusé": "Dossier refusé",
      "imprimé": "Carte imprimée"
    };
    return labels[dossierStatus.currentStep] || "";
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {dossierStatus.isCreated ? (
        <>
          <motion.div variants={itemVariants}>
            {/* Statut du dossier */}
            <Card className="dark:bg-muted/50">
              <CardHeader>
                <CardTitle>État du dossier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getStepLabel()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Progression du traitement
                      </p>
                    </div>
                    <div className="font-medium">{getStepProgress()}%</div>
                  </div>
                  <Progress 
                    value={getStepProgress()} 
                    className={cn(
                      "h-2",
                      dossierStatus.currentStep === "refusé" && "bg-red-200 dark:bg-red-900"
                    )}
                  />
                </div>

                {dossierStatus.currentStep === "refusé" && (
                  <div className="mt-4 rounded-lg bg-red-100 dark:bg-red-900/50 p-4">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      Votre dossier a été refusé. Veuillez contacter le service client pour plus d'informations.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Section Paiement */}
          {dossierStatus.paymentStatus === "pending" && (
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-muted/50">
                <CardHeader>
                  <CardTitle>Paiement des frais de carte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Montant à payer */}
                    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Frais de carte
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Frais obligatoires pour l'impression de votre carte
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold">50 000 GNF</span>
                      </div>
                    </div>

                    {/* Méthodes de paiement */}
                    <div className="space-y-4">
                      <Label>Choisissez votre méthode de paiement</Label>
                      <RadioGroup defaultValue="card" className="grid gap-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id}>
                            <RadioGroupItem
                              value={method.id}
                              id={method.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={method.id}
                              className={cn(
                                "flex items-center justify-between rounded-lg border-2 p-4",
                                "transition-colors duration-200",
                                method.bgClass,
                                method.borderClass,
                                "peer-data-[state=checked]:ring-2",
                                method.id === "card" 
                                  ? "peer-data-[state=checked]:ring-white" 
                                  : "peer-data-[state=checked]:ring-primary/50",
                                "[&:has([data-state=checked])]:border-primary"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn("rounded-full p-2", method.iconClass)}>
                                  {method.icon}
                                </div>
                                <div className="space-y-1">
                                  <p className={cn("text-sm font-medium leading-none", method.textClass)}>
                                    {method.title}
                                  </p>
                                  <p className={cn("text-sm", method.descriptionClass)}>
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button className="w-full md:w-auto">
                      Procéder au paiement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {dossierStatus.paymentStatus === "completed" && (
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-muted/50">
                <CardHeader>
                  <CardTitle>Paiement effectué</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-green-100 dark:bg-green-900/50 p-4">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Le paiement a été effectué avec succès. Votre dossier est en cours de traitement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="dark:bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Votre dossier n'a pas encore été créé.
                </p>
                <Button>
                  Créer mon dossier
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
} 