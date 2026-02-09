import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette, Type, Layout, Sparkles, Save, RotateCcw, Eye
} from 'lucide-react';
import { toast } from 'sonner';

const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'];
const colorSchemes = [
  { name: 'Professional', primary: '#8b5cf6', secondary: '#06b6d4', text: '#1e293b' },
  { name: 'Modern', primary: '#3b82f6', secondary: '#10b981', text: '#111827' },
  { name: 'Elegant', primary: '#6366f1', secondary: '#ec4899', text: '#1f2937' },
  { name: 'Bold', primary: '#ef4444', secondary: '#f59e0b', text: '#0f172a' },
  { name: 'Minimalist', primary: '#64748b', secondary: '#94a3b8', text: '#0f172a' }
];

export default function AdvancedTemplateCustomizer({ template, onSave, isDark = true }) {
  const [customization, setCustomization] = useState({
    font: 'Inter',
    fontSize: 14,
    lineSpacing: 1.5,
    colorScheme: 'Professional',
    headerStyle: 'bold',
    sectionSpacing: 20,
    showBorders: true,
    showWatermark: false,
    watermarkText: '',
    pageMargins: 20,
    alignment: 'left'
  });

  const [preview, setPreview] = useState(false);

  const updateCustomization = (key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setCustomization({
      font: 'Inter',
      fontSize: 14,
      lineSpacing: 1.5,
      colorScheme: 'Professional',
      headerStyle: 'bold',
      sectionSpacing: 20,
      showBorders: true,
      showWatermark: false,
      watermarkText: '',
      pageMargins: 20,
      alignment: 'left'
    });
    toast.success('Reset to defaults');
  };

  const saveCustomization = () => {
    onSave?.(customization);
    toast.success('Customization saved');
  };

  const selectedScheme = colorSchemes.find(s => s.name === customization.colorScheme);

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-5 h-5 text-violet-400" />
              Advanced Customization
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPreview(!preview)}>
                <Eye className="w-4 h-4 mr-2" />
                {preview ? 'Edit' : 'Preview'}
              </Button>
              <Button size="sm" onClick={saveCustomization} className="bg-violet-500">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {preview ? (
        <Card className={isDark ? 'bg-white border-slate-700' : 'bg-white border-slate-200'}>
          <CardContent className="p-8">
            <div style={{
              fontFamily: customization.font,
              fontSize: `${customization.fontSize}px`,
              lineHeight: customization.lineSpacing,
              textAlign: customization.alignment,
              color: selectedScheme?.text,
              margin: `${customization.pageMargins}px`
            }}>
              {template?.template_data?.sections?.map((section, i) => (
                <div key={i} style={{ marginBottom: `${customization.sectionSpacing}px` }}>
                  <h3 style={{
                    color: selectedScheme?.primary,
                    fontWeight: customization.headerStyle === 'bold' ? 'bold' : 'normal',
                    fontSize: `${customization.fontSize + 4}px`,
                    borderBottom: customization.showBorders ? `2px solid ${selectedScheme?.secondary}` : 'none',
                    paddingBottom: '8px',
                    marginBottom: '12px'
                  }}>
                    {section.title}
                  </h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {section.content}
                  </p>
                </div>
              ))}
              {customization.showWatermark && customization.watermarkText && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-45deg)',
                  fontSize: '48px',
                  opacity: 0.1,
                  pointerEvents: 'none',
                  color: selectedScheme?.primary
                }}>
                  {customization.watermarkText}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="typography" className="space-y-6">
          <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="typography" className="space-y-4">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Font Family</Label>
                  <Select value={customization.font} onValueChange={(v) => updateCustomization('font', v)}>
                    <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      {fonts.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Font Size: {customization.fontSize}px
                  </Label>
                  <Slider
                    value={[customization.fontSize]}
                    onValueChange={([v]) => updateCustomization('fontSize', v)}
                    min={10}
                    max={24}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Line Spacing: {customization.lineSpacing}
                  </Label>
                  <Slider
                    value={[customization.lineSpacing]}
                    onValueChange={([v]) => updateCustomization('lineSpacing', v)}
                    min={1}
                    max={2.5}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Header Style</Label>
                  <Select value={customization.headerStyle} onValueChange={(v) => updateCustomization('headerStyle', v)}>
                    <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className={`mb-3 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Color Scheme
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {colorSchemes.map(scheme => (
                      <button
                        key={scheme.name}
                        onClick={() => updateCustomization('colorScheme', scheme.name)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          customization.colorScheme === scheme.name
                            ? 'border-violet-500 bg-violet-500/10'
                            : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {scheme.name}
                        </p>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.primary }} />
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.secondary }} />
                          <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.text }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Text Alignment</Label>
                  <Select value={customization.alignment} onValueChange={(v) => updateCustomization('alignment', v)}>
                    <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Section Spacing: {customization.sectionSpacing}px
                  </Label>
                  <Slider
                    value={[customization.sectionSpacing]}
                    onValueChange={([v]) => updateCustomization('sectionSpacing', v)}
                    min={10}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Page Margins: {customization.pageMargins}px
                  </Label>
                  <Slider
                    value={[customization.pageMargins]}
                    onValueChange={([v]) => updateCustomization('pageMargins', v)}
                    min={0}
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Show Borders</Label>
                  <Switch
                    checked={customization.showBorders}
                    onCheckedChange={(v) => updateCustomization('showBorders', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Watermark</Label>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Add a watermark to your template
                    </p>
                  </div>
                  <Switch
                    checked={customization.showWatermark}
                    onCheckedChange={(v) => updateCustomization('showWatermark', v)}
                  />
                </div>

                {customization.showWatermark && (
                  <div>
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Watermark Text</Label>
                    <Input
                      placeholder="CONFIDENTIAL"
                      value={customization.watermarkText}
                      onChange={(e) => updateCustomization('watermarkText', e.target.value)}
                      className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}