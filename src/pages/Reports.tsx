import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Download,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface ReportData {
  date: string;
  revenue: number;
  customers: number;
  payments: number;
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { toast } = useToast();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch billing data
        const { data: billingData, error: billingError } = await supabase
          .from('users_billing')
          .select('amount_paid, status, created_at');

        if (billingError) throw billingError;

        // Fetch customer data
        const { data: customerData, error: customerError } = await supabase
          .from('profiles')
          .select('created_at');

        if (customerError) throw customerError;

        // Process data into report format
        const today = new Date();
        const days = dateRange === '30d' ? 30 : dateRange === '7d' ? 7 : 90;
        
        const reportMap = new Map<string, ReportData>();
        
        for (let i = days - 1; i >= 0; i--) {
          const date = subDays(today, i);
          const dateStr = format(date, 'yyyy-MM-dd');
          reportMap.set(dateStr, {
            date: format(date, 'MMM d'),
            revenue: 0,
            customers: 0,
            payments: 0,
          });
        }

        // Aggregate billing data
        billingData?.forEach((record: any) => {
          const dateStr = format(new Date(record.created_at), 'yyyy-MM-dd');
          const existing = reportMap.get(dateStr);
          if (existing) {
            if (record.status === 'paid') {
              existing.revenue += record.amount_paid || 0;
            }
            existing.payments += 1;
          }
        });

        // Aggregate customer data
        customerData?.forEach((record: any) => {
          const dateStr = format(new Date(record.created_at), 'yyyy-MM-dd');
          const existing = reportMap.get(dateStr);
          if (existing) {
            existing.customers += 1;
          }
        });

        setReportData(Array.from(reportMap.values()));
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          title: "Error loading reports",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange, selectedMonth]);

  const totalRevenue = reportData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCustomers = reportData.reduce((sum, d) => sum + d.customers, 0);
  const totalPayments = reportData.reduce((sum, d) => sum + d.payments, 0);
  const avgPayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

  const maxRevenue = Math.max(...reportData.map(d => d.revenue), 1);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'} period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'} period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'} period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Payment</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {avgPayment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Daily revenue over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-1">
              {reportData.map((item) => (
                <div key={item.date} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-teal-400 rounded-t-sm transition-all hover:opacity-80"
                    style={{ 
                      height: `${(item.revenue / maxRevenue) * 250}px`,
                      minHeight: '2px',
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1 rotate-[-45deg] origin-top-left">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { method: 'M-Pesa', amount: 65, color: 'bg-green-500' },
                { method: 'Bank Transfer', amount: 20, color: 'bg-purple-500' },
                { method: 'Card', amount: 10, color: 'bg-blue-500' },
                { method: 'Cash', amount: 5, color: 'bg-orange-500' },
              ].map((item) => (
                <div key={item.method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.method}</span>
                    <span className="text-sm text-muted-foreground">{item.amount}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.amount}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest billing and payment activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.slice(-5).reverse().map((item) => (
              <div key={item.date} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.payments} payments, {item.customers} new customers
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">KSh {item.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}