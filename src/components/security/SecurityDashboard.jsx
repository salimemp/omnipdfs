import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Clock,
  Globe,
  Fingerprint,
  FileWarning
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import moment from 'moment';

export default function SecurityDashboard({ isDark = true }) {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    encryptionAtRest: true,
    ipWhitelist: false,
    auditLogging: true,
    sessionTimeout: true,
    zeroKnowledge: false
  });

  const securityScore = 87;

  const securityEvents = [
    { id: 1, type: 'login', severity: 'info', message: 'Successful login from 192.168.1.1', timestamp: '2026-02-06T14:30:00', user: 'john@example.com' },
    { id: 2, type: 'access', severity: 'warning', message: 'Unusual access pattern detected', timestamp: '2026-02-06T14:15:00', user: 'jane@example.com' },
    { id: 3, type: 'encryption', severity: 'success', message: 'Document encrypted successfully', timestamp: '2026-02-06T14:00:00', user: 'admin@example.com' },
    { id: 4, type: 'failed_login', severity: 'error', message: 'Failed login attempt blocked', timestamp: '2026-02-06T13:45:00', user: 'unknown@example.com' }
  ];

  const severityConfig = {
    info: { icon: Activity, color: 'text-blue-400 bg-blue-500/20', label: 'Info' },
    warning: { icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/20', label: 'Warning' },
    success: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/20', label: 'Success' },
    error: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Error' }
  };

  const securityFeatures = [
    { key: 'twoFactorAuth', label: 'Two-Factor Authentication', icon: Key, description: 'Require 2FA for all users' },
    { key: 'encryptionAtRest', label: 'Encryption at Rest', icon: Lock, description: 'AES-256 encryption for stored files' },
    { key: 'ipWhitelist', label: 'IP Whitelisting', icon: Globe, description: 'Restrict access by IP address' },
    { key: 'auditLogging', label: 'Audit Logging', icon: FileWarning, description: 'Comprehensive activity logs' },
    { key: 'sessionTimeout', label: 'Session Timeout', icon: Clock, description: 'Auto logout after 30 minutes' },
    { key: 'zeroKnowledge', label: 'Zero-Knowledge Encryption', icon: Fingerprint, description: 'End-to-end encryption' }
  ];

  const toggleSetting = (key) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card className={isDark ? 'bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20' : 'bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                  Security Score
                </CardTitle>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Overall security posture
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-emerald-400">{securityScore}</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ 100</p>
            </div>
          </div>
          <Progress value={securityScore} className="mt-4 h-2" />
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: '12', icon: Activity, color: 'blue' },
          { label: 'Encrypted Files', value: '847', icon: Lock, color: 'emerald' },
          { label: 'Security Events', value: '23', icon: Eye, color: 'violet' },
          { label: 'Failed Attempts', value: '2', icon: AlertTriangle, color: 'amber' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="pt-6">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security Features */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Security Features
          </CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Configure your security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      securitySettings[feature.key] 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : isDark ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {feature.label}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings[feature.key]}
                    onCheckedChange={() => toggleSetting(feature.key)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Recent Security Events
          </CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Real-time security monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event, i) => {
              const config = severityConfig[event.severity];
              const Icon = config.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {event.message}
                      </p>
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                        {event.user}
                      </span>
                      <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
                      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                        {moment(event.timestamp).fromNow()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className={isDark ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <CheckCircle2 className="w-5 h-5 text-violet-400" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enable Zero-Knowledge Encryption for maximum privacy
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Configure IP Whitelisting to restrict access by location
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Review audit logs weekly for unusual activity patterns
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}