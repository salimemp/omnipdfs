import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Edit2, Check, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PDFComments({ document, isDark }) {
  const [comments, setComments] = useState([
    { id: 1, author: 'You', content: 'Please review page 3', page: 3, date: new Date(), resolved: false },
    { id: 2, author: 'John Doe', content: 'Updated as requested', page: 3, date: new Date(), resolved: true },
  ]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const addComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: 'You',
      content: newComment,
      page: currentPage,
      date: new Date(),
      resolved: false
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added');

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: document?.id,
      details: { type: 'comment_added', page: currentPage }
    });
  };

  const deleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
    toast.success('Comment deleted');
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const saveEdit = () => {
    setComments(comments.map(c => 
      c.id === editingId ? { ...c, content: editContent } : c
    ));
    setEditingId(null);
    setEditContent('');
    toast.success('Comment updated');
  };

  const toggleResolved = (id) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, resolved: !c.resolved } : c
    ));
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <MessageSquare className="w-5 h-5 text-violet-400" />
            Comments & Annotations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              placeholder="Page"
              className={`w-20 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}
              min={1}
            />
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}
              rows={2}
            />
            <Button onClick={addComment} size="icon" className="bg-violet-500 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {comments.map(comment => (
          <Card key={comment.id} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${comment.resolved ? 'opacity-60' : ''}`}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                    <User className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {comment.author}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {format(comment.date, 'MMM d, HH:mm')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Page {comment.page}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleResolved(comment.id)}
                    className={isDark ? 'text-slate-400' : 'text-slate-500'}
                    title={comment.resolved ? 'Mark as unresolved' : 'Mark as resolved'}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  {comment.author === 'You' && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(comment)}
                        className={isDark ? 'text-slate-400' : 'text-slate-500'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteComment(comment.id)}
                        className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingId === comment.id ? (
                <div className="flex gap-2 mt-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                    rows={2}
                  />
                  <div className="flex flex-col gap-1">
                    <Button size="icon" onClick={saveEdit} className="bg-violet-500">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'} ${comment.resolved ? 'line-through' : ''}`}>
                  {comment.content}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}