import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Mail,
  Globe,
  Save,
  RefreshCw,
  Languages
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailDeliveries: true,
    emailReports: false,
    pushOrders: true,
    pushDeliveries: false,
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'Xquadra Trading',
    phone: '+57 300 123 4567',
  });

  const [apiSettings, setApiSettings] = useState({
    goldApiKey: '••••••••••••••••',
    dollarApiKey: '••••••••••••••••',
    refreshInterval: '30',
  });

  const handleSaveProfile = () => {
    toast({
      title: t('profile.updated'),
      description: t('profile.updatedDesc'),
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: t('notifications.updated'),
      description: t('notifications.updatedDesc'),
    });
  };

  const handleSaveApi = () => {
    toast({
      title: t('api.saved'),
      description: t('api.savedDesc'),
    });
  };

  const handleSaveLanguage = () => {
    setLanguage(selectedLanguage);
    toast({
      title: t('language.saved'),
      description: t('language.savedDesc'),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold gold-text">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('settings.subtitle')}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/30 border border-border/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <SettingsIcon className="h-4 w-4 mr-2" />
              {t('settings.profile')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Bell className="h-4 w-4 mr-2" />
              {t('settings.notifications')}
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Languages className="h-4 w-4 mr-2" />
              {t('settings.language')}
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Globe className="h-4 w-4 mr-2" />
              {t('settings.api')}
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Shield className="h-4 w-4 mr-2" />
              {t('settings.security')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="surface-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  {t('profile.title')}
                </CardTitle>
                <CardDescription>
                  {t('profile.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('profile.fullName')}</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">{t('profile.company')}</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('profile.phone')}</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} className="gold-gradient text-background font-semibold">
                    <Save className="h-4 w-4 mr-2" />
                    {t('profile.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="surface-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  {t('notifications.title')}
                </CardTitle>
                <CardDescription>
                  {t('notifications.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t('notifications.email')}
                  </h3>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailOrders">{t('notifications.newOrders')}</Label>
                        <p className="text-sm text-muted-foreground">{t('notifications.newOrdersDesc')}</p>
                      </div>
                      <Switch
                        id="emailOrders"
                        checked={notifications.emailOrders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailOrders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailDeliveries">{t('notifications.deliveries')}</Label>
                        <p className="text-sm text-muted-foreground">{t('notifications.deliveriesDesc')}</p>
                      </div>
                      <Switch
                        id="emailDeliveries"
                        checked={notifications.emailDeliveries}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailDeliveries: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailReports">{t('notifications.weeklyReports')}</Label>
                        <p className="text-sm text-muted-foreground">{t('notifications.weeklyReportsDesc')}</p>
                      </div>
                      <Switch
                        id="emailReports"
                        checked={notifications.emailReports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailReports: checked })}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    {t('notifications.push')}
                  </h3>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushOrders">{t('notifications.orderAlerts')}</Label>
                        <p className="text-sm text-muted-foreground">{t('notifications.orderAlertsDesc')}</p>
                      </div>
                      <Switch
                        id="pushOrders"
                        checked={notifications.pushOrders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushOrders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushDeliveries">{t('notifications.deliveryAlerts')}</Label>
                        <p className="text-sm text-muted-foreground">{t('notifications.deliveryAlertsDesc')}</p>
                      </div>
                      <Switch
                        id="pushDeliveries"
                        checked={notifications.pushDeliveries}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushDeliveries: checked })}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} className="gold-gradient text-background font-semibold">
                    <Save className="h-4 w-4 mr-2" />
                    {t('notifications.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language">
            <Card className="surface-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  {t('language.title')}
                </CardTitle>
                <CardDescription>
                  {t('language.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="language">{t('language.select')}</Label>
                  <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">
                        <span className="flex items-center gap-2">
                          🇪🇸 {t('language.spanish')}
                        </span>
                      </SelectItem>
                      <SelectItem value="en">
                        <span className="flex items-center gap-2">
                          🇺🇸 {t('language.english')}
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveLanguage} className="gold-gradient text-background font-semibold">
                    <Save className="h-4 w-4 mr-2" />
                    {t('language.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card className="surface-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {t('api.title')}
                </CardTitle>
                <CardDescription>
                  {t('api.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="goldApi">{t('api.goldKey')}</Label>
                    <Input
                      id="goldApi"
                      type="password"
                      value={apiSettings.goldApiKey}
                      onChange={(e) => setApiSettings({ ...apiSettings, goldApiKey: e.target.value })}
                      placeholder={t('api.goldKeyPlaceholder')}
                    />
                    <p className="text-xs text-muted-foreground">{t('api.goldKeyHelp')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dollarApi">{t('api.dollarKey')}</Label>
                    <Input
                      id="dollarApi"
                      type="password"
                      value={apiSettings.dollarApiKey}
                      onChange={(e) => setApiSettings({ ...apiSettings, dollarApiKey: e.target.value })}
                      placeholder={t('api.dollarKeyPlaceholder')}
                    />
                    <p className="text-xs text-muted-foreground">{t('api.dollarKeyHelp')}</p>
                  </div>
                </div>
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="refreshInterval">{t('api.refreshInterval')}</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="10"
                    max="300"
                    value={apiSettings.refreshInterval}
                    onChange={(e) => setApiSettings({ ...apiSettings, refreshInterval: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{t('api.refreshIntervalHelp')}</p>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <Button variant="outline" className="border-border/50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('api.testConnection')}
                  </Button>
                  <Button onClick={handleSaveApi} className="gold-gradient text-background font-semibold">
                    <Save className="h-4 w-4 mr-2" />
                    {t('api.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="surface-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('security.title')}
                </CardTitle>
                <CardDescription>
                  {t('security.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('security.changePassword')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('security.currentPassword')}</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div></div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('security.newPassword')}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('security.confirmPassword')}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('security.activeSessions')}</h3>
                  <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t('security.currentSession')}</p>
                        <p className="text-sm text-muted-foreground">{t('security.location')}</p>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{t('security.active')}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end">
                  <Button className="gold-gradient text-background font-semibold">
                    <Save className="h-4 w-4 mr-2" />
                    {t('security.updatePassword')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
