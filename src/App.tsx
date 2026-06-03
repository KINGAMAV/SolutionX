/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CatalogScreen } from './screens/client/CatalogScreen';
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
import { SyndicsScreen } from './screens/SyndicsScreen';
import { UserRole } from './types';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-background text-brand-primary">
    Chargement...
  </div>
);

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  const location = useLocation();

  if (!state.authChecked) {
    return <LoadingScreen />;
  }

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const RequireRole: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { state } = useApp();
  const location = useLocation();

  if (!state.authChecked) {
    return <LoadingScreen />;
  }

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(state.user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const RedirectIfAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();

  if (!state.authChecked) {
    return <LoadingScreen />;
  }

  if (state.user) {
    return <Navigate to="/" replace />;
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
          
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
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
            <Route path="/catalog" element={<CatalogScreen />} />
          </Route>

          {/* Placeholders pour les autres rôles - à implémenter dans les prochaines phases */}
          <Route path="/admin/*" element={<RequireRole allowedRoles={['admin', 'agent']}><AdminDashboard /></RequireRole>} />
          <Route path="/boutique/*" element={<RequireRole allowedRoles={['boutique']}><BoutiqueDashboard /></RequireRole>} />
          <Route path="/livreur/*" element={<RequireRole allowedRoles={['livreur']}><LivreurDashboard /></RequireRole>} />
          <Route path="/artisan/*" element={<RequireRole allowedRoles={['artisan']}><ArtisanDashboard /></RequireRole>} />
          <Route path="/syndics/*" element={<RequireRole allowedRoles={['syndics']}><SyndicsScreen /></RequireRole>} />

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}