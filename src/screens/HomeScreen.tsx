import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { 
  ShoppingBasket, Flame, Construction, Bike, Wallet, 
  ChevronRight, Truck, AlertTriangle, Compass, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  // États pour la synchronisation en temps réel (GPS + Alerte)
  const [riderProgress, setRiderProgress] = useState(0);
  const [riderSpeed, setRiderSpeed] = useState('0 km/h');
  const [isLive, setIsLive] = useState(false);
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    // 1. Lire la position GPS simulée du livreur Moussa
    const checkGPS = () => {
      const posString = localStorage.getItem('livreur_position_SOL-92834');
      if (posString) {
        const pos = JSON.parse(posString);
        setRiderProgress(pos.progress);
        setRiderSpeed(pos.speed || '24 km/h');
        setIsLive(pos.status === 'en_route');
      } else {
        setRiderProgress(0);
        setIsLive(false);
      }
    };

    // 2. Lire les alertes de l'administration
    const checkAlert = () => {
      const configString = localStorage.getItem('citeconnect_system_config');
      if (configString) {
        const config = JSON.parse(configString);
        setAlertText(config.alertText || '');
      }
    };

    checkGPS();
    checkAlert();

    // Écouter toutes les secondes pour un ressenti instantané et interactif !
    const interval = setInterval(() => {
      checkGPS();
      checkAlert();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen pb-16"
    >
      <Header userAvatar={state.user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3"} />
      
      <main className="px-5 pt-6 space-y-6">
        {/* Greeting */}
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-brand-on-surface">Bonjour, {state.user?.name || 'Jean-Marc'}</h1>
            <p className="text-brand-on-surface-variant font-medium">Ravi de vous revoir dans votre communauté.</p>
          </div>
          {isLive && (
            <span className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-ping" />
          )}
        </section>

        {/* ALERTE URGENTE DE L'ADMINISTRATION (DIFFUSÉE DEPUIS LE PANEL ADMIN) */}
        <AnimatePresence>
          {alertText && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-brand-primary/10 border-2 border-brand-primary/20 p-4 rounded-3xl flex items-start gap-3 shadow-sm relative overflow-hidden"
            >
              <AlertTriangle className="text-brand-primary shrink-0 mt-0.5 animate-bounce" size={20} />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-brand-primary uppercase tracking-wider">Avis de l'Administration</h4>
                <p className="text-xs font-bold text-brand-on-surface-variant leading-relaxed">{alertText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD DE SUIVI GPS INTERACTIF EN DIRECT DANS L'ACCUEIL */}
        {riderProgress > 0 && riderProgress < 1 ? (
          <button 
            onClick={() => navigate('/orders/tracking')}
            className="w-full bg-brand-surface-lowest rounded-[2rem] p-6 shadow-lg border-2 border-brand-primary/20 text-left active:scale-[0.98] transition-transform space-y-4 relative overflow-hidden group"
          >
            {/* Background glowing gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-50 pointer-events-none" />

            <div className="flex items-center justify-between z-10 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-md animate-pulse">
                  <Bike size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-wider flex items-center gap-1">
                    <Compass size={10} className="animate-spin" />
                    LIVRAISON EN DIRECT (LIVE GPS)
                  </h4>
                  <p className="text-lg font-black text-brand-on-surface mt-0.5">Moussa est en chemin !</p>
                </div>
              </div>
              <span className="text-xs font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">{Math.round(riderProgress * 100)}%</span>
            </div>

            {/* Slider bar with moving bicycle */}
            <div className="relative w-full h-2.5 bg-brand-outline/10 rounded-full border border-brand-outline/10 p-0.5 flex items-center">
              <div 
                className="h-full bg-brand-primary rounded-full transition-all duration-300"
                style={{ width: `${riderProgress * 100}%` }}
              />
              <motion.div 
                className="absolute w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center shadow-md text-white border-2 border-white -ml-3"
                style={{ left: `${riderProgress * 100}%` }}
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              >
                <Bike size={10} />
              </motion.div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black text-brand-on-surface-variant z-10 relative">
              <span>Position: Abidjan, Zone 4</span>
              <span className="text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Ouvrir la Carte
                <ChevronRight size={12} />
              </span>
            </div>
          </button>
        ) : (
          /* Static Default Order Status Card */
          <button 
            onClick={() => navigate('/orders/tracking')}
            className="w-full bg-brand-surface-lowest rounded-2xl p-5 flex items-center justify-between shadow-sm border border-brand-outline/10 text-left active:scale-[0.98] transition-transform group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary p-3 rounded-2xl text-white shadow-md shadow-brand-primary/15">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">Suivi d'activité</p>
                <p className="text-lg font-black text-brand-on-surface mt-0.5">
                  {riderProgress >= 1 ? '🎉 Commande Arrivée !' : '1 commande en cours'}
                </p>
              </div>
            </div>
            <ChevronRight className="text-brand-on-surface-variant group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Services Bento Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brand-on-surface">Nos Services</h2>
            <button className="text-brand-primary font-bold text-sm">Voir tout</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Main Tile */}
            <button 
              onClick={() => navigate('/services/grocery')}
              className="col-span-2 relative h-44 bg-gradient-to-br from-[#f57c00] to-[#ffb786] rounded-[2rem] p-6 overflow-hidden text-left shadow-lg active:scale-[0.98] transition-transform group"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white leading-tight group-hover:scale-[1.02] transition-transform duration-300">Courses<br />alimentaires</h3>
                  <p className="text-white/80 text-xs font-medium mt-1">Livraison express du marché</p>
                </div>
                <div className="flex justify-end">
                  <ShoppingBasket size={48} className="text-white/30" />
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </button>

            {/* Small Tiles */}
            <div className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-brand-secondary-container flex items-center justify-center text-brand-on-surface shadow-sm">
                <span className="font-bold text-xl">♨</span>
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Gaz</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Recharge rapide</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/services/artisans')}
              className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-surface-highest flex items-center justify-center text-brand-primary shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <Construction size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Artisans</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Plomberie, électricité...</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/services/parcel')}
              className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#dde4e6] flex items-center justify-center text-brand-tertiary shadow-sm group-hover:bg-brand-tertiary group-hover:text-white transition-colors">
                <Bike size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Course express</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Un coursier dédié</p>
              </div>
            </button>

            <div className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-brand-secondary-fixed flex items-center justify-center text-brand-on-secondary shadow-sm">
                <Wallet size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Cotisation</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Frais de syndic</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community News */}
        <section className="pb-12">
          <h2 className="text-xl font-bold text-brand-on-surface mb-4">Actualités Résidence</h2>
          <div className="bg-brand-surface-lowest rounded-3xl overflow-hidden shadow-sm border border-brand-outline/10">
            <div className="h-44 w-full bg-brand-surface-variant relative">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZpfpIGO5anJL3HnJ7CqJ1eLijR1l6h4n0z2cOejtcoui2YVuglgL-9WZXTAdvk0w3rOFzmxA5F1GWgI7mx-odGz-LCWjuHpbh0132WdyLd7xuHPQALmGuQzRZpiuws1lZACAJ27BySTBf0XRlyzcDQO1IOOyBRMX7q71wkbSNeiSgLdTagqRAk-wifN8LJIcZPL5DysjQy3CmenKChAk5GHF6TIyw6_LWFAamwnm3TbRSR5zjMrdi-Kxn3YGuPBX7uoX7NxKatWSs" 
                alt="Community Park" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-5">
              <span className="bg-brand-secondary-container text-brand-on-surface px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Aujourd'hui</span>
              <h3 className="text-lg font-bold text-brand-on-surface mt-3 leading-tight">Nouveau système de sécurité</h3>
              <p className="text-sm text-brand-on-surface-variant mt-2 leading-relaxed">
                L'installation des caméras intelligentes débutera ce lundi à l'entrée principale pour renforcer votre sécurité.
              </p>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
