import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, 
  Phone, MessageSquare, Loader2, AlertCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; description: string }> = {
  pending: { 
    label: 'En attente', 
    icon: Clock, 
    color: 'text-amber-500', 
    description: 'Votre commande est enregistrée' 
  },
  confirmed: { 
    label: 'Confirmée', 
    icon: CheckCircle, 
    color: 'text-blue-500', 
    description: 'La boutique a confirmé votre commande' 
  },
  preparing: { 
    label: 'En préparation', 
    icon: Package, 
    color: 'text-purple-500', 
    description: 'Préparation de votre commande en cours' 
  },
  ready: { 
    label: 'Prête', 
    icon: CheckCircle, 
    color: 'text-cyan-500', 
    description: 'Votre commande est prête à être livrée' 
  },
  in_delivery: { 
    label: 'En livraison', 
    icon: Truck, 
    color: 'text-brand-primary', 
    description: 'Le livreur est en route' 
  },
  delivered: { 
    label: 'Livrée', 
    icon: CheckCircle, 
    color: 'text-emerald-500', 
    description: 'Commande livrée avec succès' 
  },
  cancelled: { 
    label: 'Annulée', 
    icon: AlertCircle, 
    color: 'text-red-500', 
    description: 'Cette commande a été annulée' 
  }
};

const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'in_delivery', 'delivered'];

