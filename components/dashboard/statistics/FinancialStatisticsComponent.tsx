'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, LineChart } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FinancialStatistics } from '@/types/statistics';
import { CreditCard, Wallet, TrendingUp } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">Statistiques des Montants</h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Total Amount Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
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
                Montant Total
              </CardTitle>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <Wallet className={cn(
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
                {formatAmount(financialStatistics.total_amount_collected || 0)} GNF
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Montant total perçu</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FASO Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
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
                Part FASO
              </CardTitle>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-emerald-500/10 bg-emerald-500/20"
              )}>
                <TrendingUp className={cn(
                  "h-5 w-5",
                  "dark:text-emerald-400 text-emerald-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {formatAmount(financialStatistics.faso_amount || 0)} GNF
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>{financialStatistics.faso_percentage || 0}% du montant total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CCIAG Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
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
                Part CCIAG
              </CardTitle>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-blue-500/10 bg-blue-500/20"
              )}>
                <CreditCard className={cn(
                  "h-5 w-5",
                  "dark:text-blue-400 text-blue-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {formatAmount(financialStatistics.cciag_amount || 0)} GNF
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>{financialStatistics.cciag_percentage || 0}% du montant total</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 grid-cols-1">
        {/* Monthly Payments Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
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
                Paiements par Mois
              </CardTitle>
              <CardDescription>Évolution des paiements</CardDescription>
            </CardHeader>
            <CardContent>
              {financialStatistics.payments_by_month ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={financialStatistics.payments_by_month}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid vertical={false} className="dark:stroke-gray-700 stroke-gray-200" />
                      <XAxis
                        dataKey="period"
                        className="dark:fill-gray-400 fill-gray-600"
                      />
                      <YAxis
                        className="dark:fill-gray-400 fill-gray-600"
                        tickFormatter={(value) => formatAmount(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        itemStyle={{
                          color: "hsl(var(--foreground))"
                        }}
                        formatter={(value: any) => [`${value.toLocaleString()} GNF`, 'Montant']}
                        cursor={false}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total_amount"
                        name="Montant Total"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center text-gray-400 dark:text-gray-500">
                  Chargement des données...
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Analyse des tendances <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Montants totaux des paiements mensuels
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Payment Details By Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
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
                Répartition des Paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {financialStatistics.payments_by_month ? (
                    <BarChart data={financialStatistics.payments_by_month}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      className="dark:stroke-gray-700 stroke-gray-200" 
                    />
                    <XAxis 
                      dataKey="period" 
                      className="dark:fill-gray-400 fill-gray-600"
                    />
                    <YAxis 
                      className="dark:fill-gray-400 fill-gray-600"
                      tickFormatter={(value) => formatAmount(value)}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      itemStyle={{
                        color: "hsl(var(--foreground))"
                      }}
                      formatter={(value: any) => [`${value.toLocaleString()} GNF`, '']}
                      cursor={false}
                    />
                    <Legend />
                    <Bar 
                      dataKey="faso_amount" 
                      name="FASO" 
                      stackId="a" 
                      className="dark:fill-emerald-400 fill-emerald-600" 
                    />
                    <Bar 
                      dataKey="cciag_amount" 
                      name="CCIAG" 
                      stackId="a" 
                      className="dark:fill-blue-400 fill-blue-600" 
                    />
                  </BarChart>
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
      </div>
    </div>
  );
}
