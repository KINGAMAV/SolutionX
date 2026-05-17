-- Script SQL complet pour la base de données SolutionX sur Supabase
-- À exécuter dans l'interface SQL Editor de Supabase

-- Création des tables principales

-- Suppression des anciennes tables pour éviter les conflits
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS artisan_bookings CASCADE;
DROP TABLE IF EXISTS artisans CASCADE;
DROP TABLE IF EXISTS parcel_deliveries CASCADE;
DROP TABLE IF EXISTS boutiques CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table des utilisateurs
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- Rendu optionnel car Supabase gère déjà les mots de passe
  house_number TEXT NOT NULL DEFAULT '',
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'agent', 'admin', 'livreur', 'boutique', 'artisan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des boutiques / restaurants
CREATE TABLE boutiques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des artisans
CREATE TABLE artisans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  experience INTEGER NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  hourly_rate INTEGER NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  specialty TEXT,
  zones TEXT[] NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  unit TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE,
  livreur_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
  total INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_time TEXT
);

-- Table des items de commande
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations d'artisans
CREATE TABLE artisan_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  artisan_id UUID REFERENCES artisans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des livraisons de colis
CREATE TABLE parcel_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  livreur_id UUID REFERENCES users(id) ON DELETE SET NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  description TEXT,
  estimated_price INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'delivering', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion des données de test

