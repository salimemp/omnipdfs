import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, FileText, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIDocumentGenerator({ isDark = true }) {
  const [documentType, setDocumentType] = useState('business_proposal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('professional');
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const documentTypes = [
    { value: 'business_proposal', label: 'Business Proposal' },
    { value: 'contract', label: 'Contract' },
    { value: 'report', label: 'Report' },
    { value: 'marketing_content', label: 'Marketing Content' },
    { value: 'technical_doc', label: 'Technical Documentation' },
    { value: 'presentation', label: 'Presentation Outline' }
  ];

  const styles = [
    { value: 'professional', label: 'Professional' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'technical', label: 'Technical' },
    { value: 'creative', label: 'Creative' }
  ];

  const generateDocument = async () => {
    if (!title || !description) {
      toast.error('Title and description required');
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.functions.invoke('generateDocument', {
        documentType,
        specifications: { title, description },
        style
      });

      if (response.data.success) {
        setGeneratedContent(response.data.content);
        toast.success('Document generated successfully');
      }
    } catch (error) {
      toast.error('Generation failed');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-violet-400" />
            Generate Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title..."
              className="mt-2"
            />
          </div>

          <div>
            <Label>Description & Requirements</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you need in this document..."
              className="mt-2 min-h-[150px]"
            />
          </div>

          <div>
            <Label>Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateDocument}
            disabled={generating}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {generating ? 'Generating...' : 'Generate Document'}
          </Button>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Generated Content
            </CardTitle>
            {generatedContent && (
              <Button variant="ghost" size="sm" onClick={copyContent}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {generatedContent ? (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'} max-h-[500px] overflow-y-auto`}>
              <pre className={`whitespace-pre-wrap text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {generatedContent}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Generated content will appear here
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}