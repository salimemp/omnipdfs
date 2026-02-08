import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, MessageSquare, ThumbsUp, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RealtimeComparison({ doc1, doc2, comparisonResult, isDark = false }) {
  const [viewers, setViewers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeRealtime();
    return () => cleanup();
  }, [doc1, doc2]);

  const initializeRealtime = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);

      // Create a collaboration session
      const session = await base44.entities.Collaboration.create({
        document_id: doc1.id,
        collaborators: [{
          email: user.email,
          role: 'viewer',
          joined_at: new Date().toISOString()
        }],
        comments: [],
        status: 'in_review'
      });

      // Subscribe to real-time updates
      const unsubscribe = base44.entities.Collaboration.subscribe((event) => {
        if (event.type === 'update' && event.id === session.id) {
          // Update viewers
          if (event.data.collaborators) {
            setViewers(event.data.collaborators);
          }
          // Update comments
          if (event.data.comments) {
            setComments(event.data.comments);
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Failed to initialize realtime:', error);
    }
  };

  const cleanup = () => {
    // Cleanup subscriptions
  };

  const addComment = async (section) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: currentUser?.email,
      content: newComment,
      section,
      created_at: new Date().toISOString(),
      resolved: false
    };

    try {
      // Update collaboration with new comment
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const addReaction = (changeId, emoji) => {
    setReactions(prev => ({
      ...prev,
      [changeId]: [...(prev[changeId] || []), { user: currentUser?.email, emoji }]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Active Viewers Bar */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-violet-400" />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {viewers.length} {viewers.length === 1 ? 'viewer' : 'viewers'} active
              </span>
            </div>
            <div className="flex -space-x-2">
              {viewers.slice(0, 5).map((viewer, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-slate-900">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                    {viewer.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {viewers.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center">
                  <span className="text-xs text-white">+{viewers.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Change Feed */}
      {comparisonResult && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-5 h-5 text-violet-400" />
              Live Changes Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Added Content with Reactions */}
            {comparisonResult.added_content?.map((item, i) => (
              <motion.div
                key={`add-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-l-4 border-emerald-500 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">Added</Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(`add-${i}`, '👍')}
                      className="h-6 px-2"
                    >
                      👍 {reactions[`add-${i}`]?.filter(r => r.emoji === '👍').length || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(`add-${i}`, '👀')}
                      className="h-6 px-2"
                    >
                      👀 {reactions[`add-${i}`]?.filter(r => r.emoji === '👀').length || 0}
                    </Button>
                  </div>
                </div>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {item.section}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.content}</p>
                
                {/* Inline Comments */}
                <div className="mt-3 space-y-2">
                  {comments.filter(c => c.section === item.section).map((comment, ci) => (
                    <div key={ci} className={`text-xs p-2 rounded ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
                      <span className="font-medium text-violet-400">{comment.author}: </span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{comment.content}</span>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addComment(item.section)}
                      className={`h-8 text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                    />
                    <Button
                      size="sm"
                      onClick={() => addComment(item.section)}
                      className="h-8 px-3"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Removed Content */}
            {comparisonResult.removed_content?.map((item, i) => (
              <motion.div
                key={`rem-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-l-4 border-red-500 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}
              >
                <Badge className="bg-red-500/20 text-red-400 mb-2">Removed</Badge>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {item.section}
                </p>
                <p className={`text-sm line-through ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.content}
                </p>
              </motion.div>
            ))}

            {/* Modified Sections */}
            {comparisonResult.modified_sections?.map((item, i) => (
              <motion.div
                key={`mod-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-l-4 border-amber-500 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}
              >
                <Badge className="bg-amber-500/20 text-amber-400 mb-2">Modified</Badge>
                <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {item.section}
                </p>
                <div className="space-y-2">
                  <div className={`p-2 rounded text-xs ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <span className={isDark ? 'text-red-400' : 'text-red-600'}>Before: </span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.original}</span>
                  </div>
                  <div className={`p-2 rounded text-xs ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                    <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>After: </span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.modified}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Comments Panel */}
      {comments.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <MessageSquare className="w-4 h-4" />
              All Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {comments.map((comment, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-violet-500 text-white text-xs">
                        {comment.author?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {comment.author}
                    </span>
                  </div>
                  {comment.resolved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {comment.content}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {comment.section} • {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}