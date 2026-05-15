# Guide d'Installation Local - CitéConnect

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (v18 ou supérieur) : https://nodejs.org/
- **Git** : https://git-scm.com/

## Étape 1 : Cloner le dépôt

Ouvrez votre terminal et exécutez :

```bash
git clone https://github.com/KINGAMAV/SolutionX.git
cd SolutionX
```

## Étape 2 : Installer les dépendances

```bash
npm install
```

## Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :

```
VITE_SUPABASE_URL=https://xwcpgmedpawtnklhljpo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y3BnbWVkcGF3dG5rbGhsanBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NzY2NzIsImV4cCI6MjA5NDE1MjY3Mn0.k27_FF1JoM1w7MWZordL-HtiF2292RGK2G0Dw3Ss7dY
```

## Étape 4 : Démarrer le serveur de développement

```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3000/`

## Commandes disponibles

- **Démarrer le développement** : `npm run dev`
- **Build pour la production** : `npm run build`
- **Aperçu de la build** : `npm run preview`
- **Vérifier les erreurs TypeScript** : `npm run lint`

## Structure du projet

```
SolutionX/
├── src/
│   ├── screens/          # Pages de l'application
│   ├── components/       # Composants réutilisables
│   ├── context/          # Context API (AppContext)
│   ├── lib/              # Utilitaires (Supabase, etc.)
│   ├── data.ts           # Données de test
│   ├── types.ts          # Types TypeScript
│   ├── App.tsx           # Routeur principal
│   └── main.tsx          # Point d'entrée
├── public/               # Fichiers statiques (logo)
├── index.html            # HTML principal
├── package.json          # Dépendances
├── tsconfig.json         # Configuration TypeScript
└── vite.config.ts        # Configuration Vite
```

## Troubleshooting

### Erreur : "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé
```bash
npm run dev -- --port 3001
```

### Erreurs TypeScript
```bash
npm run lint
```

## Support Supabase

Pour plus d'informations sur la configuration Supabase :
- Documentation : https://supabase.com/docs
- Projet Supabase : https://app.supabase.com

## Prochaines étapes

1. Tester l'authentification avec vos identifiants Supabase
2. Adapter les couleurs au branding CitéConnect
3. Développer les écrans des services (Courses, Gaz, Artisans, etc.)
