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
  Shield,
  Layers,
  FileOutput,
  Moon,
  Sun,
  Sparkles,
  Cloud,
  GitCompare,
  ScanText,
  LayoutTemplate,
  Webhook,
  PenTool,
  Wand2,
  Users,
  Accessibility,
  Bot
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';
import AccessibilityPanel from '@/components/shared/AccessibilityPanel';
import CookieConsent from '@/components/shared/CookieConsent';
import AppLogo from '@/components/shared/AppLogo';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { LanguageProvider } from '@/components/shared/LanguageContext';

function LayoutContent({ children, currentPageName }) {
  // SEO Metadata
  useEffect(() => {
    const metadata = {
      title: 'OmniPDFs - Enterprise PDF Management & Conversion Platform',
      description: 'Convert, edit, and manage PDFs with AI-powered tools. GDPR, HIPAA, SOC 2 compliant. 50+ file formats, real-time collaboration, OCR, and more.',
      keywords: 'PDF converter, PDF editor, document management, AI PDF tools, GDPR compliant, HIPAA compliant, PDF to Word, merge PDF, compress PDF',
      ogTitle: 'OmniPDFs - Professional PDF Tools with AI',
      ogDescription: 'Enterprise-grade PDF management with AI assistance, collaboration, and compliance',
      ogImage: 'https://omnipdfs.com/og-image.png',
    };

    document.title = metadata.title;
    
    const metaTags = [
      { name: 'description', content: metadata.description },
      { name: 'keywords', content: metadata.keywords },
      { property: 'og:title', content: metadata.ogTitle },
      { property: 'og:description', content: metadata.ogDescription },
      { property: 'og:image', content: metadata.ogImage },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.ogTitle },
      { name: 'twitter:description', content: metadata.ogDescription },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (name) tag.setAttribute('name', name);
        if (property) tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
  }, []);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omnipdfs-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('omnipdfs-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      }
    };
    fetchUser();
  }, []);

  const navigation = [
    { name: 'Dashboard', page: 'Dashboard', icon: Home },
    { name: 'Convert', page: 'Convert', icon: Zap },
    { name: 'PDF Tools', page: 'PDFTools', icon: Layers },
    { name: 'PDF Editor', page: 'PDFEditor', icon: PenTool },
    { name: 'Form Filler', page: 'FormFiller', icon: FileText },
    { name: 'OCR', page: 'OCR', icon: ScanText },
    { name: 'Templates', page: 'Templates', icon: LayoutTemplate },
    { name: 'AI Generator', page: 'AIDocGenerator', icon: Wand2 },
    { name: 'Compare PDFs', page: 'Compare', icon: GitCompare },
    { name: 'AI Assistant', page: 'AIAssistant', icon: Sparkles },
    { name: 'Task Automation', page: 'TaskAutomation', icon: Bot },
    { name: 'Collaboration', page: 'Collaboration', icon: Users },
    { name: 'Advanced Features', page: 'AdvancedFeatures', icon: Sparkles },
    { name: 'Cloud Storage', page: 'CloudStorage', icon: Cloud },
    { name: 'Project Files', page: 'ProjectFiles', icon: FolderOpen },
    { name: 'Legal Docs', page: 'LegalDocs', icon: Shield },
    { name: 'My Files', page: 'Files', icon: FolderOpen },
    { name: 'Analytics', page: 'Analytics', icon: History },
    { name: 'API Docs', page: 'APIDocs', icon: Webhook },
    { name: 'Security', page: 'Security', icon: Shield },
    { name: 'Settings', page: 'Settings', icon: Settings },
  ];

  const isActive = (page) => currentPageName === page;
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      <style>{`
        :root {
          --accent: 139 92 246;
          --accent-light: 167 139 250;
        }
        .glass {
          background: ${isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)'};
          backdrop-filter: blur(20px);
          border: 1px solid ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'};
        }
        .glass-light {
          background: ${isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
          backdrop-filter: blur(12px);
          border: 1px solid ${isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.15)'};
        }
        .glow {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
        }
        .text-gradient {
          background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-primary {
          color: ${isDark ? '#ffffff' : '#0f172a'};
        }
        .text-secondary {
          color: ${isDark ? '#94a3b8' : '#64748b'};
        }
        .text-muted {
          color: ${isDark ? '#64748b' : '#94a3b8'};
        }
        .bg-card {
          background: ${isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
        }
        .border-subtle {
          border-color: ${isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'};
        }
      `}</style>

      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <AppLogo size="small" showText={true} isDark={isDark} />
          <div className="flex items-center gap-2">
            <AccessibilityPanel isDark={isDark} />
            <LanguageSwitcher isDark={isDark} />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={isDark ? 'text-slate-400' : 'text-slate-600'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={isDark ? 'text-slate-400' : 'text-slate-600'}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
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
        fixed top-0 left-0 z-50 h-full w-72 glass border-r
        ${isDark ? 'border-slate-800/50' : 'border-slate-200'}
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-6 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <AppLogo size="default" showText={true} isDark={isDark} />
                <div className="flex items-center gap-1.5 mt-2 ml-14">
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Enterprise</span>
                  <Shield className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-1">
                <AccessibilityPanel isDark={isDark} />
                <LanguageSwitcher isDark={isDark} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
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
                      ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/10'
                      : isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'
                    }
                    ${active 
                      ? isDark ? 'text-white' : 'text-slate-900'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
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
              className={`block p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <FileOutput className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Convert</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Drop files to convert</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-violet-400 group-hover:text-violet-300 transition-colors">
                <span>Start converting</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* User Section */}
          <div className={`p-4 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-semibold">
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user.full_name || 'User'}
                  </p>
                  <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => base44.auth.logout()}
                  className={`shrink-0 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
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
          {React.cloneElement(children, { theme })}
        </div>
      </main>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}