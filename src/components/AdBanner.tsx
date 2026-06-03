import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone } from 'lucide-react';

export interface Advertisement {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  color: string;
  isActive: boolean;
  durationDays: number;
  startDate: string;
  endDate: string;
}

// Mock data par défaut
const DEFAULT_ADS: Advertisement[] = [
  { 
    id: 'ad-1', 
    brand: 'Orange CI', 
    title: 'Fibre Optique à -30%', 
    subtitle: 'Offre limitée résidence', 
    color: 'from-orange-500 to-orange-600', 
    isActive: true,
    durationDays: 30,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 'ad-2', 
    brand: 'MTN MoMo', 
    title: 'Cashback 10%', 
    subtitle: 'Sur tous vos retraits', 
    color: 'from-yellow-400 to-yellow-500', 
    isActive: true,
    durationDays: 30,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 'ad-3', 
    brand: 'Gaz Express', 
    title: 'Livraison offerte', 
    subtitle: '1ère commande > 10.000 FCFA', 
    color: 'from-[#00843D] to-[#006b31]', 
    isActive: true,
    durationDays: 30,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
];

export const AdBanner = () => {
  const [ads, setAds] = useState<Advertisement[]>(DEFAULT_ADS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Charger les publicités depuis localstorage
  useEffect(() => {
    const savedAds = localStorage.getItem('concorde_ads');
    if (savedAds) {
      try {
        const parsed = JSON.parse(savedAds);
        // Filtrer les pubs actives et non expirées
        const now = new Date();
        const activeAds = parsed.filter((ad: Advertisement) => {
          const isActive = ad.isActive;
          const isNotExpired = new Date(ad.endDate) > now;
          return isActive && isNotExpired;
        });
        setAds(activeAds.length > 0 ? activeAds : DEFAULT_ADS);
      } catch {
        setAds(DEFAULT_ADS);
      }
    }
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];
  const daysRemaining = Math.max(0, Math.ceil((new Date(currentAd.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <section className="relative mb-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Megaphone className="w-4 h-4 text-brand-primary flex-shrink-0" />
        <span className="text-sm font-bold text-brand-on-surface">Annonces & Promos</span>
      </div>

      <div className="relative w-full overflow-hidden bg-brand-surface-lowest/40 rounded-2xl h-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${currentAd.color} p-6 flex flex-col justify-between shadow-lg overflow-hidden`}
          >
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">{currentAd.brand}</span>
              <h3 className="text-white text-3xl font-black leading-tight mt-3">{currentAd.title}</h3>
              <p className="text-white/80 text-sm mt-2 max-w-xl">{currentAd.subtitle}</p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-white/90 text-sm font-bold">
              <span>{currentIndex + 1} / {ads.length}</span>
              <span>{daysRemaining}j restants</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};