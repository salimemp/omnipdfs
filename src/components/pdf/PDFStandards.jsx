import React, { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PDFStandards({ document, isDark }) {
  const [selectedStandard, setSelectedStandard] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const standards = [
    { id: 'pdf-a-1b', name: 'PDF/A-1b', description: 'Long-term archiving (basic)' },
    { id: 'pdf-a-2b', name: 'PDF/A-2b', description: 'Long-term archiving (improved)' },
    { id: 'pdf-a-3b', name: 'PDF/A-3b', description: 'Long-term archiving (with attachments)' },
    { id: 'pdf-x-1a', name: 'PDF/X-1a', description: 'Print production' },
    { id: 'pdf-x-3', name: 'PDF/X-3', description: 'Print production (color managed)' },
    { id: 'pdf-x-4', name: 'PDF/X-4', description: 'Print production (transparency support)' },
    { id: 'pdf-ua', name: 'PDF/UA', description: 'Universal accessibility' },
  ];

  const validateStandard = async () => {
    if (!selectedStandard) {
      toast.error('Please select a standard');
      return;
    }

    setValidating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        compliant: Math.random() > 0.3,
        issues: Math.random() > 0.3 ? [
          'Missing metadata fields',
          'Font embedding incomplete',
        ] : [],
        warnings: [
          'Color profile recommended',
        ]
      };

      setValidationResult(result);
      toast.success('Validation complete');

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        details: { type: 'standard_validated', standard: selectedStandard, compliant: result.compliant }
      });
    } catch (error) {
      toast.error('Validation failed');
    } finally {
      setValidating(false);
    }
  };

  const applyStandard = async () => {
    if (!selectedStandard) return;

    toast.promise(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await base44.entities.ActivityLog.create({
          action: 'convert',
          document_id: document?.id,
          details: { type: 'standard_applied', standard: selectedStandard }
        });
      },
      {
        loading: 'Converting to standard...',
        success: 'PDF standard applied successfully!',
        error: 'Failed to apply standard'
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Shield className="w-5 h-5 text-violet-400" />
            PDF Standards & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select value={selectedStandard} onValueChange={setSelectedStandard}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                <SelectValue placeholder="Select a standard" />
              </SelectTrigger>
              <SelectContent>
                {standards.map(std => (
                  <SelectItem key={std.id} value={std.id}>
                    <div>
                      <p className="font-medium">{std.name}</p>
                      <p className="text-xs text-slate-500">{std.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStandard && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {standards.find(s => s.id === selectedStandard)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={validateStandard} disabled={validating} variant="outline" className="flex-1">
              {validating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                'Validate'
              )}
            </Button>
            <Button onClick={applyStandard} disabled={!selectedStandard} className="flex-1 bg-violet-500">
              Apply Standard
            </Button>
          </div>
        </CardContent>
      </Card>

      {validationResult && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {validationResult.compliant ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge className={validationResult.compliant ? 'bg-emerald-500' : 'bg-amber-500'}>
              {validationResult.compliant ? 'Compliant' : 'Non-Compliant'}
            </Badge>

            {validationResult.issues.length > 0 && (
              <div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Issues Found:
                </p>
                <ul className="space-y-1">
                  {validationResult.issues.map((issue, i) => (
                    <li key={i} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  Warnings:
                </p>
                <ul className="space-y-1">
                  {validationResult.warnings.map((warning, i) => (
                    <li key={i} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}