'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative w-60 h-60 md:w-80 md:h-80"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-20 blur-2xl animate-pulse" />
            <div className="relative w-full h-full flex items-center justify-center">
              <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                Page non trouvée
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-[600px] md:text-lg">
                Désolé, la page que vous recherchez n&apos;existe pas ou vous n&apos;avez pas les permissions nécessaires pour y accéder.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                size="lg"
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <motion.span
                  initial={{ x: -5 }}
                  whileHover={{ x: -12 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mr-2"
                >
                  ←
                </motion.span>
                Retour à l&apos;accueil
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 