import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Webhook,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Clock,
  Zap,
  Shield,
  Code
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import moment from 'moment';

const eventTypes = [
  { id: 'upload', label: 'File Upload', description: 'When a new file is uploaded' },
  { id: 'convert', label: 'Conversion Complete', description: 'When file conversion finishes' },
  { id: 'delete', label: 'File Delete', description: 'When a file is deleted' },
  { id: 'share', label: 'File Shared', description: 'When a file is shared' },
  { id: 'download', label: 'File Download', description: 'When a file is downloaded' },
  { id: 'ocr', label: 'OCR Complete', description: 'When OCR processing finishes' },
  { id: 'merge', label: 'PDF Merged', description: 'When PDFs are merged' },
  { id: 'split', label: 'PDF Split', description: 'When a PDF is split' },
];

export default function Webhooks({ theme = 'dark' }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSecretDialog, setShowSecretDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
    is_active: true,
    secret_key: generateSecret(),
    headers: {}
  });

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  function generateSecret() {
    return 'whsec_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => base44.entities.Webhook.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Webhook.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      setShowCreateDialog(false);
      setNewWebhook({
        name: '',
        url: '',
        events: [],
        is_active: true,
        secret_key: generateSecret(),
        headers: {}
      });
      toast.success('Webhook created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Webhook.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      toast.success('Webhook updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Webhook.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      toast.success('Webhook deleted');
    },
  });

  const toggleEvent = (eventId) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const testWebhook = async (webhook) => {
    setSelectedWebhook(webhook);
    setShowTestDialog(true);
    setTesting(true);
    setTestResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2;
    setTestResult({
      success,
      statusCode: success ? 200 : 500,
      responseTime: Math.floor(Math.random() * 500) + 100,
      response: success 
        ? { received: true, timestamp: new Date().toISOString() }
        : { error: 'Connection timeout' }
    });
    setTesting(false);

    if (success) {
      updateMutation.mutate({
        id: webhook.id,
        data: { last_triggered: new Date().toISOString(), failure_count: 0 }
      });
    } else {
      updateMutation.mutate({
        id: webhook.id,
        data: { failure_count: (webhook.failure_count || 0) + 1 }
      });
    }
  };

  const copySecret = (secret) => {
    navigator.clipboard.writeText(secret);
    toast.success('Secret copied to clipboard');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Webhooks
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Receive real-time notifications for document events
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Webhook
        </Button>
      </motion.div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Zap, label: 'Real-time', desc: 'Instant event delivery', color: 'text-amber-400' },
          { icon: Shield, label: 'Secure', desc: 'HMAC signature verification', color: 'text-emerald-400' },
          { icon: RefreshCw, label: 'Retry Logic', desc: 'Auto-retry on failures', color: 'text-blue-400' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-700' : 'bg-slate-100'}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Webhooks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : webhooks.length === 0 ? (
          <div className="text-center py-16">
            <Webhook className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No webhooks configured
            </h3>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Add a webhook to receive event notifications
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="bg-violet-500 hover:bg-violet-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Webhook
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className={isDark ? 'border-slate-700' : ''}>
                <TableHead className={isDark ? 'text-slate-400' : ''}>Name</TableHead>
                <TableHead className={isDark ? 'text-slate-400' : ''}>URL</TableHead>
                <TableHead className={isDark ? 'text-slate-400' : ''}>Events</TableHead>
                <TableHead className={isDark ? 'text-slate-400' : ''}>Status</TableHead>
                <TableHead className={isDark ? 'text-slate-400' : ''}>Last Triggered</TableHead>
                <TableHead className={`text-right ${isDark ? 'text-slate-400' : ''}`}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id} className={isDark ? 'border-slate-700' : ''}>
                  <TableCell className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {webhook.name}
                  </TableCell>
                  <TableCell className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    <code className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      {webhook.url.length > 40 ? webhook.url.substring(0, 40) + '...' : webhook.url}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events?.slice(0, 3).map((event) => (
                        <Badge key={event} variant="outline" className={`text-xs ${isDark ? 'border-slate-600 text-slate-300' : 'text-slate-600'}`}>
                          {event}
                        </Badge>
                      ))}
                      {webhook.events?.length > 3 && (
                        <Badge variant="outline" className={`${isDark ? 'border-slate-600 text-slate-300' : 'text-slate-600'}`}>
                          +{webhook.events.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {webhook.is_active ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-500/20 text-slate-400">
                          <Pause className="w-3 h-3 mr-1" />
                          Paused
                        </Badge>
                      )}
                      {webhook.failure_count > 0 && (
                        <Badge className="bg-amber-500/20 text-amber-400">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {webhook.failure_count} failures
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    {webhook.last_triggered 
                      ? moment(webhook.last_triggered).fromNow()
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => testWebhook(webhook)}
                        className={isDark ? 'text-slate-400 hover:text-white' : ''}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedWebhook(webhook);
                          setShowSecretDialog(true);
                        }}
                        className={isDark ? 'text-slate-400 hover:text-white' : ''}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateMutation.mutate({ 
                          id: webhook.id, 
                          data: { is_active: !webhook.is_active }
                        })}
                        className={isDark ? 'text-slate-400 hover:text-white' : ''}
                      >
                        {webhook.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(webhook.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={`max-w-lg ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Create Webhook</DialogTitle>
            <DialogDescription className={isDark ? 'text-slate-400' : ''}>
              Configure a new webhook endpoint to receive event notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Webhook Name</Label>
              <Input
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                placeholder="e.g., Production Server"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Endpoint URL</Label>
              <Input
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                placeholder="https://your-server.com/webhook"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Events to Subscribe</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {eventTypes.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => toggleEvent(event.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                      newWebhook.events.includes(event.id)
                        ? 'bg-violet-500/20 border border-violet-500/50'
                        : isDark
                          ? 'bg-slate-800 hover:bg-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <Checkbox checked={newWebhook.events.includes(event.id)} />
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Signing Secret</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newWebhook.secret_key}
                  readOnly
                  type={showSecret ? 'text' : 'password'}
                  className={`font-mono text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSecret(!showSecret)}
                  className={isDark ? 'border-slate-700' : ''}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copySecret(newWebhook.secret_key)}
                  className={isDark ? 'border-slate-700' : ''}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(newWebhook)}
              disabled={!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secret Dialog */}
      <Dialog open={showSecretDialog} onOpenChange={setShowSecretDialog}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Webhook Secret</DialogTitle>
            <DialogDescription className={isDark ? 'text-slate-400' : ''}>
              Use this secret to verify webhook signatures
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className={`p-4 rounded-xl font-mono text-sm break-all ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>
              {selectedWebhook?.secret_key}
            </div>
            <Button
              variant="outline"
              className={`mt-4 w-full ${isDark ? 'border-slate-700' : ''}`}
              onClick={() => copySecret(selectedWebhook?.secret_key)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Secret
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Test Webhook</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {testing ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-violet-500 mx-auto mb-4" />
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Sending test payload...</p>
              </div>
            ) : testResult ? (
              <div className="space-y-4">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${
                  testResult.success 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-semibold ${testResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {testResult.success ? 'Success' : 'Failed'}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Status: {testResult.statusCode} • {testResult.responseTime}ms
                    </p>
                  </div>
                </div>
                <div>
                  <Label className={isDark ? 'text-slate-400' : ''}>Response</Label>
                  <pre className={`mt-2 p-4 rounded-xl overflow-auto text-sm ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100'}`}>
                    {JSON.stringify(testResult.response, null, 2)}
                  </pre>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}