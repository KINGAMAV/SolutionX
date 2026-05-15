import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MapPin, CheckCircle2, Utensils, Box, Bike, Home, Star, ChevronRight } from 'lucide-react';

export const OrderTrackingScreen: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    { label: 'Confirmée', time: '14:05', status: 'completed', icon: CheckCircle2 },
    { label: 'En préparation', time: '14:15', status: 'completed', icon: Utensils },
    { label: 'Prête', time: '14:30', status: 'completed', icon: Box },
    { label: 'En cours de livraison', sub: 'Le livreur approche de votre villa', status: 'active', icon: Bike },
    { label: 'Livrée', sub: "En attente d'arrivée", status: 'upcoming', icon: Home },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-brand-background min-h-screen pb-32"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-brand-primary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-brand-primary">Suivi de commande</h1>
        </div>
        <button className="p-2 text-brand-primary"><Bell size={24} /></button>
      </header>

      <main className="px-5 py-8 space-y-10">
        {/* Map Section */}
        <section className="bg-brand-surface-lowest rounded-3xl overflow-hidden shadow-xl border border-brand-outline/10 h-72 relative">
          <div className="absolute top-0 left-0 w-full p-5 bg-brand-surface-highest/40 backdrop-blur-md flex justify-between items-center z-10 border-b border-white/20">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-secondary fill-brand-secondary/20" />
              <span className="text-sm font-black text-brand-on-surface">Arrivée prévue : 14:45</span>
            </div>
            <span className="px-4 py-1.5 bg-brand-secondary-container text-brand-on-surface rounded-full text-[10px] font-black tracking-widest">EN COURS</span>
          </div>
          
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEMDkicu-vBhQgR5bNhNld9bb0rG2ckcqCGFP3eyajMEfggMJPBuDItU-nEiK0uP7luXHzcMGzcZWC9voATyxcPhnKjJ9FrQ5JIiQnpKcNWneClmZIb3Deon1LQzexspnRSh4Jy9vBEtNbc0HHqBtE3UtcEOW5IUwHjrCXJmPars_dgHEKDsHeVkX8A0Lt36Av4pbwfyPY3JDKRpbn1CbykqLMn-7IP86CgEDdOy8o8VcS2qi4bBXdrMnySG51pxrMLZcFMkX8QD46" 
            alt="Tracking Map" 
            className="w-full h-full object-cover grayscale opacity-60"
          />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative group">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-16 -left-12 bg-brand-primary text-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-2xl skew-x-[-4deg] whitespace-nowrap"
              >
                Livreur : Moussa
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-brand-primary" />
              </motion.div>
              <div className="w-16 h-16 bg-brand-primary-container rounded-3xl flex items-center justify-center text-white shadow-2xl relative">
                <Bike size={32} />
                <div className="absolute -bottom-2 w-10 h-1 bg-black/10 blur-md rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Status Tracker */}
        <section className="bg-brand-surface-lowest p-8 rounded-[2.5rem] shadow-sm border border-brand-outline/10 space-y-8">
          <h2 className="text-xl font-black text-brand-on-surface border-b border-brand-outline/10 pb-6">État de votre commande</h2>
          
          <div className="space-y-1">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-6 relative pb-10 last:pb-0">
                  {i < steps.length - 1 && (
                    <div className={`absolute left-5 top-10 bottom-0 w-[2px] ${step.status === 'completed' ? 'bg-brand-primary' : 'bg-brand-outline/10 border-l border-dashed border-brand-primary'}`} />
                  )}
                  
                  <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    step.status === 'completed' ? 'bg-brand-primary text-white' : 
                    step.status === 'active' ? 'bg-brand-secondary-container text-brand-on-surface ring-8 ring-brand-secondary-container/10 scale-110' : 
                    'bg-brand-surface-low text-brand-outline'
                  }`}>
                    <Icon size={20} className={step.status === 'active' ? 'animate-pulse' : ''} />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-black tracking-tight ${
                      step.status === 'active' ? 'text-brand-primary text-lg leading-none' : 
                      step.status === 'upcoming' ? 'text-brand-outline text-sm opacity-50' : 
                      'text-brand-on-surface text-base'
                    }`}>
                      {step.label}
                    </p>
                    {(step.time || step.sub) && (
                      <p className={`text-xs font-medium mt-1 ${step.status === 'upcoming' ? 'italic opacity-40' : 'text-brand-on-surface-variant'}`}>
                        {step.time ? `Reçue à ${step.time}` : step.sub}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-brand-outline uppercase tracking-widest">Détails de la commande</h3>
            <span className="text-xs font-black text-brand-primary">#SOL-92834</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-brand-on-surface-variant">2x Poulet Braisé ATTIÉKÉ</span>
              <span className="font-bold text-sm">12,000 FCFA</span>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-brand-on-surface-variant">1x Alloco (Format Large)</span>
              <span className="font-bold text-sm">2,500 FCFA</span>
            </div>
            <div className="h-px bg-brand-outline/5" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-xl font-black text-brand-on-surface">Total</span>
              <span className="text-2xl font-black text-brand-primary">16,000 FCFA</span>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/orders/payment')}
          className="w-full h-16 bg-brand-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all text-lg"
        >
          <Star size={24} className="fill-current" />
          Noter la commande
        </button>
      </main>
    </motion.div>
  );
};
