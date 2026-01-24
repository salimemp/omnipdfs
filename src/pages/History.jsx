import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  History as HistoryIcon,
  FileOutput,
  Merge,
  Scissors,
  Layers,
  Lock,
  Upload,
  Download,
  Share2,
  Trash2,
  ArrowRight,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileIcon from '@/components/shared/FileIcon';

const actionIcons = {
  upload: { icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  download: { icon: Download, color: 'text-green-400', bg: 'bg-green-500/10' },
  convert: { icon: FileOutput, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  share: { icon: Share2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  delete: { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10' },
  merge: { icon: Merge, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  split: { icon: Scissors, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  compress: { icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  protect: { icon: Lock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export default function History({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => base44.entities.ActivityLog.list('-created_date', 100),
  });

  const { data: conversionJobs = [] } = useQuery({
    queryKey: ['conversion-jobs'],
    queryFn: () => base44.entities.ConversionJob.list('-created_date', 50),
  });

  const getActionDescription = (activity) => {
    switch (activity.action) {
      case 'upload':
        return 'uploaded';
      case 'download':
        return 'downloaded';
      case 'convert':
        return `converted to ${activity.details?.to || 'PDF'}`;
      case 'share':
        return 'shared';
      case 'delete':
        return 'deleted';
      case 'merge':
        return 'merged PDFs';
      case 'split':
        return 'split PDF';
      case 'compress':
        return 'compressed';
      case 'protect':
        return 'password protected';
      default:
        return activity.action;
    }
  };

  const filteredActivities = activities
    .filter(activity => {
      if (searchQuery) {
        return activity.document_name?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(activity => {
      if (filterAction !== 'all') {
        return activity.action === filterAction;
      }
      return true;
    })
    .filter(activity => {
      if (dateRange === 'today') {
        return new Date(activity.created_date).toDateString() === new Date().toDateString();
      }
      if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(activity.created_date) >= weekAgo;
      }
      if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(activity.created_date) >= monthAgo;
      }
      return true;
    });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = format(new Date(activity.created_date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  const completedConversions = conversionJobs.filter(j => j.status === 'completed').length;
  const totalFilesProcessed = activities.length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity History</h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Track all your document operations and conversions</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <p className="text-sm text-slate-400 mb-1">Total Actions</p>
          <p className="text-2xl font-bold text-white">{totalFilesProcessed}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <p className="text-sm text-slate-400 mb-1">Conversions</p>
          <p className="text-2xl font-bold text-gradient">{completedConversions}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <p className="text-sm text-slate-400 mb-1">Uploads</p>
          <p className="text-2xl font-bold text-white">
            {activities.filter(a => a.action === 'upload').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-2xl p-5 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <p className="text-sm text-slate-400 mb-1">Shares</p>
          <p className="text-2xl font-bold text-white">
            {activities.filter(a => a.action === 'share').length}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-light rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-40 bg-slate-900 border-slate-700 text-white">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white">All Actions</SelectItem>
                <SelectItem value="upload" className="text-white">Uploads</SelectItem>
                <SelectItem value="convert" className="text-white">Conversions</SelectItem>
                <SelectItem value="share" className="text-white">Shares</SelectItem>
                <SelectItem value="merge" className="text-white">Merges</SelectItem>
                <SelectItem value="compress" className="text-white">Compressions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36 bg-slate-900 border-slate-700 text-white">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white">All Time</SelectItem>
                <SelectItem value="today" className="text-white">Today</SelectItem>
                <SelectItem value="week" className="text-white">This Week</SelectItem>
                <SelectItem value="month" className="text-white">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-light rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-700" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedActivities).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-sm text-slate-500 font-medium">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="space-y-3">
                {dayActivities.map((activity, index) => {
                  const actionConfig = actionIcons[activity.action] || actionIcons.upload;
                  const Icon = actionConfig.icon;

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-light rounded-2xl p-4 hover:border-violet-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${actionConfig.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${actionConfig.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-medium">
                              {activity.document_name || 'Document'}
                            </span>
                            <span className="text-slate-400">
                              {getActionDescription(activity)}
                            </span>
                            {activity.details?.from && activity.details?.to && (
                              <span className="text-slate-500 text-sm flex items-center gap-1">
                                <span className="uppercase">{activity.details.from}</span>
                                <ArrowRight className="w-3 h-3" />
                                <span className="uppercase text-violet-400">{activity.details.to}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(activity.created_date), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-light rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
            <HistoryIcon className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-white font-medium mb-2">No activity yet</h3>
          <p className="text-slate-400 text-sm">
            Your document operations will appear here
          </p>
        </motion.div>
      )}
    </div>
  );
}