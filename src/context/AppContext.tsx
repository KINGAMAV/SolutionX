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
    // Timeout de 3 secondes max pour cette requête
    const profilePromise = supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();
    
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Profile load timeout')), 3000)
    );

    const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

    if (error) {
      console.error("[Auth] Database error loading profile:", error);
    }

    if (data) {
      return {
        id: data.id,
        name: data.name || metadata.name || authUser.email?.split('@')[0] || 'Utilisateur',
        email: data.email,
        houseNumber: data.house_number || metadata.houseNumber || '',
        avatar: data.avatar || metadata.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        role: (data.role || metadata.role || 'client') as UserRole,
      };
    }
  } catch (err) {
    console.error("[Auth] Exception loading profile:", err);
  }

  // Fallback to metadata if DB record is missing or fails
  console.log("[Auth] Using metadata fallback for user:", authUser.email);
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
            paymentMethod: o.payment_method || undefined,
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
      
      try {
        // Timeout global de 5 secondes pour toute la restauration
        const sessionPromise = (async () => {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("[Auth] Session fetch error:", error);
            return null;
          }

          if (data.session?.user) {
            console.log("[Auth] Session found for user:", data.session.user.email);
            const userProfile = await loadUserProfile(data.session.user);
            dispatch({ type: 'SET_USER', payload: userProfile });
            // Fetch orders en background, don't wait
            fetchUserOrders(data.session.user.id).catch(e => console.warn("Orders fetch failed", e));
          } else {
            console.log("[Auth] No active session found");
          }
        })();

        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => {
            console.warn("[Auth] Session restoration timeout - continuing anyway");
            resolve(null);
          }, 5000)
        );

        await Promise.race([sessionPromise, timeoutPromise]);
      } catch (err) {
        console.error("[Auth] Critical failure in restoreSession:", err);
      } finally {
        dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
        console.log("[Auth] Initial Auth Check Finished");
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] State Change Event:", event, "| User:", session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          console.log("[Auth] User signing in/refreshing:", session.user.email);
          try {
            const userProfile = await loadUserProfile(session.user);
            dispatch({ type: 'SET_USER', payload: userProfile });
          } catch (err) {
            console.error("[Auth] Failed to load user profile:", err);
            // Fallback: just use the session user
            dispatch({ type: 'SET_USER', payload: {
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              houseNumber: '',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
              role: 'client',
            }});
          }
          // Fetch orders in background, don't block
          fetchUserOrders(session.user.id).catch(e => console.warn("Orders fetch failed", e));
        }
        dispatch({ type: 'SET_AUTH_CHECKED', payload: true });
      } else if (event === 'SIGNED_OUT') {
        console.log("[Auth] User signed out - clearing state");
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_ORDERS', payload: [] });
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
