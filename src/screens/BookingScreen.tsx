import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Edit3, CheckCircle2, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export const BookingScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-background min-h-screen pb-32"
    >
      <header className="bg-brand-surface shadow-sm h-16 flex justify-between items-center px-5 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 text-brand-primary">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-brand-primary tracking-tight">Prendre RDV</h1>
        </div>
      </header>

      <main className="px-5 py-8 space-y-10 max-w-md mx-auto">
        {/* Date Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <div className="bg-brand-primary-container/10 p-2 rounded-xl text-brand-primary">
              <Calendar size={20} />
            </div>
            <h2 className="text-lg font-black text-brand-on-surface">Choisir une date</h2>
          </div>

          <div className="bg-brand-surface-lowest rounded-[2.5rem] p-8 shadow-xl border border-brand-outline/5">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-black text-brand-on-surface uppercase tracking-widest">Septembre 2024</span>
              <div className="flex gap-4">
                <button className="p-2 hover:bg-brand-surface-low rounded-xl transition-colors"><ChevronLeft size={20} className="text-brand-outline" /></button>
                <button className="p-2 hover:bg-brand-surface-low rounded-xl transition-colors"><ChevronRight size={20} className="text-brand-outline" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-y-2 text-center mb-4">
              {['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'].map(d => (
                <div key={d} className="text-[9px] font-black text-brand-outline/40 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {[26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((day, i) => (
                <button 
                  key={i}
                  disabled={day < 1}
                  className={`h-10 flex items-center justify-center text-sm font-bold rounded-2xl transition-all ${
                    day === 15 
                      ? 'bg-brand-secondary-container text-brand-on-surface shadow-lg shadow-brand-secondary-container/20 scale-110' 
                      : day < 1 || i < 5
                      ? 'text-brand-outline/20 font-medium'
                      : 'text-brand-on-surface-variant hover:bg-brand-surface-low'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Time Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <div className="bg-brand-primary-container/10 p-2 rounded-xl text-brand-primary">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-black text-brand-on-surface">Heure souhaitée</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 px-1">
            {['09:00', '10:30', '14:00', '15:30', '17:00'].map((time) => (
              <button 
                key={time}
                className={`snap-center flex-shrink-0 px-8 py-3.5 rounded-full text-sm font-black transition-all ${
                  time === '10:30' 
                    ? 'bg-brand-secondary-container text-brand-on-surface shadow-lg border-2 border-brand-secondary' 
                    : 'bg-brand-surface-lowest text-brand-on-surface-variant border border-brand-outline/10 shadow-sm hover:bg-brand-surface-low'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* DescriptionSection */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <div className="bg-brand-primary-container/10 p-2 rounded-xl text-brand-primary">
              <Edit3 size={20} />
            </div>
            <h2 className="text-lg font-black text-brand-on-surface">Description du besoin</h2>
          </div>
          <div className="relative">
            <textarea 
              className="w-full bg-brand-surface-lowest border-none ring-1 ring-brand-outline/10 rounded-[2rem] p-8 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all placeholder:text-brand-outline/40 shadow-sm" 
              placeholder="Décrivez votre demande en quelques mots pour aider le prestataire..." 
              rows={5}
            />
          </div>
        </section>

        {/* Actions */}
        <div className="pt-6 space-y-6">
          <button 
            onClick={() => navigate('/profile')}
            className="w-full bg-brand-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ring-8 ring-brand-primary/5"
          >
            <CheckCircle2 size={24} className="fill-current" />
            Confirmer le rendez-vous
          </button>
          
          <div className="flex items-start gap-4 bg-brand-surface-low p-6 rounded-[2rem] border border-brand-primary/5">
            <Info size={24} className="text-brand-primary shrink-0" />
            <p className="text-[11px] font-bold text-brand-on-surface-variant leading-relaxed uppercase tracking-wider opacity-70">
              Coordonnées visibles après acceptation par le prestataire. Sécurité et confidentialité garanties par Cité Connect.
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
