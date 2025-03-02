'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, CreditCard, FileText } from 'lucide-react';
import { Bar, Cell, Line, Pie } from 'recharts';
import {
  LineChart,
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { DetailedStatistics, EnrollementStatistics } from '@/types';
import { getMerchantDetailedStatistics, getMerchantStatistics } from '@/fetcher/api-fetcher';
import { toast } from '@/hooks/use-toast';

const monthlyPayments = [
  { month: 'Jan', amount: 12500 },
  { month: 'Fev', amount: 15000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Avr', amount: 16000 },
  { month: 'Mai', amount: 21000 },
  { month: 'Juin', amount: 19500 },
  { month: 'Juil', amount: 13500 },
  { month: 'Aout', amount: 12500 },
  { month: 'Sept', amount: 32500 },
  { month: 'Oct', amount: 42500 },
  { month: 'Nov', amount: 42500 },
  { month: 'Dec', amount: 41500 },
];

const monthlyCards = [
  { month: 'Jan', cards: 145 },
  { month: 'Fev', cards: 168 },
  { month: 'Mar', cards: 156 },
  { month: 'Avr', cards: 192 },
  { month: 'Mai', cards: 178 },
  { month: 'Juin', cards: 55 },
  { month: 'Juil', cards: 305 },
  { month: 'Aout', cards: 205 },
  { month: 'Sept', cards: 35 },
  { month: 'Oct', cards: 75 },
  { month: 'Nov', cards: 105 },
  { month: 'Dec', cards: 205 },
];

const merchantsByAddress = [
  { address: 'Conakry', merchants: 156 },
  { address: 'Kindia', merchants: 123 },
  { address: 'Mamou', merchants: 98 },
  { address: 'Labé', merchants: 87 },
  { address: 'Pita', merchants: 65 },
];



export default function DashboardPage() {
  const [statistics, setStatistics] = useState<EnrollementStatistics>({} as EnrollementStatistics)
  const [detailedStatistics, setDetailedStatistics] = useState<DetailedStatistics>({} as DetailedStatistics)
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const getAppStatistics = async () => {
    setIsLoading(true);
    try {
      const stats = await getMerchantStatistics()
      setStatistics(stats)
      const detailedStats = await getMerchantDetailedStatistics()
      setDetailedStatistics(detailedStats)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les commerçants",
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-3xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}
      >
        Dashboard
      </motion.h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2 * 0.1 }}
          >
            <Card className={cn(
              "backdrop-blur-sm transition-colors duration-300",
              "dark:bg-gray-900/50 bg-white/50",
              "dark:border-cyan-900/20 border-cyan-200/20",
              "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Total Utilisateurs
                </CardTitle>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "dark:bg-cyan-500/10 bg-cyan-500/20"
                )}>
                  <Users className={cn(
                    "h-5 w-5",
                    "dark:text-cyan-400 text-cyan-600"
                  )}/>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  "dark:text-white text-gray-900"
                )}>
                  {statistics.users_statistics?.total_users}
                </div>
                <div className={cn(
                  "flex items-center text-xs mt-1",'dark:text-emerald-400 text-emerald-600'
                )}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 * 0.1 + 0.2 }}
                    className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      'dark:bg-emerald-400 bg-emerald-600'
                    )}
                  />
                  <span>{statistics.users_statistics?.last_month_users} depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2 * 0.1 }}
          >
            <Card className={cn(
              "backdrop-blur-sm transition-colors duration-300",
              "dark:bg-gray-900/50 bg-white/50",
              "dark:border-cyan-900/20 border-cyan-200/20",
              "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Commerçants actifs
                </CardTitle>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "dark:bg-cyan-500/10 bg-cyan-500/20"
                )}>
                  <Store className={cn(
                    "h-5 w-5",
                    "dark:text-cyan-400 text-cyan-600"
                  )}/>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  "dark:text-white text-gray-900"
                )}>
                  {statistics.active_merchants_statistics?.total_active_merchants}
                </div>
                <div className={cn(
                  "flex items-center text-xs mt-1",'dark:text-emerald-400 text-emerald-600'
                )}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 * 0.1 + 0.2 }}
                    className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      'dark:bg-emerald-400 bg-emerald-600'
                    )}
                  />
                  <span>{statistics.active_merchants_statistics?.last_month_active_merchants} depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2 * 0.1 }}
          >
            <Card className={cn(
              "backdrop-blur-sm transition-colors duration-300",
              "dark:bg-gray-900/50 bg-white/50",
              "dark:border-cyan-900/20 border-cyan-200/20",
              "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Cartes Générées
                </CardTitle>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "dark:bg-cyan-500/10 bg-cyan-500/20"
                )}>
                  <FileText className={cn(
                    "h-5 w-5",
                    "dark:text-cyan-400 text-cyan-600"
                  )}/>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  "dark:text-white text-gray-900"
                )}>
                  {statistics.printed_merchants_statistics?.total_printed_merchants}
                </div>
                <div className={cn(
                  "flex items-center text-xs mt-1",'dark:text-emerald-400 text-emerald-600'
                )}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 * 0.1 + 0.2 }}
                    className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      'dark:bg-emerald-400 bg-emerald-600'
                    )}
                  />
                  <span>{statistics.printed_merchants_statistics?.last_month_printed_merchants} depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 2 * 0.1 }}
          >
            <Card className={cn(
              "backdrop-blur-sm transition-colors duration-300",
              "dark:bg-gray-900/50 bg-white/50",
              "dark:border-cyan-900/20 border-cyan-200/20",
              "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={cn(
                  "text-sm font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                 En Cours De Traitement
                </CardTitle>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "dark:bg-cyan-500/10 bg-cyan-500/20"
                )}>
                  <CreditCard className={cn(
                    "h-5 w-5",
                    "dark:text-cyan-400 text-cyan-600"
                  )}/>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  "dark:text-white text-gray-900"
                )}>
                  {statistics.to_validate_merchants_statistics?.total_to_validate_merchants}
                </div>
                <div className={cn(
                  "flex items-center text-xs mt-1",'dark:text-emerald-400 text-emerald-600'
                )}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1 * 0.1 + 0.2 }}
                    className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      'dark:bg-emerald-400 bg-emerald-600'
                    )}
                  />
                  <span>{statistics.to_validate_merchants_statistics?.total_to_validate_merchants} depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Monthly Cards Generated Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-3 "
        >
          <Card className={cn(
            "backdrop-blur-sm",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "text-lg font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Nombre de Commerçants par Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailedStatistics.merchants_by_address}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="dark:stroke-gray-700 stroke-gray-200" 
                    />
                    <XAxis 
                      dataKey="address_name" 
                      className="dark:fill-gray-400 fill-gray-600"
                    />
                    <YAxis 
                      className="dark:fill-gray-400 fill-gray-600"
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: '8px',
                      }}
                      itemStyle={{
                        color: "var(--foreground)"
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="total_merchants" 
                      name="Commerçants"
                      className="dark:fill-cyan-400/80 fill-cyan-600/80"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Monthly Payments Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-3"
        >
          <Card className={cn(
            "backdrop-blur-sm",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                "text-lg font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Paiements Mensuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailedStatistics.payments_by_month}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="dark:stroke-gray-700 stroke-gray-200" 
                    />
                    <XAxis 
                      dataKey="month" 
                      className="dark:fill-gray-400 fill-gray-600"
                    />
                    <YAxis 
                      className="dark:fill-gray-400 fill-gray-600"
                      allowDecimals={false}
                      tickFormatter={(value) => `${value }FG`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: '8px',
                      }}
                      itemStyle={{
                        color: "var(--foreground)"
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total_amount" 
                      className="dark:stroke-cyan-400 stroke-cyan-600"
                      strokeWidth={2}
                      name="Montant (GNF)"
                      dot={{ className: "dark:fill-cyan-400 fill-cyan-600" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}