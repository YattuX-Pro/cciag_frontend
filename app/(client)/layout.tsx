"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { AuthActions } from "../(auth)/utils";
import { urls } from "@/types/const";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const {logout, getToken} = AuthActions();
  const [isLogout, setIsLogout] = useState(false);

  const handleLogout = () => {
    setIsLogout(true);
    logout()
    .then((res) =>{
      router.push(urls.home)
    })
    .catch((err)=> {
      toast({
        title: 'Error logout',
        description: 'Erreur logout inconu.'
      })
      console.log(err)
      setIsLogout(false)
    })
  };


  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden",
        "dark:bg-gray-950 bg-gray-50"
      )}
    >
      {/* Animated gradient background */}
      <div
        className={cn(
          "fixed inset-0 animate-gradient-slow",
          "dark:from-cyan-950 dark:via-cyan-900 dark:to-cyan-950",
          "from-cyan-50 via-cyan-100 to-cyan-100",
          "bg-gradient-to-br"
        )}
      />

      {/* Decorative background elements */}
      <div className="fixed inset-0">
        <div
          className={cn(
            "absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob",
            "dark:bg-cyan-800/30 bg-cyan-400/30"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000",
            "dark:bg-blue-800/30 bg-blue-400/30"
          )}
        />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top bar */}
          <div
            className={cn(
              "backdrop-blur-sm border-b h-16 flex items-center justify-between px-4 sticky top-0 z-20",
              "dark:bg-gray-900/50 bg-white/50",
              "dark:border-cyan-900/20 border-cyan-200/20"
            )}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
                "dark:from-cyan-400 dark:to-cyan-200",
                "from-cyan-600 to-cyan-400",
              )}
            >
              FASOSMART-CCIAG
            </motion.h1>

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "transition-colors duration-200",
                  "dark:text-cyan-400 text-cyan-600",
                  "dark:hover:text-cyan-300 hover:text-cyan-500",
                  "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10",
                )}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            
            {
                isLogout ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Loader2 className="h-5 w-5" />
                        </motion.div>
                    </Button>
                ) : (
                    <Button

                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "transition-colors duration-200",
                  "dark:text-red-400 text-red-600",
                  "dark:hover:text-red-300 hover:text-red-500",
                  "dark:hover:bg-red-500/10 hover:bg-red-500/10"
                )}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  Logout <LogOut className="h-5 w-5" />
                </motion.div>
              </Button>
                )
            }
            </div>
          </div>

          <main
            className={cn(
              "flex-1 relative overflow-y-auto focus:outline-none",
              "dark:text-gray-100 text-gray-900"
            )}
          >
            <div className="py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
