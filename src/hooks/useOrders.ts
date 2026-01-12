import { useState, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';
import { OrderFormData } from '@/components/orders/OrderForm';

// Demo orders data
const demoOrders: Order[] = [
  {
    id: 'ord-001-abc123',
    providerId: '1',
    providerName: 'Minera San Rafael',
    grams: 250.5,
    negotiationPercentage: 2.5,
    goldPrice: 2645.80,
    dollarPrice: 4125.50,
    finalPrice: 85420000,
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'ord-002-def456',
    providerId: '2',
    providerName: 'Oro Colombia SAS',
    grams: 180.0,
    negotiationPercentage: 3.0,
    goldPrice: 2652.30,
    dollarPrice: null,
    finalPrice: null,
    status: 'pending',
    createdAt: new Date(Date.now() - 43200000),
    completedAt: null,
  },
  {
    id: 'ord-003-ghi789',
    providerId: '3',
    providerName: 'Inversiones Doradas',
    grams: 500.0,
    negotiationPercentage: 1.8,
    goldPrice: null,
    dollarPrice: 4130.00,
    finalPrice: null,
    status: 'pending',
    createdAt: new Date(Date.now() - 21600000),
    completedAt: null,
  },
  {
    id: 'ord-004-jkl012',
    providerId: '1',
    providerName: 'Minera San Rafael',
    grams: 320.75,
    negotiationPercentage: 2.0,
    goldPrice: 2648.50,
    dollarPrice: 4128.00,
    finalPrice: 109850000,
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000),
    completedAt: new Date(Date.now() - 172000000),
  },
];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = useCallback(async (formData: OrderFormData, providerName: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const isComplete = formData.lockGold && formData.lockDollar;
    let finalPrice: number | null = null;

    if (isComplete && formData.goldPrice && formData.dollarPrice) {
      const gramsToOunce = formData.grams / 31.1035;
      const basePrice = gramsToOunce * formData.goldPrice * formData.dollarPrice;
      finalPrice = basePrice - (basePrice * (formData.negotiationPercentage / 100));
    }

    const newOrder: Order = {
      id: `ord-${Date.now().toString(36)}`,
      providerId: formData.providerId,
      providerName,
      grams: formData.grams,
      negotiationPercentage: formData.negotiationPercentage,
      goldPrice: formData.goldPrice,
      dollarPrice: formData.dollarPrice,
      finalPrice,
      status: isComplete ? 'completed' : 'pending',
      createdAt: new Date(),
      completedAt: isComplete ? new Date() : null,
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsLoading(false);
    return newOrder;
  }, []);

  const completeOrder = useCallback(async (orderId: string, goldPrice: number | null, dollarPrice: number | null) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedGoldPrice = goldPrice ?? order.goldPrice;
      const updatedDollarPrice = dollarPrice ?? order.dollarPrice;

      if (updatedGoldPrice && updatedDollarPrice) {
        const gramsToOunce = order.grams / 31.1035;
        const basePrice = gramsToOunce * updatedGoldPrice * updatedDollarPrice;
        const finalPrice = basePrice - (basePrice * (order.negotiationPercentage / 100));

        return {
          ...order,
          goldPrice: updatedGoldPrice,
          dollarPrice: updatedDollarPrice,
          finalPrice,
          status: 'completed' as OrderStatus,
          completedAt: new Date(),
        };
      }

      return {
        ...order,
        goldPrice: updatedGoldPrice,
        dollarPrice: updatedDollarPrice,
      };
    }));

    setIsLoading(false);
  }, []);

  const filterOrders = useCallback((status?: OrderStatus, providerId?: string) => {
    return orders.filter(order => {
      if (status && order.status !== status) return false;
      if (providerId && order.providerId !== providerId) return false;
      return true;
    });
  }, [orders]);

  return {
    orders,
    isLoading,
    createOrder,
    completeOrder,
    filterOrders,
  };
}
