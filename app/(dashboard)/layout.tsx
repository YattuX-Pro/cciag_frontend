'use client';

import useSWR from "swr";
import { useEffect, useState } from 'react';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Menu, Sun, Moon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      "dark:bg-gray-950 bg-gray-50"
    )}>
      {/* Animated gradient background */}
      <div className={cn(
        "fixed inset-0 animate-gradient-slow",
        "dark:from-cyan-950 dark:via-cyan-900 dark:to-cyan-950",
        "from-cyan-50 via-cyan-100 to-cyan-100",
        "bg-gradient-to-br"
      )} />
      
      {/* Decorative background elements */}
      <div className="fixed inset-0">
        <div className={cn(
          "absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob",
          "dark:bg-cyan-800/30 bg-cyan-400/30"
        )} />
        <div className={cn(
          "absolute bottom-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000",
          "dark:bg-blue-800/30 bg-blue-400/30"
        )} />
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          <motion.div 
            className={cn(
              'h-screen flex-shrink-0',
              sidebarOpen ? 'w-64' : 'w-16'
            )}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              width: sidebarOpen ? '16rem' : '4rem'
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.3,
              ease: 'easeInOut',
              width: { duration: 0.3 }
            }}
          >
            <div className="flex flex-col h-full">
              <div className={cn(
                "flex flex-col flex-grow pt-5 overflow-y-auto border-r h-full",
                "dark:bg-gray-900/50 bg-white/50",
                "dark:border-cyan-900/20 border-cyan-200/20",
                "backdrop-blur-sm transition-all duration-300"
              )}>
                <div className={cn(
                  "flex items-center flex-shrink-0 px-4 mb-8",
                  !sidebarOpen && 'md:justify-center'
                )}>
                  {sidebarOpen && (
                    <div className="flex items-center justify-between w-full">
                      <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                          "dark:from-cyan-400 dark:to-cyan-200",
                          "from-cyan-600 to-cyan-400"
                        )}
                      >
                        CCIAG
                      </motion.h1>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={cn(
                          "transition-colors duration-200",
                          "dark:text-cyan-400 text-cyan-600",
                          "dark:hover:text-cyan-300 hover:text-cyan-500",
                          "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                        )}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.div>
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <DashboardNav collapsed={!sidebarOpen} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top bar */}
          <div className={cn(
            "backdrop-blur-sm border-b h-16 flex items-center px-4 sticky top-0 z-20",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20"
          )}>
            <div className="flex-1 flex items-center">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={cn(
                    "transition-colors duration-200",
                    "dark:text-cyan-400 text-cyan-600",
                    "dark:hover:text-cyan-300 hover:text-cyan-500",
                    "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
                  )}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "transition-colors duration-200",
                "dark:text-cyan-400 text-cyan-600",
                "dark:hover:text-cyan-300 hover:text-cyan-500",
                "dark:hover:bg-cyan-500/10 hover:bg-cyan-500/10"
              )}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.div>
            </Button>
          </div>

          <main className={cn(
            "flex-1 relative overflow-y-auto focus:outline-none",
            "dark:text-gray-100 text-gray-900"
          )}>
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