'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LabelList } from 'recharts';
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
      
      {/* Type d'Activité - occupant une ligne complète */}
      <div className="grid gap-6 grid-cols-1 mb-6">
        {/* Type d'Activité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className={cn(
            "backdrop-blur-sm",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20"
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className={cn(
                  "text-lg font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Type d'Activité
                </CardTitle>
                <CardDescription className="text-xs mt-1">Répartition par secteur d'activité</CardDescription>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-emerald-500/10 bg-emerald-500/20"
              )}>
                <Briefcase className={cn(
                  "h-5 w-5",
                  "dark:text-emerald-400 text-emerald-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_activity_type ? (
                    <PieChart>
                      <Pie
                        data={enterpriseStatistics.stats_by_activity_type}
                        dataKey="total"
                        nameKey="type_activite"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={5}
                      >
                        {enterpriseStatistics.stats_by_activity_type.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[index % ACTIVITY_COLORS.length]} />
                        ))}
                        <LabelList 
                          dataKey="type_activite" 
                          position="outside"
                          fill="hsl(var(--foreground))"
                          stroke="none"
                          fontSize={12}
                          formatter={(value: string) => value}
                        />
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value} entreprises`, '']}
                        cursor={false}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          color: "hsl(var(--foreground))"
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
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
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
        {/* Taille d'Entreprise */}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className={cn(
                  "text-sm font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Taille d'Entreprise
                </CardTitle>
                <CardDescription className="text-xs mt-1">Répartition par taille</CardDescription>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <Building2 className={cn(
                  "h-5 w-5",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {enterpriseStatistics.stats_by_company_size ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={enterpriseStatistics.stats_by_company_size}
                      margin={{ top: 20, right: 20, bottom: 10, left: 20 }}
                    >
                      <CartesianGrid vertical={false} stroke="#0e7490" strokeOpacity={0.15} strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="taille" 
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <Tooltip
                        cursor={false}
                        formatter={(value: any) => [`${value} entreprises`, '']}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="#3b82f6"
                        barSize={80}
                        radius={[4, 4, 0, 0]}
                      >
                        {enterpriseStatistics.stats_by_company_size.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SIZE_COLORS[index % SIZE_COLORS.length]} />
                        ))}
                        <LabelList
                          position="top"
                          offset={12}
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                    Chargement des données...
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Répartition des entreprises par taille
              </div>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Type de Commerce */}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className={cn(
                  "text-sm font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Type de Commerce
                </CardTitle>
                <CardDescription className="text-xs mt-1">Répartition par type</CardDescription>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <BarChart3 className={cn(
                  "h-5 w-5",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                {enterpriseStatistics.stats_by_commerce_type ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={enterpriseStatistics.stats_by_commerce_type}
                      margin={{ top: 20, right: 20, bottom: 10, left: 20 }}
                    >
                      <CartesianGrid vertical={false} stroke="#0e7490" strokeOpacity={0.15} strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="type_commerce" 
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <Tooltip
                        cursor={false}
                        formatter={(value: any) => [`${value} entreprises`, '']}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="#10b981"
                        barSize={80}
                        radius={[4, 4, 0, 0]}
                      >
                        {enterpriseStatistics.stats_by_commerce_type.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COMMERCE_COLORS[index % COMMERCE_COLORS.length]} />
                        ))}
                        <LabelList
                          position="top"
                          offset={12}
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                    Chargement des données...
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="text-muted-foreground leading-none">
                Répartition des entreprises par type de commerce
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid gap-6 grid-cols-1">
        {/* Chiffre d'Affaires */}
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className={cn(
                  "text-lg font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Chiffre d'Affaires
                </CardTitle>
                <CardDescription className="text-xs mt-1">Tranches en millions GNF</CardDescription>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-purple-500/10 bg-purple-500/20"
              )}>
                <DollarSign className={cn(
                  "h-5 w-5",
                  "dark:text-purple-400 text-purple-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_turnover ? (
                    <BarChart
                      layout="vertical"
                      data={[...enterpriseStatistics.stats_by_turnover].sort((a, b) => {
                        const order = ['0-100', '100-250', '250-500', '500-2.5', '+2.5'];
                        return order.indexOf(a.chiffre_affaire) - order.indexOf(b.chiffre_affaire);
                      })}
                      margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                    >
                      <CartesianGrid horizontal strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="chiffre_affaire" 
                        type="category" 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatTurnover}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--foreground))",
                        }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value} entreprises`, '']}
                        labelFormatter={formatTurnover}
                        cursor={false}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[0, 4, 4, 0]}
                        barSize={30}
                      >
                        {enterpriseStatistics.stats_by_turnover.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TURNOVER_COLORS[index % TURNOVER_COLORS.length]} />
                        ))}
                        <LabelList 
                          dataKey="total" 
                          position="right" 
                          formatter={(value: number) => `${value}`}
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      Chargement des données...
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-xs pt-0">
              <div className="text-muted-foreground leading-tight">
                Répartition des entreprises par tranches de chiffre d'affaires
              </div>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Nombre d'Employés */}
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className={cn(
                  "text-lg font-medium",
                  "dark:text-gray-300 text-gray-600"
                )}>
                  Nombre d'Employés
                </CardTitle>
                <CardDescription className="text-xs mt-1">Par tranches d'effectifs</CardDescription>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-amber-500/10 bg-amber-500/20"
              )}>
                <Users className={cn(
                  "h-5 w-5",
                  "dark:text-amber-400 text-amber-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] text-foreground">
                <ResponsiveContainer width="100%" height="100%">
                  {enterpriseStatistics.stats_by_employee_count ? (
                    <BarChart
                      layout="vertical"
                      data={[...enterpriseStatistics.stats_by_employee_count].sort((a, b) => {
                        const order = ['0-5', '5-10', '10-20', '20-50', '50-100', '+100'];
                        return order.indexOf(a.nombre_employe) - order.indexOf(b.nombre_employe);
                      })}
                      margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                    >
                      <CartesianGrid horizontal strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="nombre_employe" 
                        type="category" 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatEmployeeCount}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--foreground))",
                        }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value} entreprises`, '']}
                        labelFormatter={formatEmployeeCount}
                        cursor={false}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[0, 4, 4, 0]}
                        barSize={30}
                      >
                        {enterpriseStatistics.stats_by_employee_count.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length]} />
                        ))}
                        <LabelList 
                          dataKey="total" 
                          position="right" 
                          formatter={(value: number) => `${value}`}
                          fill="hsl(var(--foreground))"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      Chargement des données...
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-xs pt-0">
              <div className="text-muted-foreground leading-tight">
                Répartition des entreprises par nombre d'employés
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
