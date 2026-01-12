import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface PriceCardProps {
  title: string;
  value: number;
  change: number;
  unit: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function PriceCard({ title, value, change, unit, icon, isLoading, onRefresh }: PriceCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="surface-card p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-foreground">
                {isLoading ? '...' : value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className={cn(
          'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
        <span className="text-xs text-muted-foreground">vs ayer</span>
      </div>
    </div>
  );
}
