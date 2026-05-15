import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Star, Verified, MapPin, Calendar, Clock, ChevronRight, CalendarCheck } from 'lucide-react';
import { ARTISANS } from '../data';

export const ArtisanProfileScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artisan = ARTISANS.find(a => a.id === id) || ARTISANS[0];

  const availability = [
    { day: 'LUN', date: 18, active: true },
    { day: 'MAR', date: 19, active: false },
    { day: 'MER', date: 20, active: false },
    { day: 'JEU', date: 21, active: false },
    { day: 'VEN', date: 22, active: false },
  ];

  const timeSlots = ['09:00', '10:30', '14:00', '15:30', '17:00', 'Complet'];

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
          <button className="p-2 text-brand-primary"><Heart size={22} /></button>
        </div>
      </header>

      <main className="px-5 pt-10 space-y-10">
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
            {artisan.specialty}
          </p>
        </section>

        {/* Stats Bento */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-brand-surface-lowest p-5 rounded-3xl flex flex-col items-center text-center space-y-1 border border-brand-outline/5 shadow-sm">
            <Verified size={24} className="text-brand-primary fill-brand-primary/10" />
            <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider">Vérifié</span>
            <span className="text-base font-black text-brand-on-surface leading-tight">Identité &<br />Diplôme</span>
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
            <div>
              <span className="text-[10px] font-bold text-brand-outline uppercase tracking-wider block">Zone d'intervention</span>
              <span className="text-sm font-extrabold text-brand-on-surface">{artisan.zones.join(', ')}</span>
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
            <div className="flex-shrink-0 w-56 h-40 rounded-3xl overflow-hidden shadow-md">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZVB0lZaadXKKOu2xG98il64bZowT9WCRGopVyJdpUaymTfGbRmjzz6_ZCYQoeKnluTQkla12e7Sb3Mo-FQ1nWnqUVtP7Xrn1Aw2xk_ag5C_DOKWVAB0uurn5YgPF3jcxrD9iXnq633l25a_FwVvfE0KIyrtBm-HAYLHRFHSSab60KmLTU4fNQXedhsnRYRX1Xd9vU9-KOVlItq_q90ZqeUdAAXtl2dKX3tsLFiJf0K9bV9mkncmcPFwDCZZgQhz94IIjkc7bTaYNe" 
                alt="Work 1" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-shrink-0 w-56 h-40 rounded-3xl overflow-hidden shadow-md">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuohMnJHHjtxPKWQrWrMZdwu0hjkFZSjYgWCIUxkwkoArCT97-iCeMtI8BMjvKZhRLnE-0oy7_WSXUMHr-pLwBXNNLGdvtxY3k3JgeQECHTwI84ebA8abwppDg1RIajlwyj42QT4hDaIdM3FHwhxlLZfIAT2gffsxccI8CRi_w0cUNhm03y3b2x7og13Zc0kCZEbdP7iuPdU3rpjHEywmjJ8TTVHianZtPieG_gRcoreq_el4H28Q9lGV5PN3W_v_nJ0s5PDdj8lUW" 
                alt="Work 2" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </section>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-brand-outline/10 p-6 pb-sorted z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-brand-outline uppercase tracking-widest">Estimation</span>
            <span className="text-xl font-black text-brand-on-surface">~22.500 FCFA</span>
          </div>
          <button 
            onClick={() => navigate('/services/booking')}
            className="flex-1 bg-brand-primary text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Demander un RDV
            <Calendar size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
