import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Shield, Users, Eye, Edit, Trash2, Share2, Lock, Unlock,
  Crown, Settings, CheckCircle2, XCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const rolePermissions = {
  admin: {
    label: 'Admin',
    icon: Crown,
    color: 'text-violet-400',
    permissions: {
      view: true,
      edit: true,
      delete: true,
      share: true,
      manageUsers: true,
      changePermissions: true,
      exportData: true,
      viewAnalytics: true
    }
  },
  editor: {
    label: 'Editor',
    icon: Edit,
    color: 'text-cyan-400',
    permissions: {
      view: true,
      edit: true,
      delete: false,
      share: true,
      manageUsers: false,
      changePermissions: false,
      exportData: true,
      viewAnalytics: false
    }
  },
  commenter: {
    label: 'Commenter',
    icon: Settings,
    color: 'text-blue-400',
    permissions: {
      view: true,
      edit: false,
      delete: false,
      share: false,
      manageUsers: false,
      changePermissions: false,
      exportData: false,
      viewAnalytics: false
    }
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    color: 'text-slate-400',
    permissions: {
      view: true,
      edit: false,
      delete: false,
      share: false,
      manageUsers: false,
      changePermissions: false,
      exportData: false,
      viewAnalytics: false
    }
  }
};

const permissionLabels = {
  view: 'View Document',
  edit: 'Edit Content',
  delete: 'Delete Document',
  share: 'Share with Others',
  manageUsers: 'Manage Team',
  changePermissions: 'Change Permissions',
  exportData: 'Export Data',
  viewAnalytics: 'View Analytics'
};

export default function PermissionsManager({ collaborators = [], onUpdate, currentUserRole = 'admin', isDark = true }) {
  const [editingUser, setEditingUser] = useState(null);
  const [customPermissions, setCustomPermissions] = useState({});

  const updateUserRole = (userEmail, newRole) => {
    const updated = collaborators.map(c =>
      c.email === userEmail ? { ...c, role: newRole } : c
    );
    onUpdate?.(updated);
    toast.success('Role updated');
  };

  const removeUser = (userEmail) => {
    const updated = collaborators.filter(c => c.email !== userEmail);
    onUpdate?.(updated);
    toast.success('User removed');
  };

  const canManagePermissions = rolePermissions[currentUserRole]?.permissions.changePermissions;

  return (
    <div className="space-y-4">
      {/* Current User Permissions */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-violet-500/10 border border-violet-500/30' : 'bg-violet-50 border border-violet-200'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Role</p>
            <Badge className="bg-violet-500/20 text-violet-400 mt-1">
              {rolePermissions[currentUserRole]?.label || 'Unknown'}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(rolePermissions[currentUserRole]?.permissions || {}).map(([key, value]) => (
            <div key={key} className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {value ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-600" />
              )}
              <span className={value ? '' : 'opacity-50'}>{permissionLabels[key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Users className="w-4 h-4 text-cyan-400" />
          Team Members ({collaborators.length})
        </h4>
        <div className="space-y-2">
          {collaborators.map((member, i) => {
            const RoleIcon = rolePermissions[member.role]?.icon || Eye;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-400">
                    {member.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {member.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <RoleIcon className={`w-3 h-3 ${rolePermissions[member.role]?.color}`} />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {rolePermissions[member.role]?.label}
                    </span>
                  </div>
                </div>
                {canManagePermissions && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={member.role}
                      onValueChange={(role) => updateUserRole(member.email, role)}
                      disabled={!canManagePermissions}
                    >
                      <SelectTrigger className={`w-32 h-8 text-xs ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                        {Object.entries(rolePermissions).map(([key, config]) => (
                          <SelectItem key={key} value={key} className={isDark ? 'text-white' : ''}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeUser(member.email)}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Permission Matrix */}
      {canManagePermissions && (
        <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Permission Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  <th className="text-left py-2">Permission</th>
                  {Object.entries(rolePermissions).map(([key, config]) => (
                    <th key={key} className="text-center py-2">{config.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionLabels).map(([permKey, permLabel]) => (
                  <tr key={permKey} className={isDark ? 'border-t border-slate-700' : 'border-t border-slate-200'}>
                    <td className={`py-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{permLabel}</td>
                    {Object.entries(rolePermissions).map(([roleKey, config]) => (
                      <td key={roleKey} className="text-center py-2">
                        {config.permissions[permKey] ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}