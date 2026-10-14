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
  Wifi, 
  Users, 
  CreditCard, 
  Phone, 
  MapPin, 
  Clock,
  Sparkles,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function CaptivePortal() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const plans = [
    { 
      id: 'daily', 
      name: 'Daily Unlimited', 
      price: 'KSh 50', 
      speed: 'Up to 10Mbps', 
      validity: '24 Hours',
      description: 'Perfect for light browsing and social media'
    },
    { 
      id: 'weekly', 
      name: 'Weekly Unlimited', 
      price: 'KSh 300', 
      speed: 'Up to 15Mbps', 
      validity: '7 Days',
      description: 'Ideal for streaming and regular usage'
    },
    { 
      id: 'monthly', 
      name: 'Monthly Unlimited', 
      price: 'KSh 1,000', 
      speed: 'Up to 25Mbps', 
      validity: '30 Days',
      description: 'Best value for heavy users and families'
    },
    { 
      id: 'premium', 
      name: 'Premium Plus', 
      price: 'KSh 2,000', 
      speed: 'Up to 50Mbps', 
      validity: '30 Days',
      description: 'Ultra-fast for gaming and 4K streaming'
    }
  ];

  const handleConnect = () => {
    if (!selectedPlan) {
      alert('Please select a plan first');
      return;
    }
    
    if (!phoneNumber && !email) {
      alert('Please provide either phone number or email');
      return;
    }

    // In a real implementation, this would initiate payment/authentication
    alert(`Connecting you with ${selectedPlan} plan...\nYou'll be redirected to payment shortly.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center shadow-lg">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Guevara WiFi
              </h1>
              <p className="text-sm text-gray-600">Free WiFi Hotspot</p>
            </div>
          </div>
          <p className="max-w-xl mx-auto text-gray-700">
            Welcome to Guevara WiFi! Enjoy fast, reliable internet access. 
            Choose a plan below to get connected.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Plans Section */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Choose Your Plan</span>
              </CardTitle>
              <CardDescription>
                Select a plan that suits your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`border-2 border-dashed rounded-xl p-4 hover:border-2 hover:border-solid transition-all cursor-pointer ${
                    selectedPlan === plan.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white">
                        {plan.id === 'daily' ? '📅' : plan.id === 'weekly' ? '📆' : plan.id === 'monthly' ? '🗓️' : '💎'}
                      </div>
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-xs text-gray-500">{plan.validity}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.speed}</p>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>
              ))}
              
              {/* Connection Form */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Label htmlFor="phone-number">Phone Number (for M-Pesa)</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="e.g., 07XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
                
                <Label htmlFor="email" className="mt-4">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
                
                <p className="mt-3 text-xs text-gray-500">
                  We'll send you an M-Pesa paybill number to complete payment.
                </p>
                
                <Button 
                  onClick={handleConnect}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
                  disabled={!selectedPlan || (!phoneNumber && !email)}
                >
                  Connect & Pay
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Section */}
          <Card className="col-span-1 md:col-span-1 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Network Status</span>
              </CardTitle>
              <CardDescription>
                Current network performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connected Devices</span>
                  <span className="text-2xl font-bold text-purple-600">47</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-gray-500">78% capacity</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network Speed</span>
                  <span className="text-xl font-bold text-green-600">24.5 Mbps</span>
                </div>
                <Progress value={82} className="h-2" />
                <p className="text-xs text-gray-500">Good signal strength</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-xl font-bold text-blue-600">99.8%</span>
                </div>
                <Progress value={99} className="h-2" />
                <p className="text-xs text-gray-500">Excellent reliability</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Info Section */}
          <Card className="col-span-1 md:col-span-3 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>Need Help?</span>
              </CardTitle>
              <CardDescription>
                We're here to assist you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Our Location</p>
                    <p className="text-sm text-gray-600">
                      Guevara WiFi Hotspot<br />
                      Westlands, Nairobi<br />
                      Near Sarit Centre
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-xl font-bold text-green-600">0700 GUEVARA (0700 483 827)</p>
                    <p className="text-xs text-gray-500">Toll Free</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm font-medium">support@guevarawifi.co.ke</p>
                    <p className="text-xs text-gray-500">24/7 Support</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Payment Methods</p>
                    <p className="text-sm text-gray-600 flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">M-Pesa</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Airtel Money</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Cash</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            By using this service, you agree to our 
            <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> 
            and 
            <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Guevara WiFi &copy; {new Date().getFullYear()} | Powered by Guevara Billing System
          </p>
        </div>
      </div>
    </div>
  );
}