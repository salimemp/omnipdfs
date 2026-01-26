import React from 'react';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Gauge, FileImage, Zap } from 'lucide-react';

const qualityProfiles = {
  maximum: {
    label: 'Maximum Quality',
    icon: Sparkles,
    color: 'text-violet-400',
    description: 'Highest quality, larger file size',
    settings: { dpi: 600, compression: 0, optimization: false }
  },
  high: {
    label: 'High Quality',
    icon: Gauge,
    color: 'text-blue-400',
    description: 'Excellent quality, balanced size',
    settings: { dpi: 300, compression: 20, optimization: true }
  },
  medium: {
    label: 'Medium Quality',
    icon: FileImage,
    color: 'text-cyan-400',
    description: 'Good quality, smaller size',
    settings: { dpi: 150, compression: 50, optimization: true }
  },
  low: {
    label: 'Low Quality',
    icon: Zap,
    color: 'text-amber-400',
    description: 'Fast processing, smallest size',
    settings: { dpi: 96, compression: 70, optimization: true }
  }
};

export default function QualitySettings({ 
  quality = 'high',
  onQualityChange,
  advancedSettings = {},
  onAdvancedChange,
  isDark = true 
}) {
  const currentProfile = qualityProfiles[quality];
  const Icon = currentProfile?.icon || Gauge;

  return (
    <div className="space-y-4">
      <div>
        <Label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Quality Preset
        </Label>
        <Select value={quality} onValueChange={onQualityChange}>
          <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
            {Object.entries(qualityProfiles).map(([key, profile]) => {
              const ProfileIcon = profile.icon;
              return (
                <SelectItem key={key} value={key} className={isDark ? 'text-white' : ''}>
                  <div className="flex items-center gap-2">
                    <ProfileIcon className={`w-4 h-4 ${profile.color}`} />
                    <div>
                      <p className="font-medium">{profile.label}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {profile.description}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {currentProfile && (
        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${currentProfile.color}`} />
            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Current Settings
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>DPI:</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentProfile.settings.dpi}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Compression:</span>
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{currentProfile.settings.compression}%</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Optimization:</span>
              <Badge className={currentProfile.settings.optimization ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                {currentProfile.settings.optimization ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            OCR Processing
          </Label>
          <Switch 
            checked={advancedSettings.ocrEnabled || false}
            onCheckedChange={(v) => onAdvancedChange?.({ ...advancedSettings, ocrEnabled: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Preserve Metadata
          </Label>
          <Switch 
            checked={advancedSettings.preserveMetadata !== false}
            onCheckedChange={(v) => onAdvancedChange?.({ ...advancedSettings, preserveMetadata: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Fast Mode
          </Label>
          <Switch 
            checked={advancedSettings.fastMode || false}
            onCheckedChange={(v) => onAdvancedChange?.({ ...advancedSettings, fastMode: v })}
          />
        </div>
      </div>
    </div>
  );
}