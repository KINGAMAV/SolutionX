-- ============================================================================
-- SolutionX Database Schema
-- ============================================================================
-- This migration creates the complete database schema for SolutionX PWA
-- with Row Level Security (RLS) policies for multi-role access control

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Users Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('resident', 'delivery_person', 'shop', 'artisan', 'admin')),
  language VARCHAR(2) DEFAULT 'FR' CHECK (language IN ('FR', 'EN')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- Houses Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_number VARCHAR(50) NOT NULL,
  block VARCHAR(50) NOT NULL,
  resident_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(house_number, block)
);

CREATE INDEX idx_houses_resident_id ON houses(resident_id);

-- ============================================================================
-- Residents Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS residents (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE RESTRICT,
  dues_amount DECIMAL(10, 2) DEFAULT 0,
  last_dues_paid TIMESTAMP WITH TIME ZONE,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_residents_house_id ON residents(house_id);

-- ============================================================================
-- Delivery Persons Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS delivery_persons (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT false,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  total_gains DECIMAL(12, 2) DEFAULT 0,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Shops Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  validated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT false,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shops_is_active ON shops(is_active);
CREATE INDEX idx_shops_validated_by ON shops(validated_by);

-- ============================================================================
-- Products Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  photo_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_is_available ON products(is_available);

-- ============================================================================
-- Orders Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(user_id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('groceries', 'gas', 'errand', 'grouped')),
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered', 'cancelled')),
  total_amount DECIMAL(12, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  delivery_time_slot VARCHAR(50) CHECK (delivery_time_slot IN ('morning', 'afternoon', 'evening', 'night')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  delivery_person_id UUID REFERENCES delivery_persons(user_id) ON DELETE SET NULL,
  payment_method VARCHAR(50) CHECK (payment_method IN ('card', 'orange_money', 'mtn_money', 'wave')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_resident_id ON orders(resident_id);
CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_delivery_person_id ON orders(delivery_person_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- Order Items Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- Grouped Orders Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS grouped_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  main_order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grouped_orders_house_id ON grouped_orders(house_id);

-- ============================================================================
-- Artisans Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS artisans (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  trade VARCHAR(100) NOT NULL,
  description TEXT,
  hourly_rate DECIMAL(10, 2),
  validated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT false,
  rating_avg DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artisans_trade ON artisans(trade);
CREATE INDEX idx_artisans_is_active ON artisans(is_active);

-- ============================================================================
-- Artisan Slots Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS artisan_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artisan_id UUID NOT NULL REFERENCES artisans(user_id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true
);

CREATE INDEX idx_artisan_slots_artisan_id ON artisan_slots(artisan_id);

-- ============================================================================
-- Appointments Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(user_id) ON DELETE CASCADE,
  artisan_id UUID NOT NULL REFERENCES artisans(user_id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  requested_time TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_time TIMESTAMP WITH TIME ZONE,
  final_amount DECIMAL(10, 2),
  solutionx_commission DECIMAL(10, 2),
  artisan_net DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_resident_id ON appointments(resident_id);
CREATE INDEX idx_appointments_artisan_id ON appointments(artisan_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================================
-- Delivery Missions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS delivery_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_person_id UUID NOT NULL REFERENCES delivery_persons(user_id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'pickup', 'in_transit', 'delivered', 'failed')),
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  dropoff_lat DECIMAL(10, 8),
  dropoff_lng DECIMAL(11, 8),
  scanned_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_delivery_missions_order_id ON delivery_missions(order_id);
CREATE INDEX idx_delivery_missions_delivery_person_id ON delivery_missions(delivery_person_id);
CREATE INDEX idx_delivery_missions_status ON delivery_missions(status);

-- ============================================================================
-- Payments Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  method VARCHAR(50) NOT NULL CHECK (method IN ('card', 'orange_money', 'mtn_money', 'wave')),
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================================
-- Promotions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotions_shop_id ON promotions(shop_id);
CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);

-- ============================================================================
-- Reviews Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID NOT NULL REFERENCES residents(user_id) ON DELETE CASCADE,
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('shop', 'artisan', 'delivery_person')),
  target_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_resident_id ON reviews(resident_id);
CREATE INDEX idx_reviews_target ON reviews(target_type, target_id);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE grouped_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Users RLS Policies
-- ============================================================================

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- Residents RLS Policies
-- ============================================================================

CREATE POLICY "Residents can view their own profile"
  ON residents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Residents can update their own profile"
  ON residents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all residents"
  ON residents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- Delivery Persons RLS Policies
-- ============================================================================

CREATE POLICY "Delivery persons can view their own profile"
  ON delivery_persons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Delivery persons can update their own profile"
  ON delivery_persons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view available delivery persons"
  ON delivery_persons FOR SELECT
  USING (is_available = true);

-- ============================================================================
-- Shops RLS Policies
-- ============================================================================

CREATE POLICY "Shops can view their own profile"
  ON shops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'shop'
    )
  );

CREATE POLICY "Everyone can view active shops"
  ON shops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage shops"
  ON shops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- Products RLS Policies
-- ============================================================================

CREATE POLICY "Everyone can view available products"
  ON products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Shop owners can manage their products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shops WHERE id = shop_id AND 
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'shop')
    )
  );

-- ============================================================================
-- Orders RLS Policies
-- ============================================================================

CREATE POLICY "Residents can view their own orders"
  ON orders FOR SELECT
  USING (resident_id = auth.uid());

CREATE POLICY "Residents can create orders"
  ON orders FOR INSERT
  WITH CHECK (resident_id = auth.uid());

CREATE POLICY "Delivery persons can view assigned orders"
  ON orders FOR SELECT
  USING (delivery_person_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- Order Items RLS Policies
-- ============================================================================

CREATE POLICY "Users can view order items for their orders"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_id AND resident_id = auth.uid()
    )
  );

-- ============================================================================
-- Artisans RLS Policies
-- ============================================================================

CREATE POLICY "Artisans can view their own profile"
  ON artisans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view active artisans"
  ON artisans FOR SELECT
  USING (is_active = true);

-- ============================================================================
-- Appointments RLS Policies
-- ============================================================================

CREATE POLICY "Residents can view their appointments"
  ON appointments FOR SELECT
  USING (resident_id = auth.uid());

CREATE POLICY "Artisans can view their appointments"
  ON appointments FOR SELECT
  USING (artisan_id = auth.uid());

CREATE POLICY "Residents can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (resident_id = auth.uid());

-- ============================================================================
-- Delivery Missions RLS Policies
-- ============================================================================

CREATE POLICY "Delivery persons can view their missions"
  ON delivery_missions FOR SELECT
  USING (delivery_person_id = auth.uid());

CREATE POLICY "Residents can view their delivery missions"
  ON delivery_missions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE id = order_id AND resident_id = auth.uid()
    )
  );

-- ============================================================================
-- Payments RLS Policies
-- ============================================================================

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- Reviews RLS Policies
-- ============================================================================

CREATE POLICY "Users can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Residents can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (resident_id = auth.uid());

-- ============================================================================
-- Triggers for Updated Timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_persons_updated_at BEFORE UPDATE ON delivery_persons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_missions_updated_at BEFORE UPDATE ON delivery_missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
