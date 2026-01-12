import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    email: 'admin@xquadra.com',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date(),
  },
  proveedor: {
    id: '2',
    email: 'proveedor@example.com',
    name: 'Proveedor Demo',
    role: 'proveedor',
    createdAt: new Date(),
  },
  xquadra: {
    id: '3',
    email: 'usuario@xquadra.com',
    name: 'Usuario Xquadra',
    role: 'xquadra',
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulated login - replace with real auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password === 'demo123') {
      setUser({ ...demoUsers[role], email });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
