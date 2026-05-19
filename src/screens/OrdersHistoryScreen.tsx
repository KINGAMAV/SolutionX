import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, ChevronRight, Clock, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrdersHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      className="bg-brand-background min-h-screen pb-32"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-brand-primary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-brand-primary">Historique</h1>
        </div>
      </header>

      <main className="px-5 py-8 space-y-6 max-w-md mx-auto">
        {state.orders.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4 opacity-40">
            <Box size={64} className="text-brand-outline" />
            <p className="font-bold text-brand-on-surface">Aucune commande passée</p>
          </div>
        ) : (
          state.orders.map((order) => (
            <motion.button
              key={order.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/orders/tracking')}
              className="w-full bg-brand-surface-lowest p-6 rounded-[2rem] shadow-sm border border-brand-outline/5 text-left space-y-4 hover:border-brand-primary/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-brand-on-surface">Commande #{order.id}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-brand-outline mt-1 uppercase tracking-widest">
                    <Clock size={12} />
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-brand-primary/10 text-brand-primary animate-pulse'
                }`}>
                  {order.status === 'confirmed' ? 'En cours' : 
                   order.status === 'delivered' ? 'Livrée' : 'Confirmée'}
                </span>
              </div>

              <div className="flex items-center gap-3 py-3 border-y border-brand-outline/5">
                <div className="flex -space-x-2">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-brand-surface-low border-2 border-brand-surface-lowest flex items-center justify-center text-brand-outline">
                      <Box size={14} />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-brand-on-surface-variant italic">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''} • {order.total.toLocaleString()} FCFA
                </p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-2 text-brand-primary">
                  <MapPin size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Suivre la livraison</span>
                </div>
                <ChevronRight size={18} className="text-brand-outline opacity-40" />
              </div>
            </motion.button>
          ))
        )}
      </main>
    </motion.div>
  );
};
