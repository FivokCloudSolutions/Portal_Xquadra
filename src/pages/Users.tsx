import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, Trash2, Search, Shield, Users as UsersIcon, Truck } from 'lucide-react';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  status: 'active' | 'inactive';
}

// Demo users data
const demoUsers: UserData[] = [
  { id: '1', name: 'Administrador Principal', email: 'admin@xquadra.com', role: 'admin', createdAt: new Date('2024-01-01'), status: 'active' },
  { id: '2', name: 'Proveedor Oro S.A.', email: 'proveedor1@example.com', role: 'proveedor', createdAt: new Date('2024-02-15'), status: 'active' },
  { id: '3', name: 'Minera del Norte', email: 'proveedor2@example.com', role: 'proveedor', createdAt: new Date('2024-03-10'), status: 'active' },
  { id: '4', name: 'Usuario Xquadra 1', email: 'usuario1@xquadra.com', role: 'xquadra', createdAt: new Date('2024-04-05'), status: 'active' },
  { id: '5', name: 'Usuario Xquadra 2', email: 'usuario2@xquadra.com', role: 'xquadra', createdAt: new Date('2024-05-20'), status: 'inactive' },
];

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="h-4 w-4" />,
  proveedor: <Truck className="h-4 w-4" />,
  xquadra: <UsersIcon className="h-4 w-4" />,
};

const roleBadgeVariants: Record<UserRole, string> = {
  admin: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  proveedor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  xquadra: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function Users() {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<UserData[]>(demoUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'xquadra' as UserRole,
    password: '',
  });

  const roleLabels: Record<UserRole, string> = {
    admin: t('users.roleAdmin'),
    proveedor: t('users.roleProvider'),
    xquadra: t('users.roleXquadra'),
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenDialog = (user?: UserData) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'xquadra',
        password: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: formData.name, email: formData.email, role: formData.role }
          : u
      ));
      toast({
        title: t('users.updated'),
        description: `${formData.name} ${t('users.updatedDesc')}`,
      });
    } else {
      const newUser: UserData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date(),
        status: 'active',
      };
      setUsers([...users, newUser]);
      toast({
        title: t('users.created'),
        description: `${formData.name} ${t('users.createdDesc')}`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: t('users.deleted'),
      description: `${user?.name} ${t('users.deletedDesc')}`,
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold gold-text">{t('users.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('users.subtitle')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gold-gradient text-background font-semibold">
                <UserPlus className="h-4 w-4 mr-2" />
                {t('users.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="surface-card border-border/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-display">
                  {editingUser ? t('users.edit') : t('users.create')}
                </DialogTitle>
                <DialogDescription>
                  {editingUser ? t('users.editDesc') : t('users.createDesc')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('users.fullName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('users.namePlaceholder')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('users.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('users.emailPlaceholder')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('users.role')}</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('users.selectRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t('users.roleAdmin')}</SelectItem>
                      <SelectItem value="proveedor">{t('users.roleProvider')}</SelectItem>
                      <SelectItem value="xquadra">{t('users.roleXquadra')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('users.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      required={!editingUser}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" className="gold-gradient text-background font-semibold">
                    {editingUser ? t('common.save') : t('common.create')}
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
                  <Shield className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                  <p className="text-sm text-muted-foreground">{t('users.admins')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Truck className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'proveedor').length}</p>
                  <p className="text-sm text-muted-foreground">{t('users.providers')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <UsersIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'xquadra').length}</p>
                  <p className="text-sm text-muted-foreground">{t('users.xquadraUsers')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="surface-card border-border/50">
          <CardHeader>
            <CardTitle>{t('users.systemUsers')}</CardTitle>
            <CardDescription>{t('users.systemUsersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('users.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder={t('users.filterRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                  <SelectItem value="admin">{t('users.roleAdmin')}</SelectItem>
                  <SelectItem value="proveedor">{t('users.roleProvider')}</SelectItem>
                  <SelectItem value="xquadra">{t('users.roleXquadra')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>{t('users.user')}</TableHead>
                    <TableHead>{t('users.role')}</TableHead>
                    <TableHead>{t('users.status')}</TableHead>
                    <TableHead>{t('users.registrationDate')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${roleBadgeVariants[user.role]} flex items-center gap-1.5 w-fit`}>
                          {roleIcons[user.role]}
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={user.status === 'active' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }
                        >
                          {user.status === 'active' ? t('users.active') : t('users.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(user)}
                            className="h-8 w-8 hover:bg-amber-500/10 hover:text-amber-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {t('users.noResults')}
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
