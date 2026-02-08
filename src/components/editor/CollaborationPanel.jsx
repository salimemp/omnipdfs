import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Crown,
  Eye,
  Edit3,
  Shield,
  MessageSquare,
  Activity,
  Mail,
  Check,
  X,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const roles = [
  { id: 'viewer', label: 'Viewer', icon: Eye, color: 'text-slate-400', description: 'Can view only' },
  { id: 'editor', label: 'Editor', icon: Edit3, color: 'text-blue-400', description: 'Can edit' },
  { id: 'admin', label: 'Admin', icon: Crown, color: 'text-amber-400', description: 'Full access' },
];

export default function CollaborationPanel({ 
  documentId, 
  isDark = true 
}) {
  const [collaborators, setCollaborators] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadCollaborators();
    loadCurrentUser();
    simulateActiveUsers();
  }, [documentId]);

  const loadCurrentUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const loadCollaborators = async () => {
    try {
      const collab = await base44.entities.Collaboration.filter({ document_id: documentId });
      if (collab.length > 0) {
        setCollaborators(collab[0].collaborators || []);
      }
    } catch (error) {
      console.error('Failed to load collaborators');
    }
  };

  const simulateActiveUsers = () => {
    // Simulate active users for demo
    setActiveUsers([
      { id: 1, name: 'You', status: 'active', lastActive: 'now' }
    ]);
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    
    try {
      // Check if collaboration record exists
      let collabRecords = await base44.entities.Collaboration.filter({ document_id: documentId });
      
      const newCollaborator = {
        email: inviteEmail,
        role: inviteRole,
        joined_at: new Date().toISOString(),
        status: 'invited'
      };

      if (collabRecords.length === 0) {
        // Create new collaboration record
        await base44.entities.Collaboration.create({
          document_id: documentId,
          collaborators: [newCollaborator]
        });
      } else {
        // Update existing collaboration
        const existing = collabRecords[0];
        const updatedCollaborators = [...(existing.collaborators || []), newCollaborator];
        
        await base44.entities.Collaboration.update(existing.id, {
          collaborators: updatedCollaborators
        });
      }

      // Send invitation email
      await base44.integrations.Core.SendEmail({
        to: inviteEmail,
        subject: 'You\'ve been invited to collaborate',
        body: `You've been invited to collaborate on a document with ${inviteRole} access. Click here to join.`
      });

      await base44.entities.ActivityLog.create({
        action: 'share',
        document_id: documentId,
        details: {
          invited_user: inviteEmail,
          role: inviteRole
        }
      });

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      loadCollaborators();
      
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (collaboratorEmail, newRole) => {
    try {
      const collabRecords = await base44.entities.Collaboration.filter({ document_id: documentId });
      if (collabRecords.length > 0) {
        const existing = collabRecords[0];
        const updatedCollaborators = existing.collaborators.map(c =>
          c.email === collaboratorEmail ? { ...c, role: newRole } : c
        );
        
        await base44.entities.Collaboration.update(existing.id, {
          collaborators: updatedCollaborators
        });
        
        toast.success('Role updated');
        loadCollaborators();
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const removeCollaborator = async (collaboratorEmail) => {
    try {
      const collabRecords = await base44.entities.Collaboration.filter({ document_id: documentId });
      if (collabRecords.length > 0) {
        const existing = collabRecords[0];
        const updatedCollaborators = existing.collaborators.filter(c => c.email !== collaboratorEmail);
        
        await base44.entities.Collaboration.update(existing.id, {
          collaborators: updatedCollaborators
        });
        
        toast.success('Collaborator removed');
        loadCollaborators();
      }
    } catch (error) {
      toast.error('Failed to remove collaborator');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Users className="w-4 h-4 text-violet-400" />
          Collaboration
        </h3>
        <Badge variant="secondary" className="text-xs">
          <Activity className="w-3 h-3 mr-1" />
          {activeUsers.length} active
        </Badge>
      </div>

      {/* Active Users */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Active Now
        </p>
        <div className="flex -space-x-2">
          {activeUsers.map((activeUser, i) => (
            <div key={i} className="relative">
              <Avatar className="w-8 h-8 border-2 border-slate-900 ring-2 ring-emerald-400">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                  {activeUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
          ))}
        </div>
      </div>

      {/* Invite Section */}
      <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
        <Label className={`text-xs font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <UserPlus className="w-3 h-3 inline mr-1" />
          Invite Collaborator
        </Label>
        <div className="space-y-2">
          <Input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@example.com"
            className={`${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
            disabled={loading}
          />
          <Select value={inviteRole} onValueChange={setInviteRole} disabled={loading}>
            <SelectTrigger className={`${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id} className={isDark ? 'text-white' : ''}>
                  <div className="flex items-center gap-2">
                    <role.icon className={`w-3 h-3 ${role.color}`} />
                    <span>{role.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleInvite}
            disabled={loading || !inviteEmail}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Mail className="w-3 h-3 mr-1" />
            )}
            Send Invitation
          </Button>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="space-y-2">
        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Collaborators ({collaborators.length})
        </p>
        {collaborators.length === 0 ? (
          <p className={`text-xs text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No collaborators yet
          </p>
        ) : (
          <div className="space-y-2">
            {collaborators.map((collaborator, i) => {
              const roleInfo = roles.find(r => r.id === collaborator.role);
              const RoleIcon = roleInfo?.icon || Shield;
              
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg flex items-center justify-between ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs">
                        {collaborator.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {collaborator.email}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <RoleIcon className={`w-3 h-3 ${roleInfo?.color}`} />
                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {roleInfo?.label}
                        </span>
                        {collaborator.status === 'invited' && (
                          <Badge variant="secondary" className="text-[10px] ml-1">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Select
                      value={collaborator.role}
                      onValueChange={(value) => updateRole(collaborator.email, value)}
                    >
                      <SelectTrigger className={`w-[90px] h-7 text-xs ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id} className={`text-xs ${isDark ? 'text-white' : ''}`}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeCollaborator(collaborator.email)}
                      className="w-7 h-7 text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Permissions Info */}
      <div className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>
          Role Permissions
        </p>
        <div className="space-y-1">
          {roles.map(role => (
            <div key={role.id} className={`text-[10px] flex items-start gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <role.icon className={`w-3 h-3 ${role.color} mt-0.5 shrink-0`} />
              <div>
                <span className="font-medium">{role.label}:</span> {role.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}