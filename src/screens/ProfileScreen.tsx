import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Loader2, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!state.user) return;
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('name, email, phone, house_number, quartier, avatar, role')
          .eq('id', state.user.id)
          .single();
        setUserData(data || state.user);
      } catch (e) {
        setUserData(state.user);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [state.user]);

  const handleLogout = async () => {
    setLoading(true);
    console.log("[Logout] Tentative de déconnexion...");
    
    try {
      // Timeout de 2s pour le signOut Supabase
      const signOutPromise = supabase.auth.signOut({ scope: 'local' });
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => {
          console.warn("[Logout] Supabase signOut timeout");
          resolve(null);
        }, 2000)
      );
      
      const result = await Promise.race([signOutPromise, timeoutPromise]);
      
      if (result && (result as any).error) {
        console.error("[Logout] Erreur Supabase:", (result as any).error);
      }
      
      // Nettoyer l'état local IMMEDIATEMENT même si Supabase n'a pas répondu
      console.log("[Logout] Nettoyage de l'état AppContext");
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_ORDERS', payload: [] });
      
      console.log("[Logout] ✅ Déconnexion effectuée");
      
      // Redirection immédiate
      navigate('/login');
    } catch (err) {
      console.error('[Logout] Exception:', err);
      // Même en cas d'erreur, nettoyer et rediriger
      dispatch({ type: 'SET_USER', payload: null });
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: Settings, label: 'Paramètres du compte', action: () => alert('Module paramètres en cours de développement') },
    { icon: CreditCard, label: 'Historique des commandes', action: () => navigate('/orders') },
    { icon: Bell, label: 'Notifications & Alertes', action: () => alert('Module notifications en cours de développement') },
    { icon: MapPin, label: 'Mes adresses de livraison', action: () => alert('Module adresses en cours de développement') },
    { icon: HelpCircle, label: 'Aide & Support client', action: () => alert('Module support en cours de développement') },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-surface-lowest flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-primary" />
          <p className="text-brand-on-surface-variant text-sm">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface-lowest pb-20">
      {/* Header Profil */}
      <header className="bg-brand-primary text-white px-5 pt-12 pb-10 rounded-b-[2.5rem] relative overflow-hidden shadow-lg shadow-brand-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00843D] to-[#005226] opacity-90" />
        <div className="relative z-10 flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full backdrop-blur-sm active:scale-95 transition-transform">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-lg font-bold">Mon Profil</h1>
          <div className="w-10" /> {/* Spacer pour centrage */}
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-18 h-18 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30 overflow-hidden shadow-inner">
            {userData?.avatar ? (
              <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userData?.name || 'Utilisateur'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm capitalize">{userData?.role || 'client'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Carte Infos Contact */}
      <div className="px-5 -mt-5 relative z-20">
        <div className="bg-brand-surface rounded-2xl p-5 shadow-sm border border-brand-outline/10 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-brand-primary" />
            </div>
            <span className="text-brand-on-surface truncate">{userData?.email}</span>
          </div>
          {userData?.phone && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-brand-on-surface">{userData.phone}</span>
            </div>
          )}
          {userData?.quartier && (
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-brand-on-surface">{userData.quartier}{userData.house_number ? `, ${userData.house_number}` : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Paramètres */}
      <div className="px-5 mt-6 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={item.action}
            className="w-full flex items-center justify-between p-4 bg-brand-surface rounded-xl border border-brand-outline/10 active:scale-[0.98] transition-transform hover:border-brand-primary/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-surface-lowest flex items-center justify-center text-brand-on-surface-variant">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-brand-on-surface">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-on-surface-variant/40" />
          </motion.button>
        ))}
      </div>

      {/* Bouton Déconnexion */}
      <div className="px-5 mt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 active:scale-[0.98] transition-transform hover:bg-red-100"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center px-5">
        <p className="text-xs text-brand-on-surface-variant">Concorde Shop • Version Démo Investisseurs</p>
        <p className="text-[10px] text-brand-on-surface-variant/50 mt-1">© 2024 Tous droits réservés</p>
      </div>
    </div>
  );
};