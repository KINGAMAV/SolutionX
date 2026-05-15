import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ShoppingCart, Bell, Heart, Plus } from 'lucide-react';
import { PRODUCTS } from '../data';
import { useApp } from '../context/AppContext';

export const GroceryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const categories = ['Tout', 'Épicerie', 'Frais', 'Boissons', 'Pharmacie'];

  const addToCart = (product: typeof PRODUCTS[0]) => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pb-32"
    >
      <header className="bg-brand-surface shadow-sm fixed top-0 w-full z-50 h-16 flex justify-between items-center px-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary-fixed overflow-hidden flex items-center justify-center text-brand-primary">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-brand-primary tracking-tight">SolutionX</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center bg-brand-surface-low rounded-full hover:bg-brand-surface-variant transition-all">
            <ShoppingCart size={22} className="text-brand-primary" />
            <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-brand-surface">{state.cart.length}</span>
          </Link>
          <button className="w-10 h-10 flex items-center justify-center bg-brand-surface-low rounded-full hover:bg-brand-surface-variant transition-all">
            <Bell size={22} className="text-brand-outline" />
          </button>
        </div>
      </header>

      <main className="mt-20 px-5 space-y-6">
        <section className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" />
            <input 
              type="text" 
              placeholder="Rechercher des produits..." 
              className="w-full h-12 pl-12 pr-4 rounded-2xl border-none bg-brand-surface-lowest text-sm font-medium shadow-sm ring-1 ring-brand-outline/10 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>
          <button className="h-12 w-12 flex items-center justify-center bg-brand-secondary-container rounded-2xl text-brand-on-surface shadow-sm active:scale-95 transition-all">
            <SlidersHorizontal size={22} />
          </button>
        </section>

        {/* Categories scroll */}
        <section className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                i === 0 
                  ? 'bg-brand-primary text-white shadow-md' 
                  : 'bg-brand-surface-lowest text-brand-on-surface-variant shadow-sm border border-brand-outline/5 hover:bg-brand-surface-variant transition-colors'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -4 }}
              className="bg-brand-surface-lowest rounded-3xl overflow-hidden shadow-sm flex flex-col border border-brand-outline/5"
            >
              <div className="aspect-square relative group">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-brand-primary shadow-sm active:scale-90 transition-all">
                  <Heart size={18} />
                </button>
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-1">{product.category}</span>
                <h3 className="font-bold text-brand-on-surface text-sm leading-tight mb-3 h-10 line-clamp-2">{product.name}</h3>
                
                <div className="mt-auto flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-brand-primary font-black text-lg">{product.price.toLocaleString()} FCFA</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-10 h-10 bg-brand-primary-container text-white rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <section className="relative h-44 w-full rounded-[2.5rem] overflow-hidden shadow-lg mt-4">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-95" />
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmjijZUpGaSqmU0sHfdftmDAu4xdpi9zwhXwK5jukeh--Znsrd6fnaoe7zf_LzkO8MmEiYGZLQEqn8m6TTh6j0RJN59EkH9JW-0v1mWUs6VtSMrT1e2lHFn1a_UlqHT6dq0SrWNaC_fN6Ux57UatvdzUybSYZuAZCs8WaOUMV17igw3yWYfwcaQvztbiVNlB3o34oc0ijA5VxOIfGURBKiPBFDJNKvi4XkZOvhaaVcUHphZfKmNVOE7Rqx2wSi_LQO8voBHZaZjbtF" 
            alt="Fruits" 
            className="absolute right-0 top-0 h-full w-3/5 object-cover mix-blend-overlay"
          />
          <div className="relative z-10 h-full p-8 flex flex-col justify-center max-w-[60%]">
            <h2 className="text-2xl font-black text-white leading-tight mb-1">Offre du Weekend</h2>
            <p className="text-white/80 text-sm font-medium mb-4">-15% sur tous les produits frais de saison.</p>
            <button className="self-start px-6 py-2 bg-white text-brand-primary rounded-full text-xs font-black shadow-lg">Commander</button>
          </div>
        </section>
      </main>

      {/* Floating Checkout */}
      <div className="fixed bottom-24 right-5 z-40">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/cart')}
          className="bg-brand-primary text-white h-16 px-8 rounded-2xl shadow-2xl flex items-center gap-3 font-bold ring-4 ring-white/20"
        >
          <ShoppingCart size={24} />
          <span>Check out</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
