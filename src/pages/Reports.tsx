import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import { useLanguage } from '@/contexts/LanguageContext';
import { demoProviders } from '@/data/providers';
import { Download, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Reports() {
  const { orders } = useOrders();
  const { t, language } = useLanguage();
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  // Generate chart data
  const chartData = orders
    .filter(o => o.status === 'completed')
    .map(o => ({
      date: new Intl.DateTimeFormat(language === 'es' ? 'es-CO' : 'en-US', { day: '2-digit', month: 'short' }).format(o.createdAt),
      gramos: o.grams,
      valor: (o.finalPrice || 0) / 1000000,
    }))
    .slice(0, 10)
    .reverse();

  const providerStats = demoProviders.map(provider => {
    const providerOrders = orders.filter(o => o.providerId === provider.id);
    const completedValue = providerOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.finalPrice || 0), 0);
    
    return {
      name: provider.name,
      ordenes: providerOrders.length,
      valor: completedValue / 1000000,
    };
  });

  const totalValue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.finalPrice || 0), 0);

  const totalGrams = orders.reduce((sum, o) => sum + o.grams, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              {t('reports.title')}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {t('reports.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48 bg-surface-2 border-border">
                <SelectValue placeholder={t('orders.provider')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('reports.allProviders')}</SelectItem>
                {demoProviders.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t('common.exportPdf')}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('reports.totalValue')}</p>
                <p className="mt-1 font-display text-3xl font-semibold gold-text">
                  {new Intl.NumberFormat(language === 'es' ? 'es-CO' : 'en-US', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                  }).format(totalValue)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="surface-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('reports.totalGrams')}</p>
                <p className="mt-1 font-display text-3xl font-semibold text-foreground">
                  {totalGrams.toFixed(2)}g
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="surface-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('reports.avgPrice')}</p>
                <p className="mt-1 font-display text-3xl font-semibold text-foreground">
                  {totalGrams > 0
                    ? new Intl.NumberFormat(language === 'es' ? 'es-CO' : 'en-US', {
                        style: 'currency',
                        currency: 'COP',
                        maximumFractionDigits: 0,
                      }).format(totalValue / totalGrams)
                    : '$0'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Volume Chart */}
          <div className="surface-card p-6">
            <h3 className="mb-6 font-display text-lg font-semibold text-foreground">
              {t('reports.volumeChart')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis dataKey="date" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gramos"
                    stroke="hsl(43, 74%, 49%)"
                    fillOpacity={1}
                    fill="url(#goldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Provider Chart */}
          <div className="surface-card p-6">
            <h3 className="mb-6 font-display text-lg font-semibold text-foreground">
              {t('reports.providerChart')}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis type="number" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 55%)" fontSize={12} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="valor" fill="hsl(43, 74%, 49%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
