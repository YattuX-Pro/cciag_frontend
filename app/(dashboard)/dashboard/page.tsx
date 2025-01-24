import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, CreditCard, FileText } from 'lucide-react';

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

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}