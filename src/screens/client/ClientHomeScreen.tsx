import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, BookOpen, Wrench, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const services = [
  { id: 'gaz', label: 'Gaz', icon: Flame, color: 'from-[#00843D] to-[#006633]', desc: 'Bouteilles & livraison rapide' },
  { id: 'cours-express', label: 'Cours Express', icon: BookOpen, color: 'from-[#003366] to-[#004080]', desc: 'Tutorat & soutien scolaire' },
  { id: 'artisans', label: 'Artisans', icon: Wrench, color: 'from-[#00843D] to-[#005226]', desc: 'Plomberie, élec, ménage...' },
  { id: 'cotisation', label: 'Cotisation', icon: Receipt, color: 'from-[#003366] to-[#002244]', desc: 'Tontines & épargne communautaire' },
];

export const ClientHomeScreen = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  const handleServiceClick = (serviceId: string) => {
    // On passe le type de service dans l'URL pour filtrer le catalogue
    navigate(`/catalog?service=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-4 py-6">
      <header className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#003366]">
          Bonjour, {state.user?.name || 'Client'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Que souhaitez-vous faire aujourd'hui ?</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {services.map((service, i) => (
          <motion.button
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#00843D]/30 transition-all group"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              <service.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#003366]">{service.label}</h3>
            <p className="text-sm text-gray-500 text-center mt-1">{service.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};