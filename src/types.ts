import { type LucideIcon } from 'lucide-react';

export type UserRole = 'client' | 'agent' | 'admin' | 'livreur' | 'boutique' | 'artisan';

export interface User {
  id: string;
  name: string;
  email: string;
  houseNumber: string;
  avatar?: string;
  role: UserRole;
}

export interface Boutique {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  logo?: string;
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

export interface Product {
  id: string;
  boutiqueId?: string;
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

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id: string;
  userId: string;
  boutiqueId?: string;
  livreurId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  createdAt: string;
  deliveryTime?: string;
}

export interface ArtisanBooking {
  id: string;
  userId: string;
  artisanId: string;
  date: string;
  time: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ParcelDelivery {
  id: string;
  userId: string;
  livreurId?: string;
  pickupAddress: string;
  deliveryAddress: string;
  description: string;
  estimatedPrice: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}
