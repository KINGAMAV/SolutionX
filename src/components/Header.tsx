import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  userAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Cité Connect', userAvatar }) => {
  return (
    <header className="bg-brand-surface shadow-sm flex justify-between items-center w-full px-5 h-16 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {userAvatar ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary/20 bg-brand-surface-highest">
            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-primary/20 bg-white p-1">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
        )}
        <h1 className="text-xl font-bold text-brand-primary tracking-tight">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="active:scale-95 transition-transform hover:bg-brand-surface-variant/50 p-2 rounded-full text-brand-primary">
          <Bell size={24} />
        </button>
      </div>
    </header>
  );
};
