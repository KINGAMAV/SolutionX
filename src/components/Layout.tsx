import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pb-24">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
