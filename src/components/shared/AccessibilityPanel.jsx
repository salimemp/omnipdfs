import React, { useState, useEffect } from 'react';
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Moon, 
  Type, 
  Contrast,
  MousePointer2,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AccessibilityPanel({ isDark = true }) {
  const [settings, setSettings] = useState({
    fontSize: 100,
    lineHeight: 1.5,
    letterSpacing: 0,
    highContrast: false,
    reducedMotion: false,
    focusIndicators: true,
    cursorSize: 'default'
  });

  useEffect(() => {
    // Apply settings to document
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    document.documentElement.style.setProperty('--line-height', settings.lineHeight);
    document.documentElement.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      lineHeight: 1.5,
      letterSpacing: 0,
      highContrast: false,
      reducedMotion: false,
      focusIndicators: true,
      cursorSize: 'default'
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Accessibility settings"
          className={isDark ? 'text-slate-400 hover:text-white' : ''}
        >
          <Accessibility className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
        <SheetHeader>
          <SheetTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
            <Accessibility className="w-5 h-5 text-violet-400" />
            Accessibility
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6" role="group" aria-label="Accessibility options">
          {/* Font Size */}
          <div>
            <Label className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : ''}`}>
              <Type className="w-4 h-4" />
              Text Size: {settings.fontSize}%
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateSetting('fontSize', Math.max(75, settings.fontSize - 10))}
                aria-label="Decrease text size"
                className={isDark ? 'border-slate-700' : ''}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([v]) => updateSetting('fontSize', v)}
                min={75}
                max={150}
                step={5}
                aria-label="Text size slider"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                aria-label="Increase text size"
                className={isDark ? 'border-slate-700' : ''}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Line Height */}
          <div>
            <Label className={isDark ? 'text-slate-300' : ''}>
              Line Spacing: {settings.lineHeight}
            </Label>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={([v]) => updateSetting('lineHeight', v)}
              min={1}
              max={2.5}
              step={0.1}
              className="mt-2"
              aria-label="Line spacing"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <Label className={isDark ? 'text-slate-300' : ''}>
              Letter Spacing: {settings.letterSpacing}px
            </Label>
            <Slider
              value={[settings.letterSpacing]}
              onValueChange={([v]) => updateSetting('letterSpacing', v)}
              min={0}
              max={5}
              step={0.5}
              className="mt-2"
              aria-label="Letter spacing"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <Label className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : ''}`}>
              <Contrast className="w-4 h-4" />
              High Contrast
            </Label>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(v) => updateSetting('highContrast', v)}
              aria-label="Toggle high contrast mode"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <Label className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : ''}`}>
              <Eye className="w-4 h-4" />
              Reduce Motion
            </Label>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(v) => updateSetting('reducedMotion', v)}
              aria-label="Reduce animations"
            />
          </div>

          {/* Focus Indicators */}
          <div className="flex items-center justify-between">
            <Label className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : ''}`}>
              <MousePointer2 className="w-4 h-4" />
              Enhanced Focus
            </Label>
            <Switch
              checked={settings.focusIndicators}
              onCheckedChange={(v) => updateSetting('focusIndicators', v)}
              aria-label="Enhanced focus indicators"
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className={`w-full mt-4 ${isDark ? 'border-slate-700' : ''}`}
            onClick={resetSettings}
          >
            Reset to Defaults
          </Button>

          {/* Keyboard Shortcuts */}
          <div className={`mt-6 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Keyboard Shortcuts
            </p>
            <ul className={`text-xs space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <li><kbd className="px-1 py-0.5 rounded bg-slate-700 text-white">Tab</kbd> Navigate elements</li>
              <li><kbd className="px-1 py-0.5 rounded bg-slate-700 text-white">Enter</kbd> Activate buttons</li>
              <li><kbd className="px-1 py-0.5 rounded bg-slate-700 text-white">Esc</kbd> Close dialogs</li>
              <li><kbd className="px-1 py-0.5 rounded bg-slate-700 text-white">↑↓</kbd> Navigate lists</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}