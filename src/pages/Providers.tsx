import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Package, Mail, DollarSign, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Provider } from '@/types';
import { demoProviders } from '@/data/providers';

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>(demoProviders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (provider?: Provider) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        name: provider.name,
        email: provider.email,
      });
    } else {
      setEditingProvider(null);
      setFormData({
        name: '',
        email: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProvider) {
      setProviders(providers.map(p => 
        p.id === editingProvider.id 
          ? { ...p, name: formData.name, email: formData.email }
          : p
      ));
      toast({
        title: t('providers.updated'),
        description: `${formData.name} ${t('providers.updatedDesc')}`,
      });
    } else {
      const newProvider: Provider = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        totalOrders: 0,
        totalDeliveries: 0,
        balance: 0,
      };
      setProviders([...providers, newProvider]);
      toast({
        title: t('providers.created'),
        description: `${formData.name} ${t('providers.createdDesc')}`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    setProviders(providers.filter(p => p.id !== providerId));
    toast({
      title: t('providers.deleted'),
      description: `${provider?.name} ${t('providers.deletedDesc')}`,
      variant: "destructive",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalBalance = providers.reduce((sum, p) => sum + p.balance, 0);
  const totalOrders = providers.reduce((sum, p) => sum + p.totalOrders, 0);
  const totalDeliveries = providers.reduce((sum, p) => sum + p.totalDeliveries, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold gold-text">{t('providers.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('providers.subtitle')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gold-gradient text-background font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                {t('providers.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="surface-card border-border/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-display">
                  {editingProvider ? t('providers.edit') : t('providers.create')}
                </DialogTitle>
                <DialogDescription>
                  {editingProvider ? t('providers.editDesc') : t('providers.createDesc')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('providers.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('providers.namePlaceholder')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('providers.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('providers.emailPlaceholder')}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" className="gold-gradient text-background font-semibold">
                    {editingProvider ? t('common.save') : t('common.create')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="surface-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Package className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{providers.length}</p>
                  <p className="text-sm text-muted-foreground">{t('providers.totalProviders')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                  <p className="text-sm text-muted-foreground">{t('providers.totalOrders')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                  <p className="text-sm text-muted-foreground">{t('providers.totalBalance')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Providers Table */}
        <Card className="surface-card border-border/50">
          <CardHeader>
            <CardTitle>{t('providers.list')}</CardTitle>
            <CardDescription>{t('providers.listDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('providers.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>{t('providers.provider')}</TableHead>
                    <TableHead className="text-center">{t('providers.orders')}</TableHead>
                    <TableHead className="text-center">{t('providers.deliveries')}</TableHead>
                    <TableHead className="text-right">{t('providers.balance')}</TableHead>
                    <TableHead className="text-right">{t('providers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {provider.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {provider.totalOrders}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {provider.totalDeliveries}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-amber-400">
                        {formatCurrency(provider.balance)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(provider)}
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(provider.id)}
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProviders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t('providers.noResults')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
