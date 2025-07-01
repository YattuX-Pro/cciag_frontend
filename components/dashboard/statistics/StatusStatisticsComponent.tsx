'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatusStatistics } from '@/types/statistics';
import { CheckCircle, Clock, XCircle, Users, FileText, FileCheck, FileX } from 'lucide-react';

interface StatusStatisticsComponentProps {
  statusStatistics: StatusStatistics;
}

export function StatusStatisticsComponent({ statusStatistics }: StatusStatisticsComponentProps) {
  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Animation des cartes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12
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

  // Formatter le nom complet des créateurs
  const formatCreatorName = (creator: any) => {
    return `${creator.created_by__first_name} ${creator.created_by__last_name}`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">Statistiques des Statuts</h2>
      
      {/* Résumé des statuts */}
      {/* Toutes les cartes sur une même ligne */}
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {/* Carte Total */}
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50",
            "h-[140px]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Total
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <FileText className={cn(
                  "h-4 w-4",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className={cn(
                "text-xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {statusStatistics.status_counts?.total || 0}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-0",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Total dossiers</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte Formalisée */}
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50",
            "h-[140px]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Formalisés
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <FileCheck className={cn(
                  "h-4 w-4",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className={cn(
                "text-xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {statusStatistics.status_counts?.formalisee || 0}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-0",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Dossiers formalisés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Carte Non Formalisée */}
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50",
            "h-[140px]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Non Formalisés
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <FileX className={cn(
                  "h-4 w-4",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className={cn(
                "text-xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {statusStatistics.status_counts?.non_formalisee || 0}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-0",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Non formalisés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      
        {/* 
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-green-900/40 bg-green-50",
            "dark:border-green-700/30 border-green-300/50",
            "dark:hover:bg-green-800/40 hover:bg-green-100/70",
            "h-[140px]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-green-200 text-green-700"
              )}>
                Validés
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "dark:bg-green-500/20 bg-green-200"
              )}>
                <CheckCircle className={cn(
                  "h-4 w-4",
                  "dark:text-green-300 text-green-700"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className={cn(
                "text-xl font-bold",
                "dark:text-green-100 text-green-800"
              )}>
                {statusStatistics.status_counts?.valide || 0}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-0",
                'dark:text-green-300 text-green-600'
              )}>
                <span>Dossiers validés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50",
            "h-[140px]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                En Attente
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <Clock className={cn(
                  "h-4 w-4",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className={cn(
                "text-xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {statusStatistics.status_counts?.a_valider || 0}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-0",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>À valider</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50",
            "h-[140px]"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Refusés
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <XCircle className={cn(
                  "h-4 w-4",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className={cn(
                "text-xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {statusStatistics.status_counts?.refuse || 0}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-0",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Dossiers refusés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>*/}
      </div>

      {/* Distribution par statut */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={childVariants} className="col-span-2">
          <Card className="backdrop-blur-sm transition-colors duration-300 dark:bg-gray-900/50 bg-white/50 dark:border-cyan-900/20 border-cyan-200/20 dark:hover:bg-gray-800/50 hover:bg-gray-50/50">
            <CardHeader className="pb-2">
              <CardTitle>Distribution par Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {statusStatistics.stats_by_status ? (
                    <PieChart>
                      <Pie
                        data={statusStatistics.stats_by_status}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="status"
                        label={({ status, percent }) => `${formatStatusName(status)}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusStatistics.stats_by_status.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} dossiers`, '']}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend 
                        formatter={(value) => formatStatusName(value)} 
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          fontSize: '12px',
                          color: 'var(--foreground)'
                        }}
                      />
                    </PieChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      Chargement des données...
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution par créateur
        <motion.div variants={childVariants} className="col-span-1">
          <Card className="backdrop-blur-sm transition-colors duration-300 dark:bg-gray-900/50 bg-white/50 dark:border-cyan-900/20 border-cyan-200/20 dark:hover:bg-gray-800/50 hover:bg-gray-50/50">
            <CardHeader className="pb-2">
              <CardTitle>Distribution par Créateur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {statusStatistics.stats_by_creator && statusStatistics.stats_by_creator.length > 0 ? (
                    <BarChart
                      data={statusStatistics.stats_by_creator}
                      layout="vertical"
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        className="dark:stroke-gray-700 stroke-gray-200"
                      />
                      <XAxis 
                        type="number" 
                        className="dark:fill-gray-400 fill-gray-600" 
                      />
                      <YAxis 
                        type="category" 
                        dataKey={(item) => formatCreatorName(item)} 
                        className="dark:fill-gray-400 fill-gray-600"
                        width={120} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value} dossiers`, 'Total']}
                        contentStyle={{ 
                          backgroundColor: 'var(--background)',
                          borderColor: 'var(--border)',
                          borderRadius: '6px'
                        }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                      <Bar 
                        dataKey="total" 
                        name="Nombre de dossiers" 
                        className="dark:fill-purple-400 fill-purple-600" 
                      />
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      {statusStatistics.stats_by_creator?.length === 0 
                        ? "Aucune donnée disponible" 
                        : "Chargement des données..."}
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </motion.div>
  );
}
