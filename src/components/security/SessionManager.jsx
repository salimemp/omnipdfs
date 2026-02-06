import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  LogOut,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

export default function SessionManager({ isDark = true }) {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Desktop',
      deviceType: 'desktop',
      browser: 'Chrome 120',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      lastActive: '2026-02-06T14:30:00',
      current: true
    },
    {
      id: 2,
      device: 'iPhone 15',
      deviceType: 'mobile',
      browser: 'Safari',
      location: 'San Francisco, CA',
      ip: '192.168.1.50',
      lastActive: '2026-02-06T10:15:00',
      current: false
    },
    {
      id: 3,
      device: 'iPad Pro',
      deviceType: 'tablet',
      browser: 'Safari',
      location: 'Oakland, CA',
      ip: '192.168.2.100',
      lastActive: '2026-02-05T20:00:00',
      current: false
    }
  ]);

  const deviceIcons = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet
  };

  const handleTerminateSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleTerminateAll = () => {
    setSessions(prev => prev.filter(s => s.current));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Active Sessions
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Manage your logged-in devices and locations
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleTerminateAll}
              className={isDark ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-red-300 text-red-600 hover:bg-red-50'}
            >
              Terminate All Other Sessions
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((session, i) => {
          const DeviceIcon = deviceIcons[session.deviceType] || Monitor;
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Device Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        session.current 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-violet-500/20 text-violet-400'
                      }`}>
                        <DeviceIcon className="w-6 h-6" />
                      </div>

                      {/* Session Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {session.device}
                          </h3>
                          {session.current && (
                            <Badge className="bg-emerald-500/20 text-emerald-400">
                              Current Session
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Monitor className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                              {session.browser}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                              {session.location}
                            </span>
                            <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>•</span>
                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                              {session.ip}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                              Last active {moment(session.lastActive).fromNow()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className={isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Terminate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Security Notice */}
      <Card className={isDark ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Security Recommendation
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                If you see any sessions you don't recognize, terminate them immediately and change your password. 
                Consider enabling two-factor authentication for additional security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}