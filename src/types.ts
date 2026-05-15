import { type LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  houseNumber: string;
  avatar: string;
}

export interface Artisan {
  id: string;
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

export type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered';

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  createdAt: string;
  deliveryTime?: string;
  carrier?: string;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}
