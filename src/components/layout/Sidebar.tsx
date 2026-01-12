import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  Truck,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navigation = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Órdenes', href: '/orders', icon: FileText },
    { name: 'Nueva Orden', href: '/orders/new', icon: TrendingUp },
    { name: 'Entregas', href: '/deliveries', icon: Truck },
    { name: 'Proveedores', href: '/providers', icon: Package },
    { name: 'Usuarios', href: '/users', icon: Users },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ],
  proveedor: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mis Órdenes', href: '/orders', icon: FileText },
    { name: 'Negociación', href: '/orders/new', icon: TrendingUp },
  ],
  xquadra: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Órdenes', href: '/orders', icon: FileText },
    { name: 'Nueva Orden', href: '/orders/new', icon: TrendingUp },
    { name: 'Entregas', href: '/deliveries', icon: Truck },
    { name: 'Reportes', href: '/reports', icon: BarChart3 },
  ],
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const navItems = navigation[user.role];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-surface-1">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-border px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-light">
              <span className="text-xl font-bold text-primary-foreground">X</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold gold-text">Xquadra</h1>
              <p className="text-xs text-muted-foreground">Gold Trading</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary gold-border'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <span className="text-sm font-medium text-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  );
}
