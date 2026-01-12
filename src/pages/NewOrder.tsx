import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrderForm, OrderFormData } from '@/components/orders/OrderForm';
import { usePriceData } from '@/hooks/usePriceData';
import { useOrders } from '@/hooks/useOrders';
import { demoProviders } from '@/data/providers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function NewOrder() {
  const { priceData } = usePriceData();
  const { createOrder, isLoading } = useOrders();
  const navigate = useNavigate();

  const handleSubmit = async (data: OrderFormData) => {
    const provider = demoProviders.find(p => p.id === data.providerId);
    if (!provider) {
      toast.error('Proveedor no encontrado');
      return;
    }

    const order = await createOrder(data, provider.name);
    
    if (order.status === 'completed') {
      toast.success('Orden completada exitosamente', {
        description: `Orden #${order.id.slice(0, 8)} generada por ${order.grams}g`,
      });
    } else {
      toast.warning('Orden pendiente creada', {
        description: 'Falta confirmar el precio del oro o dólar',
      });
    }

    navigate('/orders');
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Nueva Orden
            </h1>
            <p className="mt-1 text-muted-foreground">
              Genera una nueva orden de compra de oro
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            Precios actualizándose en tiempo real
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            Última actualización: {priceData.lastUpdated.toLocaleTimeString('es-CO')}
          </span>
        </div>

        {/* Form */}
        <div className="surface-card p-6">
          <OrderForm
            providers={demoProviders}
            priceData={priceData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
