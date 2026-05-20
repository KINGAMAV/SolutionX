import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Order, OrderItem, Artisan, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AppState {
  user: User | null;
  cart: OrderItem[];
  orders: Order[];
  selectedArtisan: Artisan | null;
  authChecked: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH_CHECKED'; payload: boolean }
  | { type: 'ADD_TO_CART'; payload: OrderItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_SELECTED_ARTISAN'; payload: Artisan | null };

const initialState: AppState = {
  user: null,
  cart: [],
  orders: [],
  selectedArtisan: null,
  authChecked: false,
};

async function loadUserProfile(authUser: any): Promise<User> {
  const metadata = authUser.user_metadata || {};
  
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        houseNumber: data.house_number || '',
        avatar: data.avatar || metadata.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        role: (data.role || metadata.role || 'client') as UserRole,
      };
    }
  } catch (err) {
    console.error("Failed to load user profile from DB", err);
  }

  // Fallback to metadata
  return {
    id: authUser.id,
    name: metadata.name || authUser.email?.split('@')[0] || 'Utilisateur',
    email: authUser.email || '',
    houseNumber: metadata.houseNumber || '',
    avatar: metadata.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    role: (metadata.role as UserRole) || 'client',
  };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTH_CHECKED':
      return { ...state, authChecked: action.payload };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_SELECTED_ARTISAN':
      return { ...state, selectedArtisan: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const fetchUserOrders = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (data) {
          const mappedOrders: Order[] = data.map(o => ({
            id: o.id,
            userId: o.user_id,
            boutiqueId: o.boutique_id,
            livreurId: o.livreur_id,
            status: o.status,
            paymentStatus: o.payment_status,
            items: o.items,
            total: o.total,
            deliveryFee: o.delivery_fee,
            createdAt: o.created_at,
            deliveryTime: o.delivery_time
          }));
          dispatch({ type: 'SET_ORDERS', payload: mappedOrders });
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    const restoreSession = async () => {
      console.log("[Auth] Starting session restoration...");
      
      // On débloque l'UI en parallèle de la récupération du profil pour éviter le chargement infini
      // On fixe un délai maximum raisonnable
      const safetyUnlock = setTimeout(() => {
        dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
      }, 3000);

      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth] Session fetch error:", error);
          dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
          return;
        }

        if (data.session?.user) {
          console.log("[Auth] Session found for user:", data.session.user.email);
          try {
            // On charge le profil mais on n'attend pas forcément indéfiniment
            const profilePromise = loadUserProfile(data.session.user);
            const userProfile = await Promise.race([
              profilePromise,
              new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout Profile")), 4000))
            ]);
            
            if (userProfile) {
              dispatch({ type: 'SET_USER', payload: userProfile as User });
              fetchUserOrders(data.session.user.id).catch(e => console.warn("Orders fetch failed", e));
            }
          } catch (profileErr) {
            console.error("[Auth] User profile loading took too long or failed:", profileErr);
          }
        } else {
          console.log("[Auth] No active session found");
        }
      } catch (err) {
        console.error("[Auth] Critical failure in restoreSession:", err);
      } finally {
        clearTimeout(safetyUnlock);
        dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
        console.log("[Auth] Initial Auth Check Finished");
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const userProfile = await loadUserProfile(session.user);
          dispatch({ type: 'SET_USER', payload: userProfile });
          await fetchUserOrders(session.user.id);
        } else {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_ORDERS', payload: [] });
        }
      } catch (err) {
        console.error("Error on auth state change", err);
      } finally {
        dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};