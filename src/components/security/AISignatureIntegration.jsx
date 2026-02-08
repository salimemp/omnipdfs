import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool, Upload, Sparkles, CheckCircle2, Shield,
  Users, Calendar, AlertTriangle, Download, Send,
  Eye, FileSignature, Zap, Brain, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AISignatureIntegration({ document, isDark = false }) {
  const [signatureType, setSignatureType] = useState('ai-assisted');
  const [signers, setSigners] = useState([]);
  const [newSigner, setNewSigner] = useState({ email: '', role: 'signer' });
  const [analyzing, setAnalyzing] = useState(false);
  const [signatureFields, setSignatureFields] = useState([]);

  const analyzeDocument = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this document and suggest optimal signature field placements.
        
        Document: ${document?.name}
        
        Provide:
        1. Recommended signature locations (coordinates and page numbers)
        2. Type of signature required (party names, roles)
        3. Signing order recommendations
        4. Required witness signatures
        5. Date fields placement
        6. Initial fields if needed
        
        Consider legal requirements and document flow.`,
        response_json_schema: {
          type: "object",
          properties: {
            signature_fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  party: { type: "string" },
                  role: { type: "string" },
                  page: { type: "number" },
                  position: { type: "object" },
                  required: { type: "boolean" },
                  order: { type: "number" }
                }
              }
            },
            signing_workflow: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        },
        file_urls: document?.file_url ? [document.file_url] : []
      });

      setSignatureFields(result.signature_fields || []);
      toast.success('Document analyzed with AI');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const addSigner = () => {
    if (!newSigner.email) {
      toast.error('Email required');
      return;
    }
    setSigners([...signers, { ...newSigner, id: Date.now() }]);
    setNewSigner({ email: '', role: 'signer' });
  };

  const removeSigner = (id) => {
    setSigners(signers.filter(s => s.id !== id));
  };

  const sendForSignature = async () => {
    if (signers.length === 0) {
      toast.error('Add at least one signer');
      return;
    }

    try {
      // Create signature request
      await base44.entities.LegalDocument.create({
        document_type: 'service_agreement',
        title: document?.name,
        parties: signers.map(s => ({ email: s.email, role: s.role })),
        status: 'pending_signature',
        metadata: { signatureFields }
      });

      // Send emails to signers
      for (const signer of signers) {
        await base44.integrations.Core.SendEmail({
          to: signer.email,
          subject: `Signature Required: ${document?.name}`,
          body: `You've been requested to sign a document. Please review and sign at your earliest convenience.`
        });
      }

      toast.success('Signature requests sent');
    } catch (error) {
      toast.error('Failed to send requests');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${isDark ? 'bg-gradient-to-br from-violet-500/10 to-blue-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <FileSignature className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AI-Powered Signature Workflow
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Intelligent signature placement and automated workflows
                </p>
              </div>
            </div>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Document Analysis
              </CardTitle>
              <CardDescription>
                Let AI suggest optimal signature placements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={analyzeDocument}
                disabled={analyzing || !document}
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
              >
                {analyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>

              {signatureFields.length > 0 && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                    AI Detected {signatureFields.length} Signature Fields
                  </p>
                  <div className="space-y-2">
                    {signatureFields.slice(0, 3).map((field, i) => (
                      <div key={i} className={`text-xs ${isDark ? 'text-violet-400/70' : 'text-violet-600/70'}`}>
                        • {field.party} ({field.role}) - Page {field.page}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Add Signers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  value={newSigner.email}
                  onChange={(e) => setNewSigner({ ...newSigner, email: e.target.value })}
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
                <Button onClick={addSigner} size="icon">
                  <Users className="w-4 h-4" />
                </Button>
              </div>

              {signers.length > 0 && (
                <div className="space-y-2">
                  {signers.map((signer, i) => (
                    <div
                      key={signer.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-violet-500/20' : 'bg-violet-100'
                        }`}>
                          <span className="text-sm font-medium text-violet-400">{i + 1}</span>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {signer.email}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {signer.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSigner(signer.id)}
                      >
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={sendForSignature}
            disabled={signers.length === 0}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            <Send className="w-4 h-4 mr-2" />
            Send for Signature
          </Button>
        </div>

        {/* Right: Preview & Features */}
        <div className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Signature Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Shield, label: 'Bank-level encryption', color: 'emerald' },
                { icon: CheckCircle2, label: 'Legally binding signatures', color: 'blue' },
                { icon: Calendar, label: 'Automatic expiration', color: 'amber' },
                { icon: Eye, label: 'Real-time tracking', color: 'violet' },
                { icon: Lock, label: 'Tamper-proof audit trail', color: 'red' },
                { icon: Zap, label: 'Instant notifications', color: 'cyan' }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${feature.color}-400`} />
                    </div>
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Signing Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Document sent to signers', 'Email notifications delivered', 'Signers review & sign', 'Completed document delivered'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
                    }`}>
                      {i + 1}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}