import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Zap, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';

export default function PremiumWall({ 
  feature, 
  isOpen, 
  onClose,
  isDark = true 
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    fetchUser();
  }, []);

  const premiumFeatures = [
    { icon: Zap, text: 'Unlimited conversions' },
    { icon: Shield, text: 'Advanced security & encryption' },
    { icon: Clock, text: 'Priority processing' },
    { icon: Users, text: 'Team collaboration' },
  ];

  const handleUpgrade = () => {
    window.location.href = '/settings?tab=billing';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className={`text-center text-xl ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Premium Feature
          </DialogTitle>
          <DialogDescription className={`text-center ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {feature || 'This feature'} requires a Premium subscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-slate-800/50' : 'bg-slate-50'
          }`}>
            <p className={`text-sm font-medium mb-3 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Premium includes:
            </p>
            <ul className="space-y-2">
              {premiumFeatures.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4 text-violet-400" />
                  <span className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className={`text-center p-4 rounded-lg border ${
            isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'
          }`}>
            <p className="text-2xl font-bold text-gradient mb-1">$9.99/month</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cancel anytime
            </p>
          </div>

          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Premium
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className={`w-full ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}