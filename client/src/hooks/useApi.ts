import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ApiResponse, PaginatedResponse } from "@shared/types";

// ============================================================================
// Generic Query Hook
// ============================================================================

export const useSupabaseQuery = <T,>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: any
) => {
  return useQuery({
    queryKey: key,
    queryFn,
    ...options,
  });
};

// ============================================================================
// Generic Mutation Hook
// ============================================================================

export const useSupabaseMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: any
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
  });
};

// ============================================================================
// Auth Hooks
// ============================================================================

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
      phone,
    }: {
      email: string;
      password: string;
      fullName: string;
      phone: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });
      if (error) throw error;
      return data;
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
  });
};

// ============================================================================
// Resident Hooks
// ============================================================================

export const useResidentProfile = (residentId: string | undefined) => {
  return useSupabaseQuery(
    ["resident", residentId as string],
    async () => {
      if (!residentId) throw new Error("No resident ID");
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .eq("user_id", residentId)
        .single();
      if (error) throw error;
      return data;
    },
    { enabled: !!residentId }
  );
};

export const useUserAppointments = (userId: string | undefined) => {
  return useSupabaseQuery(
    ["appointments", userId as string],
    async () => {
      if (!userId) throw new Error("No user ID");
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("resident_id", userId)
        .order("requested_time", { ascending: true });
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
};

// ============================================================================
// Shop Hooks
// ============================================================================

export const useShops = () => {
  return useSupabaseQuery(
    ["shops"],
    async () => {
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    }
  );
};

export const useShopById = (shopId: string | undefined) => {
  return useSupabaseQuery(
    ["shop", shopId as string],
    async () => {
      if (!shopId) throw new Error("No shop ID");
      const { data, error } = await supabase
        .from("shops")
        .select("*")
        .eq("id", shopId)
        .single();
      if (error) throw error;
      return data;
    },
    { enabled: !!shopId }
  );
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentData: any) => {
      const { data, error } = await supabase
        .from("appointments")
        .insert([appointmentData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useShopProducts = (shopId: string | undefined) => {
  return useSupabaseQuery(
    ["products", shopId as string],
    async () => {
      if (!shopId) throw new Error("No shop ID");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", shopId)
        .eq("is_available", true);
      if (error) throw error;
      return data;
    },
    { enabled: !!shopId }
  );
};

export const usePromotions = () => {
  return useSupabaseQuery(
    ["promotions"],
    async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    }
  );
};

// ============================================================================
// Order Hooks
// ============================================================================

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useOrderById = (orderId: string | undefined) => {
  return useSupabaseQuery(
    ["order", orderId as string],
    async () => {
      if (!orderId) throw new Error("No order ID");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();
      if (error) throw error;
      return data;
    },
    { enabled: !!orderId }
  );
};

export const useUserOrders = (userId: string | undefined) => {
  return useSupabaseQuery(
    ["orders", userId as string],
    async () => {
      if (!userId) throw new Error("No user ID");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("resident_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    { enabled: !!userId }
  );
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      updates,
    }: {
      orderId: string;
      updates: any;
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// ============================================================================
// Artisan Hooks
// ============================================================================

export const useArtisans = () => {
  return useSupabaseQuery(
    ["artisans"],
    async () => {
      const { data, error } = await supabase
        .from("artisans")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    }
  );
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      appointmentId,
      updates,
    }: {
      appointmentId: string;
      updates: any;
    }) => {
      const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", appointmentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useArtisansByTrade = (trade: string | undefined) => {
  return useSupabaseQuery(
    ["artisans", trade as string],
    async () => {
      if (!trade) throw new Error("No trade specified");
      const { data, error } = await supabase
        .from("artisans")
        .select("*")
        .eq("trade", trade)
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
    { enabled: !!trade }
  );
};

export const useArtisanById = (artisanId: string | undefined) => {
  return useSupabaseQuery(
    ["artisan", artisanId as string],
    async () => {
      if (!artisanId) throw new Error("No artisan ID");
      const { data, error } = await supabase
        .from("artisans")
        .select("*")
        .eq("user_id", artisanId)
        .single();
      if (error) throw error;
      return data;
    },
    { enabled: !!artisanId }
  );
};

export const useArtisanSlots = (artisanId: string | undefined) => {
  return useSupabaseQuery(
    ["artisan_slots", artisanId as string],
    async () => {
      if (!artisanId) throw new Error("No artisan ID");
      const { data, error } = await supabase
        .from("artisan_slots")
        .select("*")
        .eq("artisan_id", artisanId);
      if (error) throw error;
      return data;
    },
    { enabled: !!artisanId }
  );
};

// ============================================================================
// Delivery Hooks
// ============================================================================

export const useDeliveryPersons = () => {
  return useSupabaseQuery(
    ["delivery_persons"],
    async () => {
      const { data, error } = await supabase
        .from("delivery_persons")
        .select("*")
        .eq("is_available", true);
      if (error) throw error;
      return data;
    }
  );
};

export const useDeliveryMissions = (deliveryPersonId: string | undefined) => {
  return useSupabaseQuery(
    ["missions", deliveryPersonId as string],
    async () => {
      if (!deliveryPersonId) throw new Error("No delivery person ID");
      const { data, error } = await supabase
        .from("delivery_missions")
        .select("*")
        .eq("delivery_person_id", deliveryPersonId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    { enabled: !!deliveryPersonId }
  );
};

// ============================================================================
// Review Hooks
// ============================================================================

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewData: any) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert([reviewData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

// ============================================================================
// Payment Hooks
// ============================================================================

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentData: any) => {
      const { data, error } = await supabase
        .from("payments")
        .insert([paymentData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};
