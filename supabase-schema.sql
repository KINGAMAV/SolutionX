-- Script SQL complet pour la base de données SolutionX sur Supabase
-- À exécuter dans l'interface SQL Editor de Supabase

-- Création des tables principales

-- Table des utilisateurs
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  house_number TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des artisans
CREATE TABLE artisans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'preparing', 'ready', 'delivering', 'delivered')),
  total INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_time TEXT,
  carrier TEXT
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
INSERT INTO users (name, email, password_hash, house_number, avatar) VALUES
('Jean-Marc', 'jeanmarc@example.com', '$2b$10$dummy.hash.for.demo', 'Villa 124', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3'),
('Marie Dupont', 'marie@example.com', '$2b$10$dummy.hash.for.demo', 'Appartement 3B', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3');

-- Artisans de test
INSERT INTO artisans (name, category, experience, rating, hourly_rate, verified, specialty, zones, avatar) VALUES
('Koffi Kouassi', 'Electricien', 12, 4.9, 15000, true, 'Expert Électricien', ARRAY['Cocody', 'Riviera', 'Bingerville'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSjzHWp6PmNFxRSa7WNvGVem9xucSM89puNb3c8ODo-dFPiAzmRwKPGT0d0xtF8sMjt-kYgVegyTb4SlhyhEZkP6p9Q6TB9ftVfanSxjEz1NXna83L-ynDjjrCsm_rl5QjbVFvJUavjmHz897nM1-LBRiJqGGI97fiHTP8ApocaFzFrcC4zNk1A4CD8XcjWqlAoGYm5R7n8TMKebUPk6ltWwa_C5zlKxtNWkC7on5WXHpYWM2Psvu66o-lBURCJuHINQEVhvBUUmvA'),
('Aminata Diallo', 'Menuiserie', 8, 4.7, 12000, true, 'Menuiserie • Design intérieur', ARRAY['Marcory', 'Zone 4'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaixwngHHUaD6cM8UCJ5zWjKnGXWppOyuvgOB48D0W9GAWJODWR2sAGc4eTxEDiBU96sRQPiC3gqCfVgmwGSYr5SBcElstsZzGAS43ORrFDoDD1nCFa4lQEkfTA1bX_2JI0o-UVAHDBjqDVb38c7KUiw6rCWF6D9YR37BvIIBI2CgSy4yWoPnw394xkUHFszqa12KgDy-4yIz0I4ypahK9rmwBgmR3O-XgB3FpYM59Zt3ViU0VAE4efolqBOSWOiDHJtiM1Hdr0hhj'),
('Moussa Traoré', 'Plomberie', 15, 4.8, 10000, true, 'Plomberie • Dépannage 24/7', ARRAY['Plateau', 'Adjamé'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP5WWIGcnMzAqHjkVs78766LybBNTgzYfuy2ypdWigqLRvNeryJj7Wi_6v9RciTgLg2whU9lgg2sri2D4Hizh_650HyCIwKqQkpH-IoXZakbHCQv1Nn_zvR86KhC_pQULscsn0Z3iUp2hKgCKWpXjL_YJjunPm6QqWeepHcBHsM0dJDU4g05vJDUGd10v7HYBXHbTk4NoqiBR3j8V6z-LH8qpitBlcEFOqhsVTeQpPFjTXnkV9OnGmhOgpVEjCDE8r7ZncVfxHhrtj');

-- Produits de test
INSERT INTO products (name, category, price, unit, image) VALUES
('Sac de Riz (5kg)', 'Céréales', 4500, '5kg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdhsrtZPXBCLLKZj-f8mHWNveZHN7GMZ-pm7voTVC9HPMqcD6avK_f6ZRYdE1YP-1pbP5Q3VWNDreOtqDquugXaoGjnXmzyaurnsOQbPqVAILvOVn_ITR3nzRSoS42cEOrRNt0iB6KjN1BKe46AGbpyYbOh6s2jDISJI1Q2EmtXJONp_MAu6pa-aUhY8mjXyrywOqUdZMjZRUjFqFSFluuXcK5G_NeTYwnRqQn4KIS0Sz1fepvn1BIt3cD6mINcXZqIJ0jFycsbWJg'),
('Huile de palme (1L)', 'Épicerie', 1200, '1L', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi0J2TeVnv1pB62BZUZxwuPM036rRwYXrsoufLIwrjqkHWnTKpMax6OOVddFqBTX6iaINjRJPW_wBUiCcMw3LEV2X3gVTg2CwpZkiYWXS3EwKSFXaL9EVTcBD0Hwnu7hu4-9M_51mJeHJzQZ2slHGFY2O6Gsu4jRI3o3kdFk_yBpnAewmIKKcRljRU8mwR8tWBMN1WzDXPuZe2IKZOOat-N0h2ES0ENV1ZZRjl_WOavRuUWbMLf4jOuk1hPI36l-adNs2CEfzGN9Ch'),
('Tomates Fraîches (1kg)', 'Légumes', 800, '1kg', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTIcHcV2DWjdrVC33iCv8AX2wknppHpjD6lLBuj3jigNPDQIEGUrbmiytOz3ZoNxGdjQk7oYLkRBvBqBeMUXZvZnRql_yhCklq88qbE-LWnU4qRm13j6miEzbYpD4FrxeNi-QlwHzvnK0yIOIrn-Eso-pkJaShCTU6yIX6akNKuCqdnm-Oqosm7vfAQ-_p7vxJXFoHcdWLU9sdNSXKNloljMah8RHKvr69M4Glb-Bj7TOAxm9s706Far0vZRAeiS8vWjVLgQr0hQxL'),
('Pack Eau Minérale (6x1.5L)', 'Boissons', 2500, 'Pack', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6KTrl7NDzMck2UcVkDF9Bp1hKukL3mCXpvM7mCWAuCm6d3Pmv8_kDyX2afwz5FNbbYPIaZMmm-vZ1GCvFzSNnoTUeSohEacjNmsDdVEoW5OCb07lQSBlILK92ToWnac2Z3Hzrn7PGE71Z35bfSw_UZPeDDtMuA9LJz0132Ma15cdlEsGraZV45NT-Q2df3hboR5DRgxdPk3dglCSfdHeAOVHMIG2zx6wh9E0GKvygfVZq4U_qKT4qivBO6NXmFT9cHHyOtHg5bYbo');

-- Commande de test
INSERT INTO orders (id, user_id, status, total, delivery_fee, created_at, delivery_time, carrier) VALUES
('SOL-92834', (SELECT id FROM users WHERE email = 'jeanmarc@example.com'), 'delivering', 16000, 1500, NOW(), '14:45', 'Moussa');

-- Items de la commande de test
INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES
('SOL-92834', (SELECT id FROM products WHERE name = 'Sac de Riz (5kg)'), '2x Poulet Braisé ATTIÉKÉ', 12000, 2),
('SOL-92834', (SELECT id FROM products WHERE name = 'Huile de palme (1L)'), '1x Alloco (Format Large)', 2500, 1);

-- Politiques RLS (Row Level Security) pour Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_deliveries ENABLE ROW LEVEL SECURITY;

-- Politiques pour les utilisateurs (chaque utilisateur ne voit que ses propres données)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les commandes
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les items de commande
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Politiques pour les réservations d'artisans
CREATE POLICY "Users can view own bookings" ON artisan_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON artisan_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les livraisons de colis
CREATE POLICY "Users can view own parcels" ON parcel_deliveries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own parcels" ON parcel_deliveries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques publiques (tout le monde peut voir)
CREATE POLICY "Anyone can view artisans" ON artisans FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Index pour les performances
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_artisan_bookings_user_id ON artisan_bookings(user_id);
CREATE INDEX idx_artisan_bookings_artisan_id ON artisan_bookings(artisan_id);
CREATE INDEX idx_parcel_deliveries_user_id ON parcel_deliveries(user_id);

-- Fonctions utilitaires
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisan_bookings_updated_at BEFORE UPDATE ON artisan_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parcel_deliveries_updated_at BEFORE UPDATE ON parcel_deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();