export const OrderTrackingScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const [order, setOrder] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [livreur, setLivreur] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        // Récupérer la commande
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id, status, total, delivery_address, created_at, notes,
            boutiques (name, phone, quartier),
            user_profiles (name, phone)
          `)
          .eq('id', id)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Récupérer les items
        const { data: itemsData } = await supabase
          .from('order_items')
          .select(`
            quantity, unit_price,
            products (name, image)
          `)
          .eq('order_id', id);

        setItems(itemsData || []);

        // Récupérer la livraison
        const { data: deliveryData } = await supabase
          .from('deliveries')
          .select(`
            status, current_latitude, current_longitude,
            user_profiles (name, phone, avatar)
          `)
          .eq('order_id', id)
          .single();

        if (deliveryData) {
          setDelivery(deliveryData);
          if (deliveryData.user_profiles) {
            setLivreur(deliveryData.user_profiles);
          }
        }
      } catch (err) {
        console.error('Fetch order error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // 🔥 Subscription Realtime pour mises à jour automatiques
    const channel = supabase
      .channel(`order:${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        (payload) => {
          console.log('🔄 Order updated:', payload.new);
          setOrder((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliveries', filter: `order_id=eq.${id}` },
        (payload) => {
          console.log('🔄 Delivery updated:', payload.new);
          setDelivery(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-surface-lowest flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-primary" />
          <p className="text-brand-on-surface-variant text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-surface-lowest flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <p className="text-brand-on-surface-variant mb-4">Commande introuvable</p>
          <button 
            onClick={() => navigate('/home')} 
            className="text-brand-primary font-medium"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(order.status);
  const boutique = order.boutiques;
  const user = order.user_profiles;

  return (
    <div className="min-h-screen bg-brand-surface-lowest pb-8">
      {/* Header */}
      <header className="bg-brand-surface border-b border-brand-outline/10 sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-brand-surface-lowest transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-brand-on-surface" />
          </button>
          <h1 className="text-lg font-bold text-brand-on-surface">Suivi de commande</h1>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        {/* Timeline de statut */}
        <section className="bg-brand-surface rounded-2xl p-5 border border-brand-outline/10">
          <h2 className="text-sm font-bold text-brand-on-surface-variant uppercase tracking-wide mb-6">
            Statut de la commande
          </h2>
          
          <div className="relative">
            {/* Ligne de progression */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-outline/20" />
            <div 
              className="absolute left-4 top-0 w-0.5 bg-brand-primary transition-all duration-500"
              style={{ height: `${(currentIndex / (statusOrder.length - 1)) * 100}%` }}
            />

            {/* Étapes */}
            <div className="space-y-6 relative">
              {statusOrder.map((status, index) => {
                const config = statusConfig[status];
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = config.icon;

                return (
                  <motion.div 
                    key={status}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`
                      relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                      ${isCompleted 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : 'bg-brand-surface border-brand-outline/30 text-brand-on-surface-variant'
                      }
                      ${isCurrent ? 'ring-4 ring-brand-primary/20 scale-110' : ''}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className={`font-bold ${isCurrent ? 'text-brand-primary' : isCompleted ? 'text-brand-on-surface' : 'text-brand-on-surface-variant'}`}>
                        {config.label}
                      </p>
                      <p className="text-xs text-brand-on-surface-variant mt-0.5">
                        {config.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Carte du livreur (si en livraison) */}
        {order.status === 'in_delivery' && delivery && (
          <section className="bg-brand-surface rounded-2xl p-5 border border-brand-outline/10">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-5 h-5 text-brand-primary" />
              <h2 className="font-bold text-brand-on-surface">Votre livreur</h2>
            </div>
            
            {livreur ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                    {livreur.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-brand-on-surface">{livreur.name}</p>
                    <p className="text-sm text-brand-on-surface-variant">{livreur.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-brand-on-surface-variant">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-sm">Recherche d'un livreur en cours...</p>
              </div>
            )}

            {/* Placeholder carte */}
            <div className="mt-4 h-40 bg-brand-surface-lowest rounded-xl border border-dashed border-brand-outline/20 flex items-center justify-center">
              <div className="text-center text-brand-on-surface-variant">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Carte en temps réel</p>
                <p className="text-xs opacity-70">Intégration Mapbox/Leaflet à venir</p>
              </div>
            </div>
          </section>
        )}

        {/* Détails de la commande */}
        <section className="bg-brand-surface rounded-2xl p-5 border border-brand-outline/10">
          <h2 className="font-bold text-brand-on-surface mb-4">Détails de la commande</h2>
          
          {/* Items */}
          <div className="space-y-3 mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-brand-outline/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-surface-lowest flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-on-surface-variant" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-on-surface text-sm">
                      {item.products?.name || 'Produit'}
                    </p>
                    <p className="text-xs text-brand-on-surface-variant">
                      Qté: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-brand-on-surface">
                  {(item.quantity * item.unit_price).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-brand-outline/20">
            <span className="font-bold text-brand-on-surface">Total</span>
            <span className="text-xl font-bold text-brand-primary">
              {order.total.toLocaleString()} FCFA
            </span>
          </div>

          {/* Adresse */}
          <div className="mt-4 p-3 bg-brand-surface-lowest rounded-xl">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-on-surface-variant mt-0.5" />
              <div>
                <p className="text-xs font-medium text-brand-on-surface-variant uppercase tracking-wide mb-1">
                  Adresse de livraison
                </p>
                <p className="text-sm text-brand-on-surface">
                  {order.delivery_address || 'Non spécifiée'}
                </p>
              </div>
            </div>
          </div>

          {/* Boutique */}
          {boutique && (
            <div className="mt-3 p-3 bg-brand-surface-lowest rounded-xl">
              <p className="text-xs font-medium text-brand-on-surface-variant uppercase tracking-wide mb-1">
                Boutique
              </p>
              <p className="text-sm font-medium text-brand-on-surface">{boutique.name}</p>
              <p className="text-xs text-brand-on-surface-variant">{boutique.quartier}</p>
            </div>
          )}
        </section>

        {/* Info commande */}
        <section className="text-center text-xs text-brand-on-surface-variant">
          <p>Commande #{id?.slice(0, 8).toUpperCase()}</p>
          <p>Passée le {new Date(order.created_at).toLocaleString('fr-FR')}</p>
        </section>
      </main>
    </div>
  );
};