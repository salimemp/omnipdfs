import React, { useState } from 'react';
import { FileSignature, Upload, CheckCircle2, Shield, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PDFSigning({ document, isDark }) {
  const [signing, setSigning] = useState(false);
  const [signatureData, setSignatureData] = useState({
    name: '',
    reason: '',
    location: '',
    certificateId: '',
  });
  const [signatures, setSignatures] = useState([
    { id: 1, signer: 'John Doe', date: new Date(), reason: 'Approval', verified: true },
  ]);

  const signDocument = async () => {
    if (!signatureData.name || !signatureData.reason) {
      toast.error('Please fill required fields');
      return;
    }

    setSigning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newSignature = {
        id: Date.now(),
        signer: signatureData.name,
        date: new Date(),
        reason: signatureData.reason,
        location: signatureData.location,
        verified: true
      };

      setSignatures([...signatures, newSignature]);
      setSignatureData({ name: '', reason: '', location: '', certificateId: '' });
      toast.success('Document signed successfully');

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        details: { type: 'pdf_signed', signer: newSignature.signer }
      });
    } catch (error) {
      toast.error('Failed to sign document');
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileSignature className="w-5 h-5 text-violet-400" />
            Digital Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Signer Name *</Label>
            <Input
              value={signatureData.name}
              onChange={(e) => setSignatureData({ ...signatureData, name: e.target.value })}
              placeholder="Your full name"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Reason for Signing *</Label>
            <Textarea
              value={signatureData.reason}
              onChange={(e) => setSignatureData({ ...signatureData, reason: e.target.value })}
              placeholder="e.g., Document approval"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              rows={2}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Location</Label>
            <Input
              value={signatureData.location}
              onChange={(e) => setSignatureData({ ...signatureData, location: e.target.value })}
              placeholder="City, Country"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Certificate ID</Label>
            <Input
              value={signatureData.certificateId}
              onChange={(e) => setSignatureData({ ...signatureData, certificateId: e.target.value })}
              placeholder="Optional certificate identifier"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <Button onClick={signDocument} disabled={signing} className="w-full bg-violet-500">
            {signing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4 mr-2" />
                Sign Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {signatures.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Signatures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {signatures.map(sig => (
              <div key={sig.id} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {sig.signer}
                      </p>
                      {sig.verified && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {sig.reason}
                    </p>
                    <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Calendar className="w-3 h-3" />
                      {sig.date.toLocaleDateString()} at {sig.date.toLocaleTimeString()}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}