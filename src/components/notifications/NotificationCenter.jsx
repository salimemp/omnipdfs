import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function NotificationCenter({ isDark = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Conversion Complete',
      message: 'Document.pdf has been converted to Word format',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'New Feature Available',
      message: 'AI content generation is now available',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Storage Almost Full',
      message: 'You are using 45GB of 50GB storage',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'error': return X;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-rose-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg ${
          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
        } transition-colors`}
      >
        <Bell className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-0 top-12 w-96 max-h-[600px] rounded-xl shadow-lg z-50 overflow-hidden ${
                isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Notifications
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-violet-400 hover:text-violet-300"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark all as read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-800">
                    {notifications.map((notification) => {
                      const Icon = getIcon(notification.type);
                      const colorClass = getColor(notification.type);

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 ${
                            !notification.read
                              ? isDark ? 'bg-violet-500/5' : 'bg-violet-50'
                              : ''
                          } hover:${isDark ? 'bg-slate-800' : 'bg-slate-50'} transition-colors`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-lg ${
                              isDark ? 'bg-slate-800' : 'bg-slate-100'
                            } flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${colorClass}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className={`font-medium text-sm ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                  {notification.title}
                                </p>
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-slate-400 hover:text-slate-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className={`text-sm ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-slate-500">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </span>
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 px-2 text-xs text-violet-400"
                                  >
                                    Mark as read
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Bell className={`w-12 h-12 mx-auto mb-3 ${
                      isDark ? 'text-slate-600' : 'text-slate-300'
                    }`} />
                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      No notifications
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}