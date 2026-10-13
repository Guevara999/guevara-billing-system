import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { useGuest } from '@/components/GuestContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Wifi, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Package, 
  Receipt, 
  BarChart3, 
  Network,
  LogOut,
  Menu,
  X,
  Building2,
  Sparkles,
  User
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Package, label: 'Plans', path: '/plans' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Receipt, label: 'Payments', path: '/payments' },
  { icon: Network, label: 'Network', path: '/network' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  const { isGuest, guestName } = useGuest();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const userInitials = session?.user?.user_metadata?.first_name
    ? `${session.user.user_metadata.first_name[0]}${session.user.user_metadata.last_name?.[0] || ''}`
    : session?.user?.email?.[0]?.toUpperCase() || 'U';

  const displayName = isGuest ? guestName : (session?.user?.user_metadata?.first_name || 'User');
  const displayInitials = isGuest 
    ? `${guestName[0]}${guestName.length > 1 ? guestName[1] : 'U'}`
    : userInitials;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
          <SidebarHeader className="border-b border-purple-200">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center shadow-lg">
                <Wifi className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Guevara
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white shadow-lg' 
                            : 'hover:bg-white/20 hover:border-white/20 border-transparent border'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-purple-200">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {isGuest ? '(Guest)' : session?.user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="ml-auto"
              >
                <LogOut className="h-4 w-4 text-purple-600 hover:text-purple-800" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b border-purple-200 bg-white/80 backdrop-blur-sm p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-purple-600 hover:text-purple-800" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </header>
          <div className="flex-1 p-6 bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};