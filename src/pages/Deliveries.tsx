import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { demoProviders } from '@/data/providers';
import { Delivery } from '@/types';
import { Plus, Truck, Package } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const demoDeliveries: Delivery[] = [
  {
    id: 'del-001',
    providerId: '1',
    providerName: 'Minera San Rafael',
    grams: 250.5,
    deliveredAt: new Date(Date.now() - 86400000),
    notes: 'Entrega programada - lote A245',
  },
  {
    id: 'del-002',
    providerId: '2',
    providerName: 'Oro Colombia SAS',
    grams: 180.0,
    deliveredAt: new Date(Date.now() - 172800000),
    notes: 'Entrega anticipada',
  },
];

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(demoDeliveries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    providerId: '',
    grams: 0,
    notes: '',
  });

  const handleCreateDelivery = () => {
    const provider = demoProviders.find(p => p.id === newDelivery.providerId);
    if (!provider) {
      toast.error('Seleccione un proveedor');
      return;
    }

    const delivery: Delivery = {
      id: `del-${Date.now().toString(36)}`,
      providerId: newDelivery.providerId,
      providerName: provider.name,
      grams: newDelivery.grams,
      deliveredAt: new Date(),
      notes: newDelivery.notes,
    };

    setDeliveries(prev => [delivery, ...prev]);
    setIsDialogOpen(false);
    setNewDelivery({ providerId: '', grams: 0, notes: '' });
    toast.success('Entrega registrada exitosamente');
  };

  const totalGrams = deliveries.reduce((sum, d) => sum + d.grams, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Registro de Entregas
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gestiona las entregas de oro por proveedor
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Entrega
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Registrar Entrega</DialogTitle>
                <DialogDescription>
                  Ingresa los datos de la nueva entrega de oro
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Proveedor</Label>
                  <Select
                    value={newDelivery.providerId}
                    onValueChange={(value) => setNewDelivery(prev => ({ ...prev, providerId: value }))}
                  >
                    <SelectTrigger className="bg-surface-2 border-border">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {demoProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cantidad (gramos)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newDelivery.grams || ''}
                    onChange={(e) => setNewDelivery(prev => ({ ...prev, grams: parseFloat(e.target.value) || 0 }))}
                    className="bg-surface-2 border-border"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notas</Label>
                  <Textarea
                    value={newDelivery.notes}
                    onChange={(e) => setNewDelivery(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-surface-2 border-border resize-none"
                    placeholder="Observaciones de la entrega..."
                    rows={3}
                  />
                </div>
                <Button variant="gold" className="w-full" onClick={handleCreateDelivery}>
                  Registrar Entrega
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Entregas</p>
                <p className="font-display text-2xl font-semibold text-foreground">{deliveries.length}</p>
              </div>
            </div>
          </div>
          <div className="surface-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gramos</p>
                <p className="font-display text-2xl font-semibold text-foreground">{totalGrams.toFixed(2)}g</p>
              </div>
            </div>
          </div>
          <div className="surface-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proveedores Activos</p>
                <p className="font-display text-2xl font-semibold text-foreground">
                  {new Set(deliveries.map(d => d.providerId)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Proveedor</TableHead>
                <TableHead className="text-muted-foreground">Gramos</TableHead>
                <TableHead className="text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id} className="border-border">
                  <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                  <TableCell>{delivery.providerName}</TableCell>
                  <TableCell className="font-semibold">{delivery.grams.toFixed(2)} g</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    }).format(delivery.deliveredAt)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {delivery.notes || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
