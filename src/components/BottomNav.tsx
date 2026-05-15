import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Grid, Receipt, Bell, User } from 'lucide-react';
import { type NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Services', icon: Grid, path: '/services' },
  { label: 'Orders', icon: Receipt, path: '/orders' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-brand-surface-lowest border-t border-brand-outline/10 shadow-[0_-4px_15px_0_rgba(0,0,0,0.05)] rounded-t-3xl">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all duration-200 p-2 rounded-2xl ${
              isActive
                ? 'bg-brand-secondary-container text-brand-on-surface'
                : 'text-brand-on-surface-variant hover:bg-brand-surface-low'
            }`}
          >
            <Icon size={20} className={isActive ? 'fill-current' : ''} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
