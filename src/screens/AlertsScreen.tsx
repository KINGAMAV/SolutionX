import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Info, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';

export const AlertsScreen: React.FC = () => {
  const alerts = [
    { title: 'Taux de syndic', sub: 'Votre facture de Mai est disponible.', icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Sécurité Résidence', sub: 'Nouvelle équipe de garde ce weekend.', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Information Eau', sub: 'Coupure d\'eau prévue demain matin.', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="bg-brand-background min-h-screen pb-32"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <h1 className="text-xl font-black text-brand-primary tracking-tight">Alertes</h1>
        <button className="p-2 text-brand-primary"><Mail size={24} /></button>
      </header>

      <main className="px-5 pt-8 space-y-4">
        {alerts.map((alert, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-brand-surface-lowest p-5 rounded-3xl shadow-sm border border-brand-outline/5 flex items-center gap-5 active:scale-[0.98] transition-transform"
          >
            <div className={`w-14 h-14 rounded-2xl ${alert.bg} flex items-center justify-center ${alert.color}`}>
              <alert.icon size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-brand-on-surface text-lg leading-tight">{alert.title}</h3>
              <p className="text-sm font-medium text-brand-on-surface-variant opacity-60 mt-1">{alert.sub}</p>
            </div>
          </motion.div>
        ))}
      </main>
    </motion.div>
  );
};
