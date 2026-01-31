import React from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Shield, Users, ArrowRight } from 'lucide-react';
import AppLogo from '@/components/shared/AppLogo';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Convert Documents',
      description: 'Convert between 50+ file formats instantly'
    },
    {
      icon: Zap,
      title: 'AI-Powered Tools',
      description: 'Intelligent document processing and analysis'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'GDPR, HIPAA, and SOC 2 compliant'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Work together on documents seamlessly'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <AppLogo size="default" showText={true} isDark={true} />
            <div className="flex items-center gap-4">
              <Button
                onClick={() => base44.auth.redirectToLogin(createPageUrl('CustomDashboard'))}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Sign In
              </Button>
              <Button
                onClick={() => base44.auth.redirectToLogin(createPageUrl('CustomDashboard'))}
                className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Enterprise PDF Management
            <span className="block mt-2 bg-gradient-to-r from-violet-400 to-cyan-400 text-transparent bg-clip-text">
              Powered by AI
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Convert, edit, and manage PDFs with intelligent automation. 
            GDPR, HIPAA, SOC 2 compliant platform trusted by enterprises.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => base44.auth.redirectToLogin(createPageUrl('CustomDashboard'))}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-lg px-8 py-6"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate(createPageUrl('Convert'))}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6"
            >
              Try Converter
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations using OmniPDFs for secure, intelligent document management
          </p>
          <Button
            onClick={() => base44.auth.redirectToLogin(createPageUrl('CustomDashboard'))}
            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-lg px-8 py-6"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-500">
            © 2026 OmniPDFs. All rights reserved. Enterprise PDF Management Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}