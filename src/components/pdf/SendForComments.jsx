import React, { useState } from 'react';
import { Send, MessageSquareText, Mail, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SendForComments({ document, isDark }) {
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [deadline, setDeadline] = useState('');
  const [sent, setSent] = useState([]);

  const sendForComments = async () => {
    if (!recipients) {
      toast.error('Please add recipients');
      return;
    }

    const emails = recipients.split(',').map(e => e.trim());
    
    toast.promise(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const request = {
          id: Date.now(),
          document: document?.name || 'Document',
          recipients: emails,
          message,
          deadline: deadline ? new Date(deadline) : null,
          status: 'pending',
          sentAt: new Date()
        };

        setSent([request, ...sent]);
        setRecipients('');
        setMessage('');
        setDeadline('');

        await base44.entities.ActivityLog.create({
          action: 'share',
          document_id: document?.id,
          details: { type: 'comment_request', recipients: emails }
        });
      },
      {
        loading: 'Sending comment request...',
        success: 'Comment request sent successfully!',
        error: 'Failed to send request'
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <MessageSquareText className="w-5 h-5 text-violet-400" />
            Send for Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Recipients (comma-separated)</Label>
            <Input
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="john@example.com, jane@example.com"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please review and provide your comments..."
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              rows={3}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Deadline (optional)</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <Button onClick={sendForComments} className="w-full bg-violet-500">
            <Send className="w-4 h-4 mr-2" />
            Send Comment Request
          </Button>
        </CardContent>
      </Card>

      {sent.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Sent Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sent.map(req => (
              <div key={req.id} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {req.document}
                  </p>
                  <Badge className="bg-amber-500/20 text-amber-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {req.status}
                  </Badge>
                </div>
                <div className={`text-xs space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {req.recipients.join(', ')}
                  </p>
                  {req.deadline && (
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Deadline: {req.deadline.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}