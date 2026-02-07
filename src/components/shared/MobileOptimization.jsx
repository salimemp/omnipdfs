import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mobile-optimized bottom sheet for actions
export function MobileBottomSheet({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-64px)] p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile-optimized collapsible section
export function MobileCollapsible({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium text-slate-900 dark:text-white">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile-optimized floating action button
export function MobileFAB({ icon: Icon, label, onClick, variant = 'primary' }) {
  const variants = {
    primary: 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white',
    secondary: 'bg-slate-900 dark:bg-slate-800 text-white',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed bottom-20 right-4 z-40 ${variants[variant]} rounded-full p-4 shadow-lg flex items-center gap-2`}
    >
      <Icon className="w-6 h-6" />
      {label && <span className="font-medium pr-2">{label}</span>}
    </motion.button>
  );
}

// Touch-friendly swipeable card
export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, isDark }) {
  const [dragX, setDragX] = useState(0);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDrag={(e, info) => setDragX(info.offset.x)}
      onDragEnd={(e, info) => {
        if (info.offset.x < -100 && onSwipeLeft) onSwipeLeft();
        if (info.offset.x > 100 && onSwipeRight) onSwipeRight();
        setDragX(0);
      }}
      className={`relative touch-pan-y ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
      } rounded-xl border`}
    >
      {children}
      {dragX < -50 && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 bg-red-500/20 rounded-r-xl">
          <span className="text-red-400 font-medium">Delete</span>
        </div>
      )}
      {dragX > 50 && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 bg-green-500/20 rounded-l-xl">
          <span className="text-green-400 font-medium">Archive</span>
        </div>
      )}
    </motion.div>
  );
}

// Mobile navigation helper
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}