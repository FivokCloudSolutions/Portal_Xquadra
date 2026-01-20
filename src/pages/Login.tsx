import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types';
import { Loader2, Shield, Users, Briefcase } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const roleInfo = {
    admin: {
      label: t('login.admin'),
      description: t('login.adminDesc'),
      icon: Shield,
    },
    proveedor: {
      label: t('login.provider'),
      description: t('login.providerDesc'),
      icon: Briefcase,
    },
    xquadra: {
      label: t('login.xquadra'),
      description: t('login.xquadraDesc'),
      icon: Users,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password, role);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('login.error'));
    }
    
    setIsLoading(false);
  };

  const RoleIcon = roleInfo[role].icon;

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-light shadow-lg">
              <span className="text-2xl font-bold text-primary-foreground">X</span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold gold-text">Xquadra</h1>
              <p className="text-sm text-muted-foreground">Gold Trading Platform</p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-foreground">{t('login.welcome')}</h2>
            <p className="mt-2 text-muted-foreground">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-surface-2 border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-surface-2 border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t('login.userType')}</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger className="h-12 bg-surface-2 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(roleInfo) as UserRole[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      <div className="flex items-center gap-2">
                        {roleInfo[r].label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Role Info Card */}
              <div className="mt-3 flex items-start gap-3 rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RoleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{roleInfo[role].label}</p>
                  <p className="text-sm text-muted-foreground">{roleInfo[role].description}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.entering')}
                </>
              ) : (
                t('login.enter')
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-8 rounded-lg border border-border bg-surface-2 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t('login.demo')}</span> {t('login.demoHint')}{' '}
              <code className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-primary">demo123</code>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="relative hidden w-1/2 overflow-hidden bg-surface-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Abstract gold elements */}
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-gradient-to-tl from-gold/20 to-transparent blur-3xl" />
            
            {/* Central content */}
            <div className="relative z-10 text-center">
              <div className="mb-8 inline-flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-gold to-gold-light shadow-2xl animate-glow">
                <span className="text-6xl font-bold text-primary-foreground">X</span>
              </div>
              <h3 className="font-display text-4xl font-semibold text-foreground">
                {t('login.tagline')}<br />
                <span className="gold-text">{t('login.taglineGold')}</span>
              </h3>
              <p className="mt-4 max-w-xs text-muted-foreground">
                {t('login.platformDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    </div>
  );
}
