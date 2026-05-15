import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Edit2, Home, Receipt, Globe, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-brand-background min-h-screen pb-32"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <h1 className="text-xl font-black text-brand-primary tracking-tight">SolutionX</h1>
        <button className="p-2 text-brand-primary active:scale-95 transition-transform">
          <Bell size={24} />
        </button>
      </header>

      <main className="px-5 pt-10 space-y-10">
        {/* Profile Hero */}
        <section className="flex flex-col items-center">
          <div className="relative mb-6 group">
            <div className="w-28 h-28 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white p-1 bg-gradient-to-br from-brand-primary to-brand-secondary">
              <img 
                src={state.user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN6gYG6YVv5BqSC-eHfottnSBcUhmRReCcdFa7rHtjcoBzm83pHWamFzlyrOk-MDtGmHCS5yoBlcru8rnFNO0QP8j0dl5Sap50QvkbAHAbqxGIFwJ1S3-KnWr6yWwgIAFV_o8R2_OfClME6aSuY4zPzgFThBMJIyKUwummmECViTPso3ncRSfLWfRg2RTKn3l5EHcTPtB2rJF95LzRtq4CQjqrQ0ffqzUH1eT1M1EDhgpV26gReK06Yzb0wVRdiFlHc1e-kOQUVBRz'}
                alt={state.user?.name || 'Utilisateur'} 
                className="w-full h-full object-cover rounded-[1.75rem]" 
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-brand-primary p-2.5 rounded-2xl text-white shadow-xl ring-4 ring-brand-background hover:scale-110 transition-transform">
              <Edit2 size={16} />
            </button>
          </div>
          
          <h2 className="text-2xl font-black text-brand-on-surface">{state.user?.name || 'Jean-Marc Kouadio'}</h2>
          <div className="mt-4 flex items-center gap-3 bg-brand-surface-low px-6 py-2.5 rounded-full ring-1 ring-brand-outline/10 shadow-inner">
            <Home size={14} className="text-brand-primary fill-current" />
            <span className="text-[11px] font-black text-brand-on-surface-variant uppercase tracking-widest">{state.user?.houseNumber || 'Villa 42, Green City'}</span>
          </div>
        </section>

        {/* Menu Sections */}
        <div className="space-y-4">
          {/* History */}
          <div className="bg-brand-surface-lowest rounded-3xl p-5 shadow-sm border border-brand-outline/5">
            <p className="text-[10px] font-black text-brand-primary mb-4 uppercase tracking-[0.2em] ml-2">Activité & Commandes</p>
            <button className="w-full flex items-center justify-between p-4 bg-brand-surface-low/50 rounded-2xl group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary-fixed flex items-center justify-center text-brand-primary">
                  <Receipt size={20} />
                </div>
                <span className="font-bold text-brand-on-surface">Historique des commandes</span>
              </div>
              <ChevronRight size={18} className="text-brand-outline opacity-40 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Settings */}
          <div className="bg-brand-surface-lowest rounded-3xl p-5 shadow-sm border border-brand-outline/5 space-y-2">
            <p className="text-[10px] font-black text-brand-primary mb-4 uppercase tracking-[0.2em] ml-2">Paramètres</p>
            
            <button className="w-full flex items-center justify-between p-4 rounded-2xl group hover:bg-brand-surface-low/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-surface-low flex items-center justify-center text-brand-on-surface-variant">
                  <Globe size={20} />
                </div>
                <span className="font-bold text-brand-on-surface">Langue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-outline opacity-60">Français</span>
                <ChevronRight size={18} className="text-brand-outline opacity-40" />
              </div>
            </button>

            <div className="h-px bg-brand-outline/5 mx-4" />

            <button className="w-full flex items-center justify-between p-4 rounded-2xl group hover:bg-brand-surface-low/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-surface-low flex items-center justify-center text-brand-on-surface-variant">
                  <Bell size={20} />
                </div>
                <span className="font-bold text-brand-on-surface">Notifications</span>
              </div>
              <ChevronRight size={18} className="text-brand-outline opacity-40" />
            </button>
          </div>

          {/* Support */}
          <div className="bg-brand-surface-lowest rounded-3xl p-5 shadow-sm border border-brand-outline/5">
            <p className="text-[10px] font-black text-brand-primary mb-4 uppercase tracking-[0.2em] ml-2">Centre de support</p>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl group hover:bg-brand-surface-low/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-surface-low flex items-center justify-center text-brand-on-surface-variant">
                  <HelpCircle size={20} />
                </div>
                <span className="font-bold text-brand-on-surface">Aide & Support</span>
              </div>
              <ChevronRight size={18} className="text-brand-outline opacity-40" />
            </button>
          </div>

          {/* Logout */}
          <div className="pt-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-4 py-5 bg-brand-error/5 text-brand-error rounded-3xl font-black active:scale-95 transition-all border border-brand-error/10"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
