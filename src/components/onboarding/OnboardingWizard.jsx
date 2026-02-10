import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  FileText, Zap, Shield, Sparkles, CheckCircle2, ArrowRight, X
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const steps = [
  {
    id: 1,
    title: 'Welcome to OmniPDFs',
    description: 'Your all-in-one PDF management platform',
    icon: Sparkles,
    features: [
      'Convert 50+ file formats',
      'AI-powered tools',
      'Secure & GDPR compliant',
      'Real-time collaboration'
    ]
  },
  {
    id: 2,
    title: 'Quick Start',
    description: 'Get started with basic conversions instantly',
    icon: Zap,
    features: [
      'No sign-up needed for basic conversions',
      'Instant PDF conversion',
      'Drag & drop support',
      'Fast processing'
    ]
  },
  {
    id: 3,
    title: 'Unlock Full Features',
    description: 'Sign up to access advanced tools',
    icon: Shield,
    features: [
      'Save & organize files',
      'Advanced editing tools',
      'AI assistant & templates',
      'Cloud storage integration'
    ]
  }
];

export default function OnboardingWizard({ onComplete, isDark = true }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('omnipdfs-onboarding-complete', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem('omnipdfs-onboarding-complete', 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleSignUp = async () => {
    await base44.auth.redirectToLogin(window.location.pathname);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Step {currentStep + 1} of {steps.length}
                  </p>
                  <Progress value={progress} className="h-1 w-32 mt-1" />
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSkip}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </h2>
                <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>

                <div className="space-y-3 mb-8">
                  {step.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isDark ? 'bg-slate-800' : 'bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Button
                        onClick={handleSignUp}
                        className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                      >
                        Sign Up Now
                      </Button>
                      <Button
                        onClick={handleComplete}
                        variant="outline"
                        className="flex-1"
                      >
                        Continue as Guest
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="flex-1"
                      >
                        Skip
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}