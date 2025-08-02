'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EnterpriseStatistics } from '@/types/statistics';
import { Building2, Users, Briefcase, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import React from 'react';

interface EnterpriseStatisticsComponentProps {
  enterpriseStatistics: EnterpriseStatistics;
}

export default function EnterpriseStatisticsComponent({ enterpriseStatistics }: EnterpriseStatisticsComponentProps) {
  // Modern color schemes for different chart types
  const ACTIVITY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
  const SIZE_COLORS = ['#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
  const COMMERCE_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
  const TURNOVER_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
  const EMPLOYEE_COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];
  
  // Formattage des nombres d'employés
  const formatEmployeeCount = (code: string) => {
    const employeeMap: Record<string, string> = {
      '0-5': '0 à 5 employés',
      '5-10': '5 à 10 employés',
      '10-20': '10 à 20 employés',
      '20-50': '20 à 50 employés',
      '50-100': '50 à 100 employés',
      '+100': 'Plus de 100 employés',
    };
    return employeeMap[code] || code;
  };
  
  // Formattage des chiffres d'affaires
  const formatTurnover = (code: string) => {
    const turnoverMap: Record<string, string> = {
      '0-100': '0 à 100 millions',
      '100-250': '100 à 250 millions',
      '250-500': '250 à 500 millions',
      '500-2.5': '500 millions à 2.5 milliards',
      '+2.5': 'Plus de 2.5 milliards',
    };
    return turnoverMap[code] || code;
  };

  // Calculate total enterprises
  const totalEnterprises = enterpriseStatistics.stats_by_activity_type?.reduce((sum, item) => sum + item.total, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Modern Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Statistiques d'Entreprise</h2>
            <p className="text-white/80 text-lg">Analyse détaillée des profils d'entreprises</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 grid-cols-1">
        {/* Total Enterprises Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/70" />
              </div>
              <CardTitle className="text-white text-lg font-semibold">Total Entreprises</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="text-3xl font-bold text-white mb-2">{totalEnterprises.toLocaleString()}</div>
              <p className="text-white/80 text-sm">Entreprises enregistrées</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Types Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <BarChart3 className="h-5 w-5 text-white/70" />
              </div>
              <CardTitle className="text-white text-lg font-semibold">Secteurs d'Activité</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="text-3xl font-bold text-white mb-2">{enterpriseStatistics.stats_by_activity_type?.length || 0}</div>
              <p className="text-white/80 text-sm">Types d'activités</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Commerce Types Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
          className="group"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <Users className="h-5 w-5 text-white/70" />
              </div>
              <CardTitle className="text-white text-lg font-semibold">Types de Commerce</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="text-3xl font-bold text-white mb-2">{enterpriseStatistics.stats_by_commerce_type?.length || 0}</div>
              <p className="text-white/80 text-sm">Catégories commerciales</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section - Side by Side */}
      <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
        {/* Activity Type Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Types d'Activité</CardTitle>
                  <CardDescription className="text-sm">Répartition par secteur d'activité</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_activity_type ? (
                    <PieChart>
                      <Pie
                        data={enterpriseStatistics.stats_by_activity_type}
                        dataKey="total"
                        nameKey="type_activite"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={3}
                      >
                        {enterpriseStatistics.stats_by_activity_type.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[index % ACTIVITY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} entreprises`,
                          props.payload?.type_activite || name
                        ]}
                        labelFormatter={(label: any) => ``}
                        cursor={false}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                        itemStyle={{
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      />
                    </PieChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Company Size Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Taille d'Entreprise</CardTitle>
                  <CardDescription className="text-sm">Répartition par nombre d'employés</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_company_size ? (
                    <BarChart
                      data={enterpriseStatistics.stats_by_company_size}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="taille" 
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} entreprises`,
                          formatEmployeeCount(props.payload?.taille || name)
                        ]}
                        labelFormatter={(label: any) => formatEmployeeCount(label)}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                        itemStyle={{
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[4, 4, 0, 0]}
                      >
                        {enterpriseStatistics.stats_by_company_size.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SIZE_COLORS[index % SIZE_COLORS.length]} />
                        ))}
                        <LabelList
                          dataKey="total"
                          position="top"
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Charts - Side by Side */}
      <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
        {/* Turnover Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-2">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Chiffre d'Affaires</CardTitle>
                  <CardDescription className="text-sm">Tranches en millions GNF</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_turnover ? (
                    <BarChart
                      layout="vertical"
                      data={[...enterpriseStatistics.stats_by_turnover].sort((a, b) => {
                        const order = ['0-100', '100-250', '250-500', '500-2.5', '+2.5'];
                        return order.indexOf(a.chiffre_affaire) - order.indexOf(b.chiffre_affaire);
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
                      <YAxis 
                        dataKey="chiffre_affaire" 
                        type="category" 
                        tickFormatter={formatTurnover}
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        width={120}
                      />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} entreprises`,
                          formatTurnover(props.payload?.chiffre_affaire || name)
                        ]}
                        labelFormatter={(label: any) => formatTurnover(label)}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                        itemStyle={{
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[0, 4, 4, 0]}
                      >
                        {enterpriseStatistics.stats_by_turnover.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TURNOVER_COLORS[index % TURNOVER_COLORS.length]} />
                        ))}
                        <LabelList 
                          dataKey="total" 
                          position="right" 
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employee Count Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-red-500 to-red-600 p-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Nombre d'Employés</CardTitle>
                  <CardDescription className="text-sm">Par tranches d'effectifs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_employee_count ? (
                    <BarChart
                      layout="vertical"
                      data={[...enterpriseStatistics.stats_by_employee_count].sort((a, b) => {
                        const order = ['0-5', '5-10', '10-20', '20-50', '50-100', '+100'];
                        return order.indexOf(a.nombre_employe) - order.indexOf(b.nombre_employe);
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
                      <YAxis 
                        dataKey="nombre_employe" 
                        type="category" 
                        tickFormatter={formatEmployeeCount}
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        width={120}
                      />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} entreprises`,
                          formatEmployeeCount(props.payload?.nombre_employe || name)
                        ]}
                        labelFormatter={(label: any) => formatEmployeeCount(label)}
                        cursor={{ fill: 'rgba(220, 38, 38, 0.1)' }}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                        itemStyle={{
                          color: "hsl(var(--foreground))",
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[0, 4, 4, 0]}
                      >
                        {enterpriseStatistics.stats_by_employee_count.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length]} />
                        ))}
                        <LabelList 
                          dataKey="total" 
                          position="right" 
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée disponible</p>
                      </div>
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
