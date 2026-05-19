import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Users, Minus, Plus, Info, ChevronRight, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [isGrouped, setIsGrouped] = useState(true);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = isGrouped ? 1000 : 2500;
  const total = subtotal + deliveryFee;

  const handleOrder = () => {
    navigate('/orders/payment');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-background min-h-screen pb-40"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-brand-primary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-brand-primary">Mon Panier</h1>
        </div>
        {state.cart.length > 0 && (
          <button 
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
            className="p-2 text-brand-primary"
          >
            <Trash2 size={22} />
          </button>
        )}
      </header>

      <main className="px-5 pt-6 space-y-6 max-w-md mx-auto">
        {/* Toggle Grouped Order */}
        <div className="bg-brand-surface-low rounded-[2rem] p-6 border border-brand-outline/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-brand-secondary-container p-3 rounded-2xl text-brand-on-surface">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-brand-on-surface leading-tight text-lg">Commande groupée</h3>
                <p className="text-[11px] font-medium text-brand-on-surface-variant">Réduisez vos frais de livraison avec vos voisins</p>
              </div>
            </div>
            <button 
              onClick={() => setIsGrouped(!isGrouped)}
              className={`w-14 h-8 rounded-full transition-all relative ${isGrouped ? 'bg-brand-primary' : 'bg-brand-outline/20'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isGrouped ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <section className="space-y-4">
          {state.cart.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-brand-surface-low rounded-full flex items-center justify-center text-brand-outline opacity-20">
                <ShoppingCart size={40} />
              </div>
              <p className="text-brand-on-surface-variant font-bold">Votre panier est vide</p>
              <button onClick={() => navigate('/services/grocery')} className="text-brand-primary font-black uppercase text-xs tracking-widest mt-2">Aller à la boutique</button>
            </div>
          ) : (
            state.cart.map((item) => (
              <div key={item.id} className="bg-brand-surface-lowest p-4 rounded-3xl shadow-sm border border-brand-outline/5 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner bg-brand-surface-low shrink-0 flex items-center justify-center text-brand-outline">
                  <ShoppingCart size={24} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-brand-on-surface text-sm leading-tight">{item.name}</h4>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-brand-primary">{item.price.toLocaleString()} FCFA</span>
                    <div className="flex items-center gap-3 bg-brand-surface-low rounded-full px-2 py-1 ring-1 ring-brand-outline/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-brand-primary hover:bg-white rounded-full p-1 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-black px-1 leading-none">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-brand-primary hover:bg-white rounded-full p-1 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500/30 hover:text-red-500 p-2 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </section>

        {/* Summary Card */}
        {state.cart.length > 0 && (
          <section className="bg-brand-surface-highest rounded-[2.5rem] p-8 space-y-5">
            <h3 className="text-lg font-black text-brand-on-surface">Récapitulatif</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-brand-on-surface-variant">
                <span>Sous-total</span>
                <span className="font-bold text-brand-on-surface">{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-brand-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span>Frais de livraison</span>
                  <Info size={14} className="text-brand-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {!isGrouped && <span className="text-[10px] line-through opacity-40">2 500 FCFA</span>}
                  <span className="font-black text-brand-primary">{deliveryFee.toLocaleString()} FCFA</span>
                </div>
              </div>
              <div className="h-px bg-brand-outline/10 my-4" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-black text-brand-on-surface">Total</span>
                <span className="text-2xl font-black text-brand-primary tracking-tight">{total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 pb-28 z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          {state.cart.length > 0 && (
            <button 
              onClick={handleOrder}
              className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 text-lg ring-8 ring-brand-background"
            >
              Passer la commande
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
