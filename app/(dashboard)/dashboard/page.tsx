'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Store, CreditCard, FileText, Building2, Globe, DollarSign, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getMerchantDetailedStatistics, getMerchantStatistics, getFinancialStatistics, getEnterpriseStatistics, getStatusStatistics, getGeographicStatistics } from '@/fetcher/api-fetcher';
import { toast } from '@/hooks/use-toast';
import { DetailedStatistics, EnrollementStatistics, FinancialStatistics, EnterpriseStatistics, StatusStatistics } from '@/types/statistics';
import FinancialStatisticsComponent from '@/components/dashboard/statistics/FinancialStatisticsComponent';
import EnterpriseStatisticsComponent from '@/components/dashboard/statistics/EnterpriseStatisticsComponent';
import { StatusStatisticsComponent } from '@/components/dashboard/statistics/StatusStatisticsComponent';
import { GeographicStatisticsComponent } from '@/components/dashboard/statistics/GeographicStatisticsComponent';
import { AuthActions } from '@/app/(auth)/utils';
import { roles } from '@/types/const';

export default function DashboardPage() {
  const [statistics, setStatistics] = useState<EnrollementStatistics>({} as EnrollementStatistics)
  const [detailedStatistics, setDetailedStatistics] = useState<DetailedStatistics>({} as DetailedStatistics)
  const [financialStatistics, setFinancialStatistics] = useState<FinancialStatistics>({} as FinancialStatistics)
  const [enterpriseStatistics, setEnterpriseStatistics] = useState<EnterpriseStatistics>({
    stats_by_company_size: [],
    stats_by_activity_type: [],
    stats_by_commerce_type: [],
    stats_by_turnover: [],
    stats_by_employee_count: []
  } as EnterpriseStatistics)
  const [statusStatistics, setStatusStatistics] = useState<StatusStatistics>({
    stats_by_status: [],
    status_counts: { a_valider: 0, valide: 0, refuse: 0 },
    stats_by_creator: []
  } as StatusStatistics)
  const [geographicStatistics, setGeographicStatistics] = useState({
    stats_by_nationality: [],
    stats_by_region: [],
    stats_by_prefecture: [],
    stats_by_commune: [],
    stats_by_request_type: []
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {isAuthenticated, getToken} = AuthActions();
  const role = getToken('userRole');


  const getAppStatistics = async () => {
    setIsLoading(true);
    try {
      const stats = await getMerchantStatistics()
      setStatistics(stats)
      const detailedStats = await getMerchantDetailedStatistics()
      setDetailedStatistics(detailedStats)
      const financialStats = await getFinancialStatistics()
      setFinancialStatistics(financialStats)
      const enterpriseStats = await getEnterpriseStatistics()
      setEnterpriseStatistics(enterpriseStats)
      const statusStats = await getStatusStatistics()
      setStatusStatistics(statusStats)
      const geographicStats = await getGeographicStatistics()
      setGeographicStatistics(geographicStats)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
      console.log(error)
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(()=>{
    getAppStatistics()
  },[])
  
  return (
    <div>
      {/* Statistics Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          {/* Header content */}
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Tableau de Bord Statistiques
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Vue d'ensemble des performances et métriques clés
                </p>
              </div>
            </div>
            
            {/* Status Statistics Component */}
            <StatusStatisticsComponent statusStatistics={statusStatistics} />
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tabs for Detailed Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className=""
      >
        <Tabs defaultValue="financial" className="w-full">
          {/* Enhanced Tab Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Analyses Détaillées
              </h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full"></div>
            </div>
            
            <TabsList className="flex justify-center space-x-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-6 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 h-auto min-h-[70px]">
              <TabsTrigger 
                value="financial" 
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-emerald-500/25 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-[1.02]"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-data-[state=active]:bg-white/20 transition-colors duration-300">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-data-[state=active]:text-white" />
                </div>
                <span className="font-bold">Finance</span>
              </TabsTrigger>
              
              {role === roles.admin && (<TabsTrigger 
                value="enterprise" 
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-violet-500/25 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-[1.02]"
              >
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 group-data-[state=active]:bg-white/20 transition-colors duration-300">
                  <Building2 className="h-4 w-4 text-violet-600 dark:text-violet-400 group-data-[state=active]:text-white" />
                </div>
                <span className="font-bold">Entreprise</span>
              </TabsTrigger>)}
              
              <TabsTrigger 
                value="geographic" 
                className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-cyan-500/25 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-[1.02]"
              >
                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 group-data-[state=active]:bg-white/20 transition-colors duration-300">
                  <Globe className="h-4 w-4 text-cyan-600 dark:text-cyan-400 group-data-[state=active]:text-white" />
                </div>
                <span className="font-bold">Géographie</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="financial" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FinancialStatisticsComponent financialStatistics={financialStatistics} />
            </motion.div>
          </TabsContent>

          <TabsContent value="enterprise" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <EnterpriseStatisticsComponent enterpriseStatistics={enterpriseStatistics} />
            </motion.div>
          </TabsContent>

          <TabsContent value="geographic" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GeographicStatisticsComponent geographicStatistics={geographicStatistics} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

    </div>
  );
}