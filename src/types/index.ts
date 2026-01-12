export type UserRole = 'admin' | 'proveedor' | 'xquadra';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'completed';

export interface Order {
  id: string;
  providerId: string;
  providerName: string;
  grams: number;
  negotiationPercentage: number;
  goldPrice: number | null;
  dollarPrice: number | null;
  finalPrice: number | null;
  status: OrderStatus;
  createdAt: Date;
  completedAt: Date | null;
}

export interface Delivery {
  id: string;
  providerId: string;
  providerName: string;
  grams: number;
  deliveredAt: Date;
  notes: string;
}

export interface PriceData {
  goldOunce: number;
  dollarRate: number;
  lastUpdated: Date;
  goldChange: number;
  dollarChange: number;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalDeliveries: number;
  balance: number;
}
