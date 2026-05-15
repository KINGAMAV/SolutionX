/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
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
import { ProfileScreen } from './screens/ProfileScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ParcelDeliveryScreen } from './screens/ParcelDeliveryScreen';
import { BookingScreen } from './screens/BookingScreen';

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
            <Route path="/orders" element={<OrderTrackingScreen />} />
            <Route path="/orders/tracking" element={<OrderTrackingScreen />} />
            <Route path="/orders/payment" element={<PaymentScreen />} />
            <Route path="/alerts" element={<AlertsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
