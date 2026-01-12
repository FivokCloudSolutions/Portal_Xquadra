import { useState, useEffect, useCallback } from 'react';
import { PriceData } from '@/types';

// Simulated price data - replace with real API calls
const generatePriceData = (): PriceData => {
  const baseGold = 2650;
  const baseDollar = 4150;
  
  return {
    goldOunce: baseGold + (Math.random() - 0.5) * 50,
    dollarRate: baseDollar + (Math.random() - 0.5) * 100,
    lastUpdated: new Date(),
    goldChange: (Math.random() - 0.5) * 2,
    dollarChange: (Math.random() - 0.5) * 1.5,
  };
};

export function usePriceData() {
  const [priceData, setPriceData] = useState<PriceData>(generatePriceData());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setPriceData(generatePriceData());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { priceData, isLoading, refresh };
}
