import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code, Copy, Eye, Settings, Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function TemplateEmbedding({ template, isDark = true }) {
  const [embedConfig, setEmbedConfig] = useState({
    width: '100%',
    height: '600px',
    theme: 'light',
    showHeader: true,
    showFooter: false,
    allowDownload: true,
    autoFit: true
  });

  const generateEmbedCode = () => {
    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/embed/template/${template?.id}`;
    
    const params = new URLSearchParams({
      theme: embedConfig.theme,
      header: embedConfig.showHeader,
      footer: embedConfig.showFooter,
      download: embedConfig.allowDownload,
      autofit: embedConfig.autoFit
    });

    return `<iframe
  src="${embedUrl}?${params.toString()}"
  width="${embedConfig.width}"
  height="${embedConfig.height}"
  frameborder="0"
  style="border: 1px solid #e2e8f0; border-radius: 8px;"
  allowfullscreen
></iframe>`;
  };

  const generateJavaScript = () => {
    return `<script src="${window.location.origin}/embed.js"></script>
<div id="template-embed-${template?.id}" 
     data-template-id="${template?.id}"
     data-theme="${embedConfig.theme}"
     data-width="${embedConfig.width}"
     data-height="${embedConfig.height}">
</div>
<script>
  TemplateEmbed.init('template-embed-${template?.id}');
</script>`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (!template) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Code className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to generate embed code
          </p>
        </CardContent>
      </Card>
    );
  }

  const embedCode = generateEmbedCode();
  const jsCode = generateJavaScript();

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Code className="w-5 h-5 text-violet-400" />
            Template Embedding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </p>
            <Badge variant="outline" className="mt-2">{template.category}</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="iframe">iFrame</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Width</Label>
                  <Input
                    value={embedConfig.width}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, width: e.target.value }))}
                    className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                  />
                </div>
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Height</Label>
                  <Input
                    value={embedConfig.height}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, height: e.target.value }))}
                    className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                  />
                </div>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Theme</Label>
                <Select value={embedConfig.theme} onValueChange={(v) => setEmbedConfig(prev => ({ ...prev, theme: v }))}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Show Header</span>
                  <input
                    type="checkbox"
                    checked={embedConfig.showHeader}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, showHeader: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Show Footer</span>
                  <input
                    type="checkbox"
                    checked={embedConfig.showFooter}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, showFooter: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Allow Download</span>
                  <input
                    type="checkbox"
                    checked={embedConfig.allowDownload}
                    onChange={(e) => setEmbedConfig(prev => ({ ...prev, allowDownload: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iframe">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Embed Code</Label>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(embedCode)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={embedCode}
                readOnly
                className={`font-mono text-xs min-h-[200px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="javascript">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>JavaScript Embed</Label>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(jsCode)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={jsCode}
                readOnly
                className={`font-mono text-xs min-h-[200px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-6">
              <div className="border rounded-lg p-4" style={{ width: embedConfig.width, height: embedConfig.height, overflow: 'auto' }}>
                <div className={embedConfig.theme === 'dark' ? 'bg-slate-900 text-white p-6' : 'bg-white text-slate-900 p-6'}>
                  {embedConfig.showHeader && (
                    <div className="mb-4 pb-4 border-b">
                      <h2 className="text-xl font-bold">{template.name}</h2>
                    </div>
                  )}
                  {template.template_data?.sections?.map((section, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-semibold text-violet-600 mb-2">{section.title}</h3>
                      <p className="text-sm whitespace-pre-wrap">{section.content}</p>
                    </div>
                  ))}
                  {embedConfig.showFooter && (
                    <div className="mt-4 pt-4 border-t text-xs text-center opacity-60">
                      Powered by OmniPDFs
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}