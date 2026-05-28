# Test: Problème Second Login

## Le Problème
1. ✅ Créer un compte → fonctionne
2. ❌ Se déconnecter puis se reconnecter → "Email ou mot de passe incorrect"

## À Vérifier dans la Console (F12)

### Test 1: Créer un compte
1. Ouvrir DevTools (F12)
2. Aller à `/login`
3. Mode "S'inscrire"
4. Remplir: nom, email, mot de passe
5. Cliquer "Créer un compte"
6. Regarder les logs:
   - `[Signup] Création de compte avec role: ...`
   - `[Signup] ✅ Compte créé avec succès`
   - Le mode doit passer à "login" automatiquement

### Test 2: Première Connexion
1. Remplir email et mot de passe (mêmes infos)
2. Cliquer "Se connecter"
3. Regarder logs:
   - `[Login] Tentative de connexion avec: {email}`
   - `[Login] Session avant login: Aucune` ← important!
   - `[Login] ✅ Authentification réussie`
   - `[Auth] State Change Event: SIGNED_IN` ← doit voir ça
   - Doit rediriger vers `/`

### Test 3: Déconnexion
1. Aller au profil (click Profile)
2. Cliquer "Se déconnecter"
3. Regarder logs:
   - `[Logout] Tentative de déconnexion...`
   - `[Logout] Nettoyage de l'état AppContext`
   - `[Logout] ✅ Déconnexion complète`
   - `[Auth] State Change Event: SIGNED_OUT`
   - Doit rediriger vers `/login`

### Test 4: Deuxième Connexion (LE PROBLEME)
1. Remplir email et mot de passe (mêmes infos)
2. Cliquer "Se connecter"
3. Regarder logs TRES ATTENTIVEMENT:
   - `[Login] Tentative de connexion avec: {email}`
   - `[Login] Session avant login: ???` ← c'est quoi la réponse?
   - `[Login] Erreur Supabase complète: {...}` ← regarde le détail!
   - Quel est le `code` exact?

## Vérifications Supabase

### SQL 1: Vérifier que le compte existe
Va sur: https://app.supabase.com → SQL Editor
```sql
SELECT id, email, created_at FROM auth.users WHERE email = '{ton-email}';
```
Doit avoir 1 ligne.

### SQL 2: Vérifier les sessions
```sql
SELECT id, user_id, created_at FROM auth.sessions WHERE user_id = '{user-id-du-resultat-precedent}';
```
Combien de sessions y a? (normal d'avoir 2 si tu te reconnectes)

### SQL 3: Vérifier table users (optionnel)
```sql
SELECT id, email, name, role FROM users WHERE id = '{user-id}';
```
Regarde si c'est vide ou pas.

## Possibles Causes

### Cause 1: Session non-clearnée
Si `[Login] Session avant login: Active` ← c'est ça le problème!
→ Supabase pense que tu es déjà connecté

**Solution**: Ajouter un signOut() forcé avant le signInWithPassword dans LoginScreen

### Cause 2: Erreur d'authentification
Si `[Login] Erreur Supabase complète: {code: "invalid_grant"}` ou `{code: "mfa_required"}`
→ C'est du côté Supabase

**Solution**: Vérifier les logs Supabase Auth

### Cause 3: Rate Limiting
Si les erreurs viennent rapidement (moins d'1s entre test 3 et test 4)
→ Supabase rate-limit

**Solution**: Attendre 30s entre les tentatives

### Cause 4: Token expiré
Si `[Auth] State Change Event: TOKEN_REFRESH_ERROR`
→ Token JWT corrompu

**Solution**: Forcer un refresh ou clean localStorage

## Code à Tester

### Dans le console du browser:
```javascript
// Voir toutes les sessions
const { data } = await supabase.auth.getSession();
console.log("Current session:", data.session);

// Forcer un sign out
await supabase.auth.signOut({ scope: 'global' });
console.log("Signed out globally");

// Voir l'utilisateur actuel
const user = (await supabase.auth.getUser()).data.user;
console.log("Current user:", user);
```

## Rapporte Ici Avec:

Après avoir fait les tests 1-4, dis-moi:
1. ✅ Les logs exactes de test 4 (surtout `[Login] Session avant login: ???`)
2. ✅ Le résultat SQL 1 (compte existe?)
3. ✅ Le résultat SQL 2 (combien de sessions?)
4. ✅ Le résultat de `console.log("Current session:", data.session)` après logout
5. ✅ Le résultat de `console.log("Current session:", data.session)` avant test 4

Avec ça je pourrai diagnostiquer exact le problème!
