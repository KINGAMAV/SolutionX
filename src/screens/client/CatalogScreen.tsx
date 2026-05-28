import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, BookOpen, Wrench, Receipt, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const serviceConfig = {
  gaz: { label: 'Bouteilles de Gaz', icon: Flame, color: '#00843D' },
  'cours-express': { label: 'Cours Express', icon: BookOpen, color: '#003366' },
  artisans: { label: 'Artisans', icon: Wrench, color: '#00843D' },
  cotisation: { label: 'Cotisation', icon: Receipt, color: '#003366' }
} as const;

export const CatalogScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const service = searchParams.get('service') || 'gaz';
  const config = serviceConfig[service as keyof typeof serviceConfig] || serviceConfig.gaz;
  const Icon = config.icon;

  const [boutiques, setBoutiques] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBoutiques = async () => {
    setLoading(true);
    try {
      console.log('🔍 Requête Supabase lancée...');
      const { data, error } = await supabase
        .from('boutiques')
        .select('id, name, description, quartier, rating, is_open, ville')
        .eq('is_open', true)
        .order('rating', { ascending: false });

      console.log('📦 Réponse Supabase:', data);
      console.log('⚠️ Erreur Supabase:', error);

      if (error) throw error;
      setBoutiques(data || []);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchBoutiques();
}, [service]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-4 py-6">
      <header className="flex items-center gap-3 mb-6 max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#003366]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.color }}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#003366]">{config.label}</h1>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center py-12 text-[#00843D]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm">Chargement...</p>
        </div>
      ) : boutiques.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
          Aucun service disponible pour le moment.<br/>
          <span className="text-xs">(Vérifie que le seed SQL a bien été exécuté)</span>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-3">
          {boutiques.map((b, i) => (
            <motion.button
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/catalog/${service}/${b.id}`)}
              className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-[#00843D]/40 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-[#003366]">{b.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{b.description || 'Service disponible'}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.quartier}, {b.ville}</span>
                {b.rating > 0 && <span className="text-amber-500">⭐ {b.rating.toFixed(1)}</span>}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};