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

const stats = [
  {
    name: 'Total Utilisateurs',
    value: '2,543',
    icon: Users,
    change: '+12.3%',
    changeType: 'positive',
  },
  {
    name: 'Commerçants actifs',
    value: '1,234',
    icon: Store,
    change: '+8.2%',
    changeType: 'positive',
  },
  {
    name: 'Cartes Générées',
    value: '3,456',
    icon: FileText,
    change: '-4.5%',
    changeType: 'negative',
  },
  {
    name: 'En Cours De Traitement',
    value: '12',
    icon: CreditCard,
    change: '+23.1%',
    changeType: 'positive',
  },
];

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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
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
                  {stat.name}
                </CardTitle>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "dark:bg-cyan-500/10 bg-cyan-500/20"
                )}>
                  <stat.icon className={cn(
                    "h-5 w-5",
                    "dark:text-cyan-400 text-cyan-600"
                  )} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold",
                  "dark:text-white text-gray-900"
                )}>
                  {stat.value}
                </div>
                <div className={cn(
                  "flex items-center text-xs mt-1",
                  stat.changeType === 'positive' 
                    ? 'dark:text-emerald-400 text-emerald-600'
                    : 'dark:text-red-400 text-red-600'
                )}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      stat.changeType === 'positive'
                        ? 'dark:bg-emerald-400 bg-emerald-600'
                        : 'dark:bg-red-400 bg-red-600'
                    )}
                  />
                  <span>{stat.change} depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Merchants by Address Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
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
                Commerçants par Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={merchantsByAddress}
                      dataKey="merchants"
                      nameKey="address"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {merchantsByAddress.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          className={cn(
                            index === 0 && "dark:fill-cyan-400 fill-cyan-600",
                            index === 1 && "dark:fill-cyan-500 fill-cyan-500",
                            index === 2 && "dark:fill-cyan-600 fill-cyan-400",
                            index === 3 && "dark:fill-cyan-700 fill-cyan-300",
                            index === 4 && "dark:fill-cyan-800 fill-cyan-200"
                          )}
                        />
                      ))}
                    </Pie>
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
                    <Legend 
                      formatter={(value) => (
                        <span className="dark:text-gray-400 text-gray-600">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Cards Generated Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-2 "
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
                Cartes Générées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCards}>
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
                      dataKey="cards" 
                      name="Cartes"
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
                  <LineChart data={monthlyPayments}>
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
                      tickFormatter={(value) => `${value / 1000}M`}
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
                      dataKey="amount" 
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