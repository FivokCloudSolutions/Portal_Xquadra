import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'gold' | 'success' | 'warning';
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
  const variants = {
    default: 'bg-secondary/50 text-foreground',
    gold: 'bg-primary/10 text-primary',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="surface-card p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 font-display text-3xl font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', variants[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'text-sm font-medium',
            trend.value >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