-- Utilisateurs de test
INSERT INTO users (name, email, password_hash, house_number, role, avatar) VALUES
('Jean-Marc', 'jeanmarc@example.com', '$2b$10$dummy.hash.for.demo', 'Villa 124', 'client', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3'),
('Admin Global', 'admin@example.com', '$2b$10$dummy.hash.for.demo', 'HQ', 'admin', NULL),
('Agent Connect', 'agent@example.com', '$2b$10$dummy.hash.for.demo', 'HQ', 'agent', NULL),
('Boutique Maquis', 'boutique@example.com', '$2b$10$dummy.hash.for.demo', 'Zone 4', 'boutique', NULL),
('Moussa Livreur', 'livreur@example.com', '$2b$10$dummy.hash.for.demo', 'Cocody', 'livreur', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP5WWIGcnMzAqHjkVs78766LybBNTgzYfuy2ypdWigqLRvNeryJj7Wi_6v9RciTgLg2whU9lgg2sri2D4Hizh_650HyCIwKqQkpH-IoXZakbHCQv1Nn_zvR86KhC_pQULscsn0Z3iUp2hKgCKWpXjL_YJjunPm6QqWeepHcBHsM0dJDU4g05vJDUGd10v7HYBXHbTk4NoqiBR3j8V6z-LH8qpitBlcEFOqhsVTeQpPFjTXnkV9OnGmhOgpVEjCDE8r7ZncVfxHhrtj');

-- Boutiques de test
INSERT INTO boutiques (owner_id, name, category, address) VALUES
((SELECT id FROM users WHERE email = 'boutique@example.com'), 'Maquis Le Tiek', 'Restaurant', 'Zone 4, Rue des Jardins');

-- Artisans de test
INSERT INTO artisans (name, category, experience, rating, hourly_rate, verified, specialty, zones, avatar) VALUES
('Koffi Kouassi', 'Electricien', 12, 4.9, 15000, true, 'Expert Électricien', ARRAY['Cocody', 'Riviera', 'Bingerville'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSjzHWp6PmNFxRSa7WNvGVem9xucSM89puNb3c8ODo-dFPiAzmRwKPGT0d0xtF8sMjt-kYgVegyTb4SlhyhEZkP6p9Q6TB9ftVfanSxjEz1NXna83L-ynDjjrCsm_rl5QjbVFvJUavjmHz897nM1-LBRiJqGGI97fiHTP8ApocaFzFrcC4zNk1A4CD8XcjWqlAoGYm5R7n8TMKebUPk6ltWwa_C5zlKxtNWkC7on5WXHpYWM2Psvu66o-lBURCJuHINQEVhvBUUmvA');

-- Produits de test
INSERT INTO products (boutique_id, name, category, price, unit, image) VALUES
((SELECT id FROM boutiques LIMIT 1), 'Sac de Riz (5kg)', 'Céréales', 4500, '5kg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdhsrtZPXBCLLKZj-f8mHWNveZHN7GMZ-pm7voTVC9HPMqcD6avK_f6ZRYdE1YP-1pbP5Q3VWNDreOtqDquugXaoGjnXmzyaurnsOQbPqVAILvOVn_ITR3nzRSoS42cEOrRNt0iB6KjN1BKe46AGbpyYbOh6s2jDISJI1Q2EmtXJONp_MAu6pa-aUhY8mjXyrywOqUdZMjZRUjFqFSFluuXcK5G_NeTYwnRqQn4KIS0Sz1fepvn1BIt3cD6mINcXZqIJ0jFycsbWJg'),
((SELECT id FROM boutiques LIMIT 1), 'Pack Eau Minérale (6x1.5L)', 'Boissons', 2500, 'Pack', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6KTrl7NDzMck2UcVkDF9Bp1hKukL3mCXpvM7mCWAuCm6d3Pmv8_kDyX2afwz5FNbbYPIaZMmm-vZ1GCvFzSNnoTUeSohEacjNmsDdVEoW5OCb07lQSBlILK92ToWnac2Z3Hzrn7PGE71Z35bfSw_UZPeDDtMuA9LJz0132Ma15cdlEsGraZV45NT-Q2df3hboR5DRgxdPk3dglCSfdHeAOVHMIG2zx6wh9E0GKvygfVZq4U_qKT4qivBO6NXmFT9cHHyOtHg5bYbo');

-- Commande de test
INSERT INTO orders (id, user_id, boutique_id, livreur_id, status, total, delivery_fee, created_at, delivery_time) VALUES
('SOL-92834', (SELECT id FROM users WHERE email = 'jeanmarc@example.com'), (SELECT id FROM boutiques LIMIT 1), (SELECT id FROM users WHERE email = 'livreur@example.com'), 'delivering', 16000, 1500, NOW(), '14:45');

-- Items de la commande de test
INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES
('SOL-92834', (SELECT id FROM products WHERE name = 'Sac de Riz (5kg)'), '2x Poulet Braisé ATTIÉKÉ', 12000, 2);

-- Politiques RLS (Row Level Security) pour Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_deliveries ENABLE ROW LEVEL SECURITY;

-- Politiques sommaires pour le développement (à durcir en prod)
CREATE POLICY "Public Read Access" ON users FOR SELECT USING (true);
CREATE POLICY "Public Update Access" ON users FOR UPDATE USING (true);
CREATE POLICY "Public Insert Access" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Access" ON boutiques FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON artisans FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON products FOR SELECT USING (true);

CREATE POLICY "Public All Access" ON orders FOR ALL USING (true);
CREATE POLICY "Public All Access" ON order_items FOR ALL USING (true);
CREATE POLICY "Public All Access" ON artisan_bookings FOR ALL USING (true);
CREATE POLICY "Public All Access" ON parcel_deliveries FOR ALL USING (true);

-- Index pour les performances
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_boutique_id ON orders(boutique_id);
CREATE INDEX idx_orders_livreur_id ON orders(livreur_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_artisan_bookings_user_id ON artisan_bookings(user_id);
CREATE INDEX idx_artisan_bookings_artisan_id ON artisan_bookings(artisan_id);
CREATE INDEX idx_parcel_deliveries_user_id ON parcel_deliveries(user_id);
CREATE INDEX idx_parcel_deliveries_livreur_id ON parcel_deliveries(livreur_id);

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour synchroniser les nouveaux utilisateurs Supabase Auth vers notre table publique `users`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, house_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'houseNumber', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_boutiques_updated_at BEFORE UPDATE ON boutiques FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisan_bookings_updated_at BEFORE UPDATE ON artisan_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parcel_deliveries_updated_at BEFORE UPDATE ON parcel_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();