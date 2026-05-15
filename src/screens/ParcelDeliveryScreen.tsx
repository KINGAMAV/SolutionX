import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Flag, Navigation, Info, Truck } from 'lucide-react';

export const ParcelDeliveryScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="bg-brand-background min-h-screen pb-32"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-brand-primary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-brand-primary">Nouvelle Course</h1>
        </div>
      </header>

      <main className="px-5 py-8 space-y-8 max-w-md mx-auto">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-brand-on-surface tracking-tight">Coursier Express</h2>
          <p className="text-sm font-medium text-brand-on-surface-variant">Besoin d'un coursier ? Renseignez les détails ci-dessous.</p>
        </div>

        {/* Address Selectors */}
        <div className="bg-brand-surface-low rounded-[2rem] p-6 shadow-sm space-y-6 border border-brand-outline/10">
          <div className="relative flex items-start gap-4">
            <div className="flex flex-col items-center pt-3">
              <MapPin size={20} className="text-brand-primary fill-brand-primary/20" />
              <div className="w-[2px] h-12 bg-brand-outline-variant/30 my-2 border-l border-dashed border-brand-primary" />
              <Flag size={20} className="text-brand-secondary fill-brand-secondary/20" />
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-widest ml-1">Point de ramassage</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Entrez l'adresse de départ"
                    className="w-full bg-brand-surface-lowest border-none shadow-sm ring-1 ring-brand-outline/10 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary hover:bg-brand-primary/10 p-1.5 rounded-xl">
                    <Navigation size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-widest ml-1">Destination</label>
                <input 
                  type="text" 
                  placeholder="Où livrer ?"
                  className="w-full bg-brand-surface-lowest border-none shadow-sm ring-1 ring-brand-outline/10 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-widest ml-4">Description de la course</label>
          <textarea 
            placeholder="Ex: Récupérer un pli à l'accueil, acheter des médicaments, livraison de repas..."
            rows={4}
            className="w-full bg-brand-surface-low border-none ring-1 ring-brand-outline/10 rounded-[2rem] px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
          />
        </div>

        {/* Map Preview */}
        <div className="h-44 rounded-[2.5rem] overflow-hidden relative shadow-lg group border-4 border-white">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuALXFhBnGW60GWvBC0HQDwUlHZIWf_adyHdmSrPTLrBx845bOC3xg2cm7K5K7WA-eIUfddzJcYgBhzoO6nWf0Kk_sVRV40Cu5Ta4vt5ptQWK5HaviPmns7puXNG7cjLQ_BBsW6BUWnBRZAkGs4rHsY9umVWR-B3e4SXJEUQ30zipNnNrgtw6_OiJnO_0d-yVMM3lj0zszB6gpZ7WtWeEcBTGlKr3aZZewBwMJ-13_m0K5NcVUJV5IrMfQh4ofEQyH1AxiuuzBkV6cRF" 
            alt="Map" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale" 
          />
          <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
          <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl border border-brand-primary/10">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Truck size={14} className="text-brand-primary" />
            </motion.div>
            <span className="text-[10px] font-black text-brand-on-surface uppercase tracking-widest">Calcul de distance...</span>
          </div>
        </div>

        {/* Estimation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-secondary-fixed rounded-[2rem] p-8 border border-brand-secondary/20 shadow-xl relative overflow-hidden"
        >
          <div className="absolute -right-5 -top-5 w-24 h-24 bg-brand-secondary opacity-10 rounded-full blur-2xl" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-brand-on-secondary-fixed uppercase tracking-[0.2em]">Estimation des frais</span>
            <Info size={20} className="text-brand-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-brand-on-secondary-fixed">2.500</span>
            <span className="text-sm font-bold text-brand-on-secondary-fixed opacity-60">FCFA</span>
          </div>
          <p className="text-[10px] font-bold text-brand-on-secondary-fixed opacity-50 mt-4 leading-relaxed">
            Le prix définitif peut varier selon le trafic et le type de colis.
          </p>
        </motion.div>

        {/* Action */}
        <button 
          onClick={() => navigate('/orders/tracking')}
          className="w-full h-16 bg-brand-primary text-white rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 ring-8 ring-brand-primary/5"
        >
          <Navigation size={22} className="fill-current" />
          Commander la course
        </button>
      </main>
    </motion.div>
  );
};
