'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, CreditCard, FileText } from 'lucide-react';
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
      {/* <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-3xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}
      >
        Dashboard
      </motion.h1> */}
      <div className="">
        <StatusStatisticsComponent statusStatistics={statusStatistics} />
      </div>

      {/* Financial Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6"
      >
        <FinancialStatisticsComponent financialStatistics={financialStatistics} />
      </motion.div>
      
      {/* Enterprise Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-10"
      >
        <EnterpriseStatisticsComponent enterpriseStatistics={enterpriseStatistics} />
      </motion.div>

      {/* Geographic Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-10"
      >
        <GeographicStatisticsComponent geographicStatistics={geographicStatistics} />
      </motion.div>

    </div>
  );
}