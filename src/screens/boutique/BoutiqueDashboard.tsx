import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, ShoppingBag, TrendingUp, PackageSearch, LogOut, CheckCircle2, 
  Clock, X, Edit, Trash, Plus, Check, Star, DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS, PRODUCTS } from '../../data';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
}

export const BoutiqueDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  // Navigation par onglets
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics'>('orders');

  // Gestion de la liste des produits (CRUD local avec persistance)
  const [catalog, setCatalog] = useState<ProductItem[]>([]);
  const [productModal, setProductModal] = useState<{ open: boolean; product: ProductItem | null }>({ open: false, product: null });
  const [formProduct, setFormProduct] = useState({
    name: '',
    price: 0,
    category: 'Plat chaud',
    inStock: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdhsrtZPXBCLLKZj-f8mHWNveZHN7GMZ-pm7voTVC9HPMqcD6avK_f6ZRYdE1YP-1pbP5Q3VWNDreOtqDquugXaoGjnXmzyaurnsOQbPqVAILvOVn_ITR3nzRSoS42cEOrRNt0iB6KjN1BKe46AGbpyYbOh6s2jDISJI1Q2EmtXJONp_MAu6pa-aUhY8mjXyrywOqUdZMjZRUjFqFSFluuXcK5G_NeTYwnRqQn4KIS0Sz1fepvn1BIt3cD6mINcXZqIJ0jFycsbWJg'
  });

  useEffect(() => {
    // Initialiser le catalogue
    const savedCatalog = localStorage.getItem('boutique_catalog_SOL-92834');
    if (savedCatalog) {
      setCatalog(JSON.parse(savedCatalog));
    } else {
      const initialCatalog = PRODUCTS.map(p => ({
        ...p,
        inStock: true
      }));
      setCatalog(initialCatalog);
      localStorage.setItem('boutique_catalog_SOL-92834', JSON.stringify(initialCatalog));
    }
  }, []);

  const saveCatalog = (updated: ProductItem[]) => {
    setCatalog(updated);
    localStorage.setItem('boutique_catalog_SOL-92834', JSON.stringify(updated));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/welcome');
  };

  // ACTIONS CATALOGUE (CRUD)
  const handleOpenAddModal = () => {
    setFormProduct({
      name: '',
      price: 0,
      category: 'Plat chaud',
      inStock: true,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdhsrtZPXBCLLKZj-f8mHWNveZHN7GMZ-pm7voTVC9HPMqcD6avK_f6ZRYdE1YP-1pbP5Q3VWNDreOtqDquugXaoGjnXmzyaurnsOQbPqVAILvOVn_ITR3nzRSoS42cEOrRNt0iB6KjN1BKe46AGbpyYbOh6s2jDISJI1Q2EmtXJONp_MAu6pa-aUhY8mjXyrywOqUdZMjZRUjFqFSFluuXcK5G_NeTYwnRqQn4KIS0Sz1fepvn1BIt3cD6mINcXZqIJ0jFycsbWJg'
    });
    setProductModal({ open: true, product: null });
  };

  const handleOpenEditModal = (p: ProductItem) => {
    setFormProduct({
      name: p.name,
      price: p.price,
      category: p.category,
      inStock: p.inStock,
      image: p.image
    });
    setProductModal({ open: true, product: p });
  };

  const handleSaveProduct = () => {
    if (!formProduct.name || formProduct.price <= 0) {
      alert("Veuillez saisir un nom et un prix valides !");
      return;
    }

    if (productModal.product) {
      // MODE EDITION
      const updated = catalog.map(item => {
        if (item.id === productModal.product?.id) {
          return {
            ...item,
            name: formProduct.name,
            price: Number(formProduct.price),
            category: formProduct.category,
            inStock: formProduct.inStock
          };
        }
        return item;
      });
      saveCatalog(updated);
    } else {
      // MODE AJOUT
      const newProduct: ProductItem = {
        id: `p-${Date.now()}`,
        name: formProduct.name,
        price: Number(formProduct.price),
        category: formProduct.category,
        image: formProduct.image,
        inStock: formProduct.inStock
      };
      saveCatalog([...catalog, newProduct]);
    }
    setProductModal({ open: false, product: null });
  };

  const handleDeleteProduct = (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer ce produit de votre catalogue ?")) return;
    const updated = catalog.filter(item => item.id !== id);
    saveCatalog(updated);
  };

  const handleToggleStock = (id: string) => {
    const updated = catalog.map(item => {
      if (item.id === id) {
        return { ...item, inStock: !item.inStock };
      }
      return item;
    });
    saveCatalog(updated);
  };

  // Filtrer les commandes mockées
  const activeOrders = MOCK_ORDERS.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  // Stats Analytics
  const weeklySales = [
    { day: 'Lun', sales: 25000 },
    { day: 'Mar', sales: 42500 },
    { day: 'Mer', sales: 18000 },
    { day: 'Jeu', sales: 38000 },
    { day: 'Ven', sales: 54000 },
    { day: 'Sam', sales: 78000 },
    { day: 'Dim', sales: 62000 }
  ];

  return (
    <div className="min-h-screen bg-brand-background flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-brand-surface-lowest border-b border-brand-outline/10 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-tertiary rounded-xl flex items-center justify-center text-brand-on-tertiary shadow-md">
            <Store size={16} />
          </div>
          <div>
            <h1 className="font-black text-brand-on-surface text-sm leading-none">Boutique</h1>
            <p className="text-[9px] font-bold text-brand-on-surface-variant uppercase mt-0.5">CitéConnect</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 bg-red-50 text-red-500 rounded-xl active:scale-95 transition-all"
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-brand-surface-lowest border-r border-brand-outline/10 flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-tertiary rounded-xl flex items-center justify-center">
              <Store className="text-brand-on-tertiary" size={20} />
            </div>
            <div>
              <h1 className="font-black text-brand-on-surface text-xl leading-none">Boutique</h1>
              <p className="text-[10px] font-bold text-brand-on-surface-variant uppercase mt-1">CitéConnect Merchant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all w-full ${activeTab === 'orders' ? 'bg-brand-tertiary text-brand-on-tertiary shadow-md shadow-brand-tertiary/20' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <ShoppingBag size={18} />
            Commandes en cours
            <div className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
              {activeOrders.length}
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all w-full ${activeTab === 'products' ? 'bg-brand-tertiary text-brand-on-tertiary shadow-md shadow-brand-tertiary/20' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <PackageSearch size={18} />
            Mon Catalogue
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all w-full ${activeTab === 'analytics' ? 'bg-brand-tertiary text-brand-on-tertiary shadow-md shadow-brand-tertiary/20' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <TrendingUp size={18} />
            Statistiques & Ventes
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* 1. COMMANDES EN COURS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black text-brand-on-surface">Bonjour {state.user?.name || "Commerçant"} 👋</h2>
                    <p className="text-brand-on-surface-variant font-medium mt-1">Vous avez {activeOrders.length} nouvelles commandes en préparation aujourd'hui.</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-brand-surface-lowest px-5 py-3 rounded-2xl shadow-sm border border-brand-outline/10 text-center">
                      <p className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Revenus du jour</p>
                      <p className="text-xl font-black text-brand-primary mt-1">42 500 CFA</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {activeOrders.map(order => (
                    <div key={order.id} className="bg-brand-surface-lowest rounded-3xl p-6 shadow-md border border-brand-outline/10 flex flex-col justify-between h-[320px]">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-brand-tertiary/10 text-brand-tertiary font-black px-3 py-1 rounded-lg text-xs border border-brand-tertiary/20">
                            #{order.id.split('-')[1]}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
                            <Clock size={12} />
                            À préparer
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm font-medium">
                              <span className="text-brand-on-surface">
                                <span className="font-bold text-brand-tertiary">{item.quantity}x</span> {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-brand-outline/10">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-brand-on-surface-variant">Total Payé</span>
                          <span className="text-lg font-black text-brand-on-surface">{order.total} CFA</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 bg-brand-surface-variant text-brand-on-surface rounded-xl py-3 text-xs font-bold active:scale-95 transition-all hover:bg-brand-surface-high">
                            Refuser
                          </button>
                          <button className="flex-1 bg-brand-tertiary text-brand-on-tertiary rounded-xl py-3 text-xs font-bold active:scale-95 transition-all shadow-md shadow-brand-tertiary/20">
                            Prêt au retrait
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeOrders.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-brand-on-surface-variant bg-brand-surface-lowest rounded-3xl border border-dashed border-brand-outline/20">
                      <CheckCircle2 size={48} className="mb-4 opacity-50 text-brand-tertiary" />
                      <p className="font-bold">Aucune commande en attente.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. GESTION CATALOGUE (CRUD COMPLET AVEC MODALES) */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-brand-on-surface">Mon Catalogue Produits</h2>
                    <p className="text-brand-on-surface-variant font-medium mt-1">Ajouter, modifier ou retirer les articles de votre vitrine.</p>
                  </div>
                  <button 
                    onClick={handleOpenAddModal}
                    className="bg-brand-tertiary text-brand-on-tertiary px-5 py-3 rounded-2xl font-bold shadow-md hover:bg-brand-tertiary/95 transition-all flex items-center gap-2 text-sm active:scale-95"
                  >
                    <Plus size={16} />
                    Ajouter un produit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                  {catalog.map(product => (
                    <div key={product.id} className="bg-brand-surface-lowest rounded-[2rem] overflow-hidden shadow-md border border-brand-outline/10 flex flex-col justify-between group">
                      <div>
                        <div className="h-44 w-full overflow-hidden bg-brand-surface-low relative">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <button
                            onClick={() => handleToggleStock(product.id)}
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-sm transition-all ${
                              product.inStock 
                                ? 'bg-green-500/90 text-white' 
                                : 'bg-red-500/90 text-white'
                            }`}
                          >
                            {product.inStock ? 'En Stock' : 'Rupture'}
                          </button>
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] uppercase tracking-widest font-black text-brand-tertiary">{product.category}</span>
                          <h3 className="font-bold text-brand-on-surface mt-1 leading-snug">{product.name}</h3>
                          <p className="font-black text-lg text-brand-on-surface mt-3">{product.price} CFA</p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(product)}
                          className="flex-1 py-2.5 bg-brand-surface-low text-brand-tertiary rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-brand-tertiary hover:text-white transition-all"
                        >
                          <Edit size={14} />
                          Editer
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                          title="Supprimer"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ANALYTICS / STATISTIQUES */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface">Statistiques & Revenus Hebdomadaires</h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">Analyse financière et jours de pic d'activité.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-brand-surface-lowest p-6 rounded-[2rem] border border-brand-outline/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Chiffre d'Affaires</span>
                      <h3 className="text-2xl font-black text-brand-tertiary mt-1">317 500 CFA</h3>
                      <p className="text-[10px] font-bold text-green-600 mt-0.5">+18% vs semaine dernière</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <DollarSign size={24} />
                    </div>
                  </div>

                  <div className="bg-brand-surface-lowest p-6 rounded-[2rem] border border-brand-outline/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Commandes Servies</span>
                      <h3 className="text-2xl font-black text-brand-on-surface mt-1">87 plats</h3>
                      <p className="text-[10px] font-bold text-brand-outline mt-0.5">Note satisfaction : 98%</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 text-brand-primary rounded-xl flex items-center justify-center">
                      <ShoppingBag size={24} />
                    </div>
                  </div>

                  <div className="bg-brand-surface-lowest p-6 rounded-[2rem] border border-brand-outline/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Note Restaurant</span>
                      <h3 className="text-2xl font-black text-brand-on-surface mt-1 flex items-center gap-1">
                        4.8 <Star size={20} className="text-yellow-500 fill-current" />
                      </h3>
                      <p className="text-[10px] font-bold text-brand-outline mt-0.5">Top 3 des restaurants de la cité</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                      <Star size={24} />
                    </div>
                  </div>
                </div>

                {/* Graphique de ventes des 7 jours */}
                <div className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-brand-outline/10 pb-4">
                    <h3 className="font-black text-lg text-brand-on-surface">Volume de Ventes (CFA)</h3>
                    <span className="text-xs font-bold text-brand-on-surface-variant uppercase">7 derniers jours</span>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2">
                    {weeklySales.map((item, index) => {
                      const pct = (item.sales / 78000) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                          <span className="text-[9px] font-black text-brand-on-surface hidden md:inline">{item.sales}</span>
                          
                          <div className="w-full bg-brand-surface-low rounded-t-xl overflow-hidden relative h-40 flex items-end">
                            <motion.div 
                              className="w-full bg-gradient-to-t from-brand-tertiary to-[#f7b994] rounded-t-xl"
                              initial={{ height: 0 }}
                              animate={{ height: `${pct}%` }}
                              transition={{ duration: 0.8, delay: index * 0.08 }}
                            />
                          </div>

                          <span className="text-xs font-bold text-brand-on-surface-variant uppercase">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ============================================================== */}
      {/* MODALE CRUD PRODUIT */}
      {/* ============================================================== */}
      {productModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-2xl max-w-md w-full space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-brand-on-surface">
                {productModal.product ? 'Modifier l\'article' : 'Ajouter un Produit'}
              </h3>
              <button 
                onClick={() => setProductModal({ open: false, product: null })}
                className="p-1.5 hover:bg-brand-surface-low rounded-xl text-brand-outline"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Nom de l'article</label>
                <input 
                  type="text" 
                  placeholder="Ex: Poulet Braisé ATTIÉKÉ"
                  value={formProduct.name} 
                  onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Prix unitaire (CFA)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 4500"
                  value={formProduct.price || ''} 
                  onChange={(e) => setFormProduct({ ...formProduct, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Catégorie</label>
                <select
                  value={formProduct.category}
                  onChange={(e) => setFormProduct({ ...formProduct, category: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none font-bold"
                >
                  <option value="Plat chaud">Plats chauds</option>
                  <option value="Boissons">Boissons</option>
                  <option value="Céréales">Céréales</option>
                  <option value="Épicerie">Épicerie</option>
                </select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="stock-checkbox"
                  checked={formProduct.inStock} 
                  onChange={(e) => setFormProduct({ ...formProduct, inStock: e.target.checked })}
                  className="w-5 h-5 accent-brand-tertiary cursor-pointer"
                />
                <label htmlFor="stock-checkbox" className="text-sm font-bold text-brand-on-surface select-none cursor-pointer">
                  Disponible immédiatement (En stock)
                </label>
              </div>
            </div>

            <button 
              onClick={handleSaveProduct}
              className="w-full py-4 bg-brand-tertiary text-brand-on-tertiary font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Enregistrer le produit
            </button>
          </motion.div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface-lowest/95 backdrop-blur-md border-t border-brand-outline/10 py-3.5 px-6 flex justify-around items-center z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'orders' ? 'text-brand-tertiary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] font-black tracking-wide">Commandes</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'products' ? 'text-brand-tertiary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <PackageSearch size={20} />
          <span className="text-[10px] font-black tracking-wide">Catalogue</span>
        </button>

        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'analytics' ? 'text-brand-tertiary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <TrendingUp size={20} />
          <span className="text-[10px] font-black tracking-wide">Ventes</span>
        </button>
      </nav>

    </div>
  );
};
