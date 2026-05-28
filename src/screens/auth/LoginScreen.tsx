import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 Tentative de connexion...', email);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      console.log('✅ Connexion réussie. Redirection...');
      navigate('/home');
    } catch (err: any) {
      console.error('❌ Erreur Supabase:', err);
      setError(err.message || 'Identifiants incorrects. Vérifie ton email/mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: string) => {
    setLoading(true);
    setError(null);
    try {
      const credentials: Record<string, { email: string; password: string }> = {
        client: { email: 'demo.client@citeconnect.ci', password: 'Demo2026!' },
        boutique: { email: 'demo.boutique@citeconnect.ci', password: 'Demo2026!' },
        livreur: { email: 'demo.livreur@citeconnect.ci', password: 'Demo2026!' },
      };
      const { error } = await supabase.auth.signInWithPassword(credentials[role]);
      if (error) throw error;
      navigate('/home');
    } catch (err: any) {
      console.error('❌ Erreur démo:', err);
      setError('Compte démo introuvable dans Supabase Auth. Vérifie la table Authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface-lowest flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-surface rounded-3xl p-8 shadow-xl border border-brand-outline/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-brand-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-primary/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-on-surface">Bienvenue</h1>
          <p className="text-brand-on-surface-variant mt-2">Connectez-vous pour accéder à votre espace</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-on-surface-variant" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full pl-12 pr-4 py-3 bg-brand-surface-lowest border border-brand-outline/20 rounded-xl text-brand-on-surface placeholder:text-brand-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-on-surface-variant" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full pl-12 pr-12 py-3 bg-brand-surface-lowest border border-brand-outline/20 rounded-xl text-brand-on-surface placeholder:text-brand-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-on-surface-variant hover:text-brand-on-surface transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/25 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Se connecter'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-outline/10">
          <p className="text-xs text-center text-brand-on-surface-variant mb-4 uppercase tracking-wider font-bold">
            Accès rapide Démo
          </p>
          <div className="grid grid-cols-3 gap-3">
            {['client', 'boutique', 'livreur'].map((role) => (
              <button
                key={role}
                onClick={() => quickLogin(role)}
                disabled={loading}
                className="py-2 px-3 bg-brand-surface-lowest border border-brand-outline/20 rounded-lg text-xs font-bold text-brand-on-surface hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-50 capitalize"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-xs text-brand-on-surface-variant text-center">
        © 2024 Cité Connect. Tous droits réservés.
      </p>
    </div>
  );
};