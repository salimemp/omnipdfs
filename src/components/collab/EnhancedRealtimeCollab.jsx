import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Circle, MessageSquare, Video, Phone, 
  Share2, Edit3, Eye, MousePointer, Bell, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EnhancedRealtimeCollab({ documentId, isDark = true }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [cursors, setCursors] = useState({});
  const [typing, setTyping] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeCollaboration();
    
    // Real-time subscription for collaboration updates
    const unsubscribe = base44.entities.Collaboration.subscribe((event) => {
      if (event.type === 'update' && event.data?.document_id === documentId) {
        setActiveUsers(event.data.collaborators || []);
        
        // Update chat messages
        if (event.data.comments) {
          setMessages(event.data.comments.map(c => ({
            id: c.id,
            user: c.author,
            text: c.content,
            timestamp: c.created_at
          })));
        }
      }
    });

    const presenceInterval = setInterval(updatePresence, 3000);
    
    return () => {
      unsubscribe();
      clearInterval(presenceInterval);
    };
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeCollaboration = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const collaboration = await base44.entities.Collaboration.filter({ 
        document_id: documentId 
      });

      if (collaboration.length > 0) {
        setActiveUsers(collaboration[0].collaborators || []);
        setMessages((collaboration[0].comments || []).map(c => ({
          id: c.id,
          user: c.author,
          text: c.content,
          timestamp: c.created_at
        })));
      }

      await updatePresence();
    } catch (error) {
      console.error('Failed to initialize collaboration:', error);
    }
  };

  const updatePresence = async () => {
    if (!user || !documentId) return;

    try {
      const collaboration = await base44.entities.Collaboration.filter({ 
        document_id: documentId 
      });

      const now = new Date().toISOString();
      let collaborators = [];

      if (collaboration.length > 0) {
        collaborators = collaboration[0].collaborators || [];
        
        const existingIndex = collaborators.findIndex(c => c.email === user.email);
        if (existingIndex >= 0) {
          collaborators[existingIndex].last_active = now;
        } else {
          collaborators.push({
            email: user.email,
            role: 'editor',
            last_active: now,
            joined_at: now
          });
        }

        // Filter out inactive users (offline for more than 30 seconds)
        collaborators = collaborators.filter(c => {
          const lastActive = new Date(c.last_active);
          const diff = (new Date() - lastActive) / 1000;
          return diff < 30;
        });

        await base44.entities.Collaboration.update(collaboration[0].id, {
          collaborators,
          updated_date: now
        });

        setActiveUsers(collaborators);
      } else {
        const newCollaborators = [{
          email: user.email,
          role: 'editor',
          last_active: now,
          joined_at: now
        }];

        await base44.entities.Collaboration.create({
          document_id: documentId,
          collaborators: newCollaborators,
          status: 'in_review'
        });

        setActiveUsers(newCollaborators);
      }
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const collaboration = await base44.entities.Collaboration.filter({ 
        document_id: documentId 
      });

      if (collaboration.length > 0) {
        const comments = collaboration[0].comments || [];
        const newComment = {
          id: Date.now().toString(),
          author: user.email,
          content: newMessage,
          created_at: new Date().toISOString(),
          resolved: false
        };

        await base44.entities.Collaboration.update(collaboration[0].id, {
          comments: [...comments, newComment]
        });

        setMessages(prev => [...prev, {
          id: newComment.id,
          user: user.email,
          text: newMessage,
          timestamp: newComment.created_at
        }]);
        
        setNewMessage('');
        toast.success('Message sent');
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const inviteCollaborator = async () => {
    const email = prompt('Enter email to invite:');
    if (!email) return;

    try {
      await base44.functions.invoke('collaborationManager', {
        action: 'invite',
        documentId,
        email,
        role: 'editor'
      });
      
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const startVideoCall = () => {
    toast.info('Video call feature coming soon!');
  };

  const startAudioCall = () => {
    toast.info('Audio call feature coming soon!');
  };

  return (
    <div className="space-y-4">
      {/* Active Users Bar */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-violet-400" />
              Active Now ({activeUsers.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={startVideoCall}>
                <Video className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={startAudioCall}>
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowChat(!showChat)}>
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={inviteCollaborator} className="bg-violet-500 hover:bg-violet-600">
                <Share2 className="w-4 h-4 mr-1" />
                Invite
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence>
              {activeUsers.map((collab) => {
                const isCurrentUser = collab.email === user?.email;
                return (
                  <motion.div
                    key={collab.email}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <Avatar className={`w-10 h-10 border-2 ${
                        isCurrentUser ? 'border-violet-500' : 'border-violet-500/30'
                      }`}>
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-semibold">
                          {collab.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-emerald-400 text-emerald-400" />
                      {typing[collab.email] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Edit3 className="w-3 h-3 text-cyan-400" />
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {collab.email.split('@')[0]} {isCurrentUser && '(You)'}
                      </p>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {collab.role}
                        </Badge>
                        {typing[collab.email] && (
                          <span className="text-xs text-cyan-400">typing...</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {activeUsers.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active collaborators</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    Team Chat
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setShowChat(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className={`space-y-3 mb-4 max-h-64 overflow-y-auto p-3 rounded-lg ${
                  isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  {messages.length === 0 ? (
                    <div className="text-center py-6 text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwnMessage = msg.user === user?.email;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] ${
                            isOwnMessage 
                              ? 'bg-violet-500 text-white' 
                              : isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
                          } rounded-lg p-3`}>
                            {!isOwnMessage && (
                              <p className="text-xs font-semibold mb-1 opacity-70">
                                {msg.user.split('@')[0]}
                              </p>
                            )}
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-violet-200' : 'text-slate-400'
                            }`}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}