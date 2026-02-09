import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User, Settings, Star, Bookmark, Tag, Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfileCustomization({ isDark = true }) {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const [profile, setProfile] = useState({
    favorite_categories: user?.favorite_categories || [],
    custom_tags: user?.custom_tags || [],
    default_privacy: user?.default_privacy || 'private',
    new_tag: ''
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['current-user']);
      setEditMode(false);
      toast.success('Profile updated');
    }
  });

  const categories = ['invoice', 'contract', 'letter', 'report', 'resume', 'certificate', 'form', 'custom'];

  const toggleCategory = (cat) => {
    const current = profile.favorite_categories || [];
    setProfile(prev => ({
      ...prev,
      favorite_categories: current.includes(cat)
        ? current.filter(c => c !== cat)
        : [...current, cat]
    }));
  };

  const addTag = () => {
    if (profile.new_tag && !profile.custom_tags.includes(profile.new_tag)) {
      setProfile(prev => ({
        ...prev,
        custom_tags: [...prev.custom_tags, prev.new_tag],
        new_tag: ''
      }));
    }
  };

  const removeTag = (tag) => {
    setProfile(prev => ({
      ...prev,
      custom_tags: prev.custom_tags.filter(t => t !== tag)
    }));
  };

  const saveProfile = () => {
    updateProfileMutation.mutate({
      favorite_categories: profile.favorite_categories,
      custom_tags: profile.custom_tags,
      default_privacy: profile.default_privacy
    });
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <User className="w-5 h-5 text-violet-400" />
              Profile Customization
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditMode(!editMode)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-4 p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <Avatar className="w-16 h-16 border-2 border-violet-500/30">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-2xl font-bold">
                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.full_name || 'User'}
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {user?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Star className="w-4 h-4 text-amber-400" />
            Favorite Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={profile.favorite_categories?.includes(cat) ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  profile.favorite_categories?.includes(cat)
                    ? 'bg-violet-500 hover:bg-violet-600'
                    : editMode ? 'hover:bg-slate-700' : 'cursor-default'
                }`}
                onClick={() => editMode && toggleCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Tag className="w-4 h-4 text-cyan-400" />
            Custom Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode && (
            <div className="flex gap-2">
              <Input
                placeholder="Add new tag..."
                value={profile.new_tag}
                onChange={(e) => setProfile(prev => ({ ...prev, new_tag: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
              <Button onClick={addTag} size="sm" className="bg-cyan-500">
                Add
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {profile.custom_tags?.length === 0 ? (
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No custom tags yet
              </p>
            ) : (
              profile.custom_tags?.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className={editMode ? 'cursor-pointer hover:bg-red-500' : ''}
                  onClick={() => editMode && removeTag(tag)}
                >
                  {tag} {editMode && '×'}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Bookmark className="w-4 h-4 text-emerald-400" />
            Default Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={profile.default_privacy === 'private' ? 'default' : 'outline'}
              onClick={() => editMode && setProfile(prev => ({ ...prev, default_privacy: 'private' }))}
              disabled={!editMode}
              className={profile.default_privacy === 'private' ? 'bg-violet-500' : ''}
            >
              Private
            </Button>
            <Button
              variant={profile.default_privacy === 'public' ? 'default' : 'outline'}
              onClick={() => editMode && setProfile(prev => ({ ...prev, default_privacy: 'public' }))}
              disabled={!editMode}
              className={profile.default_privacy === 'public' ? 'bg-violet-500' : ''}
            >
              Public
            </Button>
          </div>
        </CardContent>
      </Card>

      {editMode && (
        <Button
          onClick={saveProfile}
          disabled={updateProfileMutation.isPending}
          className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Profile
        </Button>
      )}
    </div>
  );
}