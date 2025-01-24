'use client';

import useSWR from "swr";
import { useState } from 'react';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { Button } from '@/components/ui/button';
import { Menu, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { fetcher } from '@/fetcher/fetcher';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  // const { data, error, isLoading } = useSWR('/api/user/123', fetcher)

  return (
    <div className="min-h-screen background-pattern">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div 
          className={cn(
            'fixed md:relative z-30 h-screen transition-all duration-300 ease-in-out',
            sidebarOpen ? 'w-64' : 'w-0 md:w-16'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-background/95 backdrop-blur-sm border-r border-border h-full">
              <div className={cn(
                "flex items-center flex-shrink-0 px-4 mb-8",
                !sidebarOpen && 'md:justify-center'
              )}>
                {sidebarOpen && (
                  <h1 className="text-xl font-bold text-primary">CCIAG</h1>
                )}
              </div>
              <div className="flex-grow">
                <DashboardNav collapsed={!sidebarOpen} />
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top bar */}
          <div className="bg-background/95 backdrop-blur-sm border-b border-border h-16 flex items-center justify-between px-4 sticky top-0 z-20">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}