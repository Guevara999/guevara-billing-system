import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  CreditCard,
  FileText,
  Calendar,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface BillingRecord {
  id: string;
  user_id: string;
  plan_id: string | null;
  amount_paid: number;
  payment_date: string;
  status: 'paid' | 'pending' | 'overdue';
  created_at: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string | null;
}

interface Plan {
  id: string;
  name: string;
  price: number;
}

export default function Billing() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    plan_id: '',
    amount_paid: '',
    status: 'pending' as 'paid' | 'pending' | 'overdue',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch billing records
        const { data: billingData, error: billingError } = await supabase
          .from('users_billing')
          .select('*, plan:plan_id(*)')
          .order('created_at', { ascending: false });

        if (billingError) throw billingError;
        setBillingRecords(billingData || []);

        // Fetch customers
        const { data: customerData, error: customerError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, company_name');

        if (customerError) throw customerError;
        setCustomers(customerData || []);

        // Fetch plans
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('id, name, price');

        if (planError) throw planError;
        setPlans(planData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCustomerName = (userId: string) => {
    const customer = customers.find(c => c.id === userId);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown';
  };

  const getPlanName = (planId: string | null) => {
    if (!planId) return 'N/A';
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : 'N/A';
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = 
      getCustomerName(record.user_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = async () => {
    if (!formData.user_id || !formData.amount_paid) {
      toast({
        title: "Missing information",
        description: "Please select a customer and enter amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('users_billing').insert([{
        user_id: formData.user_id,
        plan_id: formData.plan_id || null,
        amount_paid: parseFloat(formData.amount_paid),
        status: formData.status,
      }]);

      if (error) throw error;
      
      toast({ title: "Invoice created successfully" });
      setIsDialogOpen(false);
      setFormData({
        user_id: '',
        plan_id: '',
        amount_paid: '',
        status: 'pending',
      });
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error creating invoice",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase.from('users_billing').delete().eq('id', id);
      if (error) throw error;
      setBillingRecords(prev => prev.filter(r => r.id !== id));
      toast({ title: "Invoice deleted successfully" });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error deleting invoice",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalRevenue = billingRecords
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount_paid, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading billing records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Billing & Invoices</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a new billing record for a customer
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id">Customer</Label>
                  <Select
                    value={formData.user_id}
                    onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.first_name} {customer.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan_id">Plan (Optional)</Label>
                  <Select
                    value={formData.plan_id}
                    onValueChange={(value) => setFormData({ ...formData, plan_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - KSh {plan.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount_paid">Amount (KSh)</Label>
                  <Input
                    id="amount_paid"
                    type="number"
                    value={formData.amount_paid}
                    onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'paid' | 'pending' | 'overdue') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateInvoice}>Create Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {billingRecords.filter(r => r.status === 'paid').length} paid invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingRecords.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              KSh {billingRecords.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount_paid, 0).toLocaleString()} outstanding
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {billingRecords.filter(r => r.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">
              KSh {billingRecords.filter(r => r.status === 'overdue').reduce((s, r) => s + r.amount_paid, 0).toLocaleString()} due
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Records</CardTitle>
          <CardDescription>
            {filteredRecords.length} records found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No billing records found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{getCustomerName(record.user_id)}</TableCell>
                    <TableCell>{getPlanName(record.plan_id)}</TableCell>
                    <TableCell>KSh {record.amount_paid.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(record.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteInvoice(record.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}