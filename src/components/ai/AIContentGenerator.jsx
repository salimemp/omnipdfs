import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Mail, Image, Code, Wand2, Copy, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const contentTypes = [
  { id: 'document', name: 'Business Document', icon: FileText, prompt: 'professional business document' },
  { id: 'email', name: 'Email', icon: Mail, prompt: 'professional email' },
  { id: 'report', name: 'Report', icon: FileText, prompt: 'detailed report' },
  { id: 'summary', name: 'Summary', icon: Sparkles, prompt: 'concise summary' },
  { id: 'presentation', name: 'Presentation', icon: Image, prompt: 'presentation outline' },
];

export default function AIContentGenerator({ isDark = true }) {
  const [contentType, setContentType] = useState('document');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setGenerating(true);
    try {
      const selectedType = contentTypes.find(t => t.id === contentType);
      const fullPrompt = `Generate a ${tone} ${selectedType.prompt} about: ${prompt}. 
      Length: ${length === 'short' ? '100-200 words' : length === 'medium' ? '300-500 words' : '700-1000 words'}.
      Make it well-structured, clear, and professional.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
      });

      setGeneratedContent(response);
      toast.success('Content generated successfully');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Copied to clipboard');
  };

  const downloadAsDocument = async () => {
    try {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const uploadResult = await base44.integrations.Core.UploadFile({ file: blob });
      
      await base44.entities.Document.create({
        name: `AI_Generated_${Date.now()}.txt`,
        file_url: uploadResult.file_url,
        file_type: 'txt',
        file_size: blob.size,
        status: 'ready'
      });

      toast.success('Document saved');
    } catch (error) {
      toast.error('Failed to save document');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-violet-400" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Content Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={contentType === type.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContentType(type.id)}
                    className={contentType === type.id ? 'bg-violet-500' : ''}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Describe what you need
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., A project proposal for implementing AI in customer service..."
              rows={4}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Tone
              </label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Length
              </label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateContent}
            disabled={generating}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
          >
            {generating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Content</CardTitle>
            {generatedContent && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={downloadAsDocument}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {generatedContent ? (
            <div className={`p-4 rounded-lg whitespace-pre-wrap ${
              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-900'
            }`}>
              {generatedContent}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Generated content will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}