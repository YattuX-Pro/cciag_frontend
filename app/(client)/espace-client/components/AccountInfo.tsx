import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface Address {
  id: number;
  name: string;
}

interface MerchantData {
  card_number: string;
  user?: UserData;
  profile_photo: string;
  signature_photo: string;
  address: Address;
}

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

export function AccountInfo() {
  // À connecter avec votre API
  const merchantData: MerchantData = {
    card_number: "123456789",
    user: {
      first_name: "Cellou",
      last_name: "bah",
      email: "test@email.com",
      phone_number: "+123456789"
    },
    profile_photo: "/path-to-photo.jpg",
    signature_photo: "/path-to-signature.jpg",
    address: {
      id: 1,
      name: "123 Rue Kipé"
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="dark:bg-muted/50 overflow-hidden">
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
              <Avatar className="h-24 w-24 border-2 border-muted">
                <AvatarImage src='/images/avatar.png' alt="Photo de profil" />
              </Avatar>
              <div className="text-center md:text-left space-y-1.5">
                <h3 className="text-2xl font-semibold">

                  {merchantData.user?.first_name} {merchantData.user?.last_name}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20">
                  <span className="text-sm font-medium text-primary">
                    N° {merchantData.card_number}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Séparateur vertical */}
            <div className="hidden md:block w-px bg-border" />

            {/* Colonne de droite avec les détails */}
            <motion.div 
              className="flex-1 space-y-6"
              variants={containerVariants}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p className="text-sm font-medium">{merchantData.user?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Téléphone</h4>
                    <p className="text-sm font-medium">{merchantData.user?.phone_number}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Adresse</h4>
                    <p className="text-sm font-medium">{merchantData.address.name}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Signature</h4>
                    <div className="inline-flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                      <img
                        src='/images/signature.png'
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
    </motion.div>
  );
} 