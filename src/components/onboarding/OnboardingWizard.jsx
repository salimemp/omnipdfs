import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  FileText, Zap, Shield, Sparkles, CheckCircle2, ArrowRight, X, Info
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const steps = [
  {
    id: 1,
    title: 'Welcome to OmniPDFs',
    description: 'Your all-in-one PDF management and conversion platform',
    icon: Sparkles,
    detailedInfo: 'OmniPDFs is an enterprise-grade document management solution trusted by thousands of businesses worldwide. We combine cutting-edge AI technology with robust security to deliver the ultimate PDF experience.',
    features: [
      { title: 'Convert 50+ file formats', detail: 'Support for PDF, Word, Excel, PowerPoint, images, CAD files, and more' },
      { title: 'AI-powered tools', detail: 'Smart content extraction, auto-formatting, and intelligent document analysis' },
      { title: 'Enterprise security', detail: 'AES-256 encryption, GDPR/HIPAA compliant, SOC 2 certified' },
      { title: 'Real-time collaboration', detail: 'Multi-user editing, comments, version control, and team workspaces' }
    ],
    stats: [
      { value: '10M+', label: 'Files processed' },
      { value: '50+', label: 'File formats' },
      { value: '99.9%', label: 'Uptime' }
    ]
  },
  {
    id: 2,
    title: 'Quick Start Guide',
    description: 'Get started with basic conversions instantly - no account needed',
    icon: Zap,
    detailedInfo: 'Experience the power of OmniPDFs immediately. Convert files without signing up, or create a free account to unlock advanced features and save your work.',
    features: [
      { title: 'Instant PDF conversion', detail: 'Convert any file to PDF in seconds with drag & drop' },
      { title: 'Guest mode available', detail: 'Try basic features without creating an account' },
      { title: 'Batch processing', detail: 'Convert multiple files at once to save time' },
      { title: 'Quality presets', detail: 'Choose from web, print, or maximum quality settings' }
    ],
    stats: [
      { value: '<5 sec', label: 'Avg conversion time' },
      { value: '25MB', label: 'Max file size' },
      { value: '∞', label: 'Daily conversions' }
    ]
  },
  {
    id: 3,
    title: 'Professional Templates',
    description: 'Access 500+ professionally designed templates',
    icon: FileText,
    detailedInfo: 'Browse our extensive library of pre-built templates for business, legal, education, and more. Each template is crafted by professionals and optimized for print and digital use.',
    features: [
      { title: 'Business templates', detail: 'Invoices, proposals, contracts, and reports' },
      { title: 'Legal documents', detail: 'NDAs, agreements, forms, and compliance docs' },
      { title: 'Educational materials', detail: 'Certificates, transcripts, and course materials' },
      { title: 'Custom branding', detail: 'Add your logo and colors to any template' }
    ],
    stats: [
      { value: '500+', label: 'Templates' },
      { value: '20+', label: 'Categories' },
      { value: '4.9/5', label: 'Avg rating' }
    ]
  },
  {
    id: 4,
    title: 'Advanced Features',
    description: 'Unlock powerful tools for professional document management',
    icon: Shield,
    detailedInfo: 'Create an account to access our full suite of professional tools including AI assistant, cloud storage, advanced editing, and team collaboration features.',
    features: [
      { title: 'Cloud storage integration', detail: 'Connect Google Drive, Dropbox, OneDrive, and Box' },
      { title: 'AI document assistant', detail: 'Smart summaries, content generation, and data extraction' },
      { title: 'Advanced PDF editor', detail: 'Edit text, images, annotations, forms, and signatures' },
      { title: 'Team collaboration', detail: 'Share, comment, review, and approve documents together' }
    ],
    stats: [
      { value: 'Unlimited', label: 'Storage' },
      { value: '10+', label: 'Integrations' },
      { value: '24/7', label: 'Support' }
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
                <p className={`text-lg mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>

                {step.detailedInfo && (
                  <div className={`flex gap-3 p-4 rounded-xl mb-6 ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
                    <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {step.detailedInfo}
                    </p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {step.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-xl ${
                        isDark ? 'bg-slate-800' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {typeof feature === 'string' ? feature : feature.title}
                          </p>
                          {typeof feature === 'object' && feature.detail && (
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              {feature.detail}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {step.stats && (
                  <div className={`grid grid-cols-3 gap-4 p-4 rounded-xl mb-6 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                    {step.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {stat.value}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

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