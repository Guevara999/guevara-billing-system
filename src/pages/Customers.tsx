import { useSession } from '@/components/SessionContextProvider';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
}

export default function Customers() {
  const { session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!session) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data to match our interface
        const transformedData = data.map((profile: any) => ({
          id: profile.id,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          company_name: profile.company_name || null,
          phone: profile.phone || null,
          status: profile.status as 'active' | 'suspended' | 'pending' || 'active',
          created_at: profile.created_at,
        }));

        setCustomers(transformedData);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error loading customers",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [session, searchTerm]);

  const filteredCustomers = customers.filter(customer =>
    `${customer.first_name} ${customer.last_name} ${customer.email} ${customer.company_name || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));

  const handleDeleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast({
        title: "Customer deleted",
        description: "Customer has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting customer",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, status: status as any } : customer
        )
      );
      
      toast({
        title: "Status updated",
        description: `Customer status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Customers</h2>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
        <div className="animate-pulse h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Manage your WiFi customers and their subscription status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found matching your search.</p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add First Customer
              </Button>
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-24">Company</TableHead>
                  <TableHead className="w-16">Status</TableHead>
                  <TableHead className="w-20">Joined</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        {customer.first_name[0]}{customer.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{`${customer.first_name} ${customer.last_name}`}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      {customer.company_name ? (
                        <span className="px-2 py-1 text-xs rounded bg-gray-100">
                          {customer.company_name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            customer.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : customer.status === 'suspended'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="p-1">
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleStatusChange(customer.id, 'active')}>
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(customer.id, 'suspended')}>
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(customer.id, 'pending')}>
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem className="destructive-text" onClick={() => handleDeleteCustomer(customer.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={customer.status === 'active'}
                        onCheckedChange={(checked) => handleStatusChange(customer.id, checked ? 'active' : 'suspended')}
                        className="h-4 w-4"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {paginatedCustomers.length} of {filteredCustomers.length} customers
          </div>
          <Pagination>
            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? 'bg-primary text-primary-foreground' : ''}
                >
                  {page}
                </button>
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  );
}