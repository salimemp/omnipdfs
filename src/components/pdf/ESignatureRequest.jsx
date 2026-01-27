import React, { useState } from 'react';
import { FileSignature, UserPlus, Mail, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ESignatureRequest({ document, isDark }) {
  const [signers, setSigners] = useState([{ email: '', name: '' }]);
  const [message, setMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);
  const [requests, setRequests] = useState([]);

  const addSigner = () => {
    setSigners([...signers, { email: '', name: '' }]);
  };

  const updateSigner = (index, field, value) => {
    const updated = [...signers];
    updated[index][field] = value;
    setSigners(updated);
  };

  const removeSigner = (index) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const sendRequest = async () => {
    if (signers.some(s => !s.email)) {
      toast.error('Please fill all signer emails');
      return;
    }

    toast.promise(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const request = {
          id: Date.now(),
          document: document?.name || 'Document',
          signers: signers.filter(s => s.email),
          message,
          expiryDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000),
          status: 'pending',
          sentAt: new Date(),
          signatures: []
        };

        setRequests([request, ...requests]);
        setSigners([{ email: '', name: '' }]);
        setMessage('');

        await base44.entities.ActivityLog.create({
          action: 'share',
          document_id: document?.id,
          details: { type: 'signature_request', signers: request.signers.map(s => s.email) }
        });
      },
      {
        loading: 'Sending signature request...',
        success: 'E-signature request sent successfully!',
        error: 'Failed to send request'
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileSignature className="w-5 h-5 text-violet-400" />
            Request E-Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Signers</Label>
              <Button size="sm" variant="outline" onClick={addSigner}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Signer
              </Button>
            </div>
            <div className="space-y-2">
              {signers.map((signer, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={signer.name}
                    onChange={(e) => updateSigner(index, 'name', e.target.value)}
                    className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signer.email}
                    onChange={(e) => updateSigner(index, 'email', e.target.value)}
                    className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}
                  />
                  {signers.length > 1 && (
                    <Button size="icon" variant="ghost" onClick={() => removeSigner(index)} className="text-red-400">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Message to Signers</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and sign this document..."
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              rows={3}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Expiry (days)</Label>
            <Input
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              min={1}
              max={365}
            />
          </div>

          <Button onClick={sendRequest} className="w-full bg-violet-500">
            <FileSignature className="w-4 h-4 mr-2" />
            Send E-Signature Request
          </Button>
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Signature Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {req.document}
                  </p>
                  <Badge className="bg-amber-500/20 text-amber-400">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                <div className={`text-xs space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p>Signers: {req.signers.map(s => s.email).join(', ')}</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Expires: {req.expiryDate.toLocaleDateString()}
                  </p>
                  <p>Signed: {req.signatures.length} / {req.signers.length}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}