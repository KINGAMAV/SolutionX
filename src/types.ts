import { type LucideIcon } from 'lucide-react';

export type UserRole = 'client' | 'artisan' | 'boutique' | 'livreur' | 'agent' | 'admin' | 'syndics';

export interface User {
  id: string;
  name: string;
  email: string;
  houseNumber: string;
  avatar: string;
  role: UserRole;
}

export interface Artisan {
  id: string;
  userId?: string;
  name: string;
  category: string;
  experience: number;
  rating: number;
  hourlyRate: number;
  verified: boolean;
  specialty: string;
  zones: string[];
  avatar: string;
}

export interface Boutique {
  id: string;
  userId?: string;
  ownerId?: string;
  name: string;
  category: string;
  address?: string;
  rating: number;
  image?: string;
  logo?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  boutiqueId?: string;
  livreurId?: string;
  artisanId?: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid';
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  createdAt: string;
  deliveryTime?: string;
  carrier?: string;
  latitude?: number;
  longitude?: number;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}
