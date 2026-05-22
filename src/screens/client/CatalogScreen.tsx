import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, BookOpen, Wrench, Receipt } from 'lucide-react';

const serviceConfig: Record<string, { label: string; icon: React.ElementType; color: string; mockItems: string[] }> = {
  gaz: {
    label: 'Bouteilles de Gaz',
    icon: Flame,
    color: '#00843D',
    mockItems: ['Gaz 6kg', 'Gaz 12kg', 'Gaz 37kg', 'Accessoires (détendeur, tuyau)']
  },
  'cours-express': {
    label: 'Cours Express',
    icon: BookOpen,
    color: '#003366',
    mockItems: ['Maths (Primaire)', 'Français (Lycée)', 'Physique-Chimie', 'Informatique & Code']
  },
  artisans: {
    label: 'Artisans de Confiance',
    icon: Wrench,
    color: '#00843D',
    mockItems: ['Plombier', 'Électricien', 'Menuisier', 'Peintre', 'Ménagère']
  },
  cotisation: {
    label: 'Cotisation & Tontines',
    icon: Receipt,
    color: '#003366',
    mockItems: ['Tontine Quotidienne', 'Épargne Groupe', 'Micro-crédit Solidaire', 'Frais de Gestion']
  }
};

export const CatalogScreen = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const service = searchParams.get('service') || '';
  const config = serviceConfig[service] || serviceConfig['gaz'];
  const Icon = config.icon;

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

      <div className="max-w-2xl mx-auto space-y-3">
        {config.mockItems.map((item, i) => (
          <motion.button
            key={item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#00843D]/40 hover:shadow-sm transition-all group"
            onClick={() => navigate(`/catalog/${service}/${encodeURIComponent(item)}`)}
          >
            <span className="font-medium text-[#003366]">{item}</span>
            <span className="text-sm text-gray-400 group-hover:text-[#00843D] transition-colors">Voir →</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};