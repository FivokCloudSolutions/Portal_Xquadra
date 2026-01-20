import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PriceCard } from '@/components/dashboard/PriceCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { usePriceData } from '@/hooks/usePriceData';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Coins, DollarSign, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
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
              {t('dashboard.welcome')}, <span className="gold-text">{user?.name}</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              {t('dashboard.summary')}
            </p>
          </div>
          <Link to="/orders/new">
            <Button variant="gold" size="lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('dashboard.newOrder')}
            </Button>
          </Link>
        </div>

        {/* Live Prices */}
        <div className="grid gap-6 md:grid-cols-2">
          <PriceCard
            title={t('dashboard.goldPrice')}
            value={priceData.goldOunce}
            change={priceData.goldChange}
            unit="USD/oz"
            icon={<Coins className="h-6 w-6" />}
            isLoading={priceLoading}
            onRefresh={refresh}
          />
          <PriceCard
            title={t('dashboard.exchangeRate')}
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
            title={t('dashboard.totalOrders')}
            value={orders.length}
            icon={FileText}
            trend={{ value: 12, label: t('dashboard.thisMonth') }}
          />
          <StatsCard
            title={t('dashboard.completed')}
            value={completedOrders}
            icon={CheckCircle}
            variant="success"
            trend={{ value: 8, label: t('dashboard.thisWeek') }}
          />
          <StatsCard
            title={t('dashboard.pending')}
            value={pendingOrders}
            icon={Clock}
            variant="warning"
          />
          <StatsCard
            title={t('dashboard.totalGrams')}
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
              {t('dashboard.recentOrders')}
            </h2>
            <Link to="/orders">
              <Button variant="ghost">{t('common.viewAll')}</Button>
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
