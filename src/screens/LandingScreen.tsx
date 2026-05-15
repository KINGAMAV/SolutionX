import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary-container to-brand-primary-container" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-gradient-to-b from-brand-surface to-brand-background rounded-full -z-10" />

      {/* Language Switcher */}
      <div className="w-full flex justify-end">
        <div className="flex bg-brand-surface-low rounded-full p-1 border border-brand-outline/20">
          <button className="px-5 py-1.5 rounded-full bg-brand-primary text-white text-xs font-bold transition-all shadow-sm">Français</button>
          <button className="px-5 py-1.5 rounded-full text-brand-on-surface-variant text-xs font-bold hover:bg-brand-surface-variant/50 transition-all">English</button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full aspect-square max-w-[320px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXg-BRUsHCdIi8Ha7UBGAysVA0P7GgyKqyV81Kks0TAptgxv1himqZSyWd9YUjWh5ToWGtsfOM-_NDWH05xpOcEdc8Lx0bkeHpZpoCJYAcFw8pd6dXeQyLfk6j4PYmlKsKarRdql5SPCm0cGNeIkAm3alsID_eZqE1lSWWM8logLwR-1pO5yjc0wkiZjtbwdUjwxJgrrpI_fjjDVP_t-sAj9qhTPp2z-y4sdxufuGDe5bJywcaGnDHSJkaN7M34gvWe1_PP7rLlrtp" 
            alt="Community Welcome" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-black text-brand-primary tracking-tight">Bienvenue sur SolutionX</h1>
          <p className="text-lg font-medium text-brand-on-surface-variant">Votre cité connectée, vos services simplifiés.</p>
        </motion.div>
      </div>

      {/* Features & Action */}
      <div className="w-full max-w-md space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-surface-lowest p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 border border-brand-outline/10 shadow-sm">
            <ShieldCheck size={32} className="text-brand-primary" />
            <span className="text-sm font-bold text-brand-on-surface">Sécurité</span>
          </div>
          <div className="bg-brand-surface-lowest p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 border border-brand-outline/10 shadow-sm">
            <CreditCard size={32} className="text-brand-secondary" />
            <span className="text-sm font-bold text-brand-on-surface">Paiements</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="w-full h-14 bg-brand-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
        >
          Commencer
          <ArrowRight size={24} />
        </button>

        <p className="text-center text-[10px] text-brand-outline font-medium px-8 leading-relaxed">
          En continuant, vous acceptez nos <span className="text-brand-primary font-bold underline underline-offset-2">Conditions d'Utilisation</span> & <span className="text-brand-primary font-bold underline underline-offset-2">Politique de Confidentialité</span>
        </p>
      </div>
    </div>
  );
};
