import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  userAvatar?: string;
  showLogo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'CitéConnect', 
  userAvatar,
  showLogo = false 
}) => {
  return (
    <header className="bg-white shadow-sm flex justify-between items-center w-full px-5 h-16 sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showLogo ? (
          <div className="flex items-center gap-2">
            <img 
              src="/logo-citeconnect.webp" 
              alt="CitéConnect Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-bold text-emerald-700">CitéConnect</span>
          </div>
        ) : (
          <>
            {userAvatar && (
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-700/20 bg-gray-50">
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-xl font-bold text-emerald-700 tracking-tight">
              {title}
            </h1>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="active:scale-95 transition-transform hover:bg-gray-100 p-2 rounded-full text-emerald-700">
          <Bell size={24} />
        </button>
      </div>
    </header>
  );
};
