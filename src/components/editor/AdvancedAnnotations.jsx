import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Tag,
  Link2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Info,
  Bookmark,
  MapPin,
  Paperclip,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const annotationTypes = [
  { id: 'comment', icon: MessageSquare, label: 'Comment', color: 'text-blue-500' },
  { id: 'note', icon: FileText, label: 'Note', color: 'text-amber-500' },
  { id: 'highlight', icon: Tag, label: 'Highlight', color: 'text-yellow-500' },
  { id: 'link', icon: Link2, label: 'Link', color: 'text-cyan-500' },
  { id: 'bookmark', icon: Bookmark, label: 'Bookmark', color: 'text-violet-500' },
  { id: 'pin', icon: MapPin, label: 'Pin', color: 'text-red-500' },
];

export default function AdvancedAnnotations({ 
  annotations = [], 
  onAddAnnotation, 
  onDeleteAnnotation,
  onUpdateAnnotation,
  currentPage = 1,
  isDark = true 
}) {
  const [showForm, setShowForm] = useState(false);
  const [annotationType, setAnnotationType] = useState('comment');
  const [annotationContent, setAnnotationContent] = useState('');
  const [annotationTitle, setAnnotationTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [priority, setPriority] = useState('normal');
  const [tags, setTags] = useState('');

  const handleAddAnnotation = () => {
    if (!annotationContent && annotationType !== 'bookmark') {
      toast.error('Please enter content');
      return;
    }

    const newAnnotation = {
      id: Date.now(),
      type: annotationType,
      title: annotationTitle,
      content: annotationContent,
      linkUrl: linkUrl,
      priority: priority,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      page: currentPage,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      resolved: false,
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 300,
    };

    onAddAnnotation?.(newAnnotation);
    
    // Reset form
    setAnnotationContent('');
    setAnnotationTitle('');
    setLinkUrl('');
    setTags('');
    setShowForm(false);
    
    toast.success('Annotation added');
  };

  const toggleResolve = (id) => {
    const annotation = annotations.find(a => a.id === id);
    if (annotation) {
      onUpdateAnnotation?.({ ...annotation, resolved: !annotation.resolved });
      toast.success(annotation.resolved ? 'Reopened' : 'Resolved');
    }
  };

  const currentPageAnnotations = annotations.filter(a => a.page === currentPage);

  const Icon = annotationTypes.find(t => t.id === annotationType)?.icon || MessageSquare;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Annotations ({currentPageAnnotations.length})
        </h3>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      {showForm && (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="space-y-3">
            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Type</Label>
              <Select value={annotationType} onValueChange={setAnnotationType}>
                <SelectTrigger className={`mt-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {annotationTypes.map(type => (
                    <SelectItem key={type.id} value={type.id} className={isDark ? 'text-white' : ''}>
                      <div className="flex items-center gap-2">
                        <type.icon className={`w-4 h-4 ${type.color}`} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Title (optional)</Label>
              <Input
                value={annotationTitle}
                onChange={(e) => setAnnotationTitle(e.target.value)}
                placeholder="Enter title..."
                className={`mt-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
              />
            </div>

            {annotationType !== 'bookmark' && (
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Content</Label>
                <Textarea
                  value={annotationContent}
                  onChange={(e) => setAnnotationContent(e.target.value)}
                  placeholder="Enter your annotation..."
                  className={`mt-1 min-h-[80px] ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
                />
              </div>
            )}

            {annotationType === 'link' && (
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>URL</Label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className={`mt-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className={`mt-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                    <SelectItem value="low" className={isDark ? 'text-white' : ''}>Low</SelectItem>
                    <SelectItem value="normal" className={isDark ? 'text-white' : ''}>Normal</SelectItem>
                    <SelectItem value="high" className={isDark ? 'text-white' : ''}>High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Tags</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2"
                  className={`mt-1 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleAddAnnotation} className="flex-1 bg-violet-500">
                <Icon className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className={isDark ? 'border-slate-700' : ''}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Annotations List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {currentPageAnnotations.length === 0 ? (
          <p className={`text-xs text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No annotations on this page
          </p>
        ) : (
          currentPageAnnotations.map((annotation) => {
            const TypeIcon = annotationTypes.find(t => t.id === annotation.type)?.icon || MessageSquare;
            const typeColor = annotationTypes.find(t => t.id === annotation.type)?.color || 'text-slate-500';
            
            return (
              <div
                key={annotation.id}
                className={`p-3 rounded-lg border ${
                  annotation.resolved
                    ? isDark ? 'bg-slate-900/30 border-slate-700/50 opacity-60' : 'bg-slate-50 border-slate-200 opacity-60'
                    : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TypeIcon className={`w-4 h-4 ${typeColor}`} />
                    {annotation.title && (
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {annotation.title}
                      </span>
                    )}
                    {annotation.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs">High</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {annotation.type === 'comment' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleResolve(annotation.id)}
                        className="w-6 h-6"
                      >
                        {annotation.resolved ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteAnnotation?.(annotation.id)}
                      className="w-6 h-6 text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {annotation.content && (
                  <p className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {annotation.content}
                  </p>
                )}

                {annotation.linkUrl && (
                  <a
                    href={annotation.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mb-2"
                  >
                    <Link2 className="w-3 h-3" />
                    {annotation.linkUrl}
                  </a>
                )}

                {annotation.tags && annotation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {annotation.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] flex items-center gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>{annotation.author}</span>
                  <span>•</span>
                  <span>{new Date(annotation.timestamp).toLocaleString()}</span>
                  {annotation.resolved && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400">Resolved</span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}