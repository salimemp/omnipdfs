import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Sparkles, Zap, Shield, Users, Brain, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OnboardingVideo({ onClose, isDark = true }) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI analyzes, summarizes, and enhances your documents automatically',
      gradient: 'from-violet-500 to-purple-600',
      animation: 'scale'
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Conversions',
      description: 'Convert between 50+ formats instantly with industry-leading speed',
      gradient: 'from-cyan-500 to-blue-600',
      animation: 'rotate'
    },
    {
      icon: Users,
      title: 'Real-Time Collaboration',
      description: 'Work together seamlessly with live editing and instant syncing',
      gradient: 'from-emerald-500 to-green-600',
      animation: 'bounce'
    },
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'GDPR, HIPAA, SOC2 compliant with end-to-end encryption',
      gradient: 'from-amber-500 to-orange-600',
      animation: 'pulse'
    },
    {
      icon: Brain,
      title: 'Smart Automation',
      description: 'Build powerful workflows that automate your document processing',
      gradient: 'from-pink-500 to-rose-600',
      animation: 'wiggle'
    },
    {
      icon: Cloud,
      title: 'Universal Cloud Integration',
      description: 'Connect Google Drive, Dropbox, OneDrive, Box seamlessly',
      gradient: 'from-indigo-500 to-violet-600',
      animation: 'float'
    }
  ];

  const animations = {
    scale: {
      animate: { scale: [1, 1.2, 1] },
      transition: { repeat: Infinity, duration: 2 }
    },
    rotate: {
      animate: { rotate: [0, 360] },
      transition: { repeat: Infinity, duration: 3, ease: 'linear' }
    },
    bounce: {
      animate: { y: [0, -20, 0] },
      transition: { repeat: Infinity, duration: 2 }
    },
    pulse: {
      animate: { scale: [1, 1.1, 1], opacity: [1, 0.8, 1] },
      transition: { repeat: Infinity, duration: 2 }
    },
    wiggle: {
      animate: { rotate: [-5, 5, -5] },
      transition: { repeat: Infinity, duration: 1.5 }
    },
    float: {
      animate: { y: [0, -15, 0] },
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
    }
  };

  const feature = features[currentFeature];
  const Icon = feature.icon;

  const nextFeature = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1);
    } else {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl mx-4 rounded-3xl overflow-hidden ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="p-12 min-h-[500px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center"
            >
              <motion.div
                {...animations[feature.animation]}
                className="mb-8"
              >
                <div className={`inline-flex p-8 rounded-3xl bg-gradient-to-br ${feature.gradient}`}>
                  <Icon className="w-24 h-24 text-white" />
                </div>
              </motion.div>

              <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {feature.title}
              </h2>
              <p className={`text-xl mb-8 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {feature.description}
              </p>

              <div className="flex items-center gap-2 justify-center mb-8">
                {features.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentFeature
                        ? 'w-12 bg-gradient-to-r ' + feature.gradient
                        : `w-2 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextFeature}
                size="lg"
                className={`bg-gradient-to-r ${feature.gradient} text-white px-8`}
              >
                {currentFeature < features.length - 1 ? (
                  <>
                    Next Feature
                    <Play className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  "Let's Get Started!"
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <motion.div
            className={`h-full bg-gradient-to-r ${feature.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentFeature + 1) / features.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}