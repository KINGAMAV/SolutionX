import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Home, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    houseNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null); // Pour gérer le chargement des boutons de démo

  const getRoleHomeRoute = (role?: string) => {
    switch (role) {
      case 'admin':
      case 'agent':
        return '/admin';
      case 'boutique':
        return '/boutique';
      case 'livreur':
        return '/livreur';
      case 'artisan':
        return '/artisan';
      case 'syndics':
        return '/syndics';
      default:
        return '/';
    }
  };

  // Données de démo pour chaque rôle
  const demoUsers = {
    admin: {
      id: 'demo-admin-001',
      name: 'Admin Démo',
      email: 'admin@demo.com',
      houseNumber: 'HQ',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'admin' as const,
    },
    livreur: {
      id: 'demo-livreur-001',
      name: 'Livreur Démo',
      email: 'livreur@demo.com',
      houseNumber: 'Zone 4',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'livreur' as const,
    },
    client: {
      id: 'demo-client-001',
      name: 'Client Démo',
      email: 'client@demo.com',
      houseNumber: 'Villa 123',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'client' as const,
    },
    boutique: {
      id: 'demo-boutique-001',
      name: 'Boutique Démo',
      email: 'boutique@demo.com',
      houseNumber: 'Marché',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'boutique' as const,
    },
    syndics: {
      id: 'demo-syndics-001',
      name: 'Syndic Démo',
      email: 'syndic@demo.com',
      houseNumber: 'Immeuble A',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'syndics' as const,
    },
    artisan: {
      id: 'demo-artisan-001',
      name: 'Prestataire Démo',
      email: 'prestataire@demo.com',
      houseNumber: 'Atelier B',
      avatar: 'https://i.pravatar.cc/150?img=6',
      role: 'artisan' as const,
    },
  };

  const handleDemoLogin = async (roleKey: keyof typeof demoUsers) => {
    setDemoLoading(roleKey);
    setError('');
    setSuccess('');
    try {
      const demoUser = demoUsers[roleKey];
      
      // Simuler une connexion réussie en mettant à jour l'état global
      // sans vérifier réellement Supabase Auth
      dispatch({ type: 'SET_USER', payload: demoUser });
      
      // Attendre un peu pour que le state se mette à jour
      setTimeout(() => {
        navigate(getRoleHomeRoute(demoUser.role));
      }, 300);
    } catch (err: any) {
      setError("Une erreur inattendue est survenue lors de la connexion démo : " + err.message);
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email || !formData.password || (mode === 'signup' && !formData.name)) {
      setError('Veuillez compléter tous les champs requis.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        console.log("[Login] Tentative de connexion avec:", formData.email);
        console.log("[Login] Email trimé:", formData.email.trim());
        
        // Vérifier la session actuelle avant la tentative
        const { data: currentSession } = await supabase.auth.getSession();
        console.log("[Login] Session avant login:", currentSession.session ? "Active" : "Aucune");
        
        // Si y a une session antérieure, la forcer à se terminer AVANT de se reconnecter
        // C'est une cause courante d'erreur "Invalid login credentials" après une déconnexion
        if (currentSession.session) {
          console.log("[Login] ⚠️ Session antérieure trouvée, on la forcer à terminer...");
          try {
            // Timeout de 1s pour le signOut
            const signOutPromise = supabase.auth.signOut({ scope: 'local' });
            const timeoutPromise = new Promise((resolve) =>
              setTimeout(() => {
                console.warn("[Login] Ancien signOut timeout");
                resolve(null);
              }, 1000)
            );
            await Promise.race([signOutPromise, timeoutPromise]);
          } catch (err) {
            console.warn("[Login] Erreur lors du signOut antérieur (ignorée):", err);
          }
          console.log("[Login] ✅ Session antérieure nettoyée");
        }
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (authError) {
          console.error("[Login] Erreur Supabase complète:", {
            message: authError.message,
            code: (authError as any).code,
            status: (authError as any).status,
          });
          setError("❌ " + (authError.message === 'Invalid login credentials' 
            ? "Email ou mot de passe incorrect" 
            : authError.message));
          setLoading(false);
          return;
        }

        if (authData?.user) {
          console.log("[Login] ✅ Authentification réussie pour:", authData.user.email);
          console.log("[Login] User ID:", authData.user.id);
          console.log("[Login] Session créée:", !!authData.session);
          // On NE redirige PAS ici - AppContext va s'en charger via onAuthStateChange
          // Juste un petit feedback visuel
          setSuccess('✅ Connexion réussie, redirection en cours...');
          // On retire le loading après 1s pour que l'utilisateur voit le message
          setTimeout(() => {
            setLoading(false);
          }, 500);
          return;
        }
      } else {
        // Logique spéciale pour l'inscription : si l'email contient 'admin', on lui donne le rôle admin (pour test/bootstrap)
        const isInitialAdmin = formData.email.toLowerCase().includes('admin@citeconnect.com') || formData.email.toLowerCase() === 'amavkingofficielle@gamil.com';
        const role = isInitialAdmin ? 'admin' : 'client';

        console.log("[Signup] Création de compte avec role:", role);

        const { data: signUpData, error: authError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              houseNumber: formData.houseNumber || 'HQ',
              role: role
            },
          },
        });

        if (authError) {
          console.error("[Signup] Erreur Supabase:", authError);
          setError("❌ Erreur inscription : " + authError.message);
          setLoading(false);
          return;
        }
        
        console.log("[Signup] ✅ Compte créé avec succès");
        setSuccess('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setMode('login');
        setFormData({ name: '', email: '', houseNumber: '', password: '' });
        setLoading(false);
      }
    } catch (err: any) {
      console.error("[Auth] Exception:", err);
      setError("❌ Erreur inattendue : " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full relative h-[300px] overflow-hidden flex items-center justify-center bg-brand-primary-container/10">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-secondary-container rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 -right-10 w-48 h-48 bg-brand-primary rounded-full blur-3xl opacity-10" />
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 flex flex-col items-center text-center px-5"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-4 p-1 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Concorde Shop Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight">Concorde Shop</h1>
          <p className="text-sm font-medium text-brand-on-surface-variant max-w-[280px] mt-2">
            Votre communauté, connectée et sécurisée au quotidien.
          </p>
        </motion.div>
      </div>

      {/* Auth Container */}
      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md px-5 -mt-10 relative z-20 pb-16"
      >
        <div className="bg-brand-surface-lowest rounded-3xl shadow-xl p-8 flex flex-col gap-8 border border-brand-outline/10">
          {/* Tabs */}
          <div className="flex bg-brand-surface-low rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                mode === 'login'
                  ? 'bg-brand-surface-lowest text-brand-primary shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                mode === 'signup'
                  ? 'bg-brand-surface-lowest text-brand-primary shadow-sm'
                  : 'text-brand-on-surface-variant hover:text-brand-primary'
              }`}
            >
              S'inscrire
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-brand-on-surface-variant ml-1">Votre nom</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" />
                  <input
                    type="text"
                    placeholder="Ex: Jean-Marc"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-brand-on-surface-variant ml-1">Email</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" />
                <input 
                  type="email" 
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-brand-on-surface-variant ml-1">Numéro de maison</label>
                <div className="relative">
                  <Home size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" />
                  <input 
                    type="text" 
                    placeholder="Ex: Villa 124"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-brand-on-surface-variant">Mot de passe</label>
                <button className="text-xs font-bold text-brand-primary">Oublié ?</button>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all text-sm font-medium"
                />
                <Eye 
                  size={18} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-outline cursor-pointer" 
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600 font-bold bg-green-50 p-3 rounded-xl border border-green-100">{success}</p>
            )}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-14 mt-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all text-lg disabled:opacity-60"
            >
              {loading ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
            </button>

            </div>

            {/* Boutons de connexion rapide pour la démo */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-brand-outline/20">
              <p className="text-center text-xs font-bold text-brand-on-surface-variant uppercase tracking-widest">Connexion rapide (Démo) :</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(demoUsers) as Array<keyof typeof demoUsers>).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => handleDemoLogin(roleKey)}
                    disabled={demoLoading === roleKey || loading}
                    className={`w-full h-11 bg-brand-secondary-container text-brand-on-secondary-container rounded-xl font-bold shadow-md active:scale-95 transition-all text-xs disabled:opacity-60 flex items-center justify-center`}
                  >
                    {demoLoading === roleKey ? 'Connexion...' : roleKey === 'artisan' ? 'Prestataire' : roleKey === 'syndics' ? 'Syndic' : roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
                  </button>
                ))}
              </div>
            </div>

          <p className="text-center text-sm font-medium text-brand-on-surface-variant">
            {mode === 'login' ? 'Pas encore de compte ?' : 'Vous avez déjà un compte ?'}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-brand-primary font-black ml-1.5 hover:underline decoration-2 underline-offset-4"
            >
              {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </div>
      </motion.main>

      <footer className="mt-8 mb-8 flex items-center justify-center gap-2 text-brand-outline opacity-60">
        <CheckCircle2 size={16} fill="currentColor" className="text-white" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Système sécurisé par Cité Connect Architecture</span>
      </footer>
    </div>
  );
};
