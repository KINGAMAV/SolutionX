# Configuration Supabase pour SolutionX

Ce guide explique comment configurer Supabase pour le projet SolutionX.

## Prérequis

- Un compte Supabase (https://supabase.com)
- Supabase CLI installé (`npm install -g supabase`)
- Node.js et npm

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com et connectez-vous
2. Cliquez sur "New Project"
3. Remplissez les informations :
   - **Name** : SolutionX
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Sélectionnez la région la plus proche (ex: Europe - eu-west-1)
4. Cliquez sur "Create new project"

### 2. Obtenir les clés d'accès

Une fois le projet créé :

1. Allez dans **Settings** → **API**
2. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_test_key
```

### 4. Exécuter les migrations

#### Option A : Via Supabase CLI (Recommandé)

```bash
# Installer Supabase CLI
npm install -g supabase

# Initialiser Supabase localement (optionnel)
supabase init

# Appliquer les migrations
supabase db push
```

#### Option B : Via l'interface Supabase

1. Allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez le contenu de `supabase/migrations/001_initial_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run**

### 5. Charger les données de test (optionnel)

1. Allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez le contenu de `supabase/seed.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run**

### 6. Configurer l'authentification

#### Email/Password

1. Allez dans **Authentication** → **Providers**
2. Activez **Email** si ce n'est pas déjà fait
3. Configurez les templates d'email si nécessaire

#### URLs de redirection

1. Allez dans **Authentication** → **URL Configuration**
2. Ajoutez les URLs autorisées :
   - `http://localhost:3000`
   - `https://your-domain.com` (votre domaine de production)

### 7. Configurer Row Level Security (RLS)

Les politiques RLS sont déjà définies dans le schéma SQL. Vérifiez qu'elles sont activées :

1. Allez dans **Authentication** → **Policies**
2. Vérifiez que RLS est activé pour toutes les tables

### 8. Configurer le stockage (optionnel)

Si vous avez besoin de stocker des fichiers (photos de produits, etc.) :

1. Allez dans **Storage**
2. Créez un nouveau bucket nommé `products`
3. Configurez les permissions publiques si nécessaire

## Structure des tables

| Table | Description |
|-------|-------------|
| `users` | Tous les utilisateurs (résidents, livreurs, boutiques, artisans, admins) |
| `residents` | Profils des résidents |
| `delivery_persons` | Profils des livreurs |
| `shops` | Profils des boutiques |
| `products` | Produits des boutiques |
| `orders` | Commandes |
| `order_items` | Articles des commandes |
| `artisans` | Profils des artisans |
| `artisan_slots` | Créneaux de disponibilité des artisans |
| `appointments` | Rendez-vous avec les artisans |
| `delivery_missions` | Missions de livraison |
| `payments` | Paiements |
| `promotions` | Codes promotionnels |
| `reviews` | Avis et évaluations |

## Utilisateurs de test

Les données de test incluent :

| Email | Rôle | Mot de passe |
|-------|------|-------------|
| admin@solutionx.local | Admin | À configurer |
| resident@solutionx.local | Résident | À configurer |
| delivery@solutionx.local | Livreur | À configurer |
| shop@solutionx.local | Boutique | À configurer |
| artisan@solutionx.local | Artisan | À configurer |

## Dépannage

### Erreur : "Permission denied"
- Vérifiez que RLS est correctement configuré
- Vérifiez que l'utilisateur a les bonnes permissions

### Erreur : "Invalid API key"
- Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont corrects
- Vérifiez que le fichier `.env.local` est dans le répertoire racine

### Les migrations ne s'appliquent pas
- Vérifiez que vous êtes connecté à Supabase CLI : `supabase login`
- Vérifiez le chemin du fichier de migration

## Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
