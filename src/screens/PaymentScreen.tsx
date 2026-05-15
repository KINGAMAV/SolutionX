import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Smartphone, Wallet, Building, CreditCard, Lock, Download, CheckCircle2 } from 'lucide-react';

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();

  const methods = [
    { name: 'Orange Money', sub: 'Rapide et sécurisé', selected: true, icon: Smartphone, color: 'bg-[#ff7900]/10', iconColor: 'text-[#ff7900]' },
    { name: 'Wave', sub: 'Frais réduits', selected: false, icon: Wallet, color: 'bg-blue-100', iconColor: 'text-blue-500' },
    { name: 'MTN MoMo', sub: 'Paiement instantané', selected: false, icon: Smartphone, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { name: 'Carte Bancaire', sub: 'Visa, Mastercard', selected: false, icon: CreditCard, color: 'bg-brand-surface-low', iconColor: 'text-brand-primary' },
  ];

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
          <h1 className="text-xl font-bold text-brand-primary">Paiement</h1>
        </div>
        <button className="p-2 text-brand-primary group active:scale-90 transition-transform">
          <Bell size={24} />
        </button>
      </header>

      <main className="px-5 py-10 space-y-12 max-w-md mx-auto">
        {/* Invoice Summary Card */}
        <section className="bg-brand-surface-lowest rounded-[2.5rem] p-10 shadow-2xl border border-brand-outline/5 relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary opacity-20" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-[0.2em] opacity-60">Montant dû</p>
            <h2 className="text-5xl font-black text-brand-primary tracking-tighter">45,000 <span className="text-2xl font-bold">FCFA</span></h2>
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-brand-surface-low rounded-full text-brand-on-surface-variant font-bold text-xs ring-4 ring-brand-surface-low/30">
            <Calendar size={14} className="text-brand-primary" />
            Echéance: 05 Octobre 2023
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-brand-on-surface ml-2">Moyens de paiement</h3>
          <div className="space-y-3">
            {methods.map((method) => (
              <motion.button 
                whileTap={{ scale: 0.98 }}
                key={method.name} 
                className={`w-full p-5 rounded-[1.75rem] flex items-center gap-5 transition-all outline-none ${
                  method.selected 
                    ? 'bg-brand-surface-lowest border-4 border-brand-primary shadow-xl scale-[1.02]' 
                    : 'bg-brand-surface-lowest border border-brand-outline/10 shadow-sm hover:border-brand-primary/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center ${method.iconColor} shrink-0`}>
                  <method.icon size={28} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-black text-brand-on-surface leading-tight">{method.name}</h4>
                  <p className="text-xs font-medium text-brand-on-surface-variant opacity-60">{method.sub}</p>
                </div>
                {method.selected && (
                  <CheckCircle2 size={24} className="text-brand-primary fill-current text-white" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Secure Footer */}
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center justify-center gap-3 py-2 px-8 bg-brand-surface-low rounded-full border border-brand-outline/5 opacity-80">
            <Lock size={16} className="text-brand-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-outline">Paiement 100% sécurisé et crypté</span>
          </div>

          <div className="w-full space-y-6">
            <button 
              onClick={() => navigate('/orders')}
              className="w-full h-16 bg-brand-primary text-white rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all ring-8 ring-brand-primary/10"
            >
              Payer 45,000 FCFA
            </button>
            
            <div className="flex flex-col items-center gap-4">
              <button className="flex items-center gap-3 text-brand-primary font-black text-sm hover:underline hover:scale-105 transition-all">
                <Download size={20} />
                Télécharger le dernier reçu
              </button>
              <p className="text-[11px] font-medium text-brand-outline text-center leading-relaxed px-10">
                Le reçu de cette transaction sera disponible immédiatement après confirmation du paiement par l'opérateur.
              </p>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
