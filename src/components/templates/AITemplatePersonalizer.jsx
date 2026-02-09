import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, User, Briefcase, Wand2, Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function AITemplatePersonalizer({ template, onSave, isDark = true }) {
  const [personalizing, setPersonalizing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    company: '',
    industry: '',
    role: '',
    preferences: ''
  });

  const personalizeTemplate = async () => {
    if (!template) {
      toast.error('No template selected');
      return;
    }

    setPersonalizing(true);
    try {
      const sections = template.template_data?.sections || [];
      const content = sections.map(s => `${s.title}: ${s.content}`).join('\n');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Personalize this ${template.category} template for the following user:

Template Content:
${content}

User Information:
- Name: ${userInfo.name || 'Not provided'}
- Company: ${userInfo.company || 'Not provided'}
- Industry: ${userInfo.industry || 'Not provided'}
- Role: ${userInfo.role || 'Not provided'}
- Preferences: ${userInfo.preferences || 'None'}

Instructions:
1. Replace generic placeholders with personalized information
2. Adapt the tone to match the industry and role
3. Add relevant examples specific to their field
4. Customize sections to be more relevant to their use case
5. Keep the structure but make it feel personally crafted

Return JSON with personalized sections array (title, content).`,
        response_json_schema: {
          type: "object",
          properties: {
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" }
                }
              }
            }
          }
        }
      });

      const personalizedTemplate = {
        ...template,
        name: `${template.name} (Personalized)`,
        template_data: {
          ...template.template_data,
          sections: result.sections,
          personalized: true,
          personalization_data: userInfo
        }
      };

      await base44.entities.Template.create({
        ...personalizedTemplate,
        id: undefined,
        created_date: undefined,
        is_public: false
      });

      toast.success('Template personalized and saved');
      onSave?.(personalizedTemplate);
    } catch (e) {
      toast.error('Personalization failed');
    } finally {
      setPersonalizing(false);
    }
  };

  if (!template) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Sparkles className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to personalize
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Template Personalization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </p>
            <Badge variant="outline">{template.category}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <User className="w-4 h-4 text-cyan-400" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Your Name</Label>
              <Input
                placeholder="John Doe"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Company</Label>
              <Input
                placeholder="Acme Corp"
                value={userInfo.company}
                onChange={(e) => setUserInfo(prev => ({ ...prev, company: e.target.value }))}
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Industry</Label>
              <Input
                placeholder="Technology, Healthcare, etc."
                value={userInfo.industry}
                onChange={(e) => setUserInfo(prev => ({ ...prev, industry: e.target.value }))}
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Role</Label>
              <Input
                placeholder="Manager, Developer, etc."
                value={userInfo.role}
                onChange={(e) => setUserInfo(prev => ({ ...prev, role: e.target.value }))}
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Special Preferences (Optional)
            </Label>
            <Textarea
              placeholder="Any specific requirements or preferences..."
              value={userInfo.preferences}
              onChange={(e) => setUserInfo(prev => ({ ...prev, preferences: e.target.value }))}
              className={`mt-2 min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />
          </div>

          <Button
            onClick={personalizeTemplate}
            disabled={personalizing || !userInfo.name}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {personalizing ? (
              <>
                <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                Personalizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Personalize Template
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}