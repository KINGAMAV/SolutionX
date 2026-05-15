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
  const [loading, setLoading] = useState(false);

  const createUserProfile = (authUser: any) => {
    const metadata = authUser.user_metadata || {};
    return {
      id: authUser.id,
      name: metadata.name || authUser.email?.split('@')[0] || 'Utilisateur',
      email: authUser.email || '',
      houseNumber: metadata.houseNumber || '',
      avatar:
        metadata.avatar ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3',
    };
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password || (mode === 'signup' && !formData.name)) {
      setError('Veuillez compléter tous les champs requis.');
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        dispatch({ type: 'SET_USER', payload: createUserProfile(data.user) });
        navigate('/');
      }
    } else {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            houseNumber: formData.houseNumber,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        dispatch({ type: 'SET_USER', payload: createUserProfile(data.user) });
        navigate('/');
      } else {
        setError('Inscription réussie. Vérifiez votre email si nécessaire.');
      }
    }

    setLoading(false);
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
          <div className="w-20 h-20 bg-brand-primary rounded-[2rem] flex items-center justify-center shadow-xl mb-4">
            <span className="text-white text-4xl font-black">S</span>
          </div>
          <h1 className="text-3xl font-black text-brand-primary tracking-tight">SolutionX</h1>
          <p className="text-sm font-medium text-brand-on-surface-variant max-w-[280px] mt-2">
            Votre communauté, connectée et sécurisée au quotidien.
          </p>
        </motion.div>
      </div>

      {/* Auth Container */}
      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md px-5 -mt-10 relative z-20"
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
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-14 mt-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all text-lg disabled:opacity-60"
            >
              {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-brand-outline/10" />
            <span className="text-xs font-bold text-brand-outline uppercase tracking-widest">OU</span>
            <div className="h-px flex-1 bg-brand-outline/10" />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 h-14 border border-brand-outline/20 rounded-2xl hover:bg-brand-surface-low transition-colors font-bold text-sm">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAky92BE6dlB6yWmUMVZ2ebne6JU81TmDgNNhu9RYz3IcUHSOZCqOttEYNhaU_OoGEQP2zXjQ8OTfhLaoQ6zpKQIpk92mXcZI25niPX2oEYiP39zZh7-lU7-HJ0D8TrpK9Ab__s5EIOO36MXqYrxIlML_K7JmyHoqxtDQfWmqL_Iad079dHqj2AuE6ZVURGuyp9ftnFAHNW1ef-N83l1tdWluziRDxVk-gL3-eUGRjyQyMO8gkuiPke_nC0IM30WXDDX7MkjM9b-8FV" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 h-14 border border-brand-outline/20 rounded-2xl hover:bg-brand-surface-low transition-colors font-bold text-sm">
              <span className="text-[#1877F2] font-black text-xl leading-none">f</span>
              Facebook
            </button>
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
        <span className="text-[10px] font-bold uppercase tracking-widest">Système sécurisé par SolutionX Architecture</span>
      </footer>
    </div>
  );
};
