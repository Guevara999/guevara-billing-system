import { useSession } from '@/components/SessionContextProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  Download,
  Upload
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ElementType;
  color: string;
}

export default function Dashboard() {
  const { session } = useSession();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!session) return;

      try {
        // Get total customers
        const { count: customerCount } = await supabase
          .from('users_billing')
          .select('*', { count: 'exact' });

        // Get total revenue
        const { data: billingData } = await supabase
          .from('users_billing')
          .select('amount_paid')
          .eq('status', 'paid');

        const totalRevenue = billingData?.reduce((sum, item) => sum + (item.amount_paid || 0), 0) || 0;

        // Get active plans
        const { count: planCount } = await supabase
          .from('plans')
          .select('*', { count: 'exact' })
          .eq('is_active', true);

        setStats([
          {
            title: 'Total Customers',
            value: customerCount || 0,
            change: '+12% this month',
            icon: Users,
            color: 'text-blue-600',
          },
          {
            title: 'Total Revenue',
            value: `KSh ${totalRevenue.toLocaleString()}`,
            change: '+8.5% this month',
            icon: CreditCard,
            color: 'text-green-600',
          },
          {
            title: 'Active Plans',
            value: planCount || 0,
            change: '+2 new plans',
            icon: Wifi,
            color: 'text-purple-600',
          },
          {
            title: 'Network Usage',
            value: '78%',
            change: '2.4 GB / 3.1 GB',
            icon: Activity,
            color: 'text-orange-600',
          },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
                <p className="text-xs text-muted-foreground">...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your WiFi billing system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-l-4 border-l-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Network Performance</CardTitle>
            <CardDescription>Real-time bandwidth usage across all access points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Download</span>
                  </div>
                  <span className="text-sm font-bold">124.5 GB</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Upload</span>
                  </div>
                  <span className="text-sm font-bold">45.2 GB</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest customer payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'John Mutua', amount: 'KSh 2,500', date: 'Today' },
                { name: 'Sarah Wanjiku', amount: 'KSh 1,800', date: 'Yesterday' },
                { name: 'David Ochieng', amount: 'KSh 3,200', date: '2 days ago' },
              ].map((payment) => (
                <div key={payment.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{payment.name}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{payment.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}