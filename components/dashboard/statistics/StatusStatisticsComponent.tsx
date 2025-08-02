'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatusStatistics } from '@/types/statistics';
import { CheckCircle, Clock, XCircle, FileText, FileCheck, FileX, TrendingUp } from 'lucide-react';

interface StatusStatisticsComponentProps {
  statusStatistics: StatusStatistics;
}

export function StatusStatisticsComponent({ statusStatistics }: StatusStatisticsComponentProps) {
  // Couleurs modernes pour les graphiques avec dégradés
  const STATUS_COLORS = {
    'A_PAYER': '#f59e0b', // Amber
    'A_VALIDER': '#3b82f6', // Blue
    'VALIDE': '#10b981', // Emerald
    'REFUSE': '#ef4444' // Red
  };
  
  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  // Animation des cartes avec effet de rebond
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 15,
        duration: 0.6
      }
    }
  };

  // Formatter les données pour une meilleure lisibilité
  const formatStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      'A_PAYER': 'À payer',
      'A_VALIDER': 'À valider',
      'VALIDE': 'Validé',
      'REFUSE': 'Refusé'
    };
    
    return statusMap[status] || status;
  };

  // Calculer les pourcentages
  const total = statusStatistics.status_counts?.total || 0;
  const getPercentage = (value: number) => total > 0 ? ((value / total) * 100).toFixed(1) : '0';

  // Données pour le graphique avec couleurs personnalisées
  const pieData = statusStatistics.stats_by_status?.map((item, index) => ({
    ...item,
    name: formatStatusName(item.status),
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || CHART_COLORS[index % CHART_COLORS.length]
  })) || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      
      {/* Cartes de statistiques avec couleurs distinctes */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Carte Total */}
        <motion.div variants={cardVariants}>
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Total Dossiers
                </CardTitle>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {statusStatistics.status_counts?.total || 0}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    {statusStatistics.stats_by_status && statusStatistics.stats_by_status.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={28}
                          dataKey="total"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <span>Formalisés: {statusStatistics.status_counts?.formalisee || 0} • Non formalisés: {statusStatistics.status_counts?.non_formalisee || 0}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte Formalisée */}
        <motion.div variants={cardVariants}>
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Formalisés
                </CardTitle>
                <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                  {statusStatistics.status_counts?.formalisee || 0}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    {statusStatistics.stats_by_status && statusStatistics.stats_by_status.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={pieData.filter(item => item.status !== 'NON_FORMALISEE')}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={28}
                          dataKey="total"
                        >
                          {pieData.filter(item => item.status !== 'NON_FORMALISEE').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    ) : (
                      <div className="w-full h-full rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">
                        <FileCheck className="h-4 w-4 text-emerald-500" />
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                <span>{getPercentage(statusStatistics.status_counts?.formalisee || 0)}% du total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Carte Non Formalisée */}
        <motion.div variants={cardVariants}>
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  Non Formalisés
                </CardTitle>
                <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">
                  {statusStatistics.status_counts?.non_formalisee || 0}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    {statusStatistics.stats_by_status && statusStatistics.stats_by_status.length > 0 ? (
                      <PieChart>
                        <Pie
                          data={pieData.filter(item => item.status !== 'FORMALISEE')}
                          cx="50%"
                          cy="50%"
                          innerRadius={18}
                          outerRadius={28}
                          dataKey="total"
                        >
                          {pieData.filter(item => item.status !== 'FORMALISEE').map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    ) : (
                      <div className="w-full h-full rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                        <FileX className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <span>{getPercentage(statusStatistics.status_counts?.non_formalisee || 0)}% du total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>



    </motion.div>
  );
}
