import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, MapPin, CheckCircle2, Utensils, Box, Bike, Home, Star, Compass } from 'lucide-react';

// Component drawing a gorgeous, simulated vector tracking map using SVG
const VectorTrackingMap: React.FC<{ progress: number; speed: string; status: string }> = ({ progress, speed, status }) => {
  // Coordonnées de la route sinueuse du livreur
  const pathPoints = [
    { x: 50, y: 220 },   // Restaurant "Le Maquis"
    { x: 100, y: 200 },
    { x: 120, y: 140 },
    { x: 180, y: 150 },
    { x: 220, y: 90 },
    { x: 280, y: 100 },
    { x: 330, y: 40 },   // Domicile Client
  ];

  // Calculer la position actuelle du livreur sur la route en fonction du progrès
  const getPositionOnPath = (prog: number) => {
    if (prog <= 0) return pathPoints[0];
    if (prog >= 1) return pathPoints[pathPoints.length - 1];
    
    const segmentCount = pathPoints.length - 1;
    const rawIndex = prog * segmentCount;
    const index = Math.floor(rawIndex);
    const segmentProgress = rawIndex - index;
    
    const start = pathPoints[index];
    const end = pathPoints[index + 1];
    
    return {
      x: start.x + segmentProgress * (end.x - start.x),
      y: start.y + segmentProgress * (end.y - start.y)
    };
  };

  const riderPos = getPositionOnPath(progress);

  return (
    <div className="w-full bg-brand-surface-low rounded-3xl p-6 border border-brand-outline/10 relative overflow-hidden shadow-inner h-80 flex flex-col justify-between">
      {/* HUD Info */}
      <div className="flex justify-between items-center z-10 bg-white/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-brand-outline/10">
        <div className="flex items-center gap-2">
          <Bike size={18} className="text-brand-primary" />
          <span className="text-xs font-black text-brand-on-surface">Vitesse du livreur: {speed}</span>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
          status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-brand-primary/10 text-brand-primary animate-pulse'
        }`}>
          {status === 'completed' ? 'Arrivé à votre Villa' : 'En chemin'}
        </span>
      </div>

      {/* SVG Map Canvas */}
      <svg viewBox="0 0 380 260" className="absolute inset-0 w-full h-full select-none">
        <defs>
          <radialGradient id="map-grid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8f5" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff1ea" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />

        {/* Decorative Grid Lines representing streets */}
        <line x1="20" y1="50" x2="360" y2="50" stroke="#f4ded2" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="20" y1="120" x2="360" y2="120" stroke="#f4ded2" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="20" y1="190" x2="360" y2="190" stroke="#f4ded2" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="80" y1="20" x2="80" y2="240" stroke="#f4ded2" strokeWidth="2" />
        <line x1="200" y1="20" x2="200" y2="240" stroke="#f4ded2" strokeWidth="2" />
        <line x1="300" y1="20" x2="300" y2="240" stroke="#f4ded2" strokeWidth="2" />

        {/* The Route Line */}
        <path 
          d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`} 
          fill="none" 
          stroke="#e5b390" 
          strokeWidth="6" 
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
        <path 
          d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`} 
          fill="none" 
          stroke="#964900" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8,6"
        />

        {/* Starting Point (Restaurant) */}
        <g transform="translate(50, 220)">
          <circle r="14" fill="#574235" opacity="0.2" />
          <circle r="8" fill="#574235" />
          <text y="-14" textAnchor="middle" fill="#574235" className="text-[9px] font-black">Resto</text>
        </g>

        {/* Ending Point (Client Villa) */}
        <g transform="translate(330, 40)">
          <circle r="16" fill="#feb300" opacity="0.2" className="animate-ping" />
          <circle r="10" fill="#feb300" />
          <path d="M-4,-2 L0,-6 L4,-2 L4,4 L-4,4 Z" fill="white" />
          <text y="-16" textAnchor="middle" fill="#7e5700" className="text-[9px] font-black">Ma Villa</text>
        </g>

        {/* Live Bicycle / Rider Marker */}
        <g transform={`translate(${riderPos.x}, ${riderPos.y})`}>
          <circle r="20" fill="#964900" opacity="0.15" />
          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#964900" className="shadow-lg animate-bounce" style={{ animationDuration: '1.2s' }} />
          {/* Simple Bike Icon */}
          <circle cx="-4" cy="4" r="3" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="4" cy="4" r="3" stroke="white" strokeWidth="1.5" fill="none" />
          <line x1="-4" y1="4" x2="0" y2="-2" stroke="white" strokeWidth="1.5" />
          <line x1="4" y1="4" x2="0" y2="-2" stroke="white" strokeWidth="1.5" />
          <line x1="0" y1="-2" x2="-6" y2="-2" stroke="white" strokeWidth="1.5" />
        </g>
      </svg>

      {/* Progress percentage overlay */}
      <div className="z-10 mt-auto bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-brand-outline/10 flex items-center justify-between">
        <span className="text-[11px] font-bold text-brand-on-surface-variant flex items-center gap-1.5">
          <Compass className="text-brand-primary animate-spin" size={14} style={{ animationDuration: '3s' }} />
          Trajet en cours...
        </span>
        <span className="text-sm font-black text-brand-primary">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
};

export const OrderTrackingScreen: React.FC = () => {
  const navigate = useNavigate();

  // États dynamiques du tracker
  const [progress, setProgress] = useState(0.4); // Commencer à 40% par défaut
  const [speed, setSpeed] = useState('24 km/h');
  const [isLive, setIsLive] = useState(false);

  // Écouter en temps réel les coordonnées partagées par le livreur
  useEffect(() => {
    // Charger immédiatement s'il y a quelque chose de stocké
    const initialPos = localStorage.getItem('livreur_position_SOL-92834');
    if (initialPos) {
      const pos = JSON.parse(initialPos);
      setProgress(pos.progress);
      setSpeed(pos.speed || '24 km/h');
      setIsLive(pos.status === 'en_route');
    }

    const interval = setInterval(() => {
      const posString = localStorage.getItem('livreur_position_SOL-92834');
      if (posString) {
        const pos = JSON.parse(posString);
        setProgress(pos.progress);
        setSpeed(pos.speed || '24 km/h');
        setIsLive(pos.status === 'en_route');
      } else {
        setIsLive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: 'Confirmée', time: '14:05', status: 'completed', icon: CheckCircle2 },
    { label: 'En préparation', time: '14:15', status: 'completed', icon: Utensils },
    { label: 'Prête', time: '14:30', status: 'completed', icon: Box },
    { 
      label: progress >= 1 ? 'Arrivée à destination' : 'En cours de livraison', 
      sub: progress >= 1 ? 'Votre livreur Moussa est devant votre villa' : 'Le livreur approche de votre villa', 
      status: progress >= 1 ? 'completed' : 'active', 
      icon: Bike 
    },
    { 
      label: progress >= 1 ? 'Livrée' : 'En attente de livraison', 
      sub: progress >= 1 ? 'Commande livrée' : "En attente d'arrivée", 
      status: progress >= 1 ? 'active' : 'upcoming', 
      icon: Home 
    },
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

      <main className="px-5 py-8 space-y-8 max-w-2xl mx-auto">
        
        {/* Dynamic Vector Map Section */}
        <section className="bg-brand-surface-lowest rounded-3xl overflow-hidden shadow-xl border border-brand-outline/10 p-1 relative">
          <div className="absolute top-3 left-3 right-3 p-4 bg-white/70 backdrop-blur-md flex justify-between items-center z-10 border border-brand-outline/10 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-primary fill-brand-primary/10 animate-bounce" />
              <span className="text-xs font-black text-brand-on-surface">
                {progress >= 1 ? 'Arrivée immédiate !' : `Arrivée prévue : 14:45`}
              </span>
            </div>
            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${
              isLive ? 'bg-brand-primary/10 text-brand-primary animate-pulse' : 'bg-brand-secondary-container text-brand-on-surface'
            }`}>
              {isLive ? '● LIVE GPS' : 'SIMULÉ'}
            </span>
          </div>

          <div className="pt-16">
            <VectorTrackingMap progress={progress} speed={speed} status={progress >= 1 ? 'completed' : 'delivering'} />
          </div>
        </section>

        {/* Live HUD alert when GPS sharing starts */}
        {isLive && (
          <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary p-4 rounded-2xl font-bold text-sm text-center animate-pulse flex items-center justify-center gap-2">
            <Compass className="animate-spin" size={18} />
            Le livreur partage sa position GPS en direct ! Suivez son trajet sur la carte.
          </div>
        )}

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
          <Star size={24} className="fill-current animate-bounce" />
          Noter la commande
        </button>
      </main>
    </motion.div>
  );
};
