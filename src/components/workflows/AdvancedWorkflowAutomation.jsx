import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Clock, Zap, Play, Pause, Trash2, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdvancedWorkflowAutomation({ isDark }) {
  const [automations, setAutomations] = useState([]);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: 'upload',
    action: 'summarize',
    schedule: 'immediate'
  });

  const triggers = [
    { value: 'upload', label: 'On Document Upload' },
    { value: 'schedule', label: 'Scheduled' },
    { value: 'update', label: 'On Document Update' },
    { value: 'tag', label: 'When Tagged' }
  ];

  const actions = [
    { value: 'summarize', label: 'Summarize Document' },
    { value: 'extract_data', label: 'Extract Data' },
    { value: 'auto-tag', label: 'Auto-Tag' },
    { value: 'translate', label: 'Translate' },
    { value: 'notify', label: 'Send Notification' }
  ];

  const schedules = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily at 9 AM' },
    { value: 'weekly', label: 'Weekly on Monday' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const createAutomation = async () => {
    if (!newAutomation.name) {
      toast.error('Enter automation name');
      return;
    }

    const automation = {
      id: Date.now().toString(),
      ...newAutomation,
      status: 'active',
      runs: 0,
      lastRun: null
    };

    setAutomations([...automations, automation]);
    setNewAutomation({ name: '', trigger: 'upload', action: 'summarize', schedule: 'immediate' });
    toast.success('Automation created');
  };

  const toggleAutomation = (id) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
    toast.success('Status updated');
  };

  const deleteAutomation = (id) => {
    setAutomations(automations.filter(a => a.id !== id));
    toast.success('Automation deleted');
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Zap className="w-5 h-5 text-violet-400" />
            Create Workflow Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Automation name..."
            value={newAutomation.name}
            onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}
          />

          <div className="grid md:grid-cols-3 gap-3">
            <Select value={newAutomation.trigger} onValueChange={(v) => setNewAutomation({ ...newAutomation, trigger: v })}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {triggers.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newAutomation.action} onValueChange={(v) => setNewAutomation({ ...newAutomation, action: v })}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actions.map(a => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newAutomation.schedule} onValueChange={(v) => setNewAutomation({ ...newAutomation, schedule: v })}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schedules.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={createAutomation} className="w-full bg-gradient-to-r from-violet-500 to-cyan-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Automation
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {automations.map((automation) => (
          <motion.div
            key={automation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {automation.name}
                      </h4>
                      <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className="font-medium">Trigger:</span> {triggers.find(t => t.value === automation.trigger)?.label}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Action:</span> {actions.find(a => a.value === automation.action)?.label}
                      <span className="mx-2">•</span>
                      <span className="font-medium">Schedule:</span> {schedules.find(s => s.value === automation.schedule)?.label}
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Runs: {automation.runs} • {automation.lastRun ? `Last: ${new Date(automation.lastRun).toLocaleString()}` : 'Never run'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleAutomation(automation.id)}
                      className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
                    >
                      {automation.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteAutomation(automation.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}