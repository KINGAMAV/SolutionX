import { User } from "@shared/types";
import { create } from "zustand";
import { supabase } from "./supabase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initializeAuth: async () => {
    try {
      set({ loading: true });
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch user profile from database
        const { data: userProfile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;
        set({ user: userProfile as User });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));

// ============================================================================
// UI State Store
// ============================================================================

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  language: "FR" | "EN";
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "FR" | "EN") => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: "light",
  language: "FR",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (lang) => set({ language: lang }),
}));

// ============================================================================
// Delivery State Store
// ============================================================================

interface DeliveryState {
  isAvailable: boolean;
  currentLocation: { lat: number; lng: number } | null;
  currentMission: any | null;
  setIsAvailable: (available: boolean) => void;
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void;
  setCurrentMission: (mission: any | null) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  isAvailable: false,
  currentLocation: null,
  currentMission: null,
  setIsAvailable: (available) => set({ isAvailable: available }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setCurrentMission: (mission) => set({ currentMission: mission }),
}));

// ============================================================================
// Cart State Store
// ============================================================================

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  shopId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShopId: (shopId: string | null) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  shopId: null,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    })),

  clearCart: () => set({ items: [], shopId: null }),
  setShopId: (shopId) => set({ shopId }),
}));
