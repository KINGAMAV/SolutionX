-- Script SQL pour ajouter les fonctionnalités du syndic
-- À exécuter dans l'interface SQL Editor de Supabase

-- Table des cotisations (subscriptions)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des alertes/annonces communautaires (announcements)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL, -- L'auteur est un syndic
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Politiques RLS (Row Level Security) pour les nouvelles tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table subscriptions
-- Les syndics peuvent tout faire
CREATE POLICY "Syndics ALL access to subscriptions" ON subscriptions
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'syndics')) WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'syndics'));

-- Les utilisateurs peuvent voir leurs propres cotisations
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Politiques pour la table announcements
-- Les syndics peuvent tout faire
CREATE POLICY "Syndics ALL access to announcements" ON announcements
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'syndics')) WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'syndics'));

-- Tous les utilisateurs peuvent lire les annonces
CREATE POLICY "All users can view announcements" ON announcements
  FOR SELECT USING (true);

-- Triggers pour updated_at sur les nouvelles tables
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);

-- Insertion de données de test pour les cotisations et annonces (optionnel)
-- Assurez-vous d'avoir des user_id valides dans votre table users pour ces insertions
-- Exemple: Insérer une cotisation en attente pour le client de démo
INSERT INTO subscriptions (user_id, amount, due_date, status) VALUES
((SELECT id FROM users WHERE email = 'client@demo.com'), 5000, '2024-07-01', 'pending') ON CONFLICT DO NOTHING;

-- Exemple: Insérer une alerte par le syndic de démo
INSERT INTO announcements (title, content, author_id) VALUES
('Coupure d''eau prévue', 'Une coupure d''eau est prévue le 15 juin de 9h à 12h pour maintenance.', (SELECT id FROM users WHERE email = 'syndic@demo.com')) ON CONFLICT DO NOTHING;
