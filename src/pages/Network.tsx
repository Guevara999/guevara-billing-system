import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Router,
  Wifi,
  Signal,
  Activity,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AccessPoint {
  id: string;
  name: string;
  location: string;
  ip_address: string;
  status: 'online' | 'offline' | 'maintenance';
  clients: number;
  max_clients: number;
  signal: number;
  last_seen: string;
}

interface Device {
  id: string;
  mac_address: string;
  ip_address: string;
  hostname: string;
  ap_id: string;
  status: 'connected' | 'disconnected';
  last_seen: string;
}

export default function Network() {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'aps' | 'devices'>('aps');
  const [isApDialogOpen, setIsApDialogOpen] = useState(false);
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);
  const [apFormData, setApFormData] = useState({
    name: '',
    location: '',
    ip_address: '',
    max_clients: '50',
  });
  const [deviceFormData, setDeviceFormData] = useState({
    mac_address: '',
    ip_address: '',
    hostname: '',
    ap_id: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data for access points
        setAccessPoints([
          {
            id: '1',
            name: 'Main Tower - Nairobi',
            location: 'Westlands, Nairobi',
            ip_address: '192.168.1.1',
            status: 'online',
            clients: 32,
            max_clients: 50,
            signal: 85,
            last_seen: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Branch Tower - Kisumu',
            location: 'Kisumu CBD',
            ip_address: '192.168.1.2',
            status: 'online',
            clients: 18,
            max_clients: 30,
            signal: 72,
            last_seen: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Remote Tower - Mombasa',
            location: 'Mombasa Old Town',
            ip_address: '192.168.1.3',
            status: 'maintenance',
            clients: 0,
            max_clients: 40,
            signal: 0,
            last_seen: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);

        // Mock data for devices
        setDevices([
          {
            id: '1',
            mac_address: '00:1A:2B:3C:4D:5E',
            ip_address: '10.0.0.15',
            hostname: 'John-Phone',
            ap_id: '1',
            status: 'connected',
            last_seen: new Date().toISOString(),
          },
          {
            id: '2',
            mac_address: '00:2B:3C:4D:5E:6F',
            ip_address: '10.0.0.22',
            hostname: 'Sarah-Laptop',
            ap_id: '1',
            status: 'connected',
            last_seen: new Date().toISOString(),
          },
          {
            id: '3',
            mac_address: '00:3C:4D:5E:6F:7A',
            ip_address: '10.0.0.31',
            hostname: 'David-Tablet',
            ap_id: '2',
            status: 'disconnected',
            last_seen: new Date(Date.now() - 7200000).toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Error fetching network data:', error);
        toast({
          title: "Error loading network data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAccessPoint = () => {
    const newAp: AccessPoint = {
      id: Date.now().toString(),
      name: apFormData.name,
      location: apFormData.location,
      ip_address: apFormData.ip_address,
      status: 'online',
      clients: 0,
      max_clients: parseInt(apFormData.max_clients),
      signal: 0,
      last_seen: new Date().toISOString(),
    };
    setAccessPoints(prev => [newAp, ...prev]);
    setIsApDialogOpen(false);
    setApFormData({ name: '', location: '', ip_address: '', max_clients: '50' });
    toast({ title: "Access point added successfully" });
  };

  const handleAddDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      mac_address: deviceFormData.mac_address,
      ip_address: deviceFormData.ip_address,
      hostname: deviceFormData.hostname,
      ap_id: deviceFormData.ap_id,
      status: 'connected',
      last_seen: new Date().toISOString(),
    };
    setDevices(prev => [newDevice, ...prev]);
    setIsDeviceDialogOpen(false);
    setDeviceFormData({ mac_address: '', ip_address: '', hostname: '', ap_id: '' });
    toast({ title: "Device added successfully" });
  };

  const handleDeleteAp = (id: string) => {
    setAccessPoints(prev => prev.filter(ap => ap.id !== id));
    toast({ title: "Access point removed" });
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    toast({ title: "Device removed" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'offline':
      case 'disconnected':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalClients = accessPoints.reduce((sum, ap) => sum + ap.clients, 0);
  const totalMaxClients = accessPoints.reduce((sum, ap) => sum + ap.max_clients, 0);
  const onlineAps = accessPoints.filter(ap => ap.status === 'online').length;
  const totalDevices = devices.length;
  const connectedDevices = devices.filter(d => d.status === 'connected').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading network data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Network Management</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Network Map
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Points</CardTitle>
            <Router className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessPoints.length}</div>
            <p className="text-xs text-muted-foreground">
              {onlineAps} online, {accessPoints.length - onlineAps} offline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Clients</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <Progress value={(totalClients / totalMaxClients) * 100} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalClients}/{totalMaxClients} capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedDevices}</div>
            <p className="text-xs text-muted-foreground">
              {totalDevices} total devices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Signal</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(accessPoints.reduce((sum, ap) => sum + ap.signal, 0) / accessPoints.length || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all access points
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Button
          variant={activeTab === 'aps' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('aps')}
        >
          Access Points
        </Button>
        <Button
          variant={activeTab === 'devices' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('devices')}
        >
          Connected Devices
        </Button>
      </div>

      {activeTab === 'aps' ? (
        <Card>
          <CardHeader>
            <CardTitle>Access Points</CardTitle>
            <CardDescription>
              Manage your WiFi access points and towers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessPoints.map((ap) => (
                <div key={ap.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Router className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{ap.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ap.location}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(ap.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">IP Address</p>
                      <p className="text-sm font-medium">{ap.ip_address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clients</p>
                      <p className="text-sm font-medium">{ap.clients}/{ap.max_clients}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Signal</p>
                      <p className="text-sm font-medium">{ap.signal}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Seen</p>
                      <p className="text-sm font-medium">
                        {new Date(ap.last_seen).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
            <CardDescription>
              View all devices connected to your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hostname</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Access Point</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.hostname}</TableCell>
                    <TableCell className="font-mono text-sm">{device.mac_address}</TableCell>
                    <TableCell>{device.ip_address}</TableCell>
                    <TableCell>
                      {accessPoints.find(ap => ap.id === device.ap_id)?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(device.last_seen).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isApDialogOpen} onOpenChange={setIsApDialogOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Access Point</DialogTitle>
            <DialogDescription>
              Register a new WiFi access point
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ap-name">Name</Label>
              <Input
                id="ap-name"
                value={apFormData.name}
                onChange={(e) => setApFormData({ ...apFormData, name: e.target.value })}
                placeholder="e.g., Main Tower - Nairobi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-location">Location</Label>
              <Input
                id="ap-location"
                value={apFormData.location}
                onChange={(e) => setApFormData({ ...apFormData, location: e.target.value })}
                placeholder="e.g., Westlands, Nairobi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-ip">IP Address</Label>
              <Input
                id="ap-ip"
                value={apFormData.ip_address}
                onChange={(e) => setApFormData({ ...apFormData, ip_address: e.target.value })}
                placeholder="e.g., 192.168.1.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ap-max-clients">Max Clients</Label>
              <Input
                id="ap-max-clients"
                type="number"
                value={apFormData.max_clients}
                onChange={(e) => setApFormData({ ...apFormData, max_clients: e.target.value })}
                placeholder="50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccessPoint}>Add Access Point</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}