# Guide de Debugging Authentification

## Corrections Appliquées ✅

### 1. .env.local - ESPACE SUPPRIMÉ
**Problème**: `VITE_SUPABASE_ANON_KEY =eyJ...` (espace avant =)
**Correction**: `VITE_SUPABASE_ANON_KEY=eyJ...`
**Impact**: Les variables d'env ne se chargeaient pas → Supabase n'avait pas les bonnes clés

### 2. LoginScreen.tsx - REDIRECTION IMMÉDIATE SUPPRIMÉE  
**Avant**:
```typescript
if (authData?.user) {
  navigate(getRoleHomeRoute(role));  // ❌ Trop rapide
  return;
}
```

**Après**:
```typescript
if (authData?.user) {
  console.log("[Login] ✅ Authentification réussie");
  setSuccess('✅ Connexion réussie, redirection en cours...');
  setTimeout(() => setLoading(false), 500);
  return;
}
```

**Pourquoi**: AppContext.tsx a un `onAuthStateChange` listener qui met à jour `state.user`. Le composant `RedirectIfAuth` redirige automatiquement vers "/" quand `state.user` n'est pas null. On laisse ce flux faire son truc au lieu de rediriger manuellement.

### 3. Messages d'Erreur Améliorés
**Avant**: `"Identifiants incorrects : Invalid login credentials"` (confus)
**Après**: `"❌ Email ou mot de passe incorrect"` (clair)

### 4. Logs Ajoutés pour Debugging
- `[Login] Tentative de connexion avec: {email}`
- `[Login] ✅ Authentification réussie pour: {email}`
- `[Login] Erreur Supabase: {error}`
- `[Signup] Création de compte avec role: {role}`
- `[Auth] State Change Event: {event}` (AppContext)
- `[Auth] Using metadata fallback for user: {email}` (fallback)

## Comment Tester

### Étape 1: Vérifier que .env.local est correct
```bash
cat .env.local
# Doit afficher:
# VITE_SUPABASE_URL=https://xwcpgmedpawtnklhljpo.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGc...
# (sans espaces!)
```

### Étape 2: Démarrer l'app et ouvrir la console
```bash
pnpm install
pnpm dev
# Puis ouvrir DevTools (F12)
```

### Étape 3: Tester une connexion
1. Aller sur `/login`
2. Entrer un email et mot de passe valides de Supabase
3. Regarder la console pour les logs `[Login]` et `[Auth]`
4. Observer le flux:
   - ✅ `[Login] Tentative de connexion...`
   - ✅ `[Login] ✅ Authentification réussie...`
   - ✅ `[Auth] State Change Event: SIGNED_IN`
   - ✅ `[Auth] Using metadata fallback...` (ou données de la DB)
   - ✅ Redirection automatique vers `/`

### Étape 4: Vérifier Supabase
Si ça ne marche toujours pas:

**A. Vérifier les credentials Supabase**:
```sql
SELECT id, email, user_metadata FROM auth.users;
```
Doit avoir au moins un compte.

**B. Vérifier la table users (optionnel)**:
```sql
SELECT id, name, email, role FROM users;
```
Si vide, c'est OK - AppContext va utiliser les metadata de auth.users.

**C. Vérifier les logs Supabase**:
Aller sur: https://app.supabase.com → Auth → Logs
Chercher les erreurs lors de la tentative de connexion.

## Flow Correct Après Fixes

```
LoginScreen 
  ↓ (supabase.auth.signInWithPassword)
  ↓ 
Supabase Auth ✅
  ↓ (déclenche onAuthStateChange SIGNED_IN)
  ↓
AppContext listener
  ↓ (dispatch SET_USER)
  ↓
state.user se met à jour
  ↓
RedirectIfAuth voit state.user != null
  ↓
Redirige vers "/" (HomeScreen)
```

## Problèmes Connus à Checker

### Erreur: "Invalid login credentials"
- Email/mot de passe incorrect?
- Compte pas créé sur Supabase?
- App pas rechargée après fix .env.local?

### Erreur: "Failed to fetch"  
- .env.local encore mal formée?
- Supabase URL ou clé vide?
- Pas de connexion internet?

### Pas de redirection après connexion
- AppContext listener ne se déclenche pas?
- Vérifier les logs `[Auth]` dans console
- Peut-être que RedirectIfAuth n'est pas en place (c'est le cas maintenant)

## Structure Actuelle (Pour Référence)

**Fichiers modifiés**:
- `.env.local` - espace supprimé
- `src/screens/LoginScreen.tsx` - plus de redirection immédiate, meilleurs logs
- `src/context/AppContext.tsx` - logs améliorés (déjà en place)

**Flux d'authentification**:
- `App.tsx` → `BrowserRouter` + `Routes`
- Routes protégées par `RequireAuth` et `RedirectIfAuth`
- AppContext gère l'état global + listener onAuthStateChange
- AppProvider sur-wrapper tout

## Prochaines Étapes Si Problème Persiste

1. Vérifier que les logs apparaissent en console
2. Vérifier Supabase Auth Logs (URL ci-dessus)
3. Vérifier Network tab (DevTools → Network) quand tu cliques sur "Se connecter"
   - Doit voir requête à `xwcpgmedpawtnklhljpo.supabase.co`
   - Réponse doit avoir un `access_token`
