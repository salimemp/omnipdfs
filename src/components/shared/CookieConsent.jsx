import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ExternalLink, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

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
          <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={declineCookies}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Cookie Consent</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We use cookies to enhance your experience, analyze site usage, and improve our services. 
                  Your privacy is important to us.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Link 
                to={createPageUrl('LegalDocs')}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Privacy Policy
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={acceptCookies}
                className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white"
              >
                Accept All
              </Button>
              <Button
                onClick={declineCookies}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Decline
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}