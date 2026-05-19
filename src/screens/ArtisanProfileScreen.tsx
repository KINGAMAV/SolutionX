import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, Verified, MapPin, Calendar, Clock, ChevronRight, CalendarCheck, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Artisan } from '../types';

export const ArtisanProfileScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('artisans')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setArtisan({
            id: data.id,
            name: data.name,
            category: data.category,
            experience: data.experience,
            rating: Number(data.rating),
            hourlyRate: data.hourly_rate,
            verified: data.verified,
            specialty: data.specialty,
            zones: data.zones || [],
            avatar: data.avatar || data.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgGuMREuc2sBVsLkVQZ0N0VxnF2YJZXQfbTOE7j5GGHVoadnlOTqO58GwMpUnBC9yq6ABwjfGPBzmpBzHJr_NRK-UknmQAJ1GjaHvtxgqs7HONsP7ojPsYGeOXhQzmEwF2AB8dM8CWgg_qgyzrp1r7PyJQJRjwDBokgXV60uUX88o6jVGZTed2wF-Z4cGXMYvBgEE1AK9orkYSODC3inRRqegq5tTbkQQU-2j5AN_yAgXqR4d2_7pj50a0sJXWHrDZK5W2kMCWtHL3'
          });
        }
      } catch (err) {
        console.error('Error fetching artisan:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArtisan();
  }, [id]);

  const availability = [
    { day: 'LUN', date: 18, active: true },
    { day: 'MAR', date: 19, active: false },
    { day: 'MER', date: 20, active: false },
    { day: 'JEU', date: 21, active: false },
    { day: 'VEN', date: 22, active: false },
  ];

  const timeSlots = ['09:00', '10:30', '14:00', '15:30', '17:00', 'Complet'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-brand-background">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
        <span className="text-sm font-black uppercase tracking-widest text-brand-primary">Chargement du profil...</span>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center bg-brand-background">
        <h2 className="text-xl font-bold">Artisan introuvable</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand-primary font-bold">Retour</button>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-brand-primary">Détails Artisan</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-brand-primary"><Share2 size={22} /></button>
          <button className="p-2 text-brand-primary group active:scale-90 transition-transform"><Heart size={22} /></button>
        </div>
      </header>

      <main className="px-5 pt-10 space-y-10 max-w-md mx-auto">
        {/* Profile Hero */}
        <section className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-36 h-36 rounded-full border-4 border-brand-surface-highest overflow-hidden shadow-2xl p-1 bg-white">
              <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="absolute bottom-2 right-2 bg-brand-secondary-container text-brand-on-surface px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg ring-2 ring-white">
              <Star size={14} className="fill-current" />
              <span className="text-xs font-black">{artisan.rating}</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-brand-on-surface tracking-tight">{artisan.name}</h2>
          <p className="text-sm font-bold text-brand-on-surface-variant flex items-center gap-2">
            {artisan.specialty || artisan.category}
          </p>
        </section>

        {/* Stats Bento */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-surface-lowest p-5 rounded-3xl flex flex-col items-center text-center space-y-1 border border-brand-outline/5 shadow-sm">
            <Verified size={24} className={artisan.verified ? "text-brand-primary fill-brand-primary/10" : "text-brand-outline opacity-30"} />
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">{artisan.verified ? "Vérifié" : "En cours"}</span>
            <span className="text-base font-black text-brand-on-surface leading-tight">
              {artisan.verified ? "Identité &\nDiplôme" : "Vérification\nen cours"}
            </span>
          </div>
          <div className="bg-brand-surface-lowest p-5 rounded-3xl flex flex-col items-center text-center space-y-1 border border-brand-outline/5 shadow-sm">
            <div className="bg-brand-primary-container/10 p-2 rounded-xl">
              <Star size={20} className="text-brand-primary fill-current" />
            </div>
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">Tarif</span>
            <span className="text-base font-black text-brand-on-surface leading-tight">{artisan.hourlyRate.toLocaleString()}<br />FCFA/h</span>
          </div>
          <div className="bg-brand-surface-lowest p-5 rounded-3xl col-span-2 flex items-center gap-5 border border-brand-outline/5 shadow-sm">
            <div className="bg-brand-secondary-container/10 p-4 rounded-2xl text-brand-secondary">
              <MapPin size={28} />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">Zone d'intervention</span>
              <span className="text-sm font-extrabold text-brand-on-surface line-clamp-1">{artisan.zones.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-black text-brand-on-surface">Disponibilités</h3>
            <button className="text-brand-primary font-bold text-sm">Voir tout</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {availability.map((item) => (
              <button 
                key={item.date}
                className={`flex-shrink-0 w-16 h-20 rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${
                  item.active 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
                    : 'bg-brand-surface-lowest text-brand-on-surface-variant border border-brand-outline/10'
                }`}
              >
                <span className={`text-[10px] font-black tracking-widest ${item.active ? 'opacity-80' : 'opacity-50'}`}>{item.day}</span>
                <span className="text-xl font-bold mt-1">{item.date}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {timeSlots.map((time, i) => (
              <button 
                key={time}
                disabled={time === 'Complet'}
                className={`py-4 px-1 rounded-2xl text-sm font-black transition-all border ${
                  time === '10:30' 
                    ? 'bg-brand-primary-container/10 border-brand-primary text-brand-primary' 
                    : time === 'Complet'
                    ? 'bg-brand-surface-lowest text-brand-outline opacity-30 border-transparent italic'
                    : 'bg-brand-surface-lowest border-brand-outline/10 text-brand-on-surface-variant hover:bg-brand-surface-variant transition-colors'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section className="pb-10">
          <h3 className="text-lg font-black text-brand-on-surface mb-5">Réalisations récentes</h3>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar">
            <div className="flex-shrink-0 w-56 h-40 rounded-3xl overflow-hidden shadow-md bg-brand-surface-low flex items-center justify-center text-brand-outline/20">
              <MapPin size={40} />
            </div>
            <div className="flex-shrink-0 w-56 h-40 rounded-3xl overflow-hidden shadow-md bg-brand-surface-low flex items-center justify-center text-brand-outline/20">
              <Star size={40} />
            </div>
          </div>
        </section>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-brand-outline/10 p-6 pb-sorted z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-brand-outline uppercase tracking-widest">Estimation</span>
            <span className="text-xl font-black text-brand-on-surface">~{Math.round(artisan.hourlyRate * 1.5).toLocaleString()} FCFA</span>
          </div>
          <button 
            onClick={() => navigate('/services/booking')}
            className="flex-1 bg-brand-primary text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Demander un RDV
            <CalendarCheck size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
