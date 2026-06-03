import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { AdBanner } from '../components/AdBanner';
import { ShoppingBasket, Construction, Bike, Wallet, ChevronRight, Truck, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen"
    >
      <Header userAvatar={state.user?.avatar} />
      
      <main className="px-5 pt-6 space-y-6">
        {/* Greeting */}
        <section>
          <h1 className="text-2xl font-bold text-brand-on-surface">Bonjour, {state.user?.name || 'Voisin'}</h1>
          <p className="text-brand-on-surface-variant font-medium">Ravi de vous revoir dans votre communauté.</p>
        </section>

        {/* Ad Banner - Géré par Admin */}
        <AdBanner />

        {/* Activity Tracking Card */}
        <button 
          onClick={() => navigate('/orders/tracking')}
          className="w-full bg-brand-surface-highest rounded-2xl p-4 flex items-center justify-between shadow-sm border border-brand-outline/10 text-left active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="bg-brand-primary p-3 rounded-full text-white">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-primary">Suivi d'activité</p>
              <p className="text-lg font-bold text-brand-on-surface">1 commande en cours</p>
            </div>
          </div>
          <ChevronRight className="text-brand-on-surface-variant" />
        </button>

        {/* Services Bento Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brand-on-surface">Nos Services</h2>
            <button className="text-brand-primary font-bold text-sm">Voir tout</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Main Tile - Courses alimentaires */}
            <button 
              onClick={() => navigate('/services/grocery')}
              className="col-span-2 relative h-44 bg-gradient-to-br from-[#f57c00] to-[#ffb786] rounded-[2rem] p-6 overflow-hidden text-left shadow-lg active:scale-[0.98] transition-transform"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight">Courses<br />alimentaires</h3>
                  <p className="text-white/80 text-xs font-medium">Livraison express du marché</p>
                </div>
                <div className="flex justify-end">
                  <ShoppingBasket size={48} className="text-white/30" />
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </button>

            {/* 🔥 Gaz - Bouton fonctionnel */}
            <button 
              onClick={() => navigate('/catalog?service=gaz')}
              className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-secondary-container flex items-center justify-center text-brand-on-surface">
                <Flame size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Gaz</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Recharge rapide</p>
              </div>
            </button>

            {/* 🔧 Artisans */}
            <button 
              onClick={() => navigate('/catalog?service=artisans')}
              className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-surface-highest flex items-center justify-center text-brand-primary">
                <Construction size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Artisans</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Plomberie, électricité...</p>
              </div>
            </button>

            {/* 🚴 Course express */}
            <button 
              onClick={() => navigate('/catalog?service=cours-express')}
              className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#dde4e6] flex items-center justify-center text-brand-tertiary">
                <Bike size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Course express</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Un coursier dédié</p>
              </div>
            </button>

            {/* 💰 Cotisation - Bouton fonctionnel UNIQUE */}
            <button 
              onClick={() => navigate('/orders/payment?purpose=cotisation&amount=7500&description=Cotisation%20syndicale')}
              className="bg-brand-surface-low rounded-[2rem] p-5 h-44 flex flex-col justify-between border border-brand-outline/10 active:scale-[0.98] transition-transform text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-secondary-fixed flex items-center justify-center text-brand-on-secondary">
                <Wallet size={22} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface">Cotisation</h3>
                <p className="text-brand-on-surface-variant text-[10px] font-medium uppercase tracking-wide">Frais de syndic</p>
              </div>
            </button>
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