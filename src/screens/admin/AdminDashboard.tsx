import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Grid, Store, Shield, LogOut, CheckCircle2, Trash2, Edit2, 
  MapPin, Bike, Eye, PlusCircle, Check, X, ShieldAlert, Award, Star,
  Sliders, MessageSquare, AlertCircle, Send, CheckSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserRole, User, Boutique, Artisan } from '../../types';
import { MOCK_USERS, ARTISANS } from '../../data';

// Component drawing a gorgeous, simulated vector tracking map using SVG
const VectorTrackingMap: React.FC<{ progress: number; speed: string; status: string }> = ({ progress, speed, status }) => {
  const pathPoints = [
    { x: 50, y: 220 },   // Restaurant "Le Maquis"
    { x: 100, y: 200 },
    { x: 120, y: 140 },
    { x: 180, y: 150 },
    { x: 220, y: 90 },
    { x: 280, y: 100 },
    { x: 330, y: 40 },   // Domicile Client
  ];

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
      <div className="flex justify-between items-center z-10 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-brand-outline/10">
        <div className="flex items-center gap-2">
          <Bike size={18} className="text-brand-primary" />
          <span className="text-xs font-black text-brand-on-surface">Vitesse: {speed}</span>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
          status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-brand-primary/10 text-brand-primary animate-pulse'
        }`}>
          {status === 'completed' ? 'Arrivé' : 'En route'}
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

        {/* Decorative Grid Lines */}
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
          <text y="-16" textAnchor="middle" fill="#7e5700" className="text-[9px] font-black">Client (Villa 124)</text>
        </g>

        {/* Live Bicycle / Rider Marker */}
        <g transform={`translate(${riderPos.x}, ${riderPos.y})`}>
          <circle r="20" fill="#964900" opacity="0.15" />
          <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#964900" className="shadow-lg" />
          <circle cx="-4" cy="4" r="3" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="4" cy="4" r="3" stroke="white" strokeWidth="1.5" fill="none" />
          <line x1="-4" y1="4" x2="0" y2="-2" stroke="white" strokeWidth="1.5" />
          <line x1="4" y1="4" x2="0" y2="-2" stroke="white" strokeWidth="1.5" />
          <line x1="0" y1="-2" x2="-6" y2="-2" stroke="white" strokeWidth="1.5" />
        </g>
      </svg>

      {/* Progress percentage overlay */}
      <div className="z-10 mt-auto bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-brand-outline/10 flex items-center justify-between">
        <span className="text-[11px] font-bold text-brand-on-surface-variant">Progression du trajet :</span>
        <span className="text-sm font-black text-brand-primary">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Rôle de l'utilisateur connecté (Admin ou Agent)
  const isAgent = state.user?.role === 'agent';
  
  // Onglets du dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'boutiques' | 'livreurs' | 'artisans' | 'clients' | 'create_pro' | 'system_config' | 'helpdesk'>('overview');
  
  // États locaux des données chargées depuis Supabase
  const [users, setUsers] = useState<User[]>([]);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [stats, setStats] = useState({ clients: 0, boutiques: 0, livreurs: 0, artisans: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Configuration Globale
  const [sysConfig, setSysConfig] = useState({
    deliveryFee: 1500,
    serviceFee: 5,
    alertText: ''
  });
  
  // Simulation de la messagerie Helpdesk (Agent & Admin)
  const [tickets, setTickets] = useState([
    { id: 1, sender: 'Jean-Marc (Villa 124)', message: 'Bonjour, ma bouteille de gaz tarde à arriver, avez-vous des infos ?', time: 'Il y a 10 min', status: 'pending', replies: [] as string[] },
    { id: 2, sender: 'Boutique Le Maquis', message: 'Je ne parviens pas à modifier le stock de poulet braisé.', time: 'Il y a 25 min', status: 'replied', replies: ['Nous regardons cela tout de suite !'] }
  ]);
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // États de suivi en direct
  const [riderProgress, setRiderProgress] = useState(0);
  const [riderSpeed, setRiderSpeed] = useState('24 km/h');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  // Modals de modification
  const [editUserModal, setEditUserModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [editBoutiqueModal, setEditBoutiqueModal] = useState<{ open: boolean; boutique: Boutique | null }>({ open: false, boutique: null });
  const [editArtisanModal, setEditArtisanModal] = useState<{ open: boolean; artisan: Artisan | null }>({ open: false, artisan: null });

  // Formulaire pour créer un pro
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'livreur' as UserRole,
    category: '', // Pour boutique ou artisan
    address: '',  // Pour boutique
    specialty: '', // Pour artisan
    hourlyRate: 2500, // Pour artisan
  });

  // Charger les données au montage
  useEffect(() => {
    fetchData();

    // Charger la configuration système depuis localStorage
    const savedConfig = localStorage.getItem('citeconnect_system_config');
    if (savedConfig) {
      setSysConfig(JSON.parse(savedConfig));
    }

    // Écouter les mises à jour de position en temps réel (localStorage)
    const interval = setInterval(() => {
      const posString = localStorage.getItem('livreur_position_SOL-92834');
      if (posString) {
        const pos = JSON.parse(posString);
        setRiderProgress(pos.progress);
        setRiderSpeed(pos.speed || '24 km/h');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: dbUsers } = await supabase.from('users').select('*');
      let loadedUsers: User[] = [];
      if (dbUsers && dbUsers.length > 0) {
        loadedUsers = dbUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          houseNumber: u.house_number,
          avatar: u.avatar || undefined,
          role: u.role as UserRole
        }));
      }
      setUsers(loadedUsers);

      const { data: dbBoutiques } = await supabase.from('boutiques').select('*');
      let loadedBoutiques: Boutique[] = [];
      if (dbBoutiques && dbBoutiques.length > 0) {
        loadedBoutiques = dbBoutiques.map(b => ({
          id: b.id,
          ownerId: b.owner_id,
          name: b.name,
          category: b.category,
          address: b.address,
          rating: Number(b.rating),
          logo: b.logo || undefined
        }));
      }
      setBoutiques(loadedBoutiques);

      const { data: dbArtisans } = await supabase.from('artisans').select('*');
      let loadedArtisans: Artisan[] = [];
      if (dbArtisans && dbArtisans.length > 0) {
        loadedArtisans = dbArtisans.map(a => ({
          id: a.id,
          userId: a.user_id || undefined,
          name: a.name,
          category: a.category,
          experience: Number(a.experience),
          rating: Number(a.rating),
          hourlyRate: Number(a.hourly_rate),
          verified: !!a.verified,
          specialty: a.specialty || '',
          zones: a.zones || [],
          avatar: a.avatar || ''
        }));
      }
      setArtisans(loadedArtisans);

      const clientsCount = loadedUsers.filter(u => u.role === 'client').length;
      const boutiquesCount = loadedBoutiques.length;
      const livreursCount = loadedUsers.filter(u => u.role === 'livreur').length;
      const artisansCount = loadedArtisans.length;

      setStats({
        clients: clientsCount,
        boutiques: boutiquesCount,
        livreurs: livreursCount,
        artisans: artisansCount
      });

    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/welcome');
  };

  // ACTIONS DE SAUVEGARDE CONFIGURATION (ADMIN SEULEMENT)
  const handleSaveConfig = () => {
    if (isAgent) {
      alert("Erreur: Les Agents n'ont pas l'autorisation de modifier la configuration système.");
      return;
    }
    localStorage.setItem('citeconnect_system_config', JSON.stringify(sysConfig));
    alert("Configuration système enregistrée et diffusée avec succès !");
  };

  // RÉPONDRE AUX TICKETS (HELPDESK)
  const handleSendReply = () => {
    if (!selectedTicket || !replyInput.trim()) return;
    
    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'replied',
          replies: [...t.replies, replyInput]
        };
      }
      return t;
    });

    setTickets(updated);
    setSelectedTicket({
      ...selectedTicket,
      status: 'replied',
      replies: [...selectedTicket.replies, replyInput]
    });
    setReplyInput('');
  };

  // ACTIONS DE CRÉATION PROFESSIONNEL
  const handleCreatePro = async () => {
    setMessage('');
    setLoading(true);
    
    if (!formData.password || formData.password.length < 6) {
      setMessage('Erreur: Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const { createClient } = await import('@supabase/supabase-js');
      const tempSupabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      });

      const { data, error } = await tempSupabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            houseNumber: 'HQ'
          }
        }
      });

      if (error) throw error;
      
      const userId = data.user?.id;
      if (!userId) throw new Error("ID utilisateur non récupéré.");

      // Insertion dans les tables métiers si nécessaire
      if (formData.role === 'boutique') {
        await supabase.from('boutiques').insert([{
          owner_id: userId,
          name: formData.name,
          category: formData.category || 'Supermarché',
          address: formData.address || 'Quartier Administratif',
          rating: 5.0
        }]);
      } else if (formData.role === 'artisan') {
        await supabase.from('artisans').insert([{
          user_id: userId,
          name: formData.name,
          category: formData.category || 'Menuiserie',
          experience: 5,
          rating: 4.5,
          hourly_rate: formData.hourlyRate,
          specialty: formData.specialty || 'Ebéniste',
          verified: true,
          zones: ['Zone 1', 'Zone 2']
        }]);
      }

      setMessage(`Le compte professionnel (${formData.role}) a été créé avec succès !`);
      setFormData({ name: '', email: '', password: '', role: 'livreur', category: '', address: '', specialty: '', hourlyRate: 2500 });
      fetchData();
    } catch (err: any) {
      setMessage(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ACTIONS DE SUPPRESSION AVEC RESTRICTION AGENT !
  const handleDeleteUser = async (id: string) => {
    if (isAgent) {
      alert("🔒 Droits insuffisants: La suppression de compte est réservée aux Administrateurs Globaux.");
      return;
    }
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) return;
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      alert("Compte supprimé avec succès !");
      fetchData();
    } catch (err: any) {
      setUsers(users.filter(u => u.id !== id));
      alert("Compte supprimé de la session locale !");
    }
  };

  const handleDeleteBoutique = async (id: string) => {
    if (isAgent) {
      alert("🔒 Droits insuffisants: La suppression de boutique est réservée aux Administrateurs Globaux.");
      return;
    }
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette boutique ?")) return;
    try {
      const { error } = await supabase.from('boutiques').delete().eq('id', id);
      if (error) throw error;
      alert("Boutique supprimée avec succès !");
      fetchData();
    } catch (err: any) {
      setBoutiques(boutiques.filter(b => b.id !== id));
      alert("Boutique supprimée de la session locale !");
    }
  };

  const handleDeleteArtisan = async (id: string) => {
    if (isAgent) {
      alert("🔒 Droits insuffisants: La suppression d'artisan est réservée aux Administrateurs Globaux.");
      return;
    }
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet artisan ?")) return;
    try {
      const { error } = await supabase.from('artisans').delete().eq('id', id);
      if (error) throw error;
      alert("Artisan supprimé avec succès !");
      fetchData();
    } catch (err: any) {
      setArtisans(artisans.filter(a => a.id !== id));
      alert("Artisan supprimé de la session locale !");
    }
  };

  // ACTIONS DE MISE À JOUR
  const handleUpdateUser = async () => {
    const u = editUserModal.user;
    if (!u) return;
    try {
      const { error } = await supabase.from('users').update({
        name: u.name,
        email: u.email,
        role: u.role,
        house_number: u.houseNumber
      }).eq('id', u.id);
      
      if (error) throw error;
      alert("Compte mis à jour avec succès !");
      setEditUserModal({ open: false, user: null });
      fetchData();
    } catch (err: any) {
      setUsers(users.map(item => item.id === u.id ? u : item));
      setEditUserModal({ open: false, user: null });
      alert("Compte mis à jour dans la session locale !");
    }
  };

  const handleUpdateBoutique = async () => {
    const b = editBoutiqueModal.boutique;
    if (!b) return;
    try {
      const { error } = await supabase.from('boutiques').update({
        name: b.name,
        category: b.category,
        address: b.address
      }).eq('id', b.id);
      
      if (error) throw error;
      alert("Boutique mise à jour avec succès !");
      setEditBoutiqueModal({ open: false, boutique: null });
      fetchData();
    } catch (err: any) {
      setBoutiques(boutiques.map(item => item.id === b.id ? b : item));
      setEditBoutiqueModal({ open: false, boutique: null });
      alert("Boutique mise à jour dans la session locale !");
    }
  };

  const handleUpdateArtisan = async () => {
    const a = editArtisanModal.artisan;
    if (!a) return;
    try {
      const { error } = await supabase.from('artisans').update({
        name: a.name,
        category: a.category,
        experience: Number(a.experience),
        hourly_rate: Number(a.hourlyRate),
        specialty: a.specialty,
        verified: a.verified,
        zones: a.zones
      }).eq('id', a.id);
      
      if (error) throw error;
      alert("Artisan mis à jour avec succès !");
      setEditArtisanModal({ open: false, artisan: null });
      fetchData();
    } catch (err: any) {
      setArtisans(artisans.map(item => item.id === a.id ? a : item));
      setEditArtisanModal({ open: false, artisan: null });
      alert("Artisan mis à jour dans la session locale !");
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-brand-surface-lowest border-b border-brand-outline/10 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md ${isAgent ? 'bg-brand-tertiary' : 'bg-brand-primary'}`}>
            <Shield size={16} />
          </div>
          <div>
            <h1 className="font-black text-brand-primary text-sm leading-none">{isAgent ? "Agent Dispatcher" : "Admin Panel"}</h1>
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isAgent ? 'bg-brand-tertiary shadow-brand-tertiary/10' : 'bg-brand-primary shadow-brand-primary/10'}`}>
              <Shield className="text-white animate-pulse" size={20} />
            </div>
            <div>
              <h1 className="font-black text-brand-primary text-lg leading-none">{isAgent ? "Agent Dispatcher" : "Admin Panel"}</h1>
              <p className="text-[9px] font-bold text-brand-on-surface-variant tracking-wider uppercase mt-1">CitéConnect Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {[
            { id: 'overview', label: "Vue d'ensemble", icon: Grid },
            { id: 'accounts', label: "Comptes Pro", icon: Shield },
            { id: 'boutiques', label: "Boutiques", icon: Store },
            { id: 'livreurs', label: "Livreurs", icon: Bike },
            { id: 'artisans', label: "Artisans", icon: Award },
            { id: 'clients', label: "Clients", icon: Users },
            { id: 'create_pro', label: "Créer un Pro", icon: PlusCircle },
            { id: 'helpdesk', label: "Boîte Support", icon: MessageSquare },
            ...(!isAgent ? [{ id: 'system_config', label: "Config Globale", icon: Sliders }] : [])
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all w-full ${
                  activeTab === tab.id 
                    ? 'bg-brand-primary text-white shadow-md' 
                    : 'text-brand-on-surface-variant hover:bg-brand-surface-low'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-brand-outline/5">
          <div className="bg-brand-surface-low p-3 rounded-2xl text-[10px] font-bold text-brand-outline mb-3 flex items-center gap-2 border border-brand-outline/10">
            <CheckSquare size={12} className="text-brand-primary shrink-0" />
            <span>Mode : {isAgent ? 'Agent Limité' : 'Super Admin'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {isAgent && (
          <div className="bg-brand-tertiary/10 border border-brand-tertiary/20 text-brand-on-surface-variant p-4 rounded-2xl font-bold text-xs flex items-center gap-2 mb-6 shadow-sm">
            <ShieldAlert size={16} className="text-brand-tertiary shrink-0" />
            <span>Vous naviguez avec les privilèges d'un **Agent Dispatcher**. Les actions de suppression définitive et de configuration globale sont bloquées.</span>
          </div>
        )}

        {loading && (
          <div className="text-center py-4 bg-brand-surface-low rounded-2xl font-bold text-brand-primary mb-6 animate-pulse">
            Chargement des données en direct...
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            
            {/* TONGLET 1: VUE D'ENSEMBLE */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black text-brand-on-surface tracking-tight">Bonjour, {state.user?.name || "Administrateur"}</h2>
                    <p className="text-brand-on-surface-variant font-medium mt-1">Supervision de l'activité en temps réel de CitéConnect.</p>
                  </div>
                </div>
                
                {/* Cartes Métriques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { title: 'Clients', value: stats.clients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { title: 'Boutiques', value: stats.boutiques, icon: Store, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { title: 'Livreurs', value: stats.livreurs, icon: Bike, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { title: 'Artisans', value: stats.artisans, icon: Award, color: 'text-green-500', bg: 'bg-green-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-brand-surface-lowest p-6 rounded-[2.2rem] shadow-sm border border-brand-outline/10 flex flex-col justify-between h-40">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-brand-on-surface-variant text-xs font-black tracking-wide uppercase opacity-75">{stat.title}</p>
                        <h3 className="text-3xl font-black text-brand-on-surface mt-1">{stat.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Radar des Livraisons */}
                <section className="bg-brand-surface-lowest p-8 rounded-[2.5rem] shadow-sm border border-brand-outline/10 mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-black text-brand-on-surface">Radar des Livraisons en Direct</h3>
                      <p className="text-sm font-medium text-brand-on-surface-variant">Suivi du livreur Moussa en cours de course</p>
                    </div>
                    {riderProgress > 0 && riderProgress < 1 && (
                      <button 
                        onClick={() => setTrackingModalOpen(true)}
                        className="px-5 py-2.5 bg-brand-primary text-white text-xs font-black rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Eye size={14} />
                        Agrandir le Radar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                      <div className="p-5 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black tracking-wider uppercase text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md">COMMANDE ACTIVE</span>
                          <span className="text-xs font-black text-brand-on-surface">#SOL-92834</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-black text-brand-on-surface">Livreur : Moussa Livreur</p>
                          <p className="text-xs font-medium text-brand-on-surface-variant">Trajet: Le Maquis → Villa 124</p>
                        </div>
                        {riderProgress > 0 ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>Progression</span>
                              <span>{Math.round(riderProgress * 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-brand-outline/10 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${riderProgress * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-brand-primary block animate-pulse mt-1">● Position mise à jour en direct</span>
                          </div>
                        ) : (
                          <div className="text-xs font-bold text-brand-on-surface-variant bg-brand-surface-low p-3 rounded-lg text-center">
                            En attente de démarrage de la course par le livreur.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <VectorTrackingMap progress={riderProgress} speed={riderSpeed} status={riderProgress >= 1 ? 'completed' : 'delivering'} />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TONGLET 2: COMPTES PRO */}
            {activeTab === 'accounts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-brand-on-surface">Comptes Administratifs et Professionnels</h2>
                    <p className="text-brand-on-surface-variant font-medium mt-1">Gérer les accès des administrateurs, agents et professionnels.</p>
                  </div>
                </div>

                <div className="bg-brand-surface-lowest rounded-3xl border border-brand-outline/10 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-brand-surface-low border-b border-brand-outline/10">
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Nom</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Email</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Rôle</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Résidence/HQ</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-outline/5">
                        {users.filter(u => u.role !== 'client').map((user) => (
                          <tr key={user.id} className="hover:bg-brand-surface-low/30 transition-colors">
                            <td className="p-5 font-bold text-brand-on-surface">{user.name}</td>
                            <td className="p-5 font-medium text-brand-on-surface-variant">{user.email}</td>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' :
                                user.role === 'agent' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                user.role === 'livreur' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                                user.role === 'boutique' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                                'bg-green-50 text-green-600 border border-green-200'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-5 font-medium text-brand-on-surface-variant">{user.houseNumber}</td>
                            <td className="p-5 text-right space-x-2">
                              <button 
                                onClick={() => setEditUserModal({ open: true, user })}
                                className="p-2 bg-brand-surface-low text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className={`p-2 rounded-xl transition-colors ${
                                  isAgent ? 'bg-brand-surface-high text-brand-outline opacity-40 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                                }`}
                                title={isAgent ? "Suppression restreinte aux Admins" : "Supprimer"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TONGLET 3: BOUTIQUES */}
            {activeTab === 'boutiques' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-brand-on-surface">Gestion des Boutiques / Restaurants</h2>
                    <p className="text-brand-on-surface-variant font-medium mt-1">Superviser et configurer les points de vente de la cité.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {boutiques.map((boutique) => (
                    <div key={boutique.id} className="bg-brand-surface-lowest rounded-3xl p-6 border border-brand-outline/10 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-brand-surface-low rounded-2xl flex items-center justify-center text-brand-primary">
                          <Store size={28} />
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-black">
                          <Star size={14} className="fill-current" />
                          {boutique.rating || "0.0"}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-black text-lg text-brand-on-surface">{boutique.name}</h3>
                        <p className="text-xs font-bold text-brand-primary mt-1">{boutique.category}</p>
                        <p className="text-sm font-medium text-brand-on-surface-variant mt-2 flex items-center gap-1">
                          <MapPin size={14} />
                          {boutique.address}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-brand-outline/5 flex gap-2">
                        <button 
                          onClick={() => setEditBoutiqueModal({ open: true, boutique })}
                          className="flex-1 py-3 bg-brand-surface-low text-brand-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-all"
                        >
                          <Edit2 size={16} />
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteBoutique(boutique.id)}
                          className={`p-3 rounded-2xl transition-colors ${
                            isAgent ? 'bg-brand-surface-high text-brand-outline opacity-40 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                          }`}
                          title={isAgent ? "Suppression restreinte aux Admins" : "Supprimer"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TONGLET 4: LIVREURS */}
            {activeTab === 'livreurs' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface">Gestion des Livreurs</h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">Contrôler les profils et les trajets des livreurs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {users.filter(u => u.role === 'livreur').map((livreur) => (
                    <div key={livreur.id} className="bg-brand-surface-lowest rounded-3xl p-6 border border-brand-outline/10 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center overflow-hidden border border-brand-primary/20">
                          {livreur.avatar ? (
                            <img src={livreur.avatar} alt={livreur.name} className="w-full h-full object-cover" />
                          ) : (
                            <Bike size={32} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-brand-on-surface">{livreur.name}</h3>
                          <p className="text-sm font-medium text-brand-on-surface-variant">{livreur.email}</p>
                          <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                            Disponible
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => setEditUserModal({ open: true, user: livreur })}
                          className="p-3 bg-brand-surface-low text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(livreur.id)}
                          className={`p-3 rounded-2xl transition-colors ${
                            isAgent ? 'bg-brand-surface-high text-brand-outline opacity-40 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                          }`}
                          title={isAgent ? "Suppression restreinte aux Admins" : "Supprimer"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TONGLET 5: ARTISANS */}
            {activeTab === 'artisans' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface">Gestion des Artisans Qualifiés</h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">Validation, tarifs horaires et spécialités des professionnels.</p>
                </div>

                <div className="bg-brand-surface-lowest rounded-3xl border border-brand-outline/10 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-brand-surface-low border-b border-brand-outline/10">
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Artisan</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Métier</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Expérience</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Tarif Horaire</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Statut</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-outline/5">
                        {artisans.map((artisan) => (
                          <tr key={artisan.id} className="hover:bg-brand-surface-low/30 transition-colors">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-surface-low overflow-hidden shrink-0 border border-brand-outline/10">
                                  <img src={artisan.avatar || 'https://via.placeholder.com/150'} alt={artisan.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-brand-on-surface">{artisan.name}</span>
                              </div>
                            </td>
                            <td className="p-5 font-bold text-brand-primary">{artisan.category}</td>
                            <td className="p-5 font-medium text-brand-on-surface-variant">{artisan.experience} ans</td>
                            <td className="p-5 font-black text-brand-on-surface">{artisan.hourlyRate} CFA / h</td>
                            <td className="p-5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                artisan.verified ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                              }`}>
                                {artisan.verified ? 'Vérifié' : 'En attente'}
                              </span>
                            </td>
                            <td className="p-5 text-right space-x-2">
                              <button 
                                onClick={() => setEditArtisanModal({ open: true, artisan })}
                                className="p-2 bg-brand-surface-low text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteArtisan(artisan.id)}
                                className={`p-2 rounded-xl transition-colors ${
                                  isAgent ? 'bg-brand-surface-high text-brand-outline opacity-40 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                                }`}
                                title={isAgent ? "Suppression restreinte aux Admins" : "Supprimer"}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TONGLET 6: CLIENTS */}
            {activeTab === 'clients' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface flex items-center gap-2">
                    Gestion des Clients Inscrits
                    <span className="px-3 py-1 bg-brand-surface-variant text-brand-on-surface-variant text-[10px] font-black tracking-widest rounded-full uppercase">
                      LECTURE SEULE
                    </span>
                  </h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">
                    Visualiser et modérer les comptes clients.
                  </p>
                </div>

                <div className="bg-brand-surface-lowest rounded-3xl border border-brand-outline/10 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-brand-surface-low border-b border-brand-outline/10">
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Client</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Email</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">Adresse / Villa</th>
                          <th className="p-5 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-outline/5">
                        {users.filter(u => u.role === 'client').map((client) => (
                          <tr key={client.id} className="hover:bg-brand-surface-low/30 transition-colors">
                            <td className="p-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-surface-low overflow-hidden shrink-0 border border-brand-outline/10">
                                  <img src={client.avatar || 'https://via.placeholder.com/150'} alt={client.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-brand-on-surface">{client.name}</span>
                              </div>
                            </td>
                            <td className="p-5 font-medium text-brand-on-surface-variant">{client.email}</td>
                            <td className="p-5 font-black text-brand-on-surface">{client.houseNumber || 'Non renseigné'}</td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <span className="text-[10px] font-bold text-brand-outline italic bg-brand-surface-low px-2 py-1 rounded">
                                  Non modifiable
                                </span>
                                <button 
                                  onClick={() => handleDeleteUser(client.id)}
                                  className={`p-2.5 rounded-xl transition-colors ${
                                    isAgent ? 'bg-brand-surface-high text-brand-outline opacity-40 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                                  }`}
                                  title={isAgent ? "Suppression restreinte aux Admins" : "Supprimer"}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TONGLET 7: CRÉER UN PRO */}
            {activeTab === 'create_pro' && (
              <div className="max-w-xl">
                <h2 className="text-2xl font-black text-brand-on-surface">Créer un compte Professionnel</h2>
                <p className="text-brand-on-surface-variant font-medium mt-2">
                  Ajouter de nouveaux livreurs, artisans, boutiques ou agents.
                </p>

                <div className="mt-8 bg-brand-surface-lowest p-6 md:p-8 rounded-[2rem] shadow-sm border border-brand-outline/10 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-brand-on-surface-variant">Rôle du professionnel</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                      className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                    >
                      <option value="livreur">Livreur E-commerce</option>
                      <option value="artisan">Artisan (Plombier, Elec...)</option>
                      <option value="boutique">Propriétaire de Boutique</option>
                      {/* Seul le Super Admin peut créer d'autres agents */}
                      {!isAgent && <option value="agent">Agent d'entreprise</option>}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-brand-on-surface-variant">Nom complet</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Moussa Diaby"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-brand-on-surface-variant">Email professionnel</label>
                    <input 
                      type="email" 
                      placeholder="moussa@expert.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-brand-on-surface-variant">Mot de passe temporaire</label>
                    <input 
                      type="text" 
                      placeholder="Min 6 caractères..."
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                    />
                  </div>

                  {formData.role === 'boutique' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-brand-on-surface-variant">Catégorie de la boutique</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Supermarché, Restaurant, Pharmacie"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-brand-on-surface-variant">Adresse / Emplacement</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Rez-de-chaussée Villa 42"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                        />
                      </div>
                    </>
                  )}

                  {formData.role === 'artisan' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-brand-on-surface-variant">Corps de métier</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Menuisier, Plombier, Électricien"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-brand-on-surface-variant">Spécialité précise</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Ebéniste de luxe"
                          value={formData.specialty}
                          onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-brand-on-surface-variant">Tarif Horaire (CFA)</label>
                        <input 
                          type="number" 
                          placeholder="2500"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                          className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium"
                        />
                      </div>
                    </>
                  )}

                  {message && (
                    <div className={`p-4 rounded-xl text-sm font-bold ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {message}
                    </div>
                  )}

                  <button 
                    onClick={handleCreatePro}
                    disabled={loading}
                    className="w-full h-14 mt-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all text-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Shield size={20} />
                    Créer le compte {formData.role}
                  </button>
                </div>
              </div>
            )}

            {/* TONGLET 8: CONFIGURATION SYSTÈME (ADMIN SEULEMENT - MASQUÉ AGENT) */}
            {activeTab === 'system_config' && !isAgent && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface flex items-center gap-2">
                    <Sliders className="text-brand-primary" />
                    Configuration Globale de la Cité
                  </h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">
                    Paramétrez les frais de services et diffusez des alertes prioritaires aux résidents.
                  </p>
                </div>

                <div className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-brand-on-surface-variant">Frais de livraison de base (CFA)</label>
                      <input 
                        type="number" 
                        value={sysConfig.deliveryFee}
                        onChange={(e) => setSysConfig({...sysConfig, deliveryFee: Number(e.target.value)})}
                        className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-brand-on-surface-variant">Commission Plateforme (%)</label>
                      <input 
                        type="number" 
                        value={sysConfig.serviceFee}
                        onChange={(e) => setSysConfig({...sysConfig, serviceFee: Number(e.target.value)})}
                        className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-brand-on-surface-variant flex items-center gap-1">
                      <AlertCircle size={16} className="text-brand-primary" />
                      Alerte Générale de la Cité (Diffusion immédiate)
                    </label>
                    <textarea 
                      placeholder="Ex: Coupure d'eau générale programmée ce dimanche de 14h à 18h pour maintenance des tuyaux."
                      value={sysConfig.alertText}
                      onChange={(e) => setSysConfig({...sysConfig, alertText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3.5 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium resize-none"
                    />
                    <p className="text-[10px] font-bold text-brand-outline">Ce message clignotera en haut de la page d'accueil de tous les résidents connectés.</p>
                  </div>

                  <button 
                    onClick={handleSaveConfig}
                    className="w-full h-14 bg-brand-primary text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={20} />
                    Enregistrer et Diffuser la Configuration
                  </button>
                </div>
              </div>
            )}

            {/* TONGLET 9: MESSAGERIE HELPDESK / BOÎTE SUPPORT */}
            {activeTab === 'helpdesk' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-brand-on-surface">Boîte Support & Dispatcher Helpdesk</h2>
                  <p className="text-brand-on-surface-variant font-medium mt-1">Répondez aux alertes, questions et réclamations des résidents de la cité.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-brand-surface-lowest rounded-3xl border border-brand-outline/10 overflow-hidden shadow-sm h-[60vh]">
                  {/* Left Column: Tickets List */}
                  <div className="lg:col-span-1 border-r border-brand-outline/10 flex flex-col">
                    <div className="p-4 bg-brand-surface-low border-b border-brand-outline/10 font-black text-xs text-brand-on-surface-variant uppercase tracking-wider">
                      Tickets Reçus
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-brand-outline/5">
                      {tickets.map(ticket => (
                        <button
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`w-full p-4 text-left transition-colors flex flex-col gap-1.5 ${
                            selectedTicket?.id === ticket.id ? 'bg-brand-primary/5 border-l-4 border-brand-primary' : 'hover:bg-brand-surface-low/30'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold text-sm text-brand-on-surface">{ticket.sender}</span>
                            <span className="text-[9px] font-bold text-brand-outline">{ticket.time}</span>
                          </div>
                          <p className="text-xs text-brand-on-surface-variant line-clamp-1">{ticket.message}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full self-start uppercase tracking-wider ${
                            ticket.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {ticket.status === 'pending' ? 'À traiter' : 'Répondu'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Active Chat Details */}
                  <div className="lg:col-span-2 flex flex-col h-full bg-brand-surface-low/10">
                    {selectedTicket ? (
                      <div className="flex flex-col h-full justify-between">
                        {/* Header Chat */}
                        <div className="p-4 bg-brand-surface-lowest border-b border-brand-outline/10 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-brand-on-surface">{selectedTicket.sender}</h3>
                            <p className="text-[10px] font-bold text-brand-outline">{selectedTicket.time}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                            selectedTicket.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {selectedTicket.status === 'pending' ? 'En attente' : 'Résolu'}
                          </span>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                          {/* Sender's original ticket */}
                          <div className="flex flex-col gap-1 items-start max-w-[80%]">
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-brand-outline/10 shadow-sm text-sm text-brand-on-surface">
                              {selectedTicket.message}
                            </div>
                            <span className="text-[9px] font-bold text-brand-outline ml-1">{selectedTicket.sender}</span>
                          </div>

                          {/* Agent replies */}
                          {selectedTicket.replies.map((reply, index) => (
                            <div key={index} className="flex flex-col gap-1 items-end max-w-[80%] ml-auto">
                              <div className="bg-brand-primary text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm">
                                {reply}
                              </div>
                              <span className="text-[9px] font-bold text-brand-outline mr-1">Vous (CitéConnect Agent)</span>
                            </div>
                          ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-brand-surface-lowest border-t border-brand-outline/10 flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Écrivez votre réponse d'assistance..."
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                            className="flex-1 px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-sm font-medium"
                          />
                          <button 
                            onClick={handleSendReply}
                            className="p-3.5 bg-brand-primary text-white rounded-2xl hover:bg-brand-primary/95 transition-all shadow-md active:scale-95 shrink-0"
                          >
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-brand-on-surface-variant p-6 text-center">
                        <MessageSquare size={48} className="mb-3 opacity-40 text-brand-primary" />
                        <h4 className="font-bold text-brand-on-surface">Sélectionnez un ticket</h4>
                        <p className="text-xs text-brand-outline mt-1 max-w-[280px]">Cliquez sur un message d'assistance dans la colonne de gauche pour y répondre.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ============================================================== */}
      {/* SECTION DES MODALS ET DIALOGUES DE MODIFICATION */}
      {/* ============================================================== */}

      {/* 1. Modal Modification Utilisateur (Comptes / Livreurs) */}
      {editUserModal.open && editUserModal.user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-2xl max-w-md w-full space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-brand-on-surface">Modifier le Compte</h3>
              <button 
                onClick={() => setEditUserModal({ open: false, user: null })}
                className="p-1.5 hover:bg-brand-surface-low rounded-xl text-brand-outline"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Nom complet</label>
                <input 
                  type="text" 
                  value={editUserModal.user.name} 
                  onChange={(e) => setEditUserModal({ open: true, user: { ...editUserModal.user!, name: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Email</label>
                <input 
                  type="email" 
                  value={editUserModal.user.email} 
                  onChange={(e) => setEditUserModal({ open: true, user: { ...editUserModal.user!, email: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">HQ / Domicile</label>
                <input 
                  type="text" 
                  value={editUserModal.user.houseNumber} 
                  onChange={(e) => setEditUserModal({ open: true, user: { ...editUserModal.user!, houseNumber: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Rôle d'Accès</label>
                <select 
                  value={editUserModal.user.role} 
                  onChange={(e) => setEditUserModal({ open: true, user: { ...editUserModal.user!, role: e.target.value as UserRole } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none font-bold"
                >
                  <option value="admin">Administrateur</option>
                  <option value="agent">Agent d'entreprise</option>
                  <option value="livreur">Livreur</option>
                  <option value="boutique">Boutique</option>
                  <option value="artisan">Artisan</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleUpdateUser}
              className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Enregistrer les modifications
            </button>
          </motion.div>
        </div>
      )}

      {/* 2. Modal Modification Boutique */}
      {editBoutiqueModal.open && editBoutiqueModal.boutique && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-2xl max-w-md w-full space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-brand-on-surface">Modifier la Boutique</h3>
              <button 
                onClick={() => setEditBoutiqueModal({ open: false, boutique: null })}
                className="p-1.5 hover:bg-brand-surface-low rounded-xl text-brand-outline"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Nom de la Boutique</label>
                <input 
                  type="text" 
                  value={editBoutiqueModal.boutique.name} 
                  onChange={(e) => setEditBoutiqueModal({ open: true, boutique: { ...editBoutiqueModal.boutique!, name: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Catégorie</label>
                <input 
                  type="text" 
                  value={editBoutiqueModal.boutique.category} 
                  onChange={(e) => setEditBoutiqueModal({ open: true, boutique: { ...editBoutiqueModal.boutique!, category: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Adresse Physique</label>
                <input 
                  type="text" 
                  value={editBoutiqueModal.boutique.address} 
                  onChange={(e) => setEditBoutiqueModal({ open: true, boutique: { ...editBoutiqueModal.boutique!, address: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handleUpdateBoutique}
              className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Enregistrer la Boutique
            </button>
          </motion.div>
        </div>
      )}

      {/* 3. Modal Modification Artisan */}
      {editArtisanModal.open && editArtisanModal.artisan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-2xl max-w-md w-full space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-brand-on-surface">Modifier l'Artisan</h3>
              <button 
                onClick={() => setEditArtisanModal({ open: false, artisan: null })}
                className="p-1.5 hover:bg-brand-surface-low rounded-xl text-brand-outline"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Nom complet</label>
                <input 
                  type="text" 
                  value={editArtisanModal.artisan.name} 
                  onChange={(e) => setEditArtisanModal({ open: true, artisan: { ...editArtisanModal.artisan!, name: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Métier / Catégorie</label>
                <input 
                  type="text" 
                  value={editArtisanModal.artisan.category} 
                  onChange={(e) => setEditArtisanModal({ open: true, artisan: { ...editArtisanModal.artisan!, category: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-on-surface-variant">Spécialité</label>
                <input 
                  type="text" 
                  value={editArtisanModal.artisan.specialty} 
                  onChange={(e) => setEditArtisanModal({ open: true, artisan: { ...editArtisanModal.artisan!, specialty: e.target.value } })}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-on-surface-variant">Expérience (Ans)</label>
                  <input 
                    type="number" 
                    value={editArtisanModal.artisan.experience} 
                    onChange={(e) => setEditArtisanModal({ open: true, artisan: { ...editArtisanModal.artisan!, experience: Number(e.target.value) } })}
                    className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-on-surface-variant">Tarif Horaire (CFA)</label>
                  <input 
                    type="number" 
                    value={editArtisanModal.artisan.hourlyRate} 
                    onChange={(e) => setEditArtisanModal({ open: true, artisan: { ...editArtisanModal.artisan!, hourlyRate: Number(e.target.value) } })}
                    className="w-full px-4 py-3 bg-brand-surface border border-brand-outline/20 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="verified-checkbox"
                  checked={editArtisanModal.artisan.verified} 
                  onChange={(e) => setEditArtisanModal({ open: true, artisan: { ...editArtisanModal.artisan!, verified: e.target.checked } })}
                  className="w-5 h-5 accent-brand-primary cursor-pointer"
                />
                <label htmlFor="verified-checkbox" className="text-sm font-bold text-brand-on-surface select-none cursor-pointer">
                  Artisan certifié et vérifié par l'entreprise
                </label>
              </div>
            </div>

            <button 
              onClick={handleUpdateArtisan}
              className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Enregistrer l'Artisan
            </button>
          </motion.div>
        </div>
      )}

      {/* 4. Modal Agrandie pour le Suivi du Radar */}
      {trackingModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-surface-lowest p-8 rounded-[2.5rem] border border-brand-outline/10 shadow-2xl max-w-2xl w-full space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-brand-on-surface flex items-center gap-2">
                  <Bike className="text-brand-primary" />
                  Radar Haute Précision : Moussa Livreur
                </h3>
                <p className="text-xs font-bold text-brand-on-surface-variant mt-1">Supervision de la livraison #SOL-92834</p>
              </div>
              <button 
                onClick={() => setTrackingModalOpen(false)}
                className="p-2 hover:bg-brand-surface-low rounded-xl text-brand-outline"
              >
                <X size={20} />
              </button>
            </div>

            <VectorTrackingMap progress={riderProgress} speed={riderSpeed} status={riderProgress >= 1 ? 'completed' : 'delivering'} />

            <div className="bg-brand-surface-low p-4 rounded-2xl flex justify-between items-center text-xs font-bold">
              <span>Position GPS : {riderProgress > 0 ? `Abidjan, Zone 4 → Cocody (${(5.3164 + riderProgress * 0.032).toFixed(4)}, ${(-3.9875 - riderProgress * 0.014).toFixed(4)})` : 'En attente...'}</span>
              <span className="text-brand-primary">Arrivée estimée : 14:45</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Mobile only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface-lowest/95 backdrop-blur-md border-t border-brand-outline/10 py-3.5 px-6 flex justify-around items-center z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'overview' ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <Grid size={20} />
          <span className="text-[10px] font-black tracking-wide">Radar</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('accounts')}
          className={`flex flex-col items-center gap-1 transition-all ${['accounts', 'create_pro', 'boutiques', 'livreurs', 'artisans', 'clients'].includes(activeTab) ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <Users size={20} />
          <span className="text-[10px] font-black tracking-wide">Comptes</span>
        </button>

        <button 
          onClick={() => setActiveTab('helpdesk')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'helpdesk' ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] font-black tracking-wide">Support</span>
        </button>

        {!isAgent && (
          <button 
            onClick={() => setActiveTab('system_config')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'system_config' ? 'text-brand-primary scale-105' : 'text-brand-on-surface-variant opacity-70'}`}
          >
            <Sliders size={20} />
            <span className="text-[10px] font-black tracking-wide">Config</span>
          </button>
        )}
      </nav>

    </div>
  );
};
