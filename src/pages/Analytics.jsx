import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  FileText,
  Users,
  Clock,
  Download,
  Upload,
  Zap,
  Calendar,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export default function Analytics({ theme = 'dark' }) {
  const [timeRange, setTimeRange] = useState('7d');
  const isDark = theme === 'dark';

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list(),
  });

  const { data: conversionJobs = [] } = useQuery({
    queryKey: ['conversion-jobs'],
    queryFn: () => base44.entities.ConversionJob.list(),
  });

  const { data: activityLogs = [] } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => base44.entities.ActivityLog.list(),
  });

  // Calculate stats
  const totalDocs = documents.length;
  const totalConversions = conversionJobs.filter(j => j.status === 'completed').length;
  const totalStorage = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);
  const avgProcessingTime = conversionJobs.length > 0
    ? conversionJobs.reduce((acc, j) => acc + (j.processing_time || 0), 0) / conversionJobs.length
    : 0;

  // Format data for charts
  const fileTypeData = documents.reduce((acc, doc) => {
    const type = doc.file_type?.toUpperCase() || 'Other';
    const existing = acc.find(d => d.name === type);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, []);

  const activityData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    name: day,
    uploads: Math.floor(Math.random() * 20) + 5,
    conversions: Math.floor(Math.random() * 15) + 3,
    downloads: Math.floor(Math.random() * 25) + 10
  }));

  const conversionTrend = Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    conversions: Math.floor(Math.random() * 50) + 20
  }));

  const statsCards = [
    { 
      title: 'Total Documents', 
      value: totalDocs, 
      change: '+12%', 
      isPositive: true,
      icon: FileText,
      color: 'text-violet-400',
      bg: 'bg-violet-500/20'
    },
    { 
      title: 'Conversions', 
      value: totalConversions, 
      change: '+8%', 
      isPositive: true,
      icon: Zap,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20'
    },
    { 
      title: 'Storage Used', 
      value: `${(totalStorage / (1024 * 1024)).toFixed(1)} MB`, 
      change: '+5%', 
      isPositive: true,
      icon: Upload,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20'
    },
    { 
      title: 'Avg. Processing', 
      value: `${(avgProcessingTime / 1000).toFixed(1)}s`, 
      change: '-15%', 
      isPositive: true,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Analytics Dashboard
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Track usage, conversions, and document insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className={`w-40 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
            <SelectItem value="7d" className={isDark ? 'text-white' : ''}>Last 7 days</SelectItem>
            <SelectItem value="30d" className={isDark ? 'text-white' : ''}>Last 30 days</SelectItem>
            <SelectItem value="90d" className={isDark ? 'text-white' : ''}>Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-5 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.title}</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="uploads" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="downloads" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conversions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Downloads</span>
            </div>
          </div>
        </motion.div>

        {/* File Types Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Document Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={fileTypeData.length > 0 ? fileTypeData : [{ name: 'No Data', value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {(fileTypeData.length > 0 ? fileTypeData : [{ name: 'No Data', value: 1 }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {fileTypeData.slice(0, 5).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Conversion Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={conversionTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="name" stroke={isDark ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="conversions" 
              stroke="#8B5CF6" 
              fill="url(#colorGradient)" 
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}