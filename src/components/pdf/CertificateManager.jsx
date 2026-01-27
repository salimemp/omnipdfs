import React, { useState } from 'react';
import { Award, Plus, Trash2, Shield, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function CertificateManager({ isDark }) {
  const [certificates, setCertificates] = useState([
    { id: 1, name: 'Company Certificate', issuer: 'GlobalSign', expiry: new Date('2026-12-31'), type: 'Digital ID' },
  ]);
  const [adding, setAdding] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', expiry: '' });

  const addCertificate = () => {
    if (!newCert.name || !newCert.issuer) {
      toast.error('Please fill all fields');
      return;
    }

    const cert = {
      id: Date.now(),
      name: newCert.name,
      issuer: newCert.issuer,
      expiry: new Date(newCert.expiry || Date.now() + 365 * 24 * 60 * 60 * 1000),
      type: 'Digital ID'
    };

    setCertificates([...certificates, cert]);
    setNewCert({ name: '', issuer: '', expiry: '' });
    setAdding(false);
    toast.success('Certificate added');
  };

  const removeCertificate = (id) => {
    setCertificates(certificates.filter(c => c.id !== id));
    toast.success('Certificate removed');
  };

  const isExpiringSoon = (date) => {
    const daysUntilExpiry = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry < 30;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Certificate Management
        </h3>
        <Button size="sm" onClick={() => setAdding(!adding)} className="bg-violet-500">
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {adding && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6 space-y-3">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Certificate Name</Label>
              <Input
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                placeholder="e.g., Company Signing Certificate"
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Issuer</Label>
              <Input
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                placeholder="e.g., DigiCert, GlobalSign"
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Expiry Date</Label>
              <Input
                type="date"
                value={newCert.expiry}
                onChange={(e) => setNewCert({ ...newCert, expiry: e.target.value })}
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addCertificate} className="bg-violet-500">Add</Button>
              <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {certificates.map(cert => (
          <Card key={cert.id} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                    <Award className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {cert.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        {cert.issuer}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {cert.type}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>Expires: {format(cert.expiry, 'MMM d, yyyy')}</span>
                      {isExpiringSoon(cert.expiry) && (
                        <Badge variant="outline" className="ml-2 text-amber-400 border-amber-400">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeCertificate(cert.id)}
                  className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}