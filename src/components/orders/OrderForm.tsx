import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PriceData, Provider } from '@/types';
import { cn } from '@/lib/utils';
import { Lock, Unlock, AlertCircle } from 'lucide-react';

interface OrderFormProps {
  providers: Provider[];
  priceData: PriceData;
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
}

export interface OrderFormData {
  providerId: string;
  grams: number;
  negotiationPercentage: number;
  goldPrice: number | null;
  dollarPrice: number | null;
  lockGold: boolean;
  lockDollar: boolean;
}

export function OrderForm({ providers, priceData, onSubmit, isLoading }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    providerId: '',
    grams: 0,
    negotiationPercentage: 0,
    goldPrice: null,
    dollarPrice: null,
    lockGold: false,
    lockDollar: false,
  });

  const handleLockGold = () => {
    setFormData(prev => ({
      ...prev,
      lockGold: !prev.lockGold,
      goldPrice: !prev.lockGold ? priceData.goldOunce : null,
    }));
  };

  const handleLockDollar = () => {
    setFormData(prev => ({
      ...prev,
      lockDollar: !prev.lockDollar,
      dollarPrice: !prev.lockDollar ? priceData.dollarRate : null,
    }));
  };

  const calculateFinalPrice = () => {
    if (formData.goldPrice && formData.dollarPrice && formData.grams > 0) {
      const gramsToOunce = formData.grams / 31.1035;
      const basePrice = gramsToOunce * formData.goldPrice * formData.dollarPrice;
      const discount = basePrice * (formData.negotiationPercentage / 100);
      return basePrice - discount;
    }
    return null;
  };

  const finalPrice = calculateFinalPrice();
  const isComplete = formData.lockGold && formData.lockDollar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Provider Selection */}
      <div className="space-y-2">
        <Label htmlFor="provider">Proveedor</Label>
        <Select
          value={formData.providerId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, providerId: value }))}
        >
          <SelectTrigger className="bg-surface-2 border-border">
            <SelectValue placeholder="Seleccionar proveedor" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grams */}
      <div className="space-y-2">
        <Label htmlFor="grams">Cantidad de Gramos</Label>
        <Input
          id="grams"
          type="number"
          step="0.01"
          min="0"
          value={formData.grams || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, grams: parseFloat(e.target.value) || 0 }))}
          className="bg-surface-2 border-border"
          placeholder="0.00"
        />
      </div>

      {/* Negotiation Percentage */}
      <div className="space-y-2">
        <Label htmlFor="percentage">Porcentaje de Negociación (%)</Label>
        <Input
          id="percentage"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.negotiationPercentage || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, negotiationPercentage: parseFloat(e.target.value) || 0 }))}
          className="bg-surface-2 border-border"
          placeholder="0.0"
        />
      </div>

      {/* Price Locks */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Gold Price Lock */}
        <div className="space-y-3">
          <Label>Precio del Oro (USD/oz)</Label>
          <div className="surface-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  ${priceData.goldOunce.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </p>
                <p className={cn(
                  'text-sm',
                  priceData.goldChange >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {priceData.goldChange >= 0 ? '+' : ''}{priceData.goldChange.toFixed(2)}%
                </p>
              </div>
              <Button
                type="button"
                variant={formData.lockGold ? 'gold' : 'outline'}
                size="icon"
                onClick={handleLockGold}
                className="h-12 w-12"
              >
                {formData.lockGold ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              </Button>
            </div>
            {formData.lockGold && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                <Lock className="h-4 w-4" />
                Precio fijado: ${formData.goldPrice?.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        {/* Dollar Price Lock */}
        <div className="space-y-3">
          <Label>Tasa de Cambio (COP/USD)</Label>
          <div className="surface-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  ${priceData.dollarRate.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                </p>
                <p className={cn(
                  'text-sm',
                  priceData.dollarChange >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {priceData.dollarChange >= 0 ? '+' : ''}{priceData.dollarChange.toFixed(2)}%
                </p>
              </div>
              <Button
                type="button"
                variant={formData.lockDollar ? 'gold' : 'outline'}
                size="icon"
                onClick={handleLockDollar}
                className="h-12 w-12"
              >
                {formData.lockDollar ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              </Button>
            </div>
            {formData.lockDollar && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                <Lock className="h-4 w-4" />
                Precio fijado: ${formData.dollarPrice?.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {!isComplete && (formData.lockGold || formData.lockDollar) && (
        <div className="flex items-start gap-3 rounded-lg bg-warning/10 p-4 text-warning">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div>
            <p className="font-medium">Orden Pendiente</p>
            <p className="text-sm opacity-80">
              {!formData.lockGold && 'Falta fijar el precio del oro. '}
              {!formData.lockDollar && 'Falta fijar la tasa de cambio.'}
            </p>
          </div>
        </div>
      )}

      {/* Final Price Preview */}
      {finalPrice !== null && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <p className="text-sm text-muted-foreground">Precio Final Estimado</p>
          <p className="font-display text-3xl font-semibold gold-text">
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              maximumFractionDigits: 0,
            }).format(finalPrice)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ({formData.grams}g × ${formData.goldPrice?.toFixed(2)}/oz × ${formData.dollarPrice?.toFixed(2)}) - {formData.negotiationPercentage}%
          </p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="gold"
        size="xl"
        className="w-full"
        disabled={!formData.providerId || formData.grams <= 0 || (!formData.lockGold && !formData.lockDollar) || isLoading}
      >
        {isLoading ? 'Generando...' : isComplete ? 'Generar Orden Completa' : 'Generar Orden Pendiente'}
      </Button>
    </form>
  );
}
