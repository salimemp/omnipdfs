import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import {
  FileText,
  Home,
  FolderOpen,
  Settings,
  History,
  Zap,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Star,
  Shield,
  Layers,
  FileOutput
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        // User not logged in
      }
    };
    fetchUser();
  }, []);

  const navigation = [
    { name: 'Dashboard', page: 'Dashboard', icon: Home },
    { name: 'Convert', page: 'Convert', icon: Zap },
    { name: 'PDF Tools', page: 'PDFTools', icon: Layers },
    { name: 'My Files', page: 'Files', icon: FolderOpen },
    { name: 'History', page: 'History', icon: History },
    { name: 'Settings', page: 'Settings', icon: Settings },
  ];

  const isActive = (page) => currentPageName === page;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        :root {
          --accent: 139 92 246;
          --accent-light: 167 139 250;
        }
        .glass {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
        }
        .glass-light {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.08);
        }
        .glow {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
        }
        .text-gradient {
          background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">OmniPDF</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 glass border-r border-slate-800/50
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center glow">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-xl">OmniPDF</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-slate-500">Enterprise</span>
                  <Shield className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.page);
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Convert Card */}
          <div className="p-4">
            <Link
              to={createPageUrl('Convert')}
              className="block p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <FileOutput className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Quick Convert</p>
                  <p className="text-xs text-slate-400">Drop files to convert</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-violet-400 group-hover:text-violet-300 transition-colors">
                <span>Start converting</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800/50">
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-semibold">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => base44.auth.logout()}
                  className="text-slate-400 hover:text-white shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}