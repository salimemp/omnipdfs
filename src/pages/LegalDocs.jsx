import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Shield,
  Download,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Scale,
  Users,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const documentTypes = {
  nda: { label: 'Non-Disclosure Agreement', icon: Shield, color: 'text-red-400' },
  employment_contract: { label: 'Employment Contract', icon: Users, color: 'text-blue-400' },
  service_agreement: { label: 'Service Agreement', icon: FileText, color: 'text-cyan-400' },
  privacy_policy: { label: 'Privacy Policy', icon: Shield, color: 'text-violet-400' },
  terms_of_service: { label: 'Terms of Service', icon: Scale, color: 'text-amber-400' },
  gdpr_consent: { label: 'GDPR Consent Form', icon: CheckCircle2, color: 'text-emerald-400' },
  data_processing_agreement: { label: 'Data Processing Agreement', icon: Shield, color: 'text-indigo-400' },
  contractor_agreement: { label: 'Contractor Agreement', icon: Users, color: 'text-pink-400' },
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-500/20 text-slate-400', icon: Edit },
  pending_review: { label: 'Pending Review', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  pending_signature: { label: 'Pending Signature', color: 'bg-blue-500/20 text-blue-400', icon: Users },
  executed: { label: 'Executed', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
  expired: { label: 'Expired', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
};

export default function LegalDocs({ theme = 'dark' }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDoc, setNewDoc] = useState({
    document_type: 'nda',
    title: '',
    jurisdiction: 'US',
    parties: [],
  });
  const [generatingAI, setGeneratingAI] = useState(false);

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      setNewDoc({ document_type: 'nda', title: '', jurisdiction: 'US', parties: [] });
    };
  }, []);

  const { data: legalDocs = [] } = useQuery({
    queryKey: ['legal-documents'],
    queryFn: () => base44.entities.LegalDocument.list('-created_date'),
  });

  const createDocMutation = useMutation({
    mutationFn: (data) => base44.entities.LegalDocument.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['legal-documents']);
      setShowCreateDialog(false);
      toast.success('Legal document created');
    },
  });

  const generateWithAI = async () => {
    if (!newDoc.document_type || !newDoc.title) {
      toast.error('Please provide document type and title');
      return;
    }

    setGeneratingAI(true);
    const browserLang = navigator.language.split('-')[0];

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional ${documentTypes[newDoc.document_type].label} template for jurisdiction ${newDoc.jurisdiction}. Title: "${newDoc.title}". Include all standard clauses, make it legally sound and ${browserLang === 'en' ? 'in English' : 'in the user language'}. Ensure GDPR compliance where applicable.`,
        response_json_schema: {
          type: "object",
          properties: {
            content: { type: "string" },
            suggested_clauses: { type: "array", items: { type: "string" } },
            compliance_tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      setNewDoc(prev => ({
        ...prev,
        content: response.content,
        compliance_tags: response.compliance_tags || ['GDPR', 'CCPA']
      }));

      toast.success('AI-generated legal document ready');
    } catch (e) {
      toast.error('Failed to generate document');
    }
    setGeneratingAI(false);
  };

  const handleCreate = () => {
    if (!newDoc.title) {
      toast.error('Title is required');
      return;
    }

    createDocMutation.mutate({
      ...newDoc,
      status: 'draft',
      compliance_tags: newDoc.compliance_tags || ['GDPR', 'CCPA', 'PIPEDA']
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Legal Documents
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Generate and manage compliant legal documents
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Document
        </Button>
      </motion.div>

      {/* Compliance Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 mb-8 ${isDark ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Enterprise Compliance Certified
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['GDPR', 'CCPA', 'PIPEDA', 'HIPAA', 'SOC 2'].map(tag => (
                <Badge key={tag} className="bg-emerald-500/20 text-emerald-400 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {legalDocs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`col-span-full text-center py-16 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200'}`}
          >
            <Scale className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No legal documents yet
            </h3>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Create your first compliant legal document
            </p>
          </motion.div>
        ) : (
          legalDocs.map((doc, index) => {
            const typeConfig = documentTypes[doc.document_type];
            const StatusIcon = statusConfig[doc.status]?.icon || FileText;
            
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-5 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center`}>
                    <typeConfig.icon className={`w-5 h-5 ${typeConfig.color}`} />
                  </div>
                  <Badge className={statusConfig[doc.status]?.color}>
                    {statusConfig[doc.status]?.label}
                  </Badge>
                </div>

                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {doc.title}
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {typeConfig.label}
                </p>

                {doc.compliance_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doc.compliance_tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Create Legal Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Document Type</Label>
              <Select value={newDoc.document_type} onValueChange={(v) => setNewDoc({...newDoc, document_type: v})}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {Object.entries(documentTypes).map(([key, config]) => (
                    <SelectItem key={key} value={key} className={isDark ? 'text-white' : ''}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Document Title</Label>
              <Input
                value={newDoc.title}
                onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                placeholder="e.g., Company NDA 2026"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Jurisdiction</Label>
              <Select value={newDoc.jurisdiction} onValueChange={(v) => setNewDoc({...newDoc, jurisdiction: v})}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  <SelectItem value="US" className={isDark ? 'text-white' : ''}>United States</SelectItem>
                  <SelectItem value="EU" className={isDark ? 'text-white' : ''}>European Union</SelectItem>
                  <SelectItem value="UK" className={isDark ? 'text-white' : ''}>United Kingdom</SelectItem>
                  <SelectItem value="CA" className={isDark ? 'text-white' : ''}>Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newDoc.content && (
              <div>
                <Label className={isDark ? 'text-slate-400' : ''}>Document Content (AI Generated)</Label>
                <Textarea
                  value={newDoc.content}
                  onChange={(e) => setNewDoc({...newDoc, content: e.target.value})}
                  className={`mt-2 min-h-[200px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateDialog(false)}
              className={isDark ? 'border-slate-700' : ''}
            >
              Cancel
            </Button>
            <Button 
              onClick={generateWithAI} 
              disabled={generatingAI}
              className="bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30"
            >
              {generatingAI ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Scale className="w-4 h-4 mr-2" />}
              Generate with AI
            </Button>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-violet-500 to-cyan-500">
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}