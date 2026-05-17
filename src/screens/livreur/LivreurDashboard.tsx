import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, MapPin, Package, CheckCircle2, ChevronRight, LogOut, 
  Clock, Route, Store, Compass, Play, FastForward, Award,
  DollarSign, Star, TrendingUp, Car, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS } from '../../data';
import { Order } from '../../types';

export const LivreurDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'earnings'>('active');

  // État du simulateur de localisation
  const [isSharing, setIsSharing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('24 km/h');
  
  // Paramètres véhicule
  const [vehicle, setVehicle] = useState<'velo' | 'moto' | 'voiture'>('velo');

  // Charger les configurations initiales
  useEffect(() => {
    const savedPos = localStorage.getItem('livreur_position_SOL-92834');
    if (savedPos) {
      const pos = JSON.parse(savedPos);
      setProgress(pos.progress);
      setIsSharing(pos.status === 'en_route');
      setSpeed(pos.speed || '24 km/h');
    }

    const savedVehicle = localStorage.getItem('livreur_vehicle_SOL-92834');
    if (savedVehicle) {
      setVehicle(savedVehicle as any);
    }
  }, []);

  // Effet de simulation du mouvement en temps réel
  useEffect(() => {
    let intervalId: any;
    if (isSharing && progress < 1) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(prev + 0.05, 1);
          const baseSpeed = vehicle === 'velo' ? 18 : vehicle === 'moto' ? 32 : 45;
          const currentSpeed = next >= 1 ? '0 km/h' : `${Math.floor(baseSpeed + Math.random() * 6)} km/h`;
          setSpeed(currentSpeed);
          
          localStorage.setItem('livreur_position_SOL-92834', JSON.stringify({
            progress: next,
            speed: currentSpeed,
            status: next >= 1 ? 'completed' : 'en_route',
            lastUpdated: new Date().toLocaleTimeString()
          }));

          if (next >= 1) {
            setIsSharing(false);
            clearInterval(intervalId);
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSharing, progress, vehicle]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/welcome');
  };

  const handleStartDelivery = () => {
    setIsSharing(true);
    if (progress >= 1) {
      setProgress(0);
    }
    localStorage.setItem('livreur_position_SOL-92834', JSON.stringify({
      progress: progress >= 1 ? 0 : progress,
      speed: vehicle === 'velo' ? '18 km/h' : vehicle === 'moto' ? '32 km/h' : '45 km/h',
      status: 'en_route',
      lastUpdated: new Date().toLocaleTimeString()
    }));
  };

  const handlePauseDelivery = () => {
    setIsSharing(false);
    localStorage.setItem('livreur_position_SOL-92834', JSON.stringify({
      progress,
      speed: '0 km/h',
      status: 'paused',
      lastUpdated: new Date().toLocaleTimeString()
    }));
  };

  const handleSpeedUp = () => {
    setProgress((prev) => {
      const next = Math.min(prev + 0.20, 1);
      const currentSpeed = next >= 1 ? '0 km/h' : '55 km/h';
      setSpeed(currentSpeed);
      localStorage.setItem('livreur_position_SOL-92834', JSON.stringify({
        progress: next,
        speed: currentSpeed,
        status: next >= 1 ? 'completed' : 'en_route',
        lastUpdated: new Date().toLocaleTimeString()
      }));
      return next;
    });
  };

  const handleMarkAsDelivered = () => {
    setProgress(1);
    setIsSharing(false);
    setSpeed('0 km/h');
    
    localStorage.removeItem('livreur_position_SOL-92834');
    
    const order = MOCK_ORDERS.find(o => o.id === 'SOL-92834');
    if (order) {
      order.status = 'delivered';
    }

    alert("Félicitations ! Commande marquée comme Livrée avec succès !");
    navigate('/welcome');
  };

  const handleVehicleChange = (type: 'velo' | 'moto' | 'voiture') => {
    setVehicle(type);
    localStorage.setItem('livreur_vehicle_SOL-92834', type);
  };

  // Filtrer les commandes
  const availableOrders = MOCK_ORDERS.filter(o => o.status !== 'delivered');
  const activeDelivery = MOCK_ORDERS.find(o => o.livreurId === state.user?.id && o.status !== 'delivered');

  // Données de revenus
  const dailyEarnings = [
    { day: 'Lun', value: 8500 },
    { day: 'Mar', value: 12000 },
    { day: 'Mer', value: 15000 },
    { day: 'Jeu', value: 18500 },
    { day: 'Ven', value: 14000 }
  ];

  return (
    <div className="min-h-screen bg-brand-background flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-surface-lowest border-r border-brand-outline/10 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/10">
              <Bike className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-black text-brand-primary text-xl">Livreur</h1>
              <p className="text-xs font-medium text-brand-on-surface-variant">CitéConnect</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 flex md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all min-w-[max-content] w-full ${activeTab === 'active' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <Route size={18} />
            Ma course actuelle
          </button>
          <button 
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all min-w-[max-content] w-full ${activeTab === 'available' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <Package size={18} />
            Courses disponibles
            <div className="ml-auto bg-brand-secondary-container text-brand-on-surface text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
              {availableOrders.length}
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all min-w-[max-content] w-full ${activeTab === 'earnings' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <DollarSign size={18} />
            Historique & Revenus
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
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* 1. COURSE ACTUELLE */}
            {activeTab === 'active' && (
              <div className="space-y-6 max-w-3xl">
                <h2 className="text-2xl font-black text-brand-on-surface">Course active</h2>
                
                {activeDelivery ? (
                  <div className="space-y-6">
                    
                    {/* SIMULATEUR GPS INTELLIGENT DE LOCALISATION */}
                    <div className="bg-brand-surface-lowest rounded-3xl p-6 shadow-lg border-2 border-brand-primary/10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Compass className={`text-brand-primary ${isSharing ? 'animate-spin' : ''}`} size={22} />
                          <h3 className="font-black text-lg text-brand-on-surface">Partage de Position GPS</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isSharing ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-brand-outline/10 text-brand-outline'
                        }`}>
                          {isSharing ? 'GPS Actif' : 'GPS Inactif'}
                        </span>
                      </div>

                      {/* Sélecteur de véhicule */}
                      <div className="bg-brand-surface-low p-4 rounded-2xl flex items-center justify-between border border-brand-outline/10">
                        <span className="text-xs font-bold text-brand-on-surface-variant flex items-center gap-1.5">
                          <Settings size={14} /> Mode de transport :
                        </span>
                        <div className="flex gap-1.5">
                          {[
                            { type: 'velo', label: 'Vélo', icon: Bike },
                            { type: 'moto', label: 'Moto', icon: Bike },
                            { type: 'voiture', label: 'Auto', icon: Car }
                          ].map(item => (
                            <button
                              key={item.type}
                              onClick={() => handleVehicleChange(item.type as any)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase transition-all ${
                                vehicle === item.type 
                                  ? 'bg-brand-primary text-white shadow-sm' 
                                  : 'bg-white text-brand-on-surface-variant border border-brand-outline/10 hover:bg-brand-surface-low'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 bg-brand-surface-low p-5 rounded-2xl border border-brand-outline/10">
                        <div className="flex justify-between items-center text-xs font-black text-brand-on-surface-variant">
                          <span>Trajet effectué : {Math.round(progress * 100)}%</span>
                          <span>Vitesse ({vehicle.toUpperCase()}) : {speed}</span>
                        </div>
                        <div className="w-full h-3.5 bg-brand-outline/10 rounded-full overflow-hidden p-0.5 border border-brand-outline/15">
                          <motion.div 
                            className="h-full bg-brand-primary rounded-full"
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ type: 'tween' }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-brand-outline font-mono">
                          GPS SIM: {(5.3164 + progress * 0.032).toFixed(5)}, {(-3.9875 - progress * 0.014).toFixed(5)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {!isSharing ? (
                          <button 
                            onClick={handleStartDelivery}
                            className="flex-1 min-w-[150px] h-12 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-brand-primary/95 transition-all text-sm active:scale-95"
                          >
                            <Play size={16} />
                            Démarrer le trajet
                          </button>
                        ) : (
                          <button 
                            onClick={handlePauseDelivery}
                            className="flex-1 min-w-[150px] h-12 bg-brand-tertiary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:bg-brand-tertiary/95 transition-all text-sm active:scale-95"
                          >
                            <span className="flex gap-1 items-center justify-center shrink-0">
                              <span className="w-1 h-3.5 bg-white rounded-full" />
                              <span className="w-1 h-3.5 bg-white rounded-full" />
                            </span>
                            Pause
                          </button>
                        )}

                        {isSharing && progress < 1 && (
                          <button 
                            onClick={handleSpeedUp}
                            className="px-5 h-12 bg-brand-secondary-container text-brand-on-surface rounded-xl font-bold flex items-center justify-center gap-2 border border-brand-outline/10 hover:bg-brand-secondary-container/90 transition-all text-sm active:scale-95"
                          >
                            <FastForward size={16} />
                            Accélérer (+20%)
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Delivery details card */}
                    <div className="bg-brand-surface-lowest rounded-3xl p-6 shadow-md border border-brand-outline/10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="bg-brand-primary/10 text-brand-primary font-black px-3 py-1 rounded-lg text-sm border border-brand-primary/20">
                            Commande #{activeDelivery.id.split('-')[1]}
                          </span>
                          <h3 className="font-bold text-xl mt-3 text-brand-on-surface">Client: Jean-Marc</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-brand-on-surface-variant">À livrer d'ici</p>
                          <p className="text-2xl font-black text-brand-on-surface">{activeDelivery.deliveryTime}</p>
                        </div>
                      </div>

                      <div className="relative pl-6 py-2 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-outline/20 before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-brand-surface-lowest bg-brand-tertiary text-white shadow shrink-0 z-10 -ml-[11px]">
                            <Store size={10} />
                          </div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] px-4">
                            <h4 className="font-bold text-brand-on-surface">Restaurant "Le Maquis"</h4>
                            <p className="text-sm font-medium text-brand-on-surface-variant">Zone 4, Rue des Jardins</p>
                          </div>
                        </div>

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-brand-surface-lowest bg-brand-primary text-white shrink-0 z-10 -ml-[11px]">
                            <MapPin size={10} />
                          </div>
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] px-4">
                            <h4 className="font-bold text-brand-on-surface">Domicile Client</h4>
                            <p className="text-sm font-medium text-brand-on-surface-variant">Villa 124, Cocody</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-brand-outline/10 space-y-4">
                        <button 
                          onClick={handleMarkAsDelivered}
                          disabled={progress < 1}
                          className={`w-full h-14 rounded-2xl font-bold shadow-lg transition-all text-lg flex items-center justify-center gap-2 ${
                            progress >= 1 
                              ? 'bg-brand-primary text-white active:scale-95 cursor-pointer' 
                              : 'bg-brand-surface-high text-brand-outline opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle2 size={24} />
                          {progress >= 1 ? 'Marquer comme Livré' : 'En cours de déplacement...'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-brand-on-surface-variant bg-brand-surface-lowest rounded-3xl border border-dashed border-brand-outline/20">
                    <CheckCircle2 size={48} className="mb-4 opacity-50" />
                    <p className="font-bold">Vous n'avez aucune course en cours.</p>
                    <button 
                      onClick={() => setActiveTab('available')}
                      className="mt-4 text-brand-primary font-bold hover:underline"
                    >
                      Voir les courses disponibles
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. COURSES DISPONIBLES */}
            {activeTab === 'available' && (
              <div className="space-y-6 max-w-4xl">
                <h2 className="text-2xl font-black text-brand-on-surface">Courses disponibles</h2>
                <p className="text-brand-on-surface-variant font-medium">Acceptez une demande pour commencer la livraison.</p>

                <div className="grid gap-4 mt-6">
                  {availableOrders.map((order, i) => (
                    <div key={i} className="bg-brand-surface-lowest rounded-2xl p-5 shadow-sm border border-brand-outline/10 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-brand-surface-low rounded-xl flex items-center justify-center text-brand-on-surface-variant group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-brand-on-surface">Commande #{order.id.split('-')[1]}</span>
                            <span className="text-[10px] font-black uppercase text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
                              + {order.deliveryFee} CFA
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-brand-on-surface-variant">
                            <Clock size={12} /> Prêt à {order.createdAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                          <p className="text-sm font-bold text-brand-on-surface">Zone 4 → Cocody</p>
                          <p className="text-xs font-medium text-brand-on-surface-variant">~ 4.2 km</p>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveTab('active');
                            handleStartDelivery();
                          }}
                          className="flex-1 md:flex-none border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
                        >
                          Accepter la course
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {availableOrders.length === 0 && (
                    <p className="text-center text-brand-on-surface-variant py-10 font-bold">Aucune course pour le moment.</p>
                  )}
                </div>
              </div>
            )}

            {/* 3. HISTORIQUE & REVENUS (NOUVEAU COMPTE LIVREUR PREMIUM !) */}
            {activeTab === 'earnings' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface">Rapport d'Activité & Revenus</h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">Analyser vos gains, courses terminées et vos notes.</p>
                </div>

                {/* Métriques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-brand-surface-lowest p-6 rounded-[2rem] border border-brand-outline/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Total Revenus</span>
                      <h3 className="text-2xl font-black text-brand-primary mt-1">68 000 CFA</h3>
                      <p className="text-[10px] font-bold text-green-600 mt-0.5">+12% cette semaine</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 text-brand-primary rounded-xl flex items-center justify-center">
                      <DollarSign size={24} />
                    </div>
                  </div>

                  <div className="bg-brand-surface-lowest p-6 rounded-[2rem] border border-brand-outline/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Courses Terminées</span>
                      <h3 className="text-2xl font-black text-brand-on-surface mt-1">34 courses</h3>
                      <p className="text-[10px] font-bold text-brand-outline mt-0.5">Taux de réussite : 100%</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                  </div>

                  <div className="bg-brand-surface-lowest p-6 rounded-[2rem] border border-brand-outline/10 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Note Moyenne</span>
                      <h3 className="text-2xl font-black text-brand-on-surface mt-1 flex items-center gap-1">
                        4.9 <Star size={20} className="text-yellow-500 fill-current" />
                      </h3>
                      <p className="text-[10px] font-bold text-brand-outline mt-0.5">Basé sur 28 avis clients</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                      <Star size={24} />
                    </div>
                  </div>
                </div>

                {/* Graphique de revenus des 5 derniers jours (Visual Flex columns) */}
                <div className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-brand-outline/10 pb-4">
                    <h3 className="font-black text-lg text-brand-on-surface">Historique de vos gains journaliers</h3>
                    <span className="text-xs font-bold text-brand-on-surface-variant flex items-center gap-1">
                      <TrendingUp size={14} className="text-brand-primary" /> +2 500 CFA moyenne
                    </span>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
                    {dailyEarnings.map((item, index) => {
                      // Calculer la hauteur relative (la valeur max est 18500)
                      const pct = (item.value / 18500) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                          <span className="text-xs font-black text-brand-on-surface">{item.value} CFA</span>
                          
                          {/* Bar block with dynamic height */}
                          <div className="w-full bg-brand-surface-low rounded-t-2xl overflow-hidden relative h-40 flex items-end shadow-inner">
                            <motion.div 
                              className="w-full bg-gradient-to-t from-brand-primary to-brand-primary-container rounded-t-2xl"
                              initial={{ height: 0 }}
                              animate={{ height: `${pct}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
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
    </div>
  );
};
