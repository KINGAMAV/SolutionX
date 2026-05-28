import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Megaphone } from 'lucide-react';

// Mock data (sera connecté à une table `ads` plus tard)
const ADS = [
  { id: 1, brand: 'Orange CI', title: 'Fibre Optique à -30%', subtitle: 'Offre limitée résidence', color: 'from-orange-500 to-orange-600' },
  { id: 2, brand: 'MTN MoMo', title: 'Cashback 10%', subtitle: 'Sur tous vos retraits', color: 'from-yellow-400 to-yellow-500' },
  { id: 3, brand: 'Gaz Express', title: 'Livraison offerte', subtitle: '1ère commande > 10.000 FCFA', color: 'from-[#00843D] to-[#006b31]' },
  { id: 4, brand: 'Syndic Résidence', title: 'AG Annuelle', subtitle: 'Samedi 15h • Salle commune', color: 'from-[#003366] to-[#002244]' },
];

export const AdBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll toutes les 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ADS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll automatique vers l'item actif
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 0;
      const gap = 12; // gap-3 = 12px
      scrollRef.current.scrollTo({ left: currentIndex * (cardWidth + gap), behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <section className="relative mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-brand-primary" />
          <span className="text-sm font-bold text-brand-on-surface">Annonces & Promos</span>
        </div>
        <span className="text-xs text-brand-on-surface-variant">{currentIndex + 1} / {ADS.length}</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ADS.map((ad, i) => (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`snap-center shrink-0 w-[280px] h-36 rounded-2xl bg-gradient-to-br ${ad.color} p-4 flex flex-col justify-between shadow-md relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform`}
          >
            {/* Effet décoratif */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">{ad.brand}</span>
              <h3 className="text-white text-lg font-bold leading-tight mt-1">{ad.title}</h3>
              <p className="text-white/80 text-xs mt-0.5">{ad.subtitle}</p>
            </div>
            
            <div className="relative z-10 flex justify-end">
              <ChevronRight className="w-5 h-5 text-white/70" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};