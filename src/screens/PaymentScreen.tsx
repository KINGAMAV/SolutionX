import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Smartphone, Wallet, CreditCard, Lock, Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('Orange Money');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 1000; // Simplified for now
  const total = subtotal + deliveryFee;

  const methods = [
    { name: 'Orange Money', sub: 'Rapide et sécurisé', icon: Smartphone, color: 'bg-[#ff7900]/10', iconColor: 'text-[#ff7900]' },
    { name: 'Wave', sub: 'Frais réduits', icon: Wallet, color: 'bg-blue-100', iconColor: 'text-blue-500' },
    { name: 'MTN MoMo', sub: 'Paiement instantané', icon: Smartphone, color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { name: 'Carte Bancaire', sub: 'Visa, Mastercard', icon: CreditCard, color: 'bg-brand-surface-low', iconColor: 'text-brand-primary' },
  ];

  const handlePayment = async () => {
    if (state.cart.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);

      // 1. Prepare Order Data
      const orderId = `SOL-${Math.floor(10000 + Math.random() * 90000)}`;
      const orderData = {
        id: orderId,
        user_id: state.user?.id,
        status: 'confirmed',
        total: total,
        delivery_fee: deliveryFee,
        items: state.cart,
        delivery_time: '14:45',
        carrier_name: 'Moussa',
        payment_status: 'paid'
      };

      // 2. Save to Supabase
      const { error: dbError } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          user_id: state.user?.id,
          status: 'confirmed',
          total: total,
          delivery_fee: deliveryFee,
          payment_status: 'paid',
          delivery_time: '14:45',
          items: state.cart // Stockage JSON pour affichage rapide
        }]);

      if (dbError) throw dbError;

      // 2b. Save detailed items for analytics
      const orderItems = state.cart.map(item => ({
        order_id: orderId,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      await supabase.from('order_items').insert(orderItems);

      // 3. Update local state
      dispatch({ 
        type: 'ADD_ORDER', 
        payload: {
          id: orderId,
          userId: state.user?.id || '',
          status: 'confirmed',
          total: total,
          deliveryFee: deliveryFee,
          items: state.cart,
          createdAt: new Date().toISOString(),
          paymentStatus: 'paid'
        } 
      });

      // 4. Clear Cart
      dispatch({ type: 'CLEAR_CART' });

      // 5. Navigate to tracking
      setTimeout(() => {
        navigate('/orders/tracking');
      }, 1500);

    } catch (err: any) {
      console.error('Payment/Order error:', err);
      setError(err.message || "Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (state.cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
        <AlertCircle size={64} className="text-brand-outline opacity-20 mb-4" />
        <h2 className="text-xl font-bold text-brand-on-surface">Panier vide</h2>
        <p className="text-brand-outline mt-2">Vous n'avez pas de commande en cours.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-10 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs">Retourner à l'accueil</button>
      </div>
    );
  }

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
            <h2 className="text-5xl font-black text-brand-primary tracking-tighter">
              {total.toLocaleString()} <span className="text-2xl font-bold">FCFA</span>
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-brand-surface-low rounded-full text-brand-on-surface-variant font-bold text-xs ring-4 ring-brand-surface-low/30">
            <Calendar size={14} className="text-brand-primary" />
            Échéance: Aujourd'hui
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
                onClick={() => setSelectedMethod(method.name)}
                className={`w-full p-5 rounded-[1.75rem] flex items-center gap-5 transition-all outline-none ${
                  selectedMethod === method.name 
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
                {selectedMethod === method.name && (
                  <CheckCircle2 size={24} className="text-brand-primary fill-current text-white" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-3xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Secure Footer */}
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center justify-center gap-3 py-2 px-8 bg-brand-surface-low rounded-full border border-brand-outline/5 opacity-80">
            <Lock size={16} className="text-brand-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-outline">Paiement 100% sécurisé et crypté</span>
          </div>

          <div className="w-full space-y-6">
            <button 
              disabled={loading}
              onClick={handlePayment}
              className="w-full h-16 bg-brand-primary text-white rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all ring-8 ring-brand-primary/10 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Traitement...</span>
                </div>
              ) : (
                `Payer ${total.toLocaleString()} FCFA`
              )}
            </button>
            
            <div className="flex flex-col items-center gap-4">
              <button className="flex items-center gap-3 text-brand-primary font-black text-sm hover:underline hover:scale-105 transition-all">
                <Download size={20} />
                Besoin d'aide ?
              </button>
              <p className="text-[11px] font-medium text-brand-outline text-center leading-relaxed px-10">
                En cliquant sur "Payer", vous acceptez nos conditions générales de vente et d'utilisation.
              </p>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
