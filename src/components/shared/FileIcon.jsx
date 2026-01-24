import React from 'react';
import { FileText, FileSpreadsheet, Presentation, Image, File, FileCode, BookOpen } from 'lucide-react';

const fileIcons = {
  pdf: { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10' },
  docx: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  doc: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  xlsx: { icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  xls: { icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  pptx: { icon: Presentation, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ppt: { icon: Presentation, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  jpg: { icon: Image, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  jpeg: { icon: Image, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  png: { icon: Image, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  txt: { icon: FileCode, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  html: { icon: FileCode, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  epub: { icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  default: { icon: File, color: 'text-slate-400', bg: 'bg-slate-500/10' }
};

export default function FileIcon({ type, size = 'md' }) {
  const config = fileIcons[type?.toLowerCase()] || fileIcons.default;
  const Icon = config.icon;
  
  const sizes = {
    sm: { wrapper: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { wrapper: 'w-10 h-10', icon: 'w-5 h-5' },
    lg: { wrapper: 'w-14 h-14', icon: 'w-7 h-7' },
    xl: { wrapper: 'w-20 h-20', icon: 'w-10 h-10' }
  };

  return (
    <div className={`${sizes[size].wrapper} ${config.bg} rounded-xl flex items-center justify-center`}>
      <Icon className={`${sizes[size].icon} ${config.color}`} />
    </div>
  );
}