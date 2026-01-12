import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PriceCard } from '@/components/dashboard/PriceCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { usePriceData } from '@/hooks/usePriceData';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, DollarSign, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { priceData, isLoading: priceLoading, refresh } = usePriceData();
  const { orders } = useOrders();

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalGrams = orders.reduce((sum, o) => sum + o.grams, 0);
  const totalValue = orders
    .filter(o => o.finalPrice !== null)
    .reduce((sum, o) => sum + (o.finalPrice || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Bienvenido, <span className="gold-text">{user?.name}</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Resumen de actividad y precios en tiempo real
            </p>
          </div>
          <Link to="/orders/new">
            <Button variant="gold" size="lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              Nueva Orden
            </Button>
          </Link>
        </div>

        {/* Live Prices */}
        <div className="grid gap-6 md:grid-cols-2">
          <PriceCard
            title="Precio del Oro"
            value={priceData.goldOunce}
            change={priceData.goldChange}
            unit="USD/oz"
            icon={<Coins className="h-6 w-6" />}
            isLoading={priceLoading}
            onRefresh={refresh}
          />
          <PriceCard
            title="Tasa de Cambio"
            value={priceData.dollarRate}
            change={priceData.dollarChange}
            unit="COP/USD"
            icon={<DollarSign className="h-6 w-6" />}
            isLoading={priceLoading}
            onRefresh={refresh}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Órdenes Totales"
            value={orders.length}
            icon={FileText}
            trend={{ value: 12, label: 'este mes' }}
          />
          <StatsCard
            title="Completadas"
            value={completedOrders}
            icon={CheckCircle}
            variant="success"
            trend={{ value: 8, label: 'esta semana' }}
          />
          <StatsCard
            title="Pendientes"
            value={pendingOrders}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title="Total Gramos"
            value={`${totalGrams.toFixed(2)}g`}
            subtitle={new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              maximumFractionDigits: 0,
            }).format(totalValue)}
            icon={Coins}
            variant="gold"
          />
        </div>

        {/* Recent Orders */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Órdenes Recientes
            </h2>
            <Link to="/orders">
              <Button variant="ghost">Ver todas</Button>
            </Link>
          </div>
          <OrdersTable 
            orders={orders.slice(0, 5)} 
            showProvider={user?.role !== 'proveedor'}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
