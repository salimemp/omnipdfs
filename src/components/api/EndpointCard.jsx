import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, CheckCircle2, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';

const methodColors = {
  GET: 'bg-emerald-500/20 text-emerald-400',
  POST: 'bg-blue-500/20 text-blue-400',
  PUT: 'bg-amber-500/20 text-amber-400',
  DELETE: 'bg-red-500/20 text-red-400',
  PATCH: 'bg-violet-500/20 text-violet-400'
};

export default function EndpointCard({ 
  endpoint, 
  isExpanded, 
  onToggle, 
  isDark = true 
}) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger 
        className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
          isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'
        }`}
        aria-expanded={isExpanded}
        aria-label={`${endpoint.method} ${endpoint.path} - ${endpoint.title}`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={methodColors[endpoint.method]} aria-label={`HTTP method: ${endpoint.method}`}>
            {endpoint.method}
          </Badge>
          <code className={`font-mono text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {endpoint.path}
          </code>
          <span className={`text-sm hidden sm:inline ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {endpoint.title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} aria-hidden="true" />
        ) : (
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} aria-hidden="true" />
        )}
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className={`mt-2 p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {endpoint.description}
          </p>

          {/* Parameters Table */}
          <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Parameters
          </h4>
          <div className="overflow-x-auto mb-4" role="table" aria-label="API parameters">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  <th className="text-left py-2 pr-4" scope="col">Name</th>
                  <th className="text-left py-2 pr-4" scope="col">Type</th>
                  <th className="text-left py-2 pr-4" scope="col">Required</th>
                  <th className="text-left py-2" scope="col">Description</th>
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

          {/* Response */}
          <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Response
          </h4>
          <pre 
            className={`p-3 rounded-lg text-xs font-mono mb-4 overflow-x-auto ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-900 text-slate-300'}`}
            aria-label="Response example"
          >
            {endpoint.response}
          </pre>

          {/* Example */}
          <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Example
          </h4>
          <div className="relative">
            <pre 
              className={`p-3 rounded-lg text-xs font-mono overflow-x-auto ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-900 text-slate-300'}`}
              aria-label="Code example"
            >
              {endpoint.example}
            </pre>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="text-slate-400 h-7 px-2"
                onClick={() => copyToClipboard(endpoint.example, 'example')}
                aria-label="Copy code example"
              >
                {copied === 'example' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Rate Limits Info */}
          {endpoint.rateLimit && (
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
              <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                Rate limit: {endpoint.rateLimit}
              </p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}