import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '../shared/LanguageContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PDFChatAssistant({ document, isDark }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I'm your AI assistant for "${document?.name}". I can help you understand, analyze, and work with this PDF. Ask me anything!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI assistant helping with a PDF document named "${document?.name}". 
        
Previous conversation:
${conversationHistory}

User question: ${input}

Provide a helpful, accurate response. If the user asks to edit the document, suggest they can use the PDF Editor. Be conversational and helpful.`,
        file_urls: document?.file_url ? [document.file_url] : undefined
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      await base44.entities.ActivityLog.create({
        action: 'ai_chat',
        document_id: document?.id,
        details: { query: input }
      });
    } catch (error) {
      toast.error('Failed to get response');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocument = () => {
    navigate(createPageUrl('PDFEditor'));
  };

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-violet-400" />
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI PDF Chat
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Ask questions about your document
            </p>
          </div>
        </div>
        <Button
          onClick={handleEditDocument}
          size="sm"
          className="bg-gradient-to-r from-violet-500 to-purple-500"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit PDF
        </Button>
      </div>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-4">
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border-2 border-violet-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500">
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                      : isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="w-8 h-8 border-2 border-cyan-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500">
                      <User className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 border-2 border-violet-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about this PDF..."
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-violet-500 to-purple-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}