'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Globe, MapPin, Users, FileText, TrendingUp, Map } from 'lucide-react';

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
  // Modern color schemes for different chart types
  const NATIONALITY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
  const REGION_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
  const PREFECTURE_COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
  const REQUEST_COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'];

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

  // Calculate totals
  const totalNationalities = geographicStatistics.stats_by_nationality.length;
  const totalRegions = geographicStatistics.stats_by_region.filter(r => r.region).length;
  const totalPrefectures = geographicStatistics.stats_by_prefecture.filter(p => p.prefecture).length;
  const totalRequestTypes = geographicStatistics.stats_by_request_type.filter(r => r.type_demande).length;

  // Préparation des données pour les graphiques
  const prepareNationalityData = () => {
    return geographicStatistics.stats_by_nationality.map((item) => ({
      name: formatNationalityName(item.nationality),
      total: item.total
    }));
  };

  const prepareRegionData = () => {
    return geographicStatistics.stats_by_region.map(item => ({
      name: formatRegionName(item.region),
      total: item.total
    }));
  };

  const preparePrefectureData = () => {
    return geographicStatistics.stats_by_prefecture
      .slice(0, 10) // Limit to top 10 for better readability
      .map(item => ({
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
    <div className="space-y-8">
      {/* Modern Gradient Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Statistiques Géographiques</h2>
            <p className="text-white/80 text-lg">Répartition territoriale et démographique</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 grid-cols-1">
        {/* Nationalities Card */}
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
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/70" />
              </div>
              <CardTitle className="text-white text-lg font-semibold">Nationalités</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="text-3xl font-bold text-white mb-2">{totalNationalities}</div>
              <p className="text-white/80 text-sm">Types de nationalités</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regions Card */}
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
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <Map className="h-5 w-5 text-white/70" />
              </div>
              <CardTitle className="text-white text-lg font-semibold">Régions</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="text-3xl font-bold text-white mb-2">{totalRegions}</div>
              <p className="text-white/80 text-sm">Régions représentées</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prefectures Card */}
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
                  <Map className="h-6 w-6 text-white" />
                </div>
                <Users className="h-5 w-5 text-white/70" />
              </div>
              <CardTitle className="text-white text-lg font-semibold">Préfectures</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pt-0">
              <div className="text-3xl font-bold text-white mb-2">{totalPrefectures}</div>
              <p className="text-white/80 text-sm">Préfectures actives</p>
            </CardContent>
          </Card>
        </motion.div>


      </div>

      {/* Charts Section - Top Row */}
      <div className="grid gap-8 lg:grid-cols-2 grid-cols-1">
        {/* Nationality Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Répartition par Nationalité</CardTitle>
                  <CardDescription className="text-sm">Distribution des nationalités</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_nationality.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={prepareNationalityData()}
                        dataKey="total"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={3}
                      >
                        {prepareNationalityData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={NATIONALITY_COLORS[index % NATIONALITY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} personnes`,
                          props.payload?.name || name
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
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '14px'
                        }}
                      />
                    </PieChart>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée de nationalité disponible</p>
                      </div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Region Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Répartition par Région</CardTitle>
                  <CardDescription className="text-sm">Distribution géographique</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_region.length > 0 ? (
                    <BarChart
                      data={prepareRegionData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} personnes`,
                          props.payload?.name || name
                        ]}
                        labelFormatter={(label: any) => label}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
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
                        {prepareRegionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={REGION_COLORS[index % REGION_COLORS.length]} />
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
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée de région disponible</p>
                      </div>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section - Bottom Row */}
      <div className="grid gap-8 lg:grid-cols-1 grid-cols-1">
        {/* Prefecture Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 100 }}
        >
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-2">
                  <Map className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Top Préfectures</CardTitle>
                  <CardDescription className="text-sm">Les préfectures les plus représentées</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  {geographicStatistics.stats_by_prefecture.length > 0 ? (
                    <BarChart
                      layout="vertical"
                      data={preparePrefectureData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        width={120}
                      />
                      <Tooltip
                        formatter={(value: any, name: any, props: any) => [
                          `${value} personnes`,
                          props.payload?.name || name
                        ]}
                        labelFormatter={(label: any) => label}
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
                        {preparePrefectureData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PREFECTURE_COLORS[index % PREFECTURE_COLORS.length]} />
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
                        <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune donnée de préfecture disponible</p>
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
