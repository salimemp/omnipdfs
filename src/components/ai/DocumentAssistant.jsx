import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Bot, Send, Loader2, Sparkles, FileText, Zap, Lightbulb,
  Copy, Download, RefreshCw, Paperclip, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import moment from 'moment';

const quickPrompts = [
  { label: 'Summarize this', prompt: 'Provide a concise summary of this document' },
  { label: 'Key takeaways', prompt: 'List the key takeaways and main points' },
  { label: 'Action items', prompt: 'Extract all action items and tasks mentioned' },
  { label: 'Find issues', prompt: 'Identify potential issues, gaps, or areas of concern' },
  { label: 'Improve clarity', prompt: 'Suggest ways to improve clarity and readability' },
  { label: 'Extract data', prompt: 'Extract structured data and key information' }
];

export default function DocumentAssistant({ document, isDark = true }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const sendMessage = async (prompt = input) => {
    if (!prompt.trim() || !document) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setProcessing(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful document assistant. Answer the user's question about this document.

User question: ${prompt}

Document: ${document.name}

Provide a clear, accurate, and helpful response.`,
        file_urls: document.file_url ? [document.file_url] : undefined
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      toast.error('Failed to get response');
    }
    setProcessing(false);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const clearChat = () => {
    setMessages([]);
    toast.success('Chat cleared');
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Assistant</p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Analyzing: {document?.name}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clearChat} className={isDark ? 'text-slate-400' : ''}>
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Sparkles className={`w-16 h-16 mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`text-center mb-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Ask me anything about this document
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-md">
              {quickPrompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.prompt)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <p className="text-sm font-medium">{q.label}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500">
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-violet-500 text-white'
                        : isDark
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-2">
                    <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {moment(msg.timestamp).fromNow()}
                    </span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className={`text-xs ${isDark ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500">
                <Bot className="w-4 h-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div className={`rounded-2xl p-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask a question about this document..."
            disabled={processing}
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || processing}
            className="bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}