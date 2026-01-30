import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, Play, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AITaskEngine({ isDark = true }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    trigger: 'on_upload',
    actions: []
  });
  const [selectedAction, setSelectedAction] = useState('');

  const triggers = [
    { value: 'on_upload', label: 'When File Uploaded' },
    { value: 'on_schedule', label: 'On Schedule' },
    { value: 'manual', label: 'Manual Trigger' }
  ];

  const actionTypes = [
    { value: 'ai_summarize', label: 'AI Summarize' },
    { value: 'convert_format', label: 'Convert Format' },
    { value: 'extract_data', label: 'Extract Data (OCR)' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'tag_document', label: 'Auto-Tag' },
    { value: 'share_document', label: 'Share Document' },
    { value: 'ai_analysis', label: 'AI Analysis' }
  ];

  const addAction = () => {
    if (!selectedAction) return;

    const action = {
      id: Date.now(),
      type: selectedAction,
      params: {}
    };

    setNewTask({
      ...newTask,
      actions: [...newTask.actions, action]
    });
    setSelectedAction('');
  };

  const createTask = async () => {
    if (!newTask.name || newTask.actions.length === 0) {
      toast.error('Task name and actions required');
      return;
    }

    try {
      const response = await base44.functions.invoke('taskAutomation', {
        action: 'create_task',
        data: {
          taskType: 'automated',
          trigger: newTask.trigger,
          actions: newTask.actions,
          name: newTask.name
        }
      });

      if (response.data.success) {
        setTasks([...tasks, { ...newTask, id: Date.now() }]);
        setNewTask({ name: '', trigger: 'on_upload', actions: [] });
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    }
  };

  const executeTask = async (task) => {
    try {
      const response = await base44.functions.invoke('taskAutomation', {
        action: 'execute_task',
        data: {
          taskId: task.id,
          actions: task.actions
        }
      });

      if (response.data.success) {
        toast.success('Task executed successfully');
      }
    } catch (error) {
      toast.error('Task execution failed');
      console.error(error);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" />
            Create AI Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Task Name..."
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />

          <Select value={newTask.trigger} onValueChange={(v) => setNewTask({ ...newTask, trigger: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Trigger" />
            </SelectTrigger>
            <SelectContent>
              {triggers.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Add Action..." />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map(a => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addAction} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {newTask.actions.length > 0 && (
            <div className="space-y-2">
              {newTask.actions.map((action, idx) => (
                <div key={action.id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    <Badge>{idx + 1}</Badge>
                    <span className="text-sm">{actionTypes.find(a => a.value === action.type)?.label}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewTask({ 
                      ...newTask, 
                      actions: newTask.actions.filter(a => a.id !== action.id) 
                    })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={createTask}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle>Active Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No tasks created yet
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{task.name}</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => executeTask(task)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Badge variant="secondary">{task.trigger}</Badge>
                  <span>•</span>
                  <span>{task.actions.length} actions</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}