import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Plus, Download, Search, Filter } from 'lucide-react';
import { OrderStatus } from '@/types';

export default function Orders() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { orders } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchTerm && !order.providerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (user?.role === 'proveedor' && order.providerId !== user.id) return false;
    return true;
  });

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting as ${format}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              {user?.role === 'proveedor' ? t('orders.myOrders') : t('orders.title')}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {filteredOrders.length} {t('orders.found')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="mr-2 h-4 w-4" />
              {t('common.export')}
            </Button>
            <Link to="/orders/new">
              <Button variant="gold">
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.newOrder')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('orders.searchProvider')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface-2 border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
            <SelectTrigger className="w-full md:w-48 bg-surface-2 border-border">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('orders.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('orders.allStatuses')}</SelectItem>
              <SelectItem value="pending">{t('orders.pending')}</SelectItem>
              <SelectItem value="completed">{t('orders.completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <OrdersTable 
          orders={filteredOrders}
          showProvider={user?.role !== 'proveedor'}
        />
      </div>
    </DashboardLayout>
  );
}
