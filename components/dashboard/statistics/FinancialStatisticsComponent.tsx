'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FinancialStatistics } from '@/types/statistics';
import { CreditCard, Wallet, TrendingUp, DollarSign } from 'lucide-react';

interface FinancialStatisticsComponentProps {
  financialStatistics: FinancialStatistics;
}

export default function FinancialStatisticsComponent({ financialStatistics }: FinancialStatisticsComponentProps) {
  // Format amounts helper function
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M`;
    }
    return amount.toLocaleString();
  };

  // Animation variants
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* En-tête avec gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Statistiques Financières</h2>
              <p className="text-green-100">Analyse des revenus et répartitions</p>
            </div>
          </div>
        </div>
      </div>
      {/* Cartes de statistiques financières */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Carte Montant Total */}
        <motion.div variants={cardVariants}>
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Montant Total
                </CardTitle>
                <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                  {formatAmount(financialStatistics.total_amount_collected || 0)} GNF
                </div>
              </div>
              <div className="rounded-full bg-indigo-500/20 p-2.5">
                <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                <span>Total des revenus collectés</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte Part FASO */}
        <motion.div variants={cardVariants}>
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Part FASO
                </CardTitle>
                <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                  {formatAmount(financialStatistics.faso_amount || 0)} GNF
                </div>
              </div>
              <div className="rounded-full bg-emerald-500/20 p-2.5">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                <span>{financialStatistics.faso_percentage || 0}% du montant total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carte Part CCIAG */}
        <motion.div variants={cardVariants}>
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Part CCIAG
                </CardTitle>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {formatAmount(financialStatistics.cciag_amount || 0)} GNF
                </div>
              </div>
              <div className="rounded-full bg-blue-500/20 p-2.5">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <span>{financialStatistics.cciag_percentage || 0}% du montant total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphiques côte à côte */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Graphique Paiements par Mois */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    Paiements par Mois
                  </CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Évolution temporelle des revenus
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {financialStatistics.payments_by_month && financialStatistics.payments_by_month.length > 0 ? (
                    <LineChart
                      data={financialStatistics.payments_by_month}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid 
                        vertical={false} 
                        className="dark:stroke-slate-700 stroke-slate-200" 
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="period"
                        className="dark:fill-slate-400 fill-slate-600"
                        fontSize={12}
                      />
                      <YAxis
                        className="dark:fill-slate-400 fill-slate-600"
                        tickFormatter={(value) => formatAmount(value)}
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                          border: 'none'
                        }}
                        itemStyle={{
                          color: 'var(--foreground)',
                          fontWeight: '500'
                        }}
                        labelStyle={{
                          color: 'var(--foreground)',
                          fontWeight: '600'
                        }}
                        formatter={(value: any) => [`${value.toLocaleString()} GNF`, 'Montant Total']}
                        cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total_amount"
                        name="Montant Total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                      />
                    </LineChart>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                        <TrendingUp className="h-8 w-8" />
                      </div>
                      <p className="text-lg font-medium">Aucune donnée disponible</p>
                      <p className="text-sm">Les paiements apparaîtront ici une fois les données chargées</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graphique Répartition des Paiements */}
        <motion.div variants={cardVariants}>
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-2">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    Répartition des Paiements
                  </CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Distribution FASO vs CCIAG
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {financialStatistics.payments_by_month && financialStatistics.payments_by_month.length > 0 ? (
                    <BarChart 
                      data={financialStatistics.payments_by_month}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        className="dark:stroke-slate-700 stroke-slate-200" 
                      />
                      <XAxis 
                        dataKey="period" 
                        className="dark:fill-slate-400 fill-slate-600"
                        fontSize={12}
                      />
                      <YAxis 
                        className="dark:fill-slate-400 fill-slate-600"
                        tickFormatter={(value) => formatAmount(value)}
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
                          border: 'none'
                        }}
                        itemStyle={{
                          color: 'var(--foreground)',
                          fontWeight: '500'
                        }}
                        labelStyle={{
                          color: 'var(--foreground)',
                          fontWeight: '600'
                        }}
                        formatter={(value: any) => [`${value.toLocaleString()} GNF`, '']}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Bar 
                        dataKey="faso_amount" 
                        name="FASO" 
                        stackId="a" 
                        fill="#10b981"
                        radius={[0, 0, 4, 4]}
                      />
                      <Bar 
                        dataKey="cciag_amount" 
                        name="CCIAG" 
                        stackId="a" 
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
                        <CreditCard className="h-8 w-8" />
                      </div>
                      <p className="text-lg font-medium">Aucune donnée disponible</p>
                      <p className="text-sm">La répartition apparaîtra ici une fois les données chargées</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
