import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Bell, 
  Send, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  FileText,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

interface Resident {
  id: string;
  name: string;
  email: string;
  house_number: string;
  subscription_status: 'paid' | 'pending' | 'overdue';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export const SyndicsScreen: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'residents' | 'announcements'>('residents');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch residents with their subscription status
      // Note: This is a simplified query, in a real app we would join with subscriptions table
      const { data: residentsData, error: residentsError } = await supabase
        .from('users')
        .select('id, name, email, house_number, role')
        .eq('role', 'client');

      if (residentsError) throw residentsError;

      // Mock subscription status for demo if not in DB
      const mappedResidents: Resident[] = residentsData.map((r: any, index: number) => ({
        ...r,
        subscription_status: index % 3 === 0 ? 'paid' : index % 3 === 1 ? 'pending' : 'overdue'
      }));
      setResidents(mappedResidents);

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;
      setAnnouncements(announcementsData || []);

    } catch (error) {
      console.error("Error fetching syndic data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (resident: Resident) => {
    alert(`Message de relance envoyé à ${resident.name} (${resident.email})`);
    // In a real app, this would trigger an email or notification via Supabase Edge Functions
  };

  const handleIssueReceipt = (resident: Resident) => {
    alert(`Reçu de paiement généré pour ${resident.name} - Villa ${resident.house_number}`);
    // Logic to update subscription status and generate PDF
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          author_id: state.user?.id
        }])
        .select();

      if (error) throw error;

      setAnnouncements([data[0], ...announcements]);
      setNewAnnouncement({ title: '', content: '' });
      setShowAddAnnouncement(false);
      alert("Alerte publiée avec succès à tous les résidents !");
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette alerte ?")) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.house_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-background pb-20">
      {/* Header */}
      <div className="bg-brand-primary text-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black">Service Syndical</h1>
            <p className="text-brand-on-primary/80 text-sm font-medium">Gestion de la Cité Connectée</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Users size={24} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/10 rounded-2xl p-1 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('residents')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'residents' ? 'bg-white text-brand-primary shadow-md' : 'text-white/80'
            }`}
          >
            <Users size={18} />
            Résidents
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'announcements' ? 'bg-white text-brand-primary shadow-md' : 'text-white/80'
            }`}
          >
            <Bell size={18} />
            Alertes
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {activeTab === 'residents' ? (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-outline" size={20} />
              <input
                type="text"
                placeholder="Rechercher un résident ou une villa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-brand-outline/10 focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>

            {/* Residents List */}
            <div className="space-y-3">
              {loading ? (
                <p className="text-center py-10 text-brand-outline">Chargement des résidents...</p>
              ) : filteredResidents.length > 0 ? (
                filteredResidents.map((resident) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={resident.id}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-brand-outline/5 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary font-bold">
                          {resident.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-brand-on-surface">{resident.name}</h3>
                          <p className="text-xs text-brand-outline font-medium">Villa {resident.house_number}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        resident.subscription_status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : resident.subscription_status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {resident.subscription_status === 'paid' ? 'À jour' : resident.subscription_status === 'overdue' ? 'En retard' : 'En attente'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {resident.subscription_status !== 'paid' && (
                        <button 
                          onClick={() => handleSendReminder(resident)}
                          className="flex-1 bg-brand-primary/10 text-brand-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <Send size={14} />
                          Relancer
                        </button>
                      )}
                      <button 
                        onClick={() => handleIssueReceipt(resident)}
                        className="flex-1 bg-brand-secondary-container text-brand-on-secondary-container py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <FileText size={14} />
                        Émettre Reçu
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-10 text-brand-outline">Aucun résident trouvé.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Add Announcement Button */}
            <button 
              onClick={() => setShowAddAnnouncement(true)}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Plus size={20} />
              Nouvelle Alerte
            </button>

            {/* Add Announcement Modal/Form */}
            {showAddAnnouncement && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-3xl shadow-xl border border-brand-primary/20 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-brand-primary">Publier une alerte</h3>
                  <button onClick={() => setShowAddAnnouncement(false)} className="text-brand-outline">
                    <XCircle size={24} />
                  </button>
                </div>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Titre de l'alerte (ex: Coupure d'eau)"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    className="w-full p-4 bg-brand-surface rounded-xl border border-brand-outline/20 outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <textarea 
                    placeholder="Détails du message..."
                    rows={4}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    className="w-full p-4 bg-brand-surface rounded-xl border border-brand-outline/20 outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <button 
                    onClick={handleAddAnnouncement}
                    className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold shadow-md active:scale-95 transition-all"
                  >
                    Publier à tous
                  </button>
                </div>
              </motion.div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
              <h2 className="text-sm font-black text-brand-on-surface-variant uppercase tracking-widest px-2">Alertes en cours</h2>
              {loading ? (
                <p className="text-center py-10 text-brand-outline">Chargement des alertes...</p>
              ) : announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <motion.div
                    key={announcement.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-brand-primary relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-brand-on-surface pr-8">{announcement.title}</h3>
                      <button 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-400 p-1 hover:bg-red-50 rounded-lg transition-colors absolute top-4 right-4"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-brand-on-surface-variant mb-3">{announcement.content}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-brand-outline/5">
                      <span className="text-[10px] font-bold text-brand-outline uppercase">
                        {new Date(announcement.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </span>
                      <button className="text-brand-primary text-xs font-bold flex items-center gap-1">
                        Modifier <Edit size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-10 text-brand-outline">Aucune alerte publiée.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
