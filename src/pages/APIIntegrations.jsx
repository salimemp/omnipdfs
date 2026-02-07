import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, Key, BookOpen, Terminal, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const codeExamples = {
  curl: `curl -X POST https://api.omnipdfs.com/v1/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "file_url": "https://example.com/document.pdf",
    "target_format": "docx"
  }'`,
  
  javascript: `const response = await fetch('https://api.omnipdfs.com/v1/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    file_url: 'https://example.com/document.pdf',
    target_format: 'docx'
  })
});

const result = await response.json();
console.log(result);`,

  python: `import requests

url = "https://api.omnipdfs.com/v1/convert"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "file_url": "https://example.com/document.pdf",
    "target_format": "docx"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,

  php: `<?php
$url = "https://api.omnipdfs.com/v1/convert";
$data = [
    "file_url" => "https://example.com/document.pdf",
    "target_format" => "docx"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
print_r($result);
?>`
};

const endpoints = [
  {
    method: 'POST',
    path: '/v1/convert',
    description: 'Convert documents between formats',
    params: ['file_url', 'target_format', 'options']
  },
  {
    method: 'POST',
    path: '/v1/merge',
    description: 'Merge multiple PDFs',
    params: ['document_ids']
  },
  {
    method: 'POST',
    path: '/v1/split',
    description: 'Split PDF by page ranges',
    params: ['document_id', 'ranges']
  },
  {
    method: 'POST',
    path: '/v1/compress',
    description: 'Compress PDF file',
    params: ['document_id', 'quality']
  },
  {
    method: 'GET',
    path: '/v1/documents',
    description: 'List all documents',
    params: ['limit', 'offset']
  },
  {
    method: 'GET',
    path: '/v1/documents/:id',
    description: 'Get document details',
    params: []
  }
];

export default function APIIntegrations({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [apiKey, setApiKey] = useState('sk_test_xxxxxxxxxxxxxxxxxxxx');
  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateApiKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success('New API key generated');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            API Integration
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Integrate OmniPDFs into your applications
          </p>
        </div>
      </motion.div>

      {/* API Key Section */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-400" />
            API Key
          </CardTitle>
          <CardDescription>Your API key for authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={apiKey}
              readOnly
              className={`font-mono ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />
            <Button
              variant="outline"
              onClick={() => copyCode(apiKey)}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button onClick={generateApiKey} className="bg-violet-500 hover:bg-violet-600">
              Generate New
            </Button>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
            <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              Keep your API key secure. Do not share it publicly or commit it to version control.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quickstart" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100'}>
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* Quick Start */}
        <TabsContent value="quickstart" className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  1. Authentication
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Include your API key in the Authorization header:
                </p>
                <div className={`p-4 rounded-lg font-mono text-sm ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-900'}`}>
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  2. Base URL
                </h3>
                <div className={`p-4 rounded-lg font-mono text-sm ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-900'}`}>
                  https://api.omnipdfs.com/v1
                </div>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  3. Rate Limits
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Free tier: 100 requests/hour<br />
                  • Pro tier: 1,000 requests/hour<br />
                  • Enterprise: Unlimited
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints */}
        <TabsContent value="endpoints" className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                          {endpoint.method}
                        </Badge>
                        <code className={`text-sm ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                          {endpoint.path}
                        </code>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {endpoint.description}
                      </p>
                    </div>
                  </div>
                  {endpoint.params.length > 0 && (
                    <div>
                      <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Parameters:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.params.map((param) => (
                          <Badge key={param} variant="outline" className="font-mono text-xs">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Code Examples */}
        <TabsContent value="examples" className="space-y-6">
          <div className="flex gap-2 mb-4">
            {Object.keys(codeExamples).map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
                className={selectedLanguage === lang ? 'bg-violet-500' : ''}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Example: Convert Document</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyCode(codeExamples[selectedLanguage])}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className={`p-4 rounded-lg overflow-x-auto ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-900'}`}>
                <code className="text-sm">{codeExamples[selectedLanguage]}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Receive real-time notifications about events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Webhook URL
                </label>
                <Input
                  placeholder="https://your-domain.com/webhook"
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
              </div>

              <div>
                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Available Events:
                </p>
                <div className="space-y-2">
                  {['document.uploaded', 'conversion.completed', 'conversion.failed', 'document.deleted'].map((event) => (
                    <label key={event} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {event}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="bg-violet-500 hover:bg-violet-600">
                Save Webhook
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}