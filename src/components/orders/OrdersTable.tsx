import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrdersTableProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  showProvider?: boolean;
}

export function OrdersTable({ orders, onViewOrder, onEditOrder, showProvider = true }: OrdersTableProps) {
  const { t, language } = useLanguage();

  const formatCurrency = (value: number | null) => {
    if (value === null) return '—';
    return new Intl.NumberFormat(language === 'es' ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'es' ? 'es-CO' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="surface-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">{t('orders.id')}</TableHead>
            {showProvider && <TableHead className="text-muted-foreground">{t('orders.provider')}</TableHead>}
            <TableHead className="text-muted-foreground">{t('orders.grams')}</TableHead>
            <TableHead className="text-muted-foreground">{t('orders.negotiation')}</TableHead>
            <TableHead className="text-muted-foreground">{t('orders.goldPrice')}</TableHead>
            <TableHead className="text-muted-foreground">{t('orders.dollarPrice')}</TableHead>
            <TableHead className="text-muted-foreground">{t('orders.finalPrice')}</TableHead>
            <TableHead className="text-muted-foreground">{t('orders.status')}</TableHead>
            <TableHead className="text-muted-foreground">{t('orders.date')}</TableHead>
            <TableHead className="text-muted-foreground text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-border">
              <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
              {showProvider && <TableCell>{order.providerName}</TableCell>}
              <TableCell className="font-semibold">{order.grams.toFixed(2)} g</TableCell>
              <TableCell>{order.negotiationPercentage}%</TableCell>
              <TableCell className={cn(order.goldPrice === null && 'text-muted-foreground')}>
                {formatCurrency(order.goldPrice)}
              </TableCell>
              <TableCell className={cn(order.dollarPrice === null && 'text-muted-foreground')}>
                {order.dollarPrice !== null ? `$${order.dollarPrice.toFixed(2)}` : '—'}
              </TableCell>
              <TableCell className="font-semibold text-primary">
                {formatCurrency(order.finalPrice)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'font-medium',
                    order.status === 'completed' ? 'status-completed' : 'status-pending'
                  )}
                >
                  {order.status === 'completed' ? t('orders.statusCompleted') : t('orders.statusPending')}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewOrder?.(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditOrder?.(order)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">{t('orders.noOrders')}</p>
        </div>
      )}
    </div>
  );
}
