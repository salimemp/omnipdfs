import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Zap, FolderOpen, Settings, ScanText } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', page: 'Dashboard', icon: Home },
  { name: 'Convert', page: 'Convert', icon: Zap },
  { name: 'OCR', page: 'OCR', icon: ScanText },
  { name: 'Files', page: 'Files', icon: FolderOpen },
  { name: 'Settings', page: 'Settings', icon: Settings },
];

export default function MobileBottomNav({ currentPageName, isDark = false }) {
  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 ${
      isDark 
        ? 'bg-slate-900/95 border-t border-slate-800' 
        : 'bg-white/95 border-t border-slate-200'
    } backdrop-blur-lg safe-bottom`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPageName === item.page;
          
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className="relative flex flex-col items-center justify-center px-4 py-2 min-w-[60px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-violet-500/10 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={`w-5 h-5 mb-1 transition-colors ${
                  isActive
                    ? 'text-violet-500'
                    : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-violet-500'
                    : isDark ? 'text-slate-500' : 'text-slate-600'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}