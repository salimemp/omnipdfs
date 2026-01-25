import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  MessageSquare,
  History,
  Send,
  CheckCircle2,
  Clock,
  FileText,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  Crown,
  Shield,
  X,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import moment from 'moment';

const roleConfig = {
  admin: { label: 'Admin', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  editor: { label: 'Editor', icon: Edit, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  viewer: { label: 'Viewer', icon: Eye, color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-500/20 text-slate-400' },
  in_review: { label: 'In Review', color: 'bg-amber-500/20 text-amber-400' },
  approved: { label: 'Approved', color: 'bg-emerald-500/20 text-emerald-400' },
  published: { label: 'Published', color: 'bg-blue-500/20 text-blue-400' },
};

export default function Collaboration({ theme = 'dark' }) {
  const [user, setUser] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('collaborators');

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list(),
  });

  const { data: collaborations = [] } = useQuery({
    queryKey: ['collaborations'],
    queryFn: () => base44.entities.Collaboration.list(),
  });

  const createCollabMutation = useMutation({
    mutationFn: (data) => base44.entities.Collaboration.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaborations']);
      toast.success('Collaboration created');
    },
  });

  const updateCollabMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Collaboration.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['collaborations']);
    },
  });

  const inviteCollaborator = async () => {
    if (!inviteEmail || !selectedCollab) return;

    const collab = collaborations.find(c => c.id === selectedCollab.id);
    const newCollaborator = {
      email: inviteEmail,
      role: inviteRole,
      joined_at: new Date().toISOString()
    };

    await updateCollabMutation.mutateAsync({
      id: selectedCollab.id,
      data: {
        collaborators: [...(collab?.collaborators || []), newCollaborator]
      }
    });

    setInviteEmail('');
    setShowInviteDialog(false);
    toast.success(`Invited ${inviteEmail} as ${inviteRole}`);
  };

  const addComment = async () => {
    if (!newComment || !selectedCollab) return;

    const collab = collaborations.find(c => c.id === selectedCollab.id);
    const comment = {
      id: Date.now().toString(),
      author: user?.email || 'Anonymous',
      content: newComment,
      created_at: new Date().toISOString(),
      resolved: false
    };

    await updateCollabMutation.mutateAsync({
      id: selectedCollab.id,
      data: {
        comments: [...(collab?.comments || []), comment]
      }
    });

    setNewComment('');
    toast.success('Comment added');
  };

  const resolveComment = async (collabId, commentId) => {
    const collab = collaborations.find(c => c.id === collabId);
    const updatedComments = collab?.comments?.map(c => 
      c.id === commentId ? { ...c, resolved: true } : c
    );

    await updateCollabMutation.mutateAsync({
      id: collabId,
      data: { comments: updatedComments }
    });

    toast.success('Comment resolved');
  };

  const updateStatus = async (collabId, newStatus) => {
    await updateCollabMutation.mutateAsync({
      id: collabId,
      data: { status: newStatus }
    });
    toast.success(`Status updated to ${statusConfig[newStatus].label}`);
  };

  const getDocumentName = (docId) => {
    return documents.find(d => d.id === docId)?.name || 'Unknown Document';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Collaboration Hub
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Work together on documents with your team
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Projects', value: collaborations.length, color: 'text-violet-400' },
          { label: 'Team Members', value: collaborations.reduce((acc, c) => acc + (c.collaborators?.length || 0), 0), color: 'text-cyan-400' },
          { label: 'Open Comments', value: collaborations.reduce((acc, c) => acc + (c.comments?.filter(cm => !cm.resolved)?.length || 0), 0), color: 'text-amber-400' },
          { label: 'In Review', value: collaborations.filter(c => c.status === 'in_review').length, color: 'text-blue-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Collaboration Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collaborations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`col-span-full text-center py-16 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200'}`}
          >
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No active collaborations
            </h3>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Start by sharing a document with your team
            </p>
          </motion.div>
        ) : (
          collaborations.map((collab, index) => (
            <motion.div
              key={collab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl overflow-hidden ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                      <FileText className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {getDocumentName(collab.document_id)}
                      </h3>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {moment(collab.created_date).fromNow()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className={isDark ? 'text-slate-400' : ''}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => updateStatus(collab.id, key)}
                          className={isDark ? 'text-white' : ''}
                        >
                          Set as {config.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge className={statusConfig[collab.status || 'draft'].color}>
                  {statusConfig[collab.status || 'draft'].label}
                </Badge>

                {/* Collaborators */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Team ({collab.collaborators?.length || 0})
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCollab(collab);
                        setShowInviteDialog(true);
                      }}
                      className={`h-6 px-2 ${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600'}`}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Invite
                    </Button>
                  </div>
                  <div className="flex -space-x-2">
                    {collab.collaborators?.slice(0, 5).map((c, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-slate-900">
                        <AvatarFallback className={`text-xs ${roleConfig[c.role]?.bg} ${roleConfig[c.role]?.color}`}>
                          {c.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {(collab.collaborators?.length || 0) > 5 && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${isDark ? 'bg-slate-800 border-slate-900 text-slate-400' : 'bg-slate-100 border-white text-slate-500'}`}>
                        +{collab.collaborators.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Preview */}
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {collab.comments?.filter(c => !c.resolved)?.length || 0} open comments
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedCollab(collab);
                        setShowCommentDialog(true);
                      }}
                      className={isDark ? 'text-slate-400' : ''}
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Invite Collaborator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Email Address</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className={isDark ? 'text-white' : ''}>
                      <div className="flex items-center gap-2">
                        <config.icon className={`w-4 h-4 ${config.color}`} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button onClick={inviteCollaborator} className="bg-violet-500 hover:bg-violet-600">
              <Send className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className={`max-w-lg ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Comments & Discussion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* Add Comment */}
            <div className="flex gap-2 mb-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
              <Button onClick={addComment} className="bg-violet-500 hover:bg-violet-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedCollab?.comments?.length === 0 && (
                <p className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No comments yet
                </p>
              )}
              {selectedCollab?.comments?.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-xl ${comment.resolved ? 'opacity-50' : ''} ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-violet-500/20 text-violet-400">
                          {comment.author?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {comment.author}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {moment(comment.created_at).fromNow()}
                      </span>
                    </div>
                    {!comment.resolved && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resolveComment(selectedCollab.id, comment.id)}
                        className="h-6 px-2 text-emerald-400 hover:text-emerald-300"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {comment.content}
                  </p>
                  {comment.resolved && (
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 text-xs">
                      Resolved
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}