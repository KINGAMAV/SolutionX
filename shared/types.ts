// ============================================================================
// User & Authentication Types
// ============================================================================

export type UserRole = "resident" | "delivery_person" | "shop" | "artisan" | "admin";

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  role: UserRole;
  language: "FR" | "EN";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Resident Types
// ============================================================================

export interface House {
  id: string;
  house_number: string;
  block: string;
  resident_id: string;
  created_at: string;
}

export interface Resident {
  user_id: string;
  house_id: string;
  dues_amount: number;
  last_dues_paid: string | null;
  rating_avg: number;
  total_reviews: number;
}

// ============================================================================
// Delivery Person Types
// ============================================================================

export interface DeliveryPerson {
  user_id: string;
  is_available: boolean;
  current_lat: number | null;
  current_lng: number | null;
  total_gains: number;
  rating_avg: number;
  total_deliveries: number;
}

export interface DeliveryMission {
  id: string;
  order_id: string;
  delivery_person_id: string;
  status: "assigned" | "accepted" | "pickup" | "in_transit" | "delivered" | "failed";
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  scanned_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Shop & Products Types
// ============================================================================

export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  validated_by: string | null;
  is_active: boolean;
  rating_avg: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  photo_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderType = "groceries" | "gas" | "errand" | "grouped";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "in_transit"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "card" | "orange_money" | "mtn_money" | "wave";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Order {
  id: string;
  resident_id: string;
  type: OrderType;
  shop_id: string | null;
  status: OrderStatus;
  total_amount: number;
  delivery_fee: number;
  delivery_time_slot: "morning" | "afternoon" | "evening" | "night" | null;
  scheduled_time: string | null;
  delivery_person_id: string | null;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface GroupedOrder {
  id: string;
  house_id: string;
  main_order_id: string;
  created_at: string;
}

// ============================================================================
// Artisan Types
// ============================================================================

export interface Artisan {
  user_id: string;
  trade: string;
  description: string;
  hourly_rate: number;
  validated_by: string | null;
  is_active: boolean;
  rating_avg: number;
  total_reviews: number;
  total_earnings: number;
}

export interface ArtisanSlot {
  id: string;
  artisan_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  is_recurring: boolean;
}

export type AppointmentStatus = "pending" | "accepted" | "rejected" | "in_progress" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  resident_id: string;
  artisan_id: string;
  status: AppointmentStatus;
  requested_time: string;
  completed_time: string | null;
  final_amount: number | null;
  solutionx_commission: number | null;
  artisan_net: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  id: string;
  user_id: string;
  order_id: string | null;
  appointment_id: string | null;
  amount: number;
  method: PaymentMethod;
  transaction_id: string | null;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Promotion Types
// ============================================================================

export type DiscountType = "percentage" | "fixed";

export interface Promotion {
  id: string;
  shop_id: string | null;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  created_at: string;
}

// ============================================================================
// Review Types
// ============================================================================

export type ReviewTargetType = "shop" | "artisan" | "delivery_person";

export interface Review {
  id: string;
  resident_id: string;
  target_type: ReviewTargetType;
  target_id: string;
  rating: number; // 1-5
  comment: string | null;
  created_at: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
