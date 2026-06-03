import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, MapPin, Package, CheckCircle2, ChevronRight, LogOut, 
  Clock, Route, Store, Compass, Play, FastForward, Award,
  DollarSign, Star, TrendingUp, Car, Settings, Phone, MessageSquare,
  AlertCircle, Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS } from '../../data';
import { Order } from '../../types';

interface UnifiedMission {
  id: string;
  type: 'order' | 'parcel'; // order = commande boutique, parcel = colis
  clientName: string;
  clientPhone?: string;
  pickupAddress?: string;
  deliveryAddress: string;
  description?: string;
  estimatedPrice?: number;
  total?: number;
  status: string;
  createdAt: string;
  livreurId?: string;
}

export const LivreurDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'earnings'>('active');

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
    if (isSharing && progress < 1 && activeDelivery) {
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(prev + 0.05, 1);
          const baseSpeed = vehicle === 'velo' ? 18 : vehicle === 'moto' ? 32 : 45;
          const currentSpeed = next >= 1 ? '0 km/h' : `${Math.floor(baseSpeed + Math.random() * 6)} km/h`;
          setSpeed(currentSpeed);
          
          // Mise à jour GPS réelle en base
          const lat = 5.3164 + next * 0.032;
          const lng = -3.9875 - next * 0.014;
          updateGPS(activeDelivery.id, lat, lng);

          if (next >= 1) {
            setIsSharing(false);
            clearInterval(intervalId);
          }
          return next;
        });
      }, 3000);
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

  const handleMarkAsDelivered = async () => {
    if (!activeDelivery) return;
    
    // Déterminer la table et le champ ID approprié
    const isParcel = activeDelivery.type === 'parcel';
    const tableName = isParcel ? 'parcel_deliveries' : 'orders';
    
    const { error } = await supabase
      .from(tableName)
      .update({ status: 'delivered' })
      .eq('id', activeDelivery.id);

    if (!error) {
      setProgress(1);
      setIsSharing(false);
      setSpeed('0 km/h');
      alert("Félicitations ! Livraison marquée comme complétée avec succès !");
    } else {
      alert("Erreur : " + error.message);
    }
  };

  const handleVehicleChange = (type: 'velo' | 'moto' | 'voiture') => {
    setVehicle(type);
    localStorage.setItem('livreur_vehicle_SOL-92834', type);
  };

  // Gestion des missions unifiées (commandes + colis)
  const [unifiedMissions, setUnifiedMissions] = useState<UnifiedMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      
      // Récupérer les commandes de boutiques
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'delivered')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });
      
      // Récupérer les colis
      const { data: parcels } = await supabase
        .from('parcel_deliveries')
        .select('*')
        .neq('status', 'delivered')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

      // Transformer les données en missions unifiées
      const missions: UnifiedMission[] = [];

      if (orders) {
        orders.forEach(order => {
          missions.push({
            id: order.id,
            type: 'order',
            clientName: order.user_id ? `Client ${order.user_id.slice(0, 8)}` : 'Client',
            deliveryAddress: 'Adresse de livraison',
            total: order.total,
            status: order.status,
            createdAt: order.created_at,
            livreurId: order.livreur_id
          });
        });
      }

      if (parcels) {
        parcels.forEach(parcel => {
          missions.push({
            id: parcel.id,
            type: 'parcel',
            clientName: parcel.user_id ? `Résident ${parcel.user_id.slice(0, 8)}` : 'Résident',
            pickupAddress: parcel.pickup_address,
            deliveryAddress: parcel.delivery_address,
            description: parcel.description,
            estimatedPrice: parcel.estimated_price,
            status: parcel.status,
            createdAt: parcel.created_at,
            livreurId: parcel.livreur_id
          });
        });
      }

      setUnifiedMissions(missions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    };

    fetchMissions();

    // Écouter les changements en temps réel
    const ordersChannel = supabase
      .channel('livreur-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchMissions();
      })
      .subscribe();

    const parcelsChannel = supabase
      .channel('livreur-parcels')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parcel_deliveries' }, () => {
        fetchMissions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(parcelsChannel);
    };
  }, []);

  const availableMissions = unifiedMissions.filter(m => !m.livreurId && (m.status === 'ready' || m.status === 'confirmed'));
  const activeDelivery = unifiedMissions.find(m => m.livreurId === state.user?.id);

  const handleAcceptMission = async (missionId: string, type: 'order' | 'parcel') => {
    const tableName = type === 'parcel' ? 'parcel_deliveries' : 'orders';
    const newStatus = type === 'parcel' ? 'delivering' : 'delivering';
    
    const { error } = await supabase
      .from(tableName)
      .update({ 
        livreur_id: state.user?.id,
        status: newStatus
      })
      .eq('id', missionId);
    
    if (error) alert("Erreur : " + error.message);
  };

  const updateGPS = async (missionId: string, lat: number, lng: number) => {
    if (!activeDelivery) return;
    
    const tableName = activeDelivery.type === 'parcel' ? 'parcel_deliveries' : 'orders';
    
    await supabase
      .from(tableName)
      .update({ 
        latitude: lat,
        longitude: lng
      })
      .eq('id', missionId);
  };

  const currentLatitude = 5.3164 + progress * 0.032;
  const currentLongitude = -3.9875 - progress * 0.014;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentLongitude - 0.012}%2C${currentLatitude - 0.008}%2C${currentLongitude + 0.012}%2C${currentLatitude + 0.008}&layer=mapnik&marker=${currentLatitude}%2C${currentLongitude}`;

  // Actions de communication rapide
  const handleCallClient = (clientName: string) => {
    alert(`Appel à ${clientName} en cours... (Simulation)`);
  };

  const handleSendMessage = (clientName: string, missionType: string) => {
    const messages = {
      order: "Je suis en route pour votre commande ! ⏱️",
      parcel: "Je viens chercher votre colis ! 📦"
    };
    alert(`Message envoyé à ${clientName}: "${messages[missionType as keyof typeof messages]}"`);
  };

  const handleOpenMaps = (address: string) => {
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  // Données de revenus
  const dailyEarnings = [
    { day: 'Lun', value: 8500 },
    { day: 'Mar', value: 12000 },
    { day: 'Mer', value: 15000 },
    { day: 'Jeu', value: 18500 },
    { day: 'Ven', value: 14000 }
  ];

  return (
    <div className="min-h-screen bg-brand-background flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-brand-surface-lowest border-b border-brand-outline/10 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-md">
            <Bike size={16} />
          </div>
          <div>
            <h1 className="font-black text-brand-primary text-sm leading-none">Livreur</h1>
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
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/10">
              <Bike className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-black text-brand-primary text-xl">Livreur</h1>
              <p className="text-xs font-medium text-brand-on-surface-variant">CitéConnect</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all w-full ${activeTab === 'active' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <Route size={18} />
            Ma mission actuelle
          </button>
          <button 
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all w-full ${activeTab === 'available' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <Package size={18} />
            Missions disponibles
            <div className="ml-auto bg-brand-secondary-container text-brand-on-surface text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
              {availableMissions.length}
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('earnings')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all w-full ${activeTab === 'earnings' ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/15' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
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
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* 1. MISSION ACTUELLE */}
            {activeTab === 'active' && (
              <div className="space-y-6 max-w-3xl">
                <h2 className="text-2xl font-black text-brand-on-surface">Mission actuelle</h2>
                
                <div className="bg-brand-surface-lowest rounded-3xl border border-brand-outline/10 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 bg-brand-background/80 border-b border-brand-outline/10 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-base text-brand-on-surface">Carte de géolocalisation</h3>
                      <p className="text-[11px] text-brand-on-surface-variant">Position actuelle du livreur.</p>
                    </div>
                    <span className="text-[11px] font-bold text-brand-primary">{isSharing ? 'En route' : 'Hors service'}</span>
                  </div>
                  <div className="h-64 sm:h-72">
                    <iframe
                      title="Carte du livreur"
                      src={mapUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>

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
                          GPS SIM: {currentLatitude.toFixed(5)}, {currentLongitude.toFixed(5)}
                        </p>
                      </div>

                      <div className="bg-brand-surface-lowest rounded-3xl border border-brand-outline/10 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 bg-brand-background/80 border-b border-brand-outline/10 flex items-center justify-between">
                          <div>
                            <h3 className="font-black text-base text-brand-on-surface">Carte de géolocalisation</h3>
                            <p className="text-[11px] text-brand-on-surface-variant">Position actuelle du livreur en temps réel.</p>
                          </div>
                          <span className="text-[11px] font-bold text-brand-primary">{isSharing ? 'En route' : 'En pause'}</span>
                        </div>
                        <div className="h-64 sm:h-72">
                          <iframe
                            title="Carte du livreur"
                            src={mapUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {!isSharing ? (
                          <button 
                            onClick={handleStartDelivery}
                            className="flex-1 min-w-[150px] h-12 bg-brand-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
                          >
                            <Play size={16} /> Démarrer la course
                          </button>
                        ) : (
                          <button 
                            onClick={handlePauseDelivery}
                            className="flex-1 min-w-[150px] h-12 bg-orange-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
                          >
                            <Clock size={16} /> Pause
                          </button>
                        )}
                        
                        <button 
                          onClick={handleSpeedUp}
                          className="flex-1 min-w-[150px] h-12 bg-brand-secondary-container text-brand-on-surface rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
                        >
                          <FastForward size={16} /> Accélérer
                        </button>
                      </div>

                      <button 
                        onClick={handleMarkAsDelivered}
                        className="w-full h-12 bg-green-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
                      >
                        <CheckCircle2 size={16} /> Marquer comme livrée
                      </button>
                    </div>

                    {/* DÉTAILS DE LA MISSION ACTUELLE */}
                    <div className="bg-brand-surface-lowest rounded-3xl p-6 shadow-lg border border-brand-outline/10 space-y-4">
                      <h3 className="font-black text-lg text-brand-on-surface flex items-center gap-2">
                        {activeDelivery.type === 'order' ? <Store size={20} /> : <Package size={20} />}
                        Détails de la mission
                      </h3>

                      <div className="space-y-3 bg-brand-surface-low p-4 rounded-2xl border border-brand-outline/10">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-brand-on-surface-variant">Client</span>
                          <span className="font-bold text-brand-on-surface">{activeDelivery.clientName}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-brand-on-surface-variant">Type</span>
                          <span className="font-bold text-brand-on-surface capitalize">{activeDelivery.type === 'order' ? 'Commande Boutique' : 'Colis'}</span>
                        </div>
                        {activeDelivery.pickupAddress && (
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-brand-on-surface-variant">Récupération</span>
                            <span className="font-bold text-brand-on-surface text-right">{activeDelivery.pickupAddress}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-brand-on-surface-variant">Livraison</span>
                          <span className="font-bold text-brand-on-surface text-right">{activeDelivery.deliveryAddress}</span>
                        </div>
                        {activeDelivery.total && (
                          <div className="flex justify-between items-start pt-2 border-t border-brand-outline/10">
                            <span className="text-xs font-bold text-brand-on-surface-variant">Montant</span>
                            <span className="font-black text-brand-primary">{activeDelivery.total} CFA</span>
                          </div>
                        )}
                      </div>

                      {/* Actions de Communication Rapide */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleCallClient(activeDelivery.clientName)}
                          className="flex-1 h-10 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-all active:scale-95"
                        >
                          <Phone size={16} /> Appeler
                        </button>
                        <button 
                          onClick={() => handleSendMessage(activeDelivery.clientName, activeDelivery.type)}
                          className="flex-1 h-10 bg-green-50 text-green-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-all active:scale-95"
                        >
                          <MessageSquare size={16} /> Message
                        </button>
                        <button 
                          onClick={() => handleOpenMaps(activeDelivery.deliveryAddress)}
                          className="flex-1 h-10 bg-purple-50 text-purple-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-100 transition-all active:scale-95"
                        >
                          <Navigation size={16} /> Maps
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-brand-surface-lowest rounded-3xl p-12 shadow-lg border-2 border-brand-outline/10 text-center space-y-4">
                    <AlertCircle size={48} className="mx-auto text-brand-outline opacity-50" />
                    <p className="text-brand-on-surface-variant font-bold">Aucune mission active pour le moment.</p>
                    <p className="text-xs text-brand-outline">Consultez l'onglet "Missions disponibles" pour accepter une nouvelle mission.</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. MISSIONS DISPONIBLES */}
            {activeTab === 'available' && (
              <div className="space-y-6 max-w-3xl">
                <h2 className="text-2xl font-black text-brand-on-surface">Missions disponibles</h2>
                
                <div className="space-y-4">
                  {availableMissions.length > 0 ? (
                    availableMissions.map((mission) => (
                      <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-brand-surface-lowest rounded-2xl p-5 shadow-lg border border-brand-outline/10 hover:shadow-xl transition-all space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {mission.type === 'order' ? (
                                <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black">
                                  COMMANDE
                                </div>
                              ) : (
                                <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-black">
                                  COLIS
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-brand-on-surface-variant">
                                {new Date(mission.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <h3 className="font-black text-brand-on-surface mb-2">{mission.clientName}</h3>
                            
                            <div className="space-y-2 text-sm">
                              {mission.pickupAddress && (
                                <div className="flex items-start gap-2 text-brand-on-surface-variant">
                                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-orange-500" />
                                  <span className="text-xs">Récupération: {mission.pickupAddress}</span>
                                </div>
                              )}
                              <div className="flex items-start gap-2 text-brand-on-surface-variant">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-green-500" />
                                <span className="text-xs">Livraison: {mission.deliveryAddress}</span>
                              </div>
                            </div>

                            {mission.description && (
                              <p className="text-xs text-brand-on-surface-variant mt-2 italic">{mission.description}</p>
                            )}
                          </div>

                          <div className="text-right ml-4">
                            {mission.total && (
                              <div className="font-black text-brand-primary text-lg">{mission.total} CFA</div>
                            )}
                            {mission.estimatedPrice && (
                              <div className="font-black text-brand-primary text-lg">{mission.estimatedPrice} CFA</div>
                            )}
                          </div>
                        </div>

                        {/* Actions rapides pour les missions disponibles */}
                        <div className="flex gap-2 pt-3 border-t border-brand-outline/10">
                          <button 
                            onClick={() => handleAcceptMission(mission.id, mission.type)}
                            className="flex-1 h-10 bg-brand-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
                          >
                            <CheckCircle2 size={16} /> Accepter
                          </button>
                          <button 
                            onClick={() => handleOpenMaps(mission.deliveryAddress)}
                            className="h-10 px-4 bg-brand-surface-low text-brand-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-surface-low/80 transition-all active:scale-95"
                          >
                            <Navigation size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-brand-surface-lowest rounded-3xl p-12 shadow-lg border-2 border-brand-outline/10 text-center space-y-4">
                      <Package size={48} className="mx-auto text-brand-outline opacity-50" />
                      <p className="text-brand-on-surface-variant font-bold">Aucune mission disponible pour le moment.</p>
                      <p className="text-xs text-brand-outline">Revenez plus tard ou vérifiez votre statut de disponibilité.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. HISTORIQUE & REVENUS */}
            {activeTab === 'earnings' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface">Rapport d'Activité & Revenus</h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">Analyser vos gains, missions terminées et vos notes.</p>
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
                      <span className="text-[10px] font-black text-brand-on-surface-variant uppercase tracking-wider">Missions Terminées</span>
                      <h3 className="text-2xl font-black text-brand-on-surface mt-1">34 missions</h3>
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

                {/* Graphique de revenus des 5 derniers jours */}
                <div className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-brand-outline/10 pb-4">
                    <h3 className="font-black text-lg text-brand-on-surface">Historique de vos gains journaliers</h3>
                    <span className="text-xs font-bold text-brand-on-surface-variant flex items-center gap-1">
                      <TrendingUp size={14} className="text-brand-primary" /> +2 500 CFA moyenne
                    </span>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-4 pt-8 px-4">
                    {dailyEarnings.map((item, index) => {
                      const pct = (item.value / 18500) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                          <span className="text-xs font-black text-brand-on-surface">{item.value} CFA</span>
                          
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface-lowest/95 backdrop-blur-md border-t border-brand-outline/10 py-3.5 px-6 flex justify-around items-center z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'active' ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <Route size={20} />
          <span className="text-[10px] font-black tracking-wide">Mission</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('available')}
          className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === 'available' ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <Package size={20} />
          {availableMissions.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-primary text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
              {availableMissions.length}
            </span>
          )}
          <span className="text-[10px] font-black tracking-wide">Dispos</span>
        </button>

        <button 
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'earnings' ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <DollarSign size={20} />
          <span className="text-[10px] font-black tracking-wide">Revenus</span>
        </button>
      </nav>

    </div>
  );
};
