import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Mail, MessageSquare, Cloud, GitBranch,
  Calendar, Database, Code, Webhook, Plus, Settings,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const integrations = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    color: 'from-red-500 to-rose-600',
    description: 'Send converted documents via email',
    triggers: ['On conversion complete', 'On document share'],
    actions: ['Send email', 'Create draft']
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-600',
    description: 'Post notifications to Slack channels',
    triggers: ['On upload', 'On conversion', 'On error'],
    actions: ['Post message', 'Create channel']
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    icon: Cloud,
    color: 'from-blue-500 to-green-500',
    description: 'Auto-sync documents to Google Drive',
    triggers: ['On upload', 'On conversion complete'],
    actions: ['Upload file', 'Create folder', 'Move file']
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: Database,
    color: 'from-blue-600 to-blue-400',
    description: 'Backup documents to Dropbox',
    triggers: ['On document create', 'On document update'],
    actions: ['Upload file', 'Create folder']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    icon: Zap,
    color: 'from-orange-500 to-amber-600',
    description: 'Connect to 5000+ apps via Zapier',
    triggers: ['Any event'],
    actions: ['Trigger Zap']
  },
  {
    id: 'webhook',
    name: 'Custom Webhook',
    icon: Webhook,
    color: 'from-slate-500 to-slate-700',
    description: 'Send events to custom endpoints',
    triggers: ['Any event', 'Custom trigger'],
    actions: ['POST request', 'GET request']
  }
];

export default function WorkflowIntegrations({ isDark = true }) {
  const [activeIntegrations, setActiveIntegrations] = useState({});
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [configuring, setConfiguring] = useState(false);
  const [config, setConfig] = useState({
    trigger: '',
    action: '',
    settings: {}
  });

  const toggleIntegration = async (integrationId) => {
    const newState = !activeIntegrations[integrationId];
    setActiveIntegrations(prev => ({
      ...prev,
      [integrationId]: newState
    }));

    try {
      await base44.functions.invoke('workflowAutomation', {
        action: newState ? 'enable_integration' : 'disable_integration',
        integrationId
      });
      
      toast.success(`${integrations.find(i => i.id === integrationId)?.name} ${newState ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update integration');
      setActiveIntegrations(prev => ({
        ...prev,
        [integrationId]: !newState
      }));
    }
  };

  const configureIntegration = (integration) => {
    setSelectedIntegration(integration);
    setConfiguring(true);
    setConfig({
      trigger: integration.triggers[0] || '',
      action: integration.actions[0] || '',
      settings: {}
    });
  };

  const saveConfiguration = async () => {
    try {
      await base44.functions.invoke('workflowAutomation', {
        action: 'configure_integration',
        integrationId: selectedIntegration.id,
        config
      });

      toast.success('Integration configured successfully');
      setConfiguring(false);
      setSelectedIntegration(null);
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Workflow Integrations
          </h2>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Connect your favorite tools and automate workflows
          </p>
        </div>
        <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : ''}>
          {Object.values(activeIntegrations).filter(Boolean).length} Active
        </Badge>
      </div>

      {/* Integration Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isActive = activeIntegrations[integration.id];

          return (
            <motion.div
              key={integration.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`relative overflow-hidden ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'
              } ${isActive ? 'ring-2 ring-violet-500' : ''}`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${integration.color}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${integration.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                    />
                  </div>
                  <CardTitle className="mt-3">{integration.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {integration.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {integration.triggers.length} triggers
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {integration.actions.length} actions
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => configureIntegration(integration)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {configuring && selectedIntegration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setConfiguring(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <Card className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(selectedIntegration.icon, {
                    className: 'w-8 h-8 text-violet-400'
                  })}
                  <div>
                    <CardTitle>Configure {selectedIntegration.name}</CardTitle>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Set up triggers and actions
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Trigger Event
                  </label>
                  <Select value={config.trigger} onValueChange={(v) => setConfig({...config, trigger: v})}>
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedIntegration.triggers.map(trigger => (
                        <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Action
                  </label>
                  <Select value={config.action} onValueChange={(v) => setConfig({...config, action: v})}>
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedIntegration.actions.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedIntegration.id === 'webhook' && (
                  <div>
                    <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Webhook URL
                    </label>
                    <Input
                      placeholder="https://your-endpoint.com/webhook"
                      className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                    />
                  </div>
                )}

                {selectedIntegration.id === 'gmail' && (
                  <div>
                    <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Email Template
                    </label>
                    <Input
                      placeholder="Subject: Document Ready"
                      className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setConfiguring(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveConfiguration}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}