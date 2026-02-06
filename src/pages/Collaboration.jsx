import React, { useState, useEffect } from 'react';
import AdvancedCollabSuite from '@/components/collab/AdvancedCollabSuite';
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
  Plus,
  AtSign,
  Bell,
  GitBranch,
  Link2,
  Video,
  Calendar,
  Sparkles,
  Loader2,
  BarChart3,
  Zap
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
import CollaboratorCard from '@/components/collab/CollaboratorCard';
import CollaborationAudit from '@/components/collab/CollaborationAudit';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

const quickActions = [
  { icon: AtSign, label: 'Mention', description: 'Tag team members', action: 'mention' },
  { icon: Bell, label: 'Notify', description: 'Send notifications', action: 'notify' },
  { icon: GitBranch, label: 'Smart Merge', description: 'AI version merge', action: 'merge' },
  { icon: Link2, label: 'Share Link', description: 'Copy share link', action: 'share' },
  { icon: Video, label: 'Meet', description: 'Start video call', action: 'video' },
  { icon: Calendar, label: 'Meeting Notes', description: 'Generate notes', action: 'notes' },
  { icon: Sparkles, label: 'AI Analyze', description: 'Analyze document', action: 'analyze' },
  { icon: CheckCircle2, label: 'Auto-Assign', description: 'AI task assignment', action: 'assign' },
];

