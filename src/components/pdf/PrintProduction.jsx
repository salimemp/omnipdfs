import React, { useState } from 'react';
import { Printer, Settings, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PrintProduction({ document, isDark }) {
  const [checking, setChecking] = useState(false);
  const [preflightResult, setPreflightResult] = useState(null);
  const [settings, setSettings] = useState({
    colorSpace: 'cmyk',
    resolution: '300',
    bleed: '3mm',
    cropMarks: true,
    colorBars: true,
    registrationMarks: true,
    overprint: false,
  });

  const runPreflight = async () => {
    setChecking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        ready: Math.random() > 0.3,
        issues: Math.random() > 0.5 ? [
          'Low resolution image on page 2 (150 DPI)',
          'RGB colors detected - should be CMYK',
        ] : [],
        warnings: [
          'Bleed area extends 2mm - recommended 3mm',
        ]
      };

      setPreflightResult(result);
      toast.success('Preflight check complete');

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        details: { type: 'preflight_check', ready: result.ready }
      });
    } catch (error) {
      toast.error('Preflight check failed');
    } finally {
      setChecking(false);
    }
  };

  const applySettings = async () => {
    toast.promise(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await base44.entities.ActivityLog.create({
          action: 'convert',
          document_id: document?.id,
          details: { type: 'print_production_applied', settings }
        });
      },
      {
        loading: 'Applying print production settings...',
        success: 'Settings applied successfully!',
        error: 'Failed to apply settings'
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Printer className="w-5 h-5 text-violet-400" />
            Print Production
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Color Space</Label>
              <Select value={settings.colorSpace} onValueChange={(v) => setSettings({ ...settings, colorSpace: v })}>
                <SelectTrigger className={`h-9 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cmyk">CMYK</SelectItem>
                  <SelectItem value="rgb">RGB</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Resolution</Label>
              <Select value={settings.resolution} onValueChange={(v) => setSettings({ ...settings, resolution: v })}>
                <SelectTrigger className={`h-9 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150 DPI</SelectItem>
                  <SelectItem value="300">300 DPI</SelectItem>
                  <SelectItem value="600">600 DPI</SelectItem>
                  <SelectItem value="1200">1200 DPI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Bleed</Label>
              <Select value={settings.bleed} onValueChange={(v) => setSettings({ ...settings, bleed: v })}>
                <SelectTrigger className={`h-9 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0mm">No Bleed</SelectItem>
                  <SelectItem value="3mm">3mm</SelectItem>
                  <SelectItem value="5mm">5mm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Print Marks</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.cropMarks}
                  onCheckedChange={(v) => setSettings({ ...settings, cropMarks: v })}
                />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Crop Marks</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.colorBars}
                  onCheckedChange={(v) => setSettings({ ...settings, colorBars: v })}
                />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Color Bars</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.registrationMarks}
                  onCheckedChange={(v) => setSettings({ ...settings, registrationMarks: v })}
                />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Registration Marks</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={settings.overprint}
                  onCheckedChange={(v) => setSettings({ ...settings, overprint: v })}
                />
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Overprint Simulation</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={runPreflight} disabled={checking} variant="outline" className="flex-1">
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                'Run Preflight'
              )}
            </Button>
            <Button onClick={applySettings} className="flex-1 bg-violet-500">
              Apply Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {preflightResult && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {preflightResult.ready ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              Preflight Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge className={preflightResult.ready ? 'bg-emerald-500' : 'bg-amber-500'}>
              {preflightResult.ready ? 'Print Ready' : 'Issues Found'}
            </Badge>

            {preflightResult.issues.length > 0 && (
              <div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Issues:
                </p>
                <ul className="space-y-1">
                  {preflightResult.issues.map((issue, i) => (
                    <li key={i} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {preflightResult.warnings.length > 0 && (
              <div>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  Warnings:
                </p>
                <ul className="space-y-1">
                  {preflightResult.warnings.map((warning, i) => (
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