-- Supabase migration : ajouter le suivi des moyens de paiement et une table de souscriptions pour les cotisations
-- Exécuter dans l'éditeur SQL de Supabase

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT;

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('cotisation', 'abonnement_boutique', 'syndic_subscription')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  amount INTEGER NOT NULL DEFAULT 0,
  due_date DATE,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow public select subscriptions" ON subscriptions
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow update subscriptions" ON subscriptions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
