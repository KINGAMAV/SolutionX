-- ============================================================================
-- SolutionX Seed Data
-- ============================================================================
-- This file contains initial data for testing and development

-- Insert test admin user (password: admin123)
INSERT INTO users (id, email, phone, full_name, role, language, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@solutionx.local',
  '+225 01 23 45 67',
  'Admin SolutionX',
  'admin',
  'FR',
  true
) ON CONFLICT DO NOTHING;

-- Insert test resident user
INSERT INTO users (id, email, phone, full_name, role, language, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'resident@solutionx.local',
  '+225 07 12 34 56',
  'Jean Dupont',
  'resident',
  'FR',
  true
) ON CONFLICT DO NOTHING;

-- Insert test delivery person user
INSERT INTO users (id, email, phone, full_name, role, language, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'delivery@solutionx.local',
  '+225 07 98 76 54',
  'Ahmed Livreur',
  'delivery_person',
  'FR',
  true
) ON CONFLICT DO NOTHING;

-- Insert test shop user
INSERT INTO users (id, email, phone, full_name, role, language, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'shop@solutionx.local',
  '+225 07 55 55 55',
  'Boutique Centrale',
  'shop',
  'FR',
  true
) ON CONFLICT DO NOTHING;

-- Insert test artisan user
INSERT INTO users (id, email, phone, full_name, role, language, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'artisan@solutionx.local',
  '+225 07 77 77 77',
  'Kofi Électricien',
  'artisan',
  'FR',
  true
) ON CONFLICT DO NOTHING;

-- Insert test houses
INSERT INTO houses (id, house_number, block, resident_id)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'A001', 'Block A', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000002', 'A002', 'Block A', NULL),
  ('10000000-0000-0000-0000-000000000003', 'B001', 'Block B', NULL)
ON CONFLICT DO NOTHING;

-- Insert test resident profile
INSERT INTO residents (user_id, house_id, dues_amount, rating_avg)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000001',
  5000,
  4.5
) ON CONFLICT DO NOTHING;

-- Insert test delivery person profile
INSERT INTO delivery_persons (user_id, is_available, current_lat, current_lng, total_gains, rating_avg)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  true,
  6.8276,
  -5.2893,
  150000,
  4.8
) ON CONFLICT DO NOTHING;

-- Insert test shops
INSERT INTO shops (id, name, address, phone, lat, lng, validated_by, is_active, rating_avg)
VALUES 
  (
    '20000000-0000-0000-0000-000000000001',
    'Marché Frais',
    '123 Avenue Principale, Cité Résidentielle',
    '+225 01 23 45 67',
    6.8270,
    -5.2900,
    '00000000-0000-0000-0000-000000000001',
    true,
    4.6
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Supermarché Express',
    '456 Rue du Commerce, Cité Résidentielle',
    '+225 01 98 76 54',
    6.8280,
    -5.2880,
    '00000000-0000-0000-0000-000000000001',
    true,
    4.3
  )
ON CONFLICT DO NOTHING;

-- Insert test products
INSERT INTO products (id, shop_id, name, description, price, stock, is_available)
VALUES 
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Riz blanc 5kg',
    'Riz blanc de qualité supérieure',
    8500,
    50,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'Huile de palme 5L',
    'Huile de palme pure',
    12000,
    30,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    'Pain frais',
    'Pain complet du jour',
    2500,
    100,
    true
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000002',
    'Lait 1L',
    'Lait frais pasteurisé',
    3500,
    80,
    true
  )
ON CONFLICT DO NOTHING;

-- Insert test artisan profile
INSERT INTO artisans (user_id, trade, description, hourly_rate, validated_by, is_active, rating_avg)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'Électricien',
  'Électricien expérimenté avec 10 ans d''expérience',
  15000,
  '00000000-0000-0000-0000-000000000001',
  true,
  4.9
) ON CONFLICT DO NOTHING;

-- Insert test artisan slots
INSERT INTO artisan_slots (id, artisan_id, day_of_week, start_time, end_time, is_recurring)
VALUES 
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 1, '08:00', '17:00', true),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 2, '08:00', '17:00', true),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 3, '08:00', '17:00', true),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 4, '08:00', '17:00', true),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 5, '08:00', '17:00', true)
ON CONFLICT DO NOTHING;

-- Insert test promotions
INSERT INTO promotions (id, shop_id, code, discount_type, discount_value, valid_from, valid_to, is_active)
VALUES 
  (
    '50000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'BIENVENUE10',
    'percentage',
    10,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    true
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'PROMO500',
    'fixed',
    500,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    true
  )
ON CONFLICT DO NOTHING;
