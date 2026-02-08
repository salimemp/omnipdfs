import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, AlertTriangle, Shield, Scale, CreditCard, Ban } from 'lucide-react';

export default function TermsOfService({ theme }) {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Terms of Service
        </h1>
        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Last Updated: January 1, 2026
        </p>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Please read these terms carefully before using OmniPDFs.
        </p>
      </div>

      {/* Introduction */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-6">
          <p className={`mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            These Terms of Service ("Terms") govern your access to and use of OmniPDFs ("Service," "Platform," "we," "our," or "us"), including our website at www.omnipdfs.com and all related services.
          </p>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            By accessing or using our Service, you agree to be bound by these Terms. If you do not agree, you may not use our Service.
          </p>
        </CardContent>
      </Card>

      {/* Account Terms */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileText className="w-5 h-5 text-violet-400" />
            Account Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You must be 18 years or older to use this Service</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You must provide accurate and complete registration information</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You are responsible for maintaining the security of your account</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You are responsible for all activities under your account</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>One person or entity may maintain only one free account</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You must immediately notify us of any unauthorized use</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Service Usage */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Shield className="w-5 h-5 text-cyan-400" />
            Acceptable Use
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              You May:
            </h4>
            <ul className="space-y-2">
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Use the Service for lawful purposes only</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Upload and process documents you own or have rights to</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Share documents with explicit permission from owners</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Use API integrations according to rate limits</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              You May NOT:
            </h4>
            <ul className="space-y-2">
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Violate any applicable laws or regulations</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Infringe on intellectual property rights</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Upload malware, viruses, or malicious code</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Attempt to access other users' accounts or data</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Reverse engineer or scrape our platform</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Abuse or overload our systems</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span className="text-red-400 mt-1">✗</span>
                <span>Share your account credentials with others</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <CreditCard className="w-5 h-5 text-amber-400" />
            Payment & Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Paid plans are billed in advance on a monthly or annual basis</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>All fees are non-refundable except as required by law</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You authorize us to charge your payment method for renewal</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Prices may change with 30 days notice to active subscribers</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Downgrading may cause loss of features, content, or capacity</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You can cancel your subscription at any time</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Content Ownership */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Scale className="w-5 h-5 text-blue-400" />
            Content & Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              Your Content
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              You retain all rights to documents and files you upload. By uploading content, you grant us a license to process, store, and transmit your content solely to provide the Service.
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Our Platform
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              OmniPDFs and its original content, features, and functionality are owned by us and protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </div>
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              Feedback
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Any feedback, suggestions, or ideas you provide may be used by us without any obligation to you.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Termination */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Ban className="w-5 h-5 text-red-400" />
            Termination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>We may terminate or suspend your account immediately for violations</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>You may terminate your account at any time through settings</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Upon termination, your right to use the Service ceases immediately</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>We may delete your data after a grace period (typically 30 days)</span>
            </li>
            <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="text-violet-400 mt-1">•</span>
              <span>Provisions that should survive termination will remain in effect</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimers */}
      <Card className={isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Disclaimers & Limitations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
            <strong>Service "AS IS":</strong> The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.
          </p>
          <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
            <strong>No Guarantees:</strong> We do not guarantee the Service will be uninterrupted, secure, or error-free.
          </p>
          <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
            <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages.
          </p>
          <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
            <strong>Data Loss:</strong> We recommend maintaining backups. We are not responsible for data loss.
          </p>
        </CardContent>
      </Card>

      {/* Governing Law */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Governing Law & Disputes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            These Terms shall be governed by the laws of [Your Jurisdiction], without regard to conflict of law provisions.
          </p>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, except where prohibited by law.
          </p>
        </CardContent>
      </Card>

      {/* Changes to Terms */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Changes to Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            We reserve the right to modify these Terms at any time. We will provide notice of material changes through email or a prominent notice on our Service. Your continued use after changes constitutes acceptance of the modified Terms.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className={isDark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Questions about these Terms? Contact us:
          </p>
          <div className={`space-y-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <p><strong>Email:</strong> legal@omnipdfs.com</p>
            <p><strong>Website:</strong> www.omnipdfs.com</p>
            <p><strong>Address:</strong> [Your Business Address]</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}