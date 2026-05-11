# Guide de déploiement SolutionX

Ce guide explique comment déployer SolutionX en production.

## Architecture de déploiement

```
┌─────────────────┐
│   Frontend      │
│ (Vercel/Netlify)│
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Supabase      │
│  (Backend)      │
└─────────────────┘
```

## 1. Préparation

### 1.1 Vérifier le code

```bash
# Vérifier les erreurs TypeScript
pnpm run check

# Tester la build
pnpm run build
```

### 1.2 Configurer les variables d'environnement

Créez un fichier `.env.production` avec les clés de production :

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_key
```

## 2. Déploiement du Frontend

### Option A : Vercel (Recommandé)

**Avantages** :
- Déploiement automatique depuis GitHub
- Certificat SSL gratuit
- CDN global
- Domaine personnalisé gratuit

**Étapes** :

1. **Créer un compte Vercel** : https://vercel.com
2. **Connecter le dépôt GitHub** :
   - Cliquez sur "New Project"
   - Sélectionnez le dépôt `AhilePharma`
   - Vercel détecte automatiquement Vite
3. **Configurer les variables d'environnement** :
   - Allez dans **Settings** → **Environment Variables**
   - Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
4. **Déployer** :
   - Cliquez sur "Deploy"
   - Vercel construit et déploie automatiquement

**Accès** :
- URL automatique : `https://solution-x-xxxxx.vercel.app`
- Domaine personnalisé : Configurez dans **Settings** → **Domains**

### Option B : Netlify

**Avantages** :
- Interface simple
- Déploiement automatique
- Formulaires Netlify intégrés

**Étapes** :

1. **Créer un compte Netlify** : https://netlify.com
2. **Connecter le dépôt GitHub** :
   - Cliquez sur "New site from Git"
   - Sélectionnez GitHub
   - Autorisez Netlify
   - Sélectionnez le dépôt `AhilePharma`
3. **Configurer le build** :
   - Build command : `pnpm run build`
   - Publish directory : `dist/public`
4. **Ajouter les variables d'environnement** :
   - Allez dans **Site settings** → **Build & deploy** → **Environment**
   - Ajoutez les variables Supabase
5. **Déployer** :
   - Cliquez sur "Deploy site"

### Option C : Déploiement manuel

```bash
# Build
pnpm run build

# Résultat dans dist/public/
# Téléchargez sur votre serveur web
```

## 3. Configuration Supabase pour la production

### 3.1 Créer un projet Supabase de production

1. Allez sur https://supabase.com
2. Créez un nouveau projet avec :
   - **Name** : SolutionX Production
   - **Region** : Choisir la région la plus proche de vos utilisateurs
   - **Database Password** : Mot de passe fort

### 3.2 Exécuter les migrations

```bash
# Via Supabase CLI
supabase db push --db-url "postgresql://..."

# Ou manuellement via l'interface SQL Editor
```

### 3.3 Configurer l'authentification

1. Allez dans **Authentication** → **URL Configuration**
2. Ajoutez les URLs autorisées :
   - `https://your-domain.com`
   - `https://www.your-domain.com`
   - `https://solution-x-xxxxx.vercel.app` (si Vercel)

### 3.4 Activer les extensions nécessaires

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 3.5 Configurer les backups

1. Allez dans **Database** → **Backups**
2. Activez les backups automatiques
3. Configurez la rétention (30 jours recommandé)

## 4. Configuration du domaine personnalisé

### 4.1 Avec Vercel

1. Allez dans **Settings** → **Domains**
2. Entrez votre domaine (ex: `solutionx.ci`)
3. Vercel fournit les enregistrements DNS à configurer
4. Configurez chez votre registraire de domaine

### 4.2 Avec Netlify

1. Allez dans **Site settings** → **Domain management**
2. Cliquez sur **Add custom domain**
3. Entrez votre domaine
4. Configurez les enregistrements DNS

## 5. Configuration SSL/TLS

- **Vercel** : Certificat SSL gratuit automatique
- **Netlify** : Certificat SSL gratuit automatique
- **Domaine personnalisé** : Certificat Let's Encrypt gratuit

## 6. Monitoring et maintenance

### 6.1 Logs

- **Vercel** : **Deployments** → **Logs**
- **Netlify** : **Deploys** → **Deploy log**
- **Supabase** : **Logs** → **Edge Function Logs**

### 6.2 Performance

- **Vercel Analytics** : Monitoring automatique
- **Netlify Analytics** : Activez dans les paramètres
- **Supabase** : Consultez les métriques de la base de données

### 6.3 Backups

- **Supabase** : Backups automatiques quotidiens
- **Code** : Sauvegardé sur GitHub

## 7. Mise à jour en production

### Processus de déploiement

1. **Développement local** :
   ```bash
   git checkout -b feature/new-feature
   # Développer et tester
   git commit -m "Add new feature"
   ```

2. **Pull Request** :
   ```bash
   git push origin feature/new-feature
   # Créer une PR sur GitHub
   ```

3. **Revue et merge** :
   ```bash
   # Après approbation
   git checkout main
   git merge feature/new-feature
   git push origin main
   ```

4. **Déploiement automatique** :
   - Vercel/Netlify détecte le push sur `main`
   - Construit et déploie automatiquement
   - Vous recevez une notification

## 8. Dépannage

### Erreur : "Build failed"
- Vérifiez les logs de build
- Vérifiez les variables d'environnement
- Vérifiez les dépendances

### Erreur : "Cannot connect to Supabase"
- Vérifiez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Vérifiez que le projet Supabase est actif
- Vérifiez les URLs autorisées dans l'authentification

### Performance lente
- Vérifiez les logs Supabase
- Vérifiez les index de base de données
- Activez le caching

## 9. Checklist de déploiement

- [ ] Code testé localement
- [ ] Variables d'environnement configurées
- [ ] Migrations Supabase exécutées
- [ ] Certificat SSL configuré
- [ ] Domaine personnalisé configuré
- [ ] Authentification Supabase configurée
- [ ] Backups activés
- [ ] Monitoring configuré
- [ ] Documentation mise à jour
- [ ] Équipe notifiée

## 10. Support

Pour toute question ou problème :
- Consultez la [documentation Vercel](https://vercel.com/docs)
- Consultez la [documentation Netlify](https://docs.netlify.com)
- Consultez la [documentation Supabase](https://supabase.com/docs)
