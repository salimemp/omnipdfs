import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  User, 
  FileEdit, 
  MessageSquare, 
  UserPlus, 
  Eye,
  Download,
  Filter,
  Calendar,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import moment from 'moment';

const activityIcons = {
  edit: FileEdit,
  comment: MessageSquare,
  invite: UserPlus,
  view: Eye,
  share: User
};

const activityColors = {
  edit: 'text-blue-400 bg-blue-500/20',
  comment: 'text-violet-400 bg-violet-500/20',
  invite: 'text-emerald-400 bg-emerald-500/20',
  view: 'text-amber-400 bg-amber-500/20',
  share: 'text-cyan-400 bg-cyan-500/20'
};

export default function CollaborationAudit({ collaboration, isDark = true }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  // Generate mock audit trail
  const auditTrail = [
    { id: 1, user: 'john@example.com', action: 'edit', target: 'Section 2', timestamp: '2026-02-06T14:30:00', ip: '192.168.1.1', details: 'Modified paragraph 3' },
    { id: 2, user: 'jane@example.com', action: 'comment', target: 'Page 5', timestamp: '2026-02-06T14:25:00', ip: '192.168.1.2', details: 'Added comment on pricing' },
    { id: 3, user: 'admin@example.com', action: 'invite', target: 'sarah@example.com', timestamp: '2026-02-06T14:00:00', ip: '192.168.1.3', details: 'Invited as Editor' },
    { id: 4, user: 'john@example.com', action: 'view', target: 'Document', timestamp: '2026-02-06T13:45:00', ip: '192.168.1.1', details: 'Opened document' },
    { id: 5, user: 'jane@example.com', action: 'share', target: 'Link', timestamp: '2026-02-06T13:30:00', ip: '192.168.1.2', details: 'Generated share link' },
  ];

  const filteredTrail = auditTrail.filter(item => {
    const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.action === filterType;
    return matchesSearch && matchesType;
  });

  const exportAuditLog = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Target', 'IP Address', 'Details'].join(','),
      ...filteredTrail.map(item => 
        [item.timestamp, item.user, item.action, item.target, item.ip, item.details].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-violet-400" />
              <div>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                  Audit Trail
                </CardTitle>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Complete activity history and compliance logging
                </CardDescription>
              </div>
            </div>
            <Button onClick={exportAuditLog} variant="outline" size="sm" className={isDark ? 'border-slate-700' : 'border-slate-200'}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="edit">Edits</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="invite">Invitations</SelectItem>
                <SelectItem value="view">Views</SelectItem>
                <SelectItem value="share">Shares</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {filteredTrail.map((item, index) => {
          const Icon = activityIcons[item.action] || FileEdit;
          const colorClass = activityColors[item.action] || 'text-slate-400 bg-slate-500/20';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {item.user}
                            </span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {item.action}
                            </Badge>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.details}
                          </p>
                        </div>
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {moment(item.timestamp).fromNow()}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                          Target: {item.target}
                        </span>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                          IP: {item.ip}
                        </span>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                          {moment(item.timestamp).format('MMM D, YYYY h:mm A')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            {Object.keys(activityIcons).map(action => {
              const count = auditTrail.filter(item => item.action === action).length;
              const Icon = activityIcons[action];
              return (
                <div key={action} className="text-center">
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${activityColors[action]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {count}
                  </p>
                  <p className={`text-xs capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {action}s
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}