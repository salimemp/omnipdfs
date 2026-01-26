import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MoreVertical, 
  UserPlus, 
  MessageSquare,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from 'moment';

const roleConfig = {
  admin: { label: 'Admin', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  editor: { label: 'Editor', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  viewer: { label: 'Viewer', color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-500/20 text-slate-400' },
  in_review: { label: 'In Review', color: 'bg-amber-500/20 text-amber-400' },
  approved: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
  published: { label: 'Published', color: 'bg-blue-500/20 text-blue-400' },
};

export default function CollaboratorCard({ 
  collab, 
  documentName,
  onStatusChange,
  onInviteClick,
  onCommentsClick,
  isDark = true,
  index = 0
}) {
  const openComments = collab.comments?.filter(c => !c.resolved)?.length || 0;
  const lastActivity = collab.comments?.[collab.comments.length - 1]?.created_at || collab.created_date;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl overflow-hidden ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      role="article"
      aria-label={`Collaboration on ${documentName}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}
              aria-hidden="true"
            >
              <FileText className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {documentName}
              </h3>
              <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock className="w-3 h-3" aria-hidden="true" />
                <time dateTime={collab.created_date}>
                  {moment(collab.created_date).fromNow()}
                </time>
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={isDark ? 'text-slate-400' : ''}
                aria-label="Document options"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
              {Object.entries(statusConfig).map(([key, config]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onStatusChange(collab.id, key)}
                  className={isDark ? 'text-white' : ''}
                >
                  Set as {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status & Activity */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={statusConfig[collab.status || 'draft'].color}>
            {statusConfig[collab.status || 'draft'].label}
          </Badge>
          {lastActivity && (
            <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Activity className="w-3 h-3" aria-hidden="true" />
              Last activity {moment(lastActivity).fromNow()}
            </span>
          )}
        </div>

        {/* Collaborators */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Team ({collab.collaborators?.length || 0})
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onInviteClick(collab)}
              className={`h-6 px-2 ${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600'}`}
              aria-label="Invite collaborator"
            >
              <UserPlus className="w-3 h-3 mr-1" aria-hidden="true" />
              Invite
            </Button>
          </div>
          <div className="flex -space-x-2" role="group" aria-label="Team members">
            {collab.collaborators?.slice(0, 5).map((c, i) => (
              <Avatar 
                key={i} 
                className="w-8 h-8 border-2 border-slate-900"
                title={`${c.email} - ${roleConfig[c.role]?.label}`}
              >
                <AvatarFallback className={`text-xs ${roleConfig[c.role]?.bg} ${roleConfig[c.role]?.color}`}>
                  {c.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {(collab.collaborators?.length || 0) > 5 && (
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${isDark ? 'bg-slate-800 border-slate-900 text-slate-400' : 'bg-slate-100 border-white text-slate-500'}`}
                aria-label={`${collab.collaborators.length - 5} more team members`}
              >
                +{collab.collaborators.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} aria-hidden="true" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {openComments} open comment{openComments !== 1 ? 's' : ''}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCommentsClick(collab)}
              className={isDark ? 'text-slate-400' : ''}
              aria-label={`View all comments for ${documentName}`}
            >
              View All
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}