/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CatalogScreen } from './screens/client/CatalogScreen'; 
import { ClientHomeScreen } from './screens/client/ClientHomeScreen';
import { AppProvider, useApp } from './context/AppContext';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ArtisansScreen } from './screens/ArtisansScreen';
import { ArtisanProfileScreen } from './screens/ArtisanProfileScreen';
import { GroceryScreen } from './screens/GroceryScreen';
import { CartScreen } from './screens/CartScreen';
import { OrderTrackingScreen } from './screens/OrderTrackingScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { OrdersHistoryScreen } from './screens/OrdersHistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ParcelDeliveryScreen } from './screens/ParcelDeliveryScreen';
import { BookingScreen } from './screens/BookingScreen';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { BoutiqueDashboard } from './screens/boutique/BoutiqueDashboard';
import { LivreurDashboard } from './screens/livreur/LivreurDashboard';
import { ArtisanDashboard } from './screens/artisan/ArtisanDashboard';
import { UserRole } from './types';

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-brand-background">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border-2 border-brand-primary/10 overflow-hidden p-1">
      <img src="/logo.png" className="w-full h-full object-contain animate-pulse" alt="Logo" />
    </div>
    <div className="text-brand-primary font-bold animate-pulse text-sm">Cité Connect</div>
  </div>
);

const getRoleHomeRoute = (role?: string) => {
  switch (role) {
    case 'admin':
    case 'agent':
      return '/admin';
    case 'boutique':
      return '/boutique';
    case 'livreur':
      return '/livreur';
    case 'artisan':
      return '/artisan';
    case 'client':
    default:
      return '/';
  }
};

const RequireRole: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { state } = useApp();
  const location = useLocation();

  if (!state.authChecked) return <LoadingScreen />;
  
  if (!state.user) {
    // Éviter la boucle si on est déjà sur login ou welcome
    if (location.pathname === '/login' || location.pathname === '/welcome') return <>{children}</>;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!allowedRoles.includes(state.user.role)) {
    const target = getRoleHomeRoute(state.user.role);
    // Éviter la redirection vers soi-même
    if (location.pathname === target) return <>{children}</>;
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();

  if (!state.authChecked) return <LoadingScreen />;

  if (state.user) {
    return <Navigate to={getRoleHomeRoute(state.user.role)} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<LandingScreen />} />
          <Route path="/login" element={<RedirectIfAuth><LoginScreen /></RedirectIfAuth>} />
          
          {/* Routes Client */}
          <Route element={<RequireRole allowedRoles={['client']}><Layout /></RequireRole>}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/services" element={<Navigate to="/" replace />} />
            <Route path="/services/artisans" element={<ArtisansScreen />} />
            <Route path="/services/artisans/:id" element={<ArtisanProfileScreen />} />
            <Route path="/services/booking" element={<BookingScreen />} />
            <Route path="/services/parcel" element={<ParcelDeliveryScreen />} />
            <Route path="/services/grocery" element={<GroceryScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/orders" element={<OrdersHistoryScreen />} />
            <Route path="/orders/tracking" element={<OrderTrackingScreen />} />
            <Route path="/orders/payment" element={<PaymentScreen />} />
            <Route path="/alerts" element={<AlertsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            {/* ajout des routes spécifiques pour les services - à implémenter dans les prochaines phases */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ClientHomeScreen />} />

          <Route path="/catalog" element={<CatalogScreen />} />
          </Route>

          {/* Placeholders pour les autres rôles - à implémenter dans les prochaines phases */}
          <Route path="/admin/*" element={<RequireRole allowedRoles={['admin', 'agent']}><AdminDashboard /></RequireRole>} />
          <Route path="/boutique/*" element={<RequireRole allowedRoles={['boutique']}><BoutiqueDashboard /></RequireRole>} />
          <Route path="/livreur/*" element={<RequireRole allowedRoles={['livreur']}><LivreurDashboard /></RequireRole>} />
          <Route path="/artisan/*" element={<RequireRole allowedRoles={['artisan']}><ArtisanDashboard /></RequireRole>} />

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
