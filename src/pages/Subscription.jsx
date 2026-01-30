import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Crown, Zap, Shield, Users, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Subscription({ theme = 'dark' }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    fetchUser();
  }, []);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic features for personal use',
      features: [
        '10 conversions per month',
        'Basic file formats',
        'Standard processing speed',
        'Community support',
        'Ads supported'
      ],
      current: user?.subscription_tier === 'free' || !user?.subscription_tier,
      priceId: null
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      description: 'Advanced features for professionals',
      features: [
        'Unlimited conversions',
        'All file formats',
        'Priority processing',
        'Email support',
        'No ads',
        'Advanced AI features',
        'Cloud storage integration',
        'Batch processing'
      ],
      popular: true,
      current: user?.subscription_tier === 'premium',
      priceId: 'price_premium_monthly'
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: 'month',
      description: 'Complete solution for teams',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'API access',
        'Custom branding',
        'Dedicated support',
        'Advanced security',
        'SLA guarantee',
        'Custom workflows'
      ],
      current: user?.subscription_tier === 'pro',
      priceId: 'price_pro_monthly'
    }
  ];

  const handleSubscribe = async (priceId) => {
    if (!priceId) return;
    
    setLoading(true);
    try {
      const result = await base44.functions.invoke('createSubscription', { priceId });
      
      if (result.data.success && result.data.sessionUrl) {
        window.location.href = result.data.sessionUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-violet-500/10' : 'bg-violet-100'} border border-violet-500/20 mb-6`}>
          <Crown className="w-4 h-4 text-violet-400" />
          <span className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>Pricing Plans</span>
        </div>
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Choose Your Plan
        </h1>
        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Select the perfect plan for your needs
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative h-full ${
              plan.popular 
                ? 'border-violet-500 shadow-xl shadow-violet-500/20' 
                : isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className={`text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {plan.description}
                </CardDescription>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading || plan.current || !plan.priceId}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white'
                      : plan.current
                      ? 'bg-slate-700'
                      : ''
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : plan.current ? (
                    'Current Plan'
                  ) : plan.priceId ? (
                    'Subscribe'
                  ) : (
                    'Free Forever'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {user?.subscription_tier !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {user?.subscription_tier?.toUpperCase()} Plan
                  </p>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Status: {user?.subscription_status || 'Active'}
                  </p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}