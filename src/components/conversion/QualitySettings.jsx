import React from 'react';
import { Settings, Zap, Award, Crown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../shared/LanguageContext';

export default function QualitySettings({ options, onChange, isDark }) {
  const { t } = useLanguage();

  const qualityLevels = [
    { value: 'low', label: 'Low', icon: Zap, color: 'text-slate-400', desc: 'Fast, smaller files' },
    { value: 'medium', label: 'Medium', icon: Settings, color: 'text-blue-400', desc: 'Balanced quality' },
    { value: 'high', label: 'High', icon: Award, color: 'text-amber-400', desc: 'Better quality' },
    { value: 'maximum', label: 'Maximum', icon: Crown, color: 'text-violet-400', desc: 'Best quality, larger files' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label className={`mb-3 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Output Quality
        </Label>
        <Select value={options.quality || 'maximum'} onValueChange={(v) => onChange({ quality: v })}>
          <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
            {qualityLevels.map(level => {
              const Icon = level.icon;
              return (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${level.color}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={isDark ? 'text-white' : 'text-slate-900'}>{level.label}</span>
                        {level.value === 'maximum' && (
                          <Badge className="bg-violet-500/20 text-violet-300 text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{level.desc}</p>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>OCR (Text Recognition)</Label>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Extract text from images</p>
          </div>
          <Switch
            checked={options.ocr_enabled || false}
            onCheckedChange={(checked) => onChange({ ocr_enabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Compress Output</Label>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reduce file size</p>
          </div>
          <Switch
            checked={options.compress || false}
            onCheckedChange={(checked) => onChange({ compress: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Preserve Metadata</Label>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Keep original properties</p>
          </div>
          <Switch
            checked={options.preserve_metadata !== false}
            onCheckedChange={(checked) => onChange({ preserve_metadata: checked })}
          />
        </div>
      </div>

      <div className={`p-4 rounded-xl ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 text-violet-400 mt-0.5" />
          <div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Maximum Quality Enabled
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Your conversions will use the highest quality settings for professional-grade output
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}