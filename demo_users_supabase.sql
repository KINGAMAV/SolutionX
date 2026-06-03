-- Script SQL complet pour la base de données SolutionX sur Supabase
-- À exécuter dans l'interface SQL Editor de Supabase

-- 1. Mettre à jour la contrainte CHECK pour le rôle 'syndics' si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_role_check'
          AND conrelid = 'public.users'::regclass
    ) THEN
        -- Si la contrainte n'existe pas, la créer avec tous les rôles
        ALTER TABLE users
        ADD CONSTRAINT users_role_check CHECK (role IN ('client', 'agent', 'admin', 'livreur', 'boutique', 'artisan', 'syndics'));
    ELSE
        -- Si la contrainte existe, la modifier pour inclure 'syndics'
        ALTER TABLE users
        DROP CONSTRAINT users_role_check;
        ALTER TABLE users
        ADD CONSTRAINT users_role_check CHECK (role IN ('client', 'agent', 'admin', 'livreur', 'boutique', 'artisan', 'syndics'));
    END IF;
END
$$;

-- 2. Insertion des utilisateurs de démonstration
-- Les mots de passe ne sont pas gérés ici car Supabase Auth gère ses propres mots de passe.
-- Ces utilisateurs seront créés directement dans la table 'public.users' avec un rôle.
-- Pour la connexion via Supabase Auth, il faudra les créer via l'interface Supabase Auth ou via l'API.
-- Cependant, pour la démo, nous allons simuler la connexion via le code de l'application.

INSERT INTO users (name, email, house_number, role, avatar) VALUES
('Admin Démo', 'admin@demo.com', 'HQ', 'admin', 'https://i.pravatar.cc/150?img=1') ON CONFLICT (email) DO UPDATE SET role = 'admin', name = 'Admin Démo', house_number = 'HQ';

INSERT INTO users (name, email, house_number, role, avatar) VALUES
('Livreur Démo', 'livreur@demo.com', 'Zone 4', 'livreur', 'https://i.pravatar.cc/150?img=2') ON CONFLICT (email) DO UPDATE SET role = 'livreur', name = 'Livreur Démo', house_number = 'Zone 4';

INSERT INTO users (name, email, house_number, role, avatar) VALUES
('Client Démo', 'client@demo.com', 'Villa 123', 'client', 'https://i.pravatar.cc/150?img=3') ON CONFLICT (email) DO UPDATE SET role = 'client', name = 'Client Démo', house_number = 'Villa 123';

INSERT INTO users (name, email, house_number, role, avatar) VALUES
('Boutique Démo', 'boutique@demo.com', 'Marché', 'boutique', 'https://i.pravatar.cc/150?img=4') ON CONFLICT (email) DO UPDATE SET role = 'boutique', name = 'Boutique Démo', house_number = 'Marché';

INSERT INTO users (name, email, house_number, role, avatar) VALUES
('Syndic Démo', 'syndic@demo.com', 'Immeuble A', 'syndics', 'https://i.pravatar.cc/150?img=5') ON CONFLICT (email) DO UPDATE SET role = 'syndics', name = 'Syndic Démo', house_number = 'Immeuble A';

INSERT INTO users (name, email, house_number, role, avatar) VALUES
('Prestataire Démo', 'prestataire@demo.com', 'Atelier B', 'artisan', 'https://i.pravatar.cc/150?img=6') ON CONFLICT (email) DO UPDATE SET role = 'artisan', name = 'Prestataire Démo', house_number = 'Atelier B';

-- Note: Pour que ces utilisateurs puissent se connecter via Supabase Auth, vous devrez également les créer
-- dans la table `auth.users` de Supabase avec des mots de passe. Pour cette démo, nous allons contourner
-- cela en simulant la connexion directement dans l'application via les boutons de démo.
