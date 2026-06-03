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

  const handleDemoLogin = async (role: string) => {
    setDemoLoading(role);
    setError('');
    setSuccess('');
    try {
      const email = `${role}@demo.com`;
      const password = 'password123'; // Mot de passe générique pour la démo

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        setError(`Erreur de connexion pour ${role}: ` + authError.message);
        setDemoLoading(null);
        return;
      }

      if (authData?.user) {
        navigate(getRoleHomeRoute(role));
      }
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
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (authError) {
          setError("Identifiants incorrects : " + authError.message);
          setLoading(false);
          return;
        }

        if (authData?.user) {
          // On laisse AppContext gérer la redirection via l'état global ou on redirige ici
          // Pour être sûr, on récupère le rôle des métadonnées ou de la base
          const role = authData.user.user_metadata?.role || 'client';
          navigate(getRoleHomeRoute(role));
          return;
        }
      } else {
        // Logique spéciale pour l'inscription : si l'email contient 'admin', on lui donne le rôle admin (pour test/bootstrap)
        const isInitialAdmin = formData.email.toLowerCase().includes('admin@citeconnect.com') || formData.email.toLowerCase() === 'amavkingofficielle@gamil.com';
        const role = isInitialAdmin ? 'admin' : 'client';

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
          setError(authError.message);
          setLoading(false);
          return;
        }
        
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setMode('login');
        setLoading(false);
      }
    } catch (err: any) {
      setError("Une erreur inattendue est survenue : " + err.message);
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
              alt="Cité Connect Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight">Cité Connect</h1>
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
            <div className="flex flex-col gap-3 mt-6">
              <p className="text-center text-sm font-bold text-brand-on-surface-variant">Connexion rapide (Démo) :</p>
              <div className="grid grid-cols-2 gap-3">
                {[ 'admin', 'livreur', 'client', 'boutique', 'syndics', 'artisan' ].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleDemoLogin(role)}
                    disabled={demoLoading === role || loading}
                    className={`w-full h-12 bg-brand-secondary-container text-brand-on-secondary-container rounded-xl font-bold shadow-md active:scale-95 transition-all text-sm disabled:opacity-60 flex items-center justify-center`}
                  >
                    {demoLoading === role ? 'Connexion...' : role.charAt(0).toUpperCase() + role.slice(1)}
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
