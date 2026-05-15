import React from 'react';
import { motion } from 'framer-motion';
import { Search, Construction, Droplets, Bolt, Paintbrush, Star, Verified, Zap, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ARTISANS } from '../data';

export const ArtisansScreen: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Plomberie', icon: Droplets, color: 'bg-brand-primary-container', iconColor: 'text-on-primary-container' },
    { name: 'Menuiserie', icon: Construction, color: 'bg-brand-secondary-container', iconColor: 'text-on-secondary-container' },
    { name: 'Électricité', icon: Bolt, color: 'bg-brand-tertiary', colorClass: 'bg-[#989fa1]', iconColor: 'text-white' },
    { name: 'Peinture', icon: Paintbrush, color: 'bg-brand-surface-highest', iconColor: 'text-brand-on-surface-variant' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <header className="bg-brand-surface shadow-sm flex justify-between items-center w-full px-5 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-secondary-container flex items-center justify-center overflow-hidden border-2 border-brand-primary/20">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3" 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-xl font-bold text-brand-primary tracking-tight">SolutionX</h1>
        </div>
        <button className="text-brand-primary p-2 rounded-full hover:bg-brand-surface-variant/50">
          <Bell size={24} />
        </button>
      </header>

      <main className="px-5 pt-6 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-brand-on-surface mb-6">Annuaire des Artisans</h2>
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" />
            <input 
              type="text" 
              placeholder="Rechercher un service ou un artisan..."
              className="w-full h-14 pl-12 pr-4 rounded-3xl border border-brand-outline/20 bg-brand-surface-lowest focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
        </section>

        {/* Category Bento Grid */}
        <section className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              className={`${cat.colorClass || cat.color} p-6 rounded-3xl flex flex-col items-center justify-center gap-3 aspect-square border border-black/5 hover:shadow-lg active:scale-[0.98] transition-all`}
            >
              <div className="bg-white/20 p-3.5 rounded-full backdrop-blur-sm">
                <cat.icon size={32} className={cat.iconColor} />
              </div>
              <span className="font-bold text-sm tracking-tight">{cat.name}</span>
            </button>
          ))}
        </section>

        {/* Recommended Artisans */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-brand-on-surface">Artisans recommandés</h3>
            <button className="text-brand-primary font-bold text-sm">Voir tout</button>
          </div>
          
          <div className="space-y-4">
            {ARTISANS.map((artisan) => (
              <motion.button 
                whileTap={{ scale: 0.98 }}
                key={artisan.id}
                onClick={() => navigate(`/services/artisans/${artisan.id}`)}
                className="w-full bg-brand-surface-lowest rounded-3xl p-4 flex gap-4 shadow-sm border border-brand-outline/5 hover:border-brand-primary/30 transition-colors text-left"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-brand-surface-low">
                  <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-brand-on-surface">{artisan.name}</h4>
                      <div className="flex items-center gap-1 bg-brand-secondary-fixed px-2 py-0.5 rounded-full">
                        <Star size={10} className="text-brand-on-secondary fill-current" />
                        <span className="text-[10px] font-black">{artisan.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-brand-outline mt-0.5">
                      {artisan.category} • {artisan.experience} ans d'exp.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/5 rounded-full">
                      <Verified size={14} className="text-brand-primary fill-current text-white" />
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide">Certifié SolutionX</span>
                    </div>
                    
                    {artisan.id === '3' && (
                      <div className="flex items-center gap-1 text-brand-error animate-pulse">
                        <Zap size={14} fill="currentColor" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
};
