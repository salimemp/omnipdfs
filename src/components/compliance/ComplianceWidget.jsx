import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

const complianceFrameworks = {
  gdpr: {
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    region: 'European Union',
    status: 'compliant',
    features: [
      'Right to access personal data',
      'Right to erasure (right to be forgotten)',
      'Data portability',
      'Consent management',
      'Data breach notification (72 hours)',
      'Data Protection Officer (DPO) appointed'
    ],
    link: 'https://gdpr.eu/'
  },
  ccpa: {
    name: 'CCPA',
    fullName: 'California Consumer Privacy Act',
    region: 'California, USA',
    status: 'compliant',
    features: [
      'Right to know what data is collected',
      'Right to delete personal data',
      'Right to opt-out of data selling',
      'Non-discrimination for exercising rights',
      'Privacy policy disclosure'
    ],
    link: 'https://oag.ca.gov/privacy/ccpa'
  },
  pipeda: {
    name: 'PIPEDA',
    fullName: 'Personal Information Protection and Electronic Documents Act',
    region: 'Canada',
    status: 'compliant',
    features: [
      'Consent for data collection',
      'Limited collection principle',
      'Accuracy of personal information',
      'Safeguards and security',
      'Openness about practices',
      'Individual access to data'
    ],
    link: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/'
  },
  hipaa: {
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    region: 'United States',
    status: 'compliant',
    features: [
      'Protected Health Information (PHI) security',
      'Encryption of health data at rest and in transit',
      'Access controls and audit logs',
      'Business Associate Agreements (BAA)',
      'Breach notification procedures',
      'Administrative safeguards'
    ],
    link: 'https://www.hhs.gov/hipaa/index.html'
  },
  soc2: {
    name: 'SOC 2 Type II',
    fullName: 'Service Organization Control 2',
    region: 'Global',
    status: 'compliant',
    features: [
      'Security controls and monitoring',
      'Availability (99.9% uptime)',
      'Processing integrity',
      'Confidentiality measures',
      'Privacy protection',
      'Annual independent audits'
    ],
    link: 'https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome'
  }
};

export default function ComplianceWidget({ isDark = true }) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setShowDetails(false);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200'}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Compliance Status
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enterprise-grade protection
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(complianceFrameworks).map(([key, framework]) => (
            <Badge
              key={key}
              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedFramework(framework);
                setShowDetails(true);
              }}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {framework.name}
            </Badge>
          ))}
        </div>

        <div className={`text-xs space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>AES-256 end-to-end encryption</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Zero-knowledge architecture</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Annual security audits & penetration testing</span>
          </div>
        </div>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : ''}`}>
              <Badge className="bg-emerald-500/20 text-emerald-400">
                {selectedFramework?.name}
              </Badge>
              {selectedFramework?.fullName}
            </DialogTitle>
          </DialogHeader>

          {selectedFramework && (
            <div className="space-y-4 py-4">
              <div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Region: {selectedFramework.region}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Certified & Compliant
                  </Badge>
                </div>
              </div>

              <div>
                <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  How OmniPDF Complies:
                </p>
                <ul className="space-y-2">
                  {selectedFramework.features.map((feature, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    OmniPDF undergoes regular independent audits to maintain compliance with {selectedFramework.name} standards.
                    Our security practices are continuously monitored and updated.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs"
                  onClick={() => window.open(selectedFramework.link, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Learn More About {selectedFramework.name}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}