export default function Collaboration({ theme = 'dark' }) {
  const [user, setUser] = useState(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('collaborators');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [showWorkflows, setShowWorkflows] = useState(null);
  const [showPermissions, setShowPermissions] = useState(null);
  const [showAudit, setShowAudit] = useState(null);

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    base44.auth.me().then(data => {
      if (mounted) setUser(data);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const analyzeDocumentWithAI = async (collab) => {
    setAiAnalyzing(true);
    const docName = getDocumentName(collab.document_id);
    const browserLang = navigator.language.split('-')[0];
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this collaboration on document "${docName}". Team has ${collab.collaborators?.length || 0} members, ${collab.comments?.filter(c => !c.resolved)?.length || 0} open comments, status is ${collab.status}. Respond in ${browserLang}. Provide: 1) Summary 2) Potential bottlenecks 3) Recommendations`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            bottlenecks: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      setAiInsights(response);
      toast.success('AI analysis complete');
    } catch (e) {
      toast.error('Analysis failed');
    }
    setAiAnalyzing(false);
  };

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

  const autoAssignTasks = async (collab) => {
    setAiAnalyzing(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on a collaboration with ${collab.collaborators?.length || 0} team members and ${collab.comments?.length || 0} comments, suggest 3-5 specific action items and who should handle them.`,
        response_json_schema: {
          type: "object",
          properties: {
            tasks: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  task: { type: "string" },
                  assignee_role: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      const taskComment = {
        id: Date.now().toString(),
        author: 'AI Assistant',
        content: `📋 Suggested Tasks:\n${response.tasks.map((t, i) => `${i + 1}. ${t.task} (${t.assignee_role}) - Priority: ${t.priority}`).join('\n')}`,
        created_at: new Date().toISOString(),
        resolved: false
      };

      const existingCollab = collaborations.find(c => c.id === collab.id);
      await updateCollabMutation.mutateAsync({
        id: collab.id,
        data: {
          comments: [...(existingCollab?.comments || []), taskComment]
        }
      });

      toast.success('AI assigned tasks');
    } catch (e) {
      toast.error('Task assignment failed');
    }
    setAiAnalyzing(false);
  };

  const smartMergeVersions = async (collabId) => {
    setAiAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: 'Analyze document versions and suggest intelligent merge strategy to resolve conflicts.',
        response_json_schema: {
          type: "object",
          properties: {
            merge_strategy: { type: "string" },
            conflicts: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });
      toast.success(`Merge analysis complete: ${response.merge_strategy}`);
    } catch (e) {
      toast.error('Merge analysis failed');
    }
    setAiAnalyzing(false);
  };

  const generateMeetingNotes = async (collabId) => {
    setAiAnalyzing(true);
    try {
      const collab = collaborations.find(c => c.id === collabId);
      const allComments = collab?.comments?.map(c => c.content).join('\n') || '';
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate structured meeting notes from these discussion comments:\n${allComments}`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            decisions: { type: "array", items: { type: "string" } },
            action_items: { type: "array", items: { type: "string" } },
            next_steps: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      const notesComment = {
        id: Date.now().toString(),
        author: 'AI Meeting Notes',
        content: `📝 Meeting Summary:\n${response.summary}\n\nDecisions:\n${response.decisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nAction Items:\n${response.action_items.map((a, i) => `${i + 1}. ${a}`).join('\n')}`,
        created_at: new Date().toISOString(),
        resolved: false
      };

      await updateCollabMutation.mutateAsync({
        id: collabId,
        data: {
          comments: [...(collab?.comments || []), notesComment]
        }
      });
      
      toast.success('Meeting notes generated');
    } catch (e) {
      toast.error('Note generation failed');
    }
    setAiAnalyzing(false);
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
        <Button
          onClick={() => setShowAnalytics(!showAnalytics)}
          variant="outline"
          className={isDark ? 'border-slate-700' : ''}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {showAnalytics ? 'Hide' : 'Show'} Analytics
        </Button>
      </motion.div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <InsightsDashboard collaborations={collaborations} isDark={isDark} />
        </motion.div>
      )}

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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 mb-8 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quick Actions</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                if (action.action === 'analyze' && collaborations.length > 0) {
                  analyzeDocumentWithAI(collaborations[0]);
                } else if (action.action === 'assign' && collaborations.length > 0) {
                  autoAssignTasks(collaborations[0]);
                } else if (action.action === 'merge' && collaborations.length > 0) {
                  smartMergeVersions(collaborations[0].id);
                } else if (action.action === 'notes' && collaborations.length > 0) {
                  generateMeetingNotes(collaborations[0].id);
                } else {
                  toast.info(`${action.label}: ${action.description}`);
                }
              }}
              disabled={(action.action === 'analyze' || action.action === 'assign' || action.action === 'merge' || action.action === 'notes') && aiAnalyzing}
              className={`p-3 rounded-xl text-center transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} ${action.label === 'AI Analyze' ? 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10' : ''}`}
            >
              {(action.action === 'analyze' || action.action === 'assign' || action.action === 'merge' || action.action === 'notes') && aiAnalyzing ? (
                <Loader2 className="w-5 h-5 mx-auto mb-1 text-violet-400 animate-spin" />
              ) : (
                <action.icon className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-violet-400' : 'text-violet-500'}`} />
              )}
              <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{action.label}</p>
            </button>
          ))}
        </div>

        {aiInsights && (
          <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Insights</h4>
              <Button size="sm" variant="ghost" onClick={() => setAiInsights(null)} className="ml-auto h-6 px-2">
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{aiInsights.summary}</p>
            {aiInsights.recommendations?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aiInsights.recommendations.slice(0, 3).map((rec, i) => (
                  <Badge key={i} className="bg-violet-500/20 text-violet-400 text-xs">{rec}</Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Collaboration Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Active collaborations">
        {collaborations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`col-span-full text-center py-16 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200'}`}
            role="status"
          >
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} aria-hidden="true" />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No active collaborations
            </h3>
            <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Start by sharing a document with your team
            </p>
          </motion.div>
        ) : (
          collaborations.map((collab, index) => (
            <CollaboratorCard
              key={collab.id}
              collab={collab}
              documentName={getDocumentName(collab.document_id)}
              onStatusChange={updateStatus}
              onInviteClick={(c) => {
                setSelectedCollab(c);
                setShowInviteDialog(true);
              }}
              onCommentsClick={(c) => {
                setSelectedCollab(c);
                setShowCommentDialog(true);
              }}
              onAuditClick={(c) => setShowAudit(c)}
              isDark={isDark}
              index={index}
            />
          ))
        )}
      </div>

      {/* Audit Dialog */}
      <Dialog open={!!showAudit} onOpenChange={() => setShowAudit(null)}>
        <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Collaboration Audit Trail</DialogTitle>
          </DialogHeader>
          {showAudit && <CollaborationAudit collaboration={showAudit} isDark={isDark} />}
        </DialogContent>
      </Dialog>

      {/* Workflow Automation Dialog */}
      <Dialog open={!!showWorkflows} onOpenChange={() => setShowWorkflows(null)}>
        <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
              <Zap className="w-5 h-5 text-violet-400" />
              Workflow Automation
            </DialogTitle>
          </DialogHeader>
          {showWorkflows && (
            <WorkflowAutomation
              collaborationId={showWorkflows.id}
              isDark={isDark}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={!!showPermissions} onOpenChange={() => setShowPermissions(null)}>
        <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
              <Shield className="w-5 h-5 text-violet-400" />
              Manage Permissions
            </DialogTitle>
          </DialogHeader>
          {showPermissions && (
            <PermissionsManager
              collaborators={showPermissions.collaborators || []}
              onUpdate={(updated) => {
                updateCollabMutation.mutateAsync({
                  id: showPermissions.id,
                  data: { collaborators: updated }
                });
              }}
              currentUserRole="admin"
              isDark={isDark}
            />
          )}
        </DialogContent>
      </Dialog>

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