import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Plus, Minus, Loader2, ShoppingCart, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export const BoutiqueDetailScreen = () => {
  const { service, id } = useParams<{ service: string; id: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const [boutique, setBoutique] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer les infos de la boutique
        const { data: boutiqueData, error: boutiqueError } = await supabase
          .from('boutiques')
          .select('id, name, description, quartier, ville, rating, latitude, longitude')
          .eq('id', id)
          .single();

        if (boutiqueError) throw boutiqueError;
        setBoutique(boutiqueData);

        // 2. Récupérer les produits de cette boutique
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, description, price, stock, image, category, is_available')
          .eq('boutique_id', id)
          .eq('is_available', true)
          .order('name');

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        alert('Erreur: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleOrder = async () => {
    if (!selectedProduct || !state.user?.id) return;
    
    setSubmitting(true);
    try {
      const total = selectedProduct.price * quantity;
      
      // Créer la commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: state.user.id,
          boutique_id: id,
          order_type: service === 'artisans' ? 'service' : 'product',
          status: 'pending',
          total,
          delivery_address: state.user.house_number || 'Adresse non spécifiée',
          delivery_latitude: boutique?.latitude || null,
          delivery_longitude: boutique?.longitude || null,
          notes: `Produit: ${selectedProduct.name} | Qté: ${quantity}`,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Si produits commandés, créer les order_items
      if (orderData.id) {
        await supabase.from('order_items').insert({
          order_id: orderData.id,
          product_id: selectedProduct.id,
          quantity,
          unit_price: selectedProduct.price,
        });
      }

      // Rediriger vers le suivi
      navigate(`/tracking/${orderData.id}`);
    } catch (err: any) {
      console.error('Order error:', err);
      alert('Erreur lors de la commande: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!boutique) {
    return (
      <div className="min-h-screen bg-brand-surface-lowest flex items-center justify-center p-8">
        <div className="text-center text-brand-on-surface-variant">
          <p>Boutique introuvable</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-brand-primary font-medium">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

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
          <div className="flex-1">
            <h1 className="text-lg font-bold text-brand-on-surface">{boutique.name}</h1>
            <div className="flex items-center gap-2 text-xs text-brand-on-surface-variant">
              <MapPin className="w-3 h-3" />
              <span>{boutique.quartier}{boutique.ville && `, ${boutique.ville}`}</span>
              {boutique.rating > 0 && (
                <span className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  {boutique.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6">
        {/* Description boutique */}
        {boutique.description && (
          <section className="bg-brand-surface rounded-2xl p-4 border border-brand-outline/10">
            <p className="text-sm text-brand-on-surface-variant leading-relaxed">
              {boutique.description}
            </p>
          </section>
        )}

        {/* Liste des produits */}
        <section>
          <h2 className="text-lg font-bold text-brand-on-surface mb-4">
            Produits disponibles ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-brand-surface rounded-2xl border border-dashed border-brand-outline/20">
              <Package className="w-12 h-12 mx-auto mb-3 text-brand-on-surface-variant/40" />
              <p className="text-brand-on-surface-variant text-sm">Aucun produit disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product, index) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-brand-outline/10 bg-brand-surface hover:border-brand-primary/30'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-brand-on-surface">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-brand-on-surface-variant mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-brand-primary font-bold text-base">
                          {product.price.toLocaleString()} FCFA
                        </span>
                        <span className="text-brand-on-surface-variant">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    {selectedProduct?.id === product.id && (
                      <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {/* Panier & Commande */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-outline/10 p-5 shadow-lg"
            >
              <div className="max-w-lg mx-auto space-y-4">
                {/* Info produit sélectionné */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-brand-on-surface">
                      {selectedProduct.name}
                    </p>
                    <p className="text-brand-primary font-bold">
                      {selectedProduct.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-xs text-brand-on-surface-variant hover:text-brand-on-surface"
                  >
                    Changer
                  </button>
                </div>

                {/* Sélecteur quantité */}
                <div className="flex items-center justify-between bg-brand-surface-lowest rounded-xl p-3">
                  <span className="text-sm font-medium text-brand-on-surface">Quantité</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-outline/20 flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Minus className="w-4 h-4 text-brand-on-surface" />
                    </button>
                    <span className="w-8 text-center font-bold text-brand-on-surface">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                      className="w-8 h-8 rounded-lg bg-brand-surface border border-brand-outline/20 flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4 text-brand-on-surface" />
                    </button>
                  </div>
                </div>

                {/* Total & Bouton commander */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs text-brand-on-surface-variant">Total</p>
                    <p className="text-2xl font-bold text-brand-on-surface">
                      {(selectedProduct.price * quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                  <button
                    onClick={handleOrder}
                    disabled={submitting || selectedProduct.stock < quantity}
                    className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-5 h-5" />
                    )}
                    {submitting ? 'Traitement...' : 'Commander'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};