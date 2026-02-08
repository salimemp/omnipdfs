import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ExternalLink, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from './LanguageContext';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const theme = localStorage.getItem('omnipdfs-theme') || 'light';
    setIsDark(theme === 'dark');
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('omnipdf-cookie-consent');
    if (!consent) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('omnipdf-cookie-consent', 'accepted');
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem('omnipdf-cookie-consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className={`backdrop-blur-lg rounded-2xl p-6 shadow-2xl ${
            isDark 
              ? 'bg-slate-900/95 border border-slate-700' 
              : 'bg-white/95 border border-slate-200'
          }`}>
            <button
              onClick={declineCookies}
              className={`absolute top-3 right-3 transition-colors ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {t('cookieConsent')}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('cookieMessage')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Link 
                to={createPageUrl('LegalDocs')}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                {t('privacyPolicy')}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={acceptCookies}
                className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white"
              >
                {t('acceptAll')}
              </Button>
              <Button
                onClick={declineCookies}
                variant="outline"
                className={isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}
              >
                {t('decline')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}