# SolutionX - PWA pour Cité Résidentielle

**SolutionX** est une Progressive Web Application (PWA) complète pour centraliser les services du quotidien dans une cité résidentielle ivoirienne. Elle permet aux résidents de commander des courses, du gaz, de trouver des artisans, de suivre les livraisons et de payer les cotisations.

## 🎯 Fonctionnalités principales

### Pour les Résidents
- 📦 Commande de courses auprès de boutiques partenaires
- ⛽ Service de livraison de gaz
- 🔧 Mise en relation avec artisans (électriciens, plombiers, etc.)
- 🚚 Suivi en temps réel des livraisons
- 💳 Paiement par carte bancaire ou mobile money
- 💰 Gestion des cotisations résidentielles

### Pour les Livreurs
- 📍 Géolocalisation et dispatch automatique
- 📋 Gestion des missions de livraison
- 💵 Suivi des gains
- ⭐ Système de notation

### Pour les Boutiques
- 📊 Tableau de bord avec commandes et ventes
- 🛍️ Gestion du catalogue de produits
- 📢 Codes promotionnels
- 💸 Suivi des revenus

### Pour les Artisans
- 📅 Gestion des créneaux de disponibilité
- 📞 Mise en relation avec clients
- 💰 Suivi des revenus et commissions
- ⭐ Système de notation

### Pour les Administrateurs
- 📈 Dashboard avec indicateurs clés
- 👥 Gestion des utilisateurs et validation
- 🚚 Gestion des livreurs et suivi
- 💳 Configuration des frais de livraison
- 📋 Gestion des litiges

## 🛠️ Stack technique

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | React 18 + TypeScript + TailwindCSS 4 |
| **PWA** | Vite PWA Plugin |
| **État** | Zustand + React Query |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Cartes** | Leaflet + OpenStreetMap |
| **Paiements** | Stripe (test) + Mobile Money (simulé) |
| **Notifications** | Web Push API + Supabase Realtime |
| **Formulaires** | React Hook Form + Zod |

## 📋 Prérequis

- **Node.js** 18+ et npm/pnpm
- **Compte Supabase** (https://supabase.com)
- **Clés Stripe** (test mode)
- **Git** pour le versioning

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/KINGAMAV/AhilePharma.git
cd solution-x
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (Mode test)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_test_key

# Mobile Money (Simulé)
VITE_ORANGE_MONEY_API_URL=https://api.orangemoney.ci/test
VITE_MTN_MONEY_API_URL=https://api.mtnmoney.ci/test
VITE_WAVE_API_URL=https://api.wave.ci/test

# App
VITE_APP_NAME=SolutionX
VITE_ENVIRONMENT=development
```

### 4. Configurer Supabase

Consultez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour les instructions détaillées.

En résumé :
1. Créez un projet Supabase
2. Exécutez les migrations SQL
3. Chargez les données de test
4. Configurez l'authentification

### 5. Démarrer le serveur de développement

```bash
pnpm run dev
```

L'application sera disponible à `http://localhost:3000`

## 📁 Structure du projet

```
solution-x/
├── client/
│   ├── src/
│   │   ├── pages/           # Pages de l'application
│   │   ├── components/      # Composants React réutilisables
│   │   ├── contexts/        # Contexts React
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── lib/             # Utilitaires et services
│   │   ├── App.tsx          # Composant principal
│   │   ├── main.tsx         # Point d'entrée
│   │   └── index.css        # Styles globaux
│   ├── public/              # Fichiers statiques
│   └── index.html           # Template HTML
├── shared/
│   └── types.ts             # Types TypeScript partagés
├── supabase/
│   ├── migrations/          # Migrations SQL
│   ├── seed.sql             # Données de test
│   └── config.toml          # Configuration Supabase
├── vite.config.ts           # Configuration Vite
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances
└── README.md                # Ce fichier
```

## 🔐 Authentification

L'application utilise **Supabase Auth** avec email/password. Les utilisateurs peuvent :

1. **S'inscrire** avec un email, mot de passe et rôle
2. **Se connecter** avec leurs identifiants
3. **Accéder** aux fonctionnalités selon leur rôle

### Rôles disponibles

| Rôle | Description |
|------|-------------|
| `resident` | Résident de la cité |
| `delivery_person` | Livreur employé |
| `shop` | Boutique partenaire |
| `artisan` | Artisan (électricien, plombier, etc.) |
| `admin` | Administrateur local |

## 📊 Base de données

La base de données Supabase contient 16 tables principales :

- **users** : Tous les utilisateurs
- **residents** : Profils des résidents
- **delivery_persons** : Profils des livreurs
- **shops** : Boutiques partenaires
- **products** : Produits des boutiques
- **orders** : Commandes
- **artisans** : Artisans
- **appointments** : Rendez-vous
- **delivery_missions** : Missions de livraison
- **payments** : Paiements
- **promotions** : Codes promotionnels
- **reviews** : Avis et évaluations

Consultez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour plus de détails.

## 🔒 Sécurité

- **Row Level Security (RLS)** : Chaque utilisateur ne voit que ses données
- **Authentification JWT** : Via Supabase Auth
- **Politiques granulaires** : Par rôle et type d'accès
- **HTTPS** : Obligatoire en production

## 📱 PWA

L'application est une Progressive Web App installable :

- **Offline-first** : Fonctionne hors ligne avec caching
- **Installable** : Peut être installée sur l'écran d'accueil
- **Responsive** : Adapté à tous les appareils
- **Notifications** : Web Push API

## 🚀 Déploiement

### Vercel (Frontend)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

### Netlify (Frontend)

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
netlify deploy --prod --dir=dist/public
```

### Supabase (Backend)

Le backend est hébergé sur Supabase. Aucune configuration supplémentaire requise.

## 📚 Documentation

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuration Supabase
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## 🐛 Dépannage

### Erreur : "Cannot find module"
```bash
pnpm install
```

### Erreur : "Invalid API key"
Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont corrects dans `.env.local`

### Erreur : "Permission denied"
Vérifiez que RLS est correctement configuré dans Supabase

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le dépôt
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Manus AI** - Développement initial
- **Votre nom** - Contributeur

## 📧 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.

---

**Dernière mise à jour** : Mai 2026
