import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Key,
  Copy,
  CheckCircle2,
  FileText,
  Zap,
  Upload,
  Download,
  Shield,
  Terminal,
  Book,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

const apiEndpoints = [
  {
    method: 'POST',
    path: '/api/v1/convert',
    title: 'Convert Document',
    description: 'Convert a document from one format to another',
    params: [
      { name: 'file', type: 'File', required: true, description: 'The file to convert' },
      { name: 'target_format', type: 'string', required: true, description: 'Target format (pdf, docx, xlsx, etc.)' },
      { name: 'options', type: 'object', required: false, description: 'Conversion options (quality, ocr, etc.)' }
    ],
    response: `{
  "id": "conv_123abc",
  "status": "completed",
  "output_url": "https://...",
  "processing_time": 1250
}`,
    example: `curl -X POST https://api.omnipdf.com/v1/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@document.pdf" \\
  -F "target_format=docx"`
  },
  {
    method: 'POST',
    path: '/api/v1/merge',
    title: 'Merge PDFs',
    description: 'Merge multiple PDF files into one',
    params: [
      { name: 'files', type: 'File[]', required: true, description: 'Array of PDF files to merge' },
      { name: 'order', type: 'number[]', required: false, description: 'Custom order for merging' }
    ],
    response: `{
  "id": "merge_456def",
  "status": "completed",
  "output_url": "https://...",
  "page_count": 15
}`,
    example: `curl -X POST https://api.omnipdf.com/v1/merge \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "files[]=@doc1.pdf" \\
  -F "files[]=@doc2.pdf"`
  },
  {
    method: 'POST',
    path: '/api/v1/ocr',
    title: 'OCR Recognition',
    description: 'Extract text from images and scanned PDFs',
    params: [
      { name: 'file', type: 'File', required: true, description: 'Image or PDF file' },
      { name: 'language', type: 'string', required: false, description: 'OCR language (default: en)' },
      { name: 'output_format', type: 'string', required: false, description: 'Output format (text, json, pdf)' }
    ],
    response: `{
  "id": "ocr_789ghi",
  "status": "completed",
  "text": "Extracted text content...",
  "confidence": 0.95
}`,
    example: `curl -X POST https://api.omnipdf.com/v1/ocr \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@scanned.pdf" \\
  -F "language=en"`
  },
  {
    method: 'GET',
    path: '/api/v1/documents',
    title: 'List Documents',
    description: 'Retrieve a list of all documents',
    params: [
      { name: 'limit', type: 'number', required: false, description: 'Number of results (default: 50)' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset' },
      { name: 'type', type: 'string', required: false, description: 'Filter by file type' }
    ],
    response: `{
  "documents": [...],
  "total": 150,
  "limit": 50,
  "offset": 0
}`,
    example: `curl https://api.omnipdf.com/v1/documents?limit=10 \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  }
];

const sdkExamples = {
  javascript: `import OmniPDF from '@omnipdf/sdk';

const client = new OmniPDF('YOUR_API_KEY');

// Convert a document
const result = await client.convert({
  file: documentFile,
  targetFormat: 'pdf',
  options: {
    quality: 'high',
    ocr: true
  }
});

console.log(result.outputUrl);`,
  python: `from omnipdf import OmniPDF

client = OmniPDF('YOUR_API_KEY')

# Convert a document
result = client.convert(
    file=open('document.docx', 'rb'),
    target_format='pdf',
    options={'quality': 'high'}
)

print(result.output_url)`,
  curl: `# Convert a document
curl -X POST https://api.omnipdf.com/v1/convert \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@document.docx" \\
  -F "target_format=pdf" \\
  -F "options[quality]=high"`
};

export default function APIDocs({ theme = 'dark' }) {
  const [copied, setCopied] = useState(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState('javascript');

  const isDark = theme === 'dark';

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const methodColors = {
    GET: 'bg-emerald-500/20 text-emerald-400',
    POST: 'bg-blue-500/20 text-blue-400',
    PUT: 'bg-amber-500/20 text-amber-400',
    DELETE: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-violet-500/10' : 'bg-violet-100'} border border-violet-500/20 mb-4`}>
          <Code2 className="w-4 h-4 text-violet-400" />
          <span className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>Developer API</span>
        </div>
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          API Documentation
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Integrate OmniPDF into your applications with our REST API
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 mb-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Key className="w-5 h-5 text-violet-400" />
          Quick Start
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              1. Get your API key from Settings → API Keys
            </p>
            <div className={`flex gap-2 p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Input
                value="sk_live_xxxxxxxxxxxxxxxxxxxx"
                readOnly
                className={`font-mono text-sm ${isDark ? 'bg-transparent border-none text-slate-300' : 'bg-transparent border-none'}`}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard('sk_live_xxxxxxxxxxxxxxxxxxxx', 'apikey')}
              >
                {copied === 'apikey' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              2. Base URL for all requests
            </p>
            <div className={`flex gap-2 p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <code className={`flex-1 font-mono text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                https://api.omnipdf.com/v1
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard('https://api.omnipdf.com/v1', 'baseurl')}
              >
                {copied === 'baseurl' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SDK Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 mb-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Terminal className="w-5 h-5 text-cyan-400" />
          SDK Examples
        </h2>
        <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
          <TabsList className={`mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
          </TabsList>
          {Object.entries(sdkExamples).map(([lang, code]) => (
            <TabsContent key={lang} value={lang}>
              <div className="relative">
                <pre className={`p-4 rounded-xl overflow-x-auto text-sm font-mono ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-900 text-slate-300'}`}>
                  {code}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 text-slate-400"
                  onClick={() => copyToClipboard(code, `sdk-${lang}`)}
                >
                  {copied === `sdk-${lang}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Endpoints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <h2 className={`font-semibold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Book className="w-5 h-5 text-emerald-400" />
          API Endpoints
        </h2>

        <div className="space-y-4">
          {apiEndpoints.map((endpoint, index) => (
            <Collapsible
              key={index}
              open={expandedEndpoint === index}
              onOpenChange={(open) => setExpandedEndpoint(open ? index : -1)}
            >
              <CollapsibleTrigger className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'
              }`}>
                <div className="flex items-center gap-3">
                  <Badge className={methodColors[endpoint.method]}>
                    {endpoint.method}
                  </Badge>
                  <code className={`font-mono text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {endpoint.path}
                  </code>
                  <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {endpoint.title}
                  </span>
                </div>
                {expandedEndpoint === index ? (
                  <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={`mt-2 p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                  <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {endpoint.description}
                  </p>

                  <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Parameters
                  </h4>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                          <th className="text-left py-2 pr-4">Name</th>
                          <th className="text-left py-2 pr-4">Type</th>
                          <th className="text-left py-2 pr-4">Required</th>
                          <th className="text-left py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.params.map((param, i) => (
                          <tr key={i} className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            <td className="py-2 pr-4 font-mono text-violet-400">{param.name}</td>
                            <td className="py-2 pr-4 font-mono text-cyan-400">{param.type}</td>
                            <td className="py-2 pr-4">
                              {param.required ? (
                                <Badge className="bg-red-500/20 text-red-400">Required</Badge>
                              ) : (
                                <Badge variant="outline" className={isDark ? 'border-slate-700' : ''}>Optional</Badge>
                              )}
                            </td>
                            <td className="py-2">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Response
                  </h4>
                  <pre className={`p-3 rounded-lg text-xs font-mono mb-4 ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-900 text-slate-300'}`}>
                    {endpoint.response}
                  </pre>

                  <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Example
                  </h4>
                  <div className="relative">
                    <pre className={`p-3 rounded-lg text-xs font-mono ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-900 text-slate-300'}`}>
                      {endpoint.example}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400"
                      onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                    >
                      {copied === `example-${index}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </motion.div>
    </div>
  );
}