import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Clock, Mail } from 'lucide-react';

export default function PrivacyPolicy({ theme }) {
  const isDark = theme === 'dark';

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account information (email, name) when you register',
        'Documents you upload and process through our services',
        'Usage data including how you interact with our platform',
        'Device information (browser type, IP address, operating system)',
        'Cookies and similar tracking technologies'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'Provide, maintain, and improve our services',
        'Process documents and perform conversions as requested',
        'Send service updates and security notifications',
        'Analyze usage patterns to enhance user experience',
        'Comply with legal obligations and enforce our policies',
        'Prevent fraud and ensure platform security'
      ]
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'End-to-end encryption for data in transit (TLS/SSL)',
        'Encryption at rest for stored documents',
        'Regular security audits and vulnerability assessments',
        'Access controls and authentication mechanisms',
        'SOC 2 Type II compliance',
        'GDPR and HIPAA compliant infrastructure'
      ]
    },
    {
      icon: Eye,
      title: 'Data Sharing',
      content: [
        'We do NOT sell your personal information',
        'Third-party service providers (cloud storage, analytics) under strict agreements',
        'Legal requirements (court orders, law enforcement requests)',
        'Business transfers (mergers, acquisitions) with continued protection',
        'With your explicit consent for specific purposes'
      ]
    },
    {
      icon: Clock,
      title: 'Data Retention',
      content: [
        'Account data retained while your account is active',
        'Documents stored according to your subscription plan',
        'Auto-deletion available for temporary documents',
        'Backup retention for 30 days after deletion',
        'Anonymized analytics data retained indefinitely',
        'You can request complete data deletion at any time'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Privacy Policy
        </h1>
        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Last Updated: January 1, 2026
        </p>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Your privacy is important to us. This policy explains how OmniPDFs collects, uses, and protects your information.
        </p>
      </div>

      {/* Introduction */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-6">
          <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            OmniPDFs ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our document processing platform at www.omnipdfs.com.
          </p>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            By using OmniPDFs, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of our services.
          </p>
        </CardContent>
      </Card>

      {/* Main Sections */}
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Card key={index} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Icon className="w-5 h-5 text-violet-400" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-violet-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}

      {/* Your Rights */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Your Privacy Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              Access & Portability
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Request a copy of your personal data in a machine-readable format
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Correction
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Update or correct inaccurate personal information
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              Deletion
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Request deletion of your account and associated data
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Object to Processing
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Opt-out of certain data processing activities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookies */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Cookies & Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            We use cookies and similar technologies to enhance your experience:
          </p>
          <ul className="space-y-2">
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span><strong>Essential Cookies:</strong> Required for authentication and core functionality</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span><strong>Analytics Cookies:</strong> Help us understand usage patterns</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span><strong>Preference Cookies:</strong> Remember your settings and preferences</span>
            </li>
          </ul>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            You can control cookies through your browser settings, though some features may not work without them.
          </p>
        </CardContent>
      </Card>

      {/* International Transfers */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            International Data Transfers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
          </p>
          <ul className="space-y-2 mt-3">
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Standard Contractual Clauses approved by the European Commission</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Privacy Shield certification (where applicable)</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Encryption and security measures during transfer</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Children's Privacy */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Children's Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className={isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Mail className="w-5 h-5 text-violet-400" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            For questions about this Privacy Policy or to exercise your rights:
          </p>
          <div className={`space-y-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <p><strong>Email:</strong> privacy@omnipdfs.com</p>
            <p><strong>Data Protection Officer:</strong> dpo@omnipdfs.com</p>
            <p><strong>Mail:</strong> OmniPDFs Privacy Team, [Your Address]</p>
          </div>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Policy Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            We may update this Privacy Policy periodically. We will notify you of material changes by email or through a prominent notice on our platform. Continued use after changes constitutes acceptance of the updated policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}