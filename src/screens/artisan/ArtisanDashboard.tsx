import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, Settings, LogOut, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const ArtisanDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'requests' | 'calendar'>('requests');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/welcome');
  };

  // Mock de demandes d'intervention
  const mockRequests = [
    { id: 'REQ-01', client: 'Julie', address: 'Cocody Danga', service: 'Fuite d\'eau sous évier', time: 'Aujourd\'hui, 15:30', status: 'pending' },
    { id: 'REQ-02', client: 'M. Koné', address: 'Riviera Faya', service: 'Installation Chauffe-eau', time: 'Demain, 09:00', status: 'confirmed' }
  ];

  return (
    <div className="min-h-screen bg-brand-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-surface-lowest border-r border-brand-outline/10 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Wrench className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-black text-brand-on-surface text-xl">Artisan</h1>
              <p className="text-xs font-medium text-brand-on-surface-variant">CitéConnect</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 flex md:flex-col overflow-x-auto md:overflow-visible scrollbar-hide">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors min-w-[max-content] ${activeTab === 'requests' ? 'bg-green-50 text-green-700' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <Clock size={18} />
            Demandes
            <div className="ml-auto bg-green-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              1
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors min-w-[max-content] ${activeTab === 'calendar' ? 'bg-green-50 text-green-700' : 'text-brand-on-surface-variant hover:bg-brand-surface-low'}`}
          >
            <Calendar size={18} />
            Mon Planning
          </button>
        </nav>

        <div className="p-4 mt-auto space-y-2">
          {/* Disponibilité Toggle */}
          <div className="bg-brand-surface-low p-4 rounded-xl flex items-center justify-between">
            <span className="text-sm font-bold text-brand-on-surface-variant">Disponibilité</span>
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${isAvailable ? 'bg-green-500' : 'bg-brand-outline/30'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

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
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'requests' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-black text-brand-on-surface">Demandes d'intervention</h2>
              <p className="text-brand-on-surface-variant font-medium">Répondez rapidement pour satisfaire vos clients.</p>

              <div className="grid gap-4 mt-6">
                {mockRequests.filter(r => r.status === 'pending').map((req, i) => (
                  <div key={i} className="bg-brand-surface-lowest rounded-3xl p-6 shadow-sm border border-brand-outline/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-orange-50 text-orange-600 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">Nouvelle Demande</span>
                        <h3 className="font-black text-xl mt-3 text-brand-on-surface">{req.service}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-on-surface-variant">Intervention souhaitée</p>
                        <p className="text-brand-on-surface font-black mt-1 bg-brand-surface-low px-3 py-1 rounded-lg inline-block">{req.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-brand-outline/10">
                      <div className="flex items-center gap-2 text-brand-on-surface font-medium">
                         <div className="w-8 h-8 rounded-full bg-brand-secondary-container flex items-center justify-center text-brand-on-surface font-bold text-xs">CL</div>
                         {req.client}
                      </div>
                      <div className="flex items-center gap-2 text-brand-on-surface-variant text-sm font-bold">
                        <MapPin size={16} />
                        {req.address}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 border-2 border-brand-outline/20 text-brand-on-surface-variant hover:bg-brand-surface-low py-3.5 rounded-xl font-bold transition-colors">
                        Refuser
                      </button>
                      <button className="flex-1 bg-green-500 text-white shadow-lg shadow-green-500/20 py-3.5 rounded-xl font-bold transition-transform active:scale-95">
                        Accepter la mission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-brand-on-surface">Mon Planning</h2>
              <div className="bg-brand-surface-lowest rounded-3xl p-6 shadow-sm border border-brand-outline/10 text-center text-brand-on-surface-variant py-20">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-bold text-lg">Votre agenda est synchronisé.</p>
                <p className="text-sm">Toutes vos interventions confirmées apparaîtront ici.</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};
