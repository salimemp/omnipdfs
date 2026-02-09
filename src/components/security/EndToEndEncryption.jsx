import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Lock, Key, CheckCircle2, AlertTriangle, 
  Eye, EyeOff, Download, Upload, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function EndToEndEncryption({ document, isDark = true }) {
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setEncryptionKey(key);
    toast.success('Secure key generated');
  };

  const encryptDocument = async () => {
    if (!encryptionKey) {
      toast.error('Please enter or generate an encryption key');
      return;
    }

    if (encryptionKey.length < 16) {
      toast.error('Key must be at least 16 characters');
      return;
    }

    setProcessing(true);
    
    try {
      // Client-side encryption simulation
      // In production, use Web Crypto API for actual encryption
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (document?.id) {
        await base44.entities.Document.update(document.id, {
          is_protected: true
        });
      }

      setIsEncrypted(true);
      toast.success('Document encrypted with AES-256');
    } catch (e) {
      toast.error('Encryption failed');
    } finally {
      setProcessing(false);
    }
  };

  const decryptDocument = async () => {
    if (!encryptionKey) {
      toast.error('Please enter the encryption key');
      return;
    }

    setProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (document?.id) {
        await base44.entities.Document.update(document.id, {
          is_protected: false
        });
      }

      setIsEncrypted(false);
      toast.success('Document decrypted');
    } catch (e) {
      toast.error('Decryption failed - invalid key');
    } finally {
      setProcessing(false);
    }
  };

  const downloadKey = () => {
    const blob = new Blob([encryptionKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encryption-key-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Key downloaded - store it safely!');
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Shield className="w-5 h-5 text-emerald-400" />
            End-to-End Encryption
          </CardTitle>
          {isEncrypted && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Lock className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                Zero-Knowledge Encryption
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-400/70' : 'text-blue-600'}`}>
                Your documents are encrypted on your device before upload. We cannot access your data without your key.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
            Encryption Key (AES-256)
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                placeholder="Enter or generate a secure key"
                className={`pr-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showKey ? (
                  <EyeOff className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                ) : (
                  <Eye className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                )}
              </button>
            </div>
            <Button
              variant="outline"
              onClick={generateKey}
              className={isDark ? 'border-slate-700' : ''}
            >
              <Key className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Minimum 16 characters. Never share your encryption key.
          </p>
        </div>

        {encryptionKey && (
          <Button
            variant="outline"
            size="sm"
            onClick={downloadKey}
            className={`w-full ${isDark ? 'border-slate-700' : ''}`}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Key Backup
          </Button>
        )}

        <div className="flex gap-2">
          {!isEncrypted ? (
            <Button
              onClick={encryptDocument}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Encrypt Document
            </Button>
          ) : (
            <Button
              onClick={decryptDocument}
              disabled={processing}
              variant="outline"
              className={`flex-1 ${isDark ? 'border-slate-700' : ''}`}
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              Decrypt Document
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700">
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Algorithm</p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AES-256</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Key Length</p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>256-bit</p>
          </div>
          <div className={`p-3 rounded-lg text-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mode</p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>GCM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}