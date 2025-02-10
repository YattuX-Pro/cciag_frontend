'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentStatus } from "./components/PaymentStatus";
import { AccountInfo } from "./components/AccountInfo";
import { CardRenewal } from "./components/CardRenewal";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function EspaceClient() {
  return (
    <motion.div 
      className="flex-1 space-y-4 p-4 md:p-8 pt-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between space-y-2"
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold tracking-tight">Espace Client</h2>
      </motion.div>

      <Tabs defaultValue="payment" className="space-y-4">
        <div className="w-full overflow-auto">
          <TabsList className="bg-muted/20 dark:bg-muted/50 w-full justify-start md:justify-center">
            <motion.div 
              className="flex min-w-max"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TabsTrigger value="payment" className="flex-1">État du Dossier</TabsTrigger>
              <TabsTrigger value="account" className="flex-1">Mon Compte</TabsTrigger>
              <TabsTrigger value="renewal" className="flex-1">Renouvellement Carte</TabsTrigger>
            </motion.div>
          </TabsList>
        </div>

        <TabsContent value="payment">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <PaymentStatus />
          </motion.div>
        </TabsContent>

        <TabsContent value="account">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="dark:bg-muted/50">
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountInfo />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="renewal">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="dark:bg-muted/50">
              <CardHeader>
                <CardTitle>Demande de Renouvellement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardRenewal />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}