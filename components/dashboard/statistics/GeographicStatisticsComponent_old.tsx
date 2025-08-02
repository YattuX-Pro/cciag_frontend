'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Globe, MapPin, Users, FileText } from 'lucide-react';

interface GeographicStatistics {
  stats_by_nationality: {
    nationality: string;
    total: number;
  }[];
  stats_by_region: {
    region: string | null;
    total: number;
  }[];
  stats_by_prefecture: {
    prefecture: string | null;
    region: string | null;
    total: number;
  }[];
  stats_by_commune: any[];
  stats_by_request_type: {
    type_demande: string | null;
    total: number;
  }[];
}

interface GeographicStatisticsComponentProps {
  geographicStatistics: GeographicStatistics;
}

export function GeographicStatisticsComponent({ geographicStatistics }: GeographicStatisticsComponentProps) {
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
  const formatRegionName = (region: string | null) => {
    if (!region) return "Non spécifié";
    return region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
  };

  const formatPrefectureName = (prefecture: string | null) => {
    if (!prefecture) return "Non spécifié";
    return prefecture;
  };

  const formatNationalityName = (nationality: string | null) => {
    if (!nationality) return "Non spécifié";
    return nationality.charAt(0).toUpperCase() + nationality.slice(1).toLowerCase();
  };

  const formatRequestType = (type: string | null) => {
    if (!type) return "Non spécifié";
    
    const typeMap: Record<string, string> = {
      'NOUVELLE_ADHESION': 'Nouvelle adhésion',
      'RENOUVELLEMENT': 'Renouvellement',
      'DUPLICATA': 'Duplicata'
    };
    
    return typeMap[type] || type;
  };

  // Préparation des données pour les graphiques
  const prepareNationalityData = () => {
    return geographicStatistics.stats_by_nationality.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    }));
  };

  const prepareRegionData = () => {
    return geographicStatistics.stats_by_region.map(item => ({
      name: formatRegionName(item.region),
      total: item.total
    }));
  };

  const preparePrefectureData = () => {
    return geographicStatistics.stats_by_prefecture.map(item => ({
      name: formatPrefectureName(item.prefecture),
      region: formatRegionName(item.region),
      total: item.total
    }));
  };

  const prepareRequestTypeData = () => {
    return geographicStatistics.stats_by_request_type.map(item => ({
      name: formatRequestType(item.type_demande),
      total: item.total
    }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-4">Statistiques Géographiques</h2>
      
      {/* Carte de résumé des nationalités */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Nationalités
              </CardTitle>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-cyan-500/10 bg-cyan-500/20"
              )}>
                <Globe className={cn(
                  "h-5 w-5",
                  "dark:text-cyan-400 text-cyan-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className={cn(
                "text-2xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {geographicStatistics.stats_by_nationality.length}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Types de nationalités</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Régions
              </CardTitle>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-emerald-500/10 bg-emerald-500/20"
              )}>
                <MapPin className={cn(
                  "h-5 w-5",
                  "dark:text-emerald-400 text-emerald-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className={cn(
                "text-2xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {geographicStatistics.stats_by_region.filter(r => r.region).length}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Régions représentées</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <Card className={cn(
            "backdrop-blur-sm transition-colors duration-300",
            "dark:bg-gray-900/50 bg-white/50",
            "dark:border-cyan-900/20 border-cyan-200/20",
            "dark:hover:bg-gray-800/50 hover:bg-gray-50/50"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={cn(
                "text-sm font-medium",
                "dark:text-gray-300 text-gray-600"
              )}>
                Types de demandes
              </CardTitle>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                "dark:bg-purple-500/10 bg-purple-500/20"
              )}>
                <FileText className={cn(
                  "h-5 w-5",
                  "dark:text-purple-400 text-purple-600"
                )}/>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className={cn(
                "text-2xl font-bold",
                "dark:text-white text-gray-900"
              )}>
                {geographicStatistics.stats_by_request_type.filter(r => r.type_demande).length}
              </div>
              <div className={cn(
                "flex items-center text-xs mt-1",
                'dark:text-gray-400 text-gray-600'
              )}>
                <span>Types de demandes</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Graphiques détaillés */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Nationalités */}
        <motion.div variants={childVariants} className="col-span-1">
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
                Répartition par Nationalité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_nationality && geographicStatistics.stats_by_nationality.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={prepareNationalityData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="total"
                        nameKey="nationality"
                        label={({ nationality, total, percent }) => 
                          `${formatNationalityName(nationality)} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {prepareNationalityData().map((entry, index) => (
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
                        formatter={(value) => formatNationalityName(value)} 
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
                      {geographicStatistics.stats_by_nationality?.length === 0 
                        ? "Aucune donnée disponible" 
                        : "Chargement des données..."}
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

             {/* Types de demandes */}
             <motion.div variants={childVariants} className="col-span-1">
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
                Répartition par Type de Demande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_request_type && geographicStatistics.stats_by_request_type.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={prepareRequestTypeData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="total"
                        nameKey="name"
                        label={({ name, total, percent }) => 
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {prepareRequestTypeData().map((entry, index) => (
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
                        formatter={(value) => value} 
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
                      {geographicStatistics.stats_by_request_type?.length === 0 
                        ? "Aucune donnée disponible" 
                        : "Chargement des données..."}
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Régions */}
        <motion.div variants={childVariants} className="col-span-1">
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
                Répartition par Région
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_region && geographicStatistics.stats_by_region.length > 0 ? (
                    <BarChart 
                      data={prepareRegionData()}
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
                        dataKey="name" 
                        type="category"
                        className="dark:fill-gray-400 fill-gray-600"
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value} dossiers`, 'Total']}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        cursor={false}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="total" 
                        name="Nombre de dossiers" 
                        className="dark:fill-emerald-400 fill-emerald-600" 
                      />
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      {geographicStatistics.stats_by_region?.length === 0 
                        ? "Aucune donnée disponible" 
                        : "Chargement des données..."}
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Préfectures */}
        <motion.div variants={childVariants} className="col-span-1">
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
                Répartition par Préfecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_prefecture && geographicStatistics.stats_by_prefecture.length > 0 ? (
                    <BarChart 
                      data={preparePrefectureData()}
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
                        dataKey="name" 
                        type="category"
                        className="dark:fill-gray-400 fill-gray-600"
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value} dossiers`, 'Total']}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        cursor={false}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="total" 
                        name="Nombre de dossiers" 
                        className="dark:fill-blue-400 fill-blue-600" 
                      />
                    </BarChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                      {geographicStatistics.stats_by_prefecture?.length === 0 
                        ? "Aucune donnée disponible" 
                        : "Chargement des données..."}
